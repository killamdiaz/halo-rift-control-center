const Store = require('electron-store').default;
const store = new Store();
const { app, BrowserWindow, contextBridge, ipcRenderer } = require('electron');
const path = require('path');
const { ipcMain } = require('electron');
const noble = require('@abandonware/noble');
// ── BLE UUIDs (must match firmware) ─────────────────────────────
const SERVICE_UUID = 'a000';  // Wi‑Fi setup service
const SSID_UUID    = 'a001';  // write: SSID
const PASS_UUID    = 'a002';  // write: password
const ROLE_UUID    = 'a003';  // write: L / R / primary
// ────────────────────────────────────────────────────────────────

let scannedBLEDevices = [];

let splash, mainWindow;

// Utility: push fresh connection status for every paired device
function broadcastConnectionStatus() {
  if (!mainWindow || mainWindow.isDestroyed()) return;

  const stored = store.get('pairedDevices') || [];
  const connectedIds = Object.values(noble._peripherals)
    .filter(p => p.state === 'connected')
    .map(p => p.id);

  const enriched = stored.map(d => ({
    ...d,
    isConnected: connectedIds.includes(d.id),
  }));

  mainWindow.webContents.send('update-connection-status', enriched);
}

function startBLEScan() {
  if (noble.state === 'poweredOn') {
    console.log('🔄 Starting BLE scan...');
    noble.stopScanning();
    noble.startScanning([], true);
  } else {
    noble.once('stateChange', (state) => {
      if (state === 'poweredOn') {
        console.log('🔄 BLE powered on — starting scan...');
        noble.startScanning([], true);
      } else {
        console.warn('⚠️ BLE not powered on:', state);
      }
    });
  }
}

function setupNobleListeners() {
  noble.on('discover', async (peripheral) => {
    const name = peripheral.advertisement.localName;
    const deviceType = name && name.toUpperCase().includes('GUN') ? 'gun' : 'shoe';
    if (!name || !name.toUpperCase().includes('HALO')) return;

    const deviceData = {
      id: peripheral.id,
      name,
      address: peripheral.address,
      rssi: peripheral.rssi,
      type: deviceType,
    };

    console.log(`🔎 Found BLE device: ${name}`);

    const paired = store.get('pairedDevices') || [];
    const isPreviouslyPaired = paired.find(d => d.id === peripheral.id);

    if (isPreviouslyPaired) {
      console.log(`🤝 Auto-reconnecting to previously paired device: ${name}`);

      try {
        await peripheral.connectAsync();
        console.log(`✅ Connected to ${name}`);

        peripheral.on('disconnect', () => {
          console.log(`🔌 ${name} disconnected (per-device listener)`);

          const stored = store.get('pairedDevices') || [];
          const wasPaired = stored.find(d => d.id === peripheral.id);

          if (mainWindow && mainWindow.webContents) {
            mainWindow.webContents.send('ble-device-disconnected', {
              id: peripheral.id,
              name,
              role: wasPaired?.role || 'unpaired',
              type: wasPaired?.type || deviceType,
              ip: wasPaired?.ip || '',
            });
            mainWindow.webContents.send('device-status-update', {
              id: peripheral.id,
              name,
              isConnected: false,
              ip: '',
              mac: '',
              signal: 0,
            });
          }
          broadcastConnectionStatus();
        });

        mainWindow.webContents.send('ble-device-connected', {
          id: peripheral.id,
          name,
          role: isPreviouslyPaired.role,
          type: isPreviouslyPaired.type,
          ip: isPreviouslyPaired.ip,
          address: isPreviouslyPaired.address,
          signal: peripheral.rssi,
        });
        mainWindow.webContents.send('device-status-update', {
          id: peripheral.id,
          name,
          isConnected: true,
          ip: isPreviouslyPaired.ip,
          mac: isPreviouslyPaired.address,
          signal: peripheral.rssi,
        });
        broadcastConnectionStatus();
      } catch (err) {
        console.error(`❌ Failed to auto-connect to ${name}`, err);
      }
    }

    mainWindow.webContents.send('ble-device-found', {
      id: peripheral.id,
      name: name,
      role: isPreviouslyPaired?.role || 'unpaired',
      type: deviceType,
      ip: '',
    });
  });

  noble.on('disconnect', (peripheral) => {
    console.log(`🔌 ${peripheral.advertisement.localName || peripheral.id} disconnected (global listener)`);

    const stored = store.get('pairedDevices') || [];
    const wasPaired = stored.find(d => d.id === peripheral.id);

    if (mainWindow && mainWindow.webContents) {
      mainWindow.webContents.send('ble-device-disconnected', {
        id: peripheral.id,
        name: peripheral.advertisement?.localName || peripheral.id,
        role: wasPaired?.role || 'unpaired',
        type: wasPaired?.type || 'shoe',
        ip: wasPaired?.ip || '',
      });
    }
    broadcastConnectionStatus();
  });
}

function createWindow() {
  // Splash window
  splash = new BrowserWindow({
    width: 300,
    height: 300,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
  });
  splash.loadFile(path.join(__dirname, 'splash.html'));

  // Main window (hidden initially)
  mainWindow = new BrowserWindow({
    width: 1700,
    height: 800,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
    }
  });

  mainWindow.loadURL('http://localhost:8080');

  // Once React is ready, show main & close splash
  mainWindow.webContents.on('did-finish-load', () => {
setTimeout(() => {
  if (splash && !splash.isDestroyed()) splash.close();
  if (mainWindow && !mainWindow.isDestroyed()) mainWindow.show();
}, 1500);
  });
}

app.whenReady().then(() => {
  console.log("🚀 Electron app fully ready");
  console.log('🧠 Currently stored paired devices:', store.get('pairedDevices'));

  if (!nobleListenersSet) {
    setupNobleListeners();
    nobleListenersSet = true;
  }

  startBLEScan();
  createWindow();
});

setInterval(broadcastConnectionStatus, 1000); // every 1 second

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

let nobleListenersSet = false;

ipcMain.on('log-to-main', (event, msg) => {
  console.log(`[Renderer]: ${msg}`);
});

ipcMain.on('pair-ble-device', async (event, { id, role, ssid, password }) => {
  const peripheral = noble._peripherals[id];
  if (!peripheral) {
    console.error('❌ Peripheral not found for pairing:', id);
    return;
  }

  const deviceType = peripheral.advertisement.localName &&
                     peripheral.advertisement.localName.toUpperCase().includes('GUN')
                     ? 'gun' : 'shoe';

  try {
    await peripheral.connectAsync();
    const { characteristics } =
      await peripheral.discoverSomeServicesAndCharacteristicsAsync(
        [SERVICE_UUID],
        [SSID_UUID, PASS_UUID, ROLE_UUID]
      );

    const ssidChar = characteristics.find(c => c.uuid.includes(SSID_UUID));
    const passChar = characteristics.find(c => c.uuid.includes(PASS_UUID));
    const roleChar = characteristics.find(c => c.uuid.includes(ROLE_UUID));

    await ssidChar.writeAsync(Buffer.from(ssid), false);
    await passChar.writeAsync(Buffer.from(password), false);
    await roleChar.writeAsync(Buffer.from(role), false);

    console.log(`✅ Successfully paired BLE device ${id} as ${role}`);

    // Read IP, MAC, RSSI, and UUID from BLE characteristics
    const IP_UUID = 'a005';
    const MAC_UUID = 'a006';
    const RSSI_UUID = 'a007';
    const UUID_UUID = 'a008';

    const { characteristics: infoChars } =
      await peripheral.discoverSomeServicesAndCharacteristicsAsync(
        [SERVICE_UUID],
        [IP_UUID, MAC_UUID, RSSI_UUID, UUID_UUID]
      );

    const ipChar = infoChars.find(c => c.uuid.includes(IP_UUID));
    const macChar = infoChars.find(c => c.uuid.includes(MAC_UUID));
    const rssiChar = infoChars.find(c => c.uuid.includes(RSSI_UUID));
    const uuidChar = infoChars.find(c => c.uuid.includes(UUID_UUID));

    let espIp = '';
    let espMac = '';
    let espRssi = peripheral.rssi;
    let espUUID = '';

    if (ipChar) {
      const ipVal = await ipChar.readAsync();
      espIp = ipVal.toString('utf8');
    }

    if (macChar) {
      const macVal = await macChar.readAsync();
      espMac = macVal.toString('utf8');
    }

    if (rssiChar) {
      const rssiVal = await rssiChar.readAsync();
      espRssi = parseInt(rssiVal.toString('utf8')) || peripheral.rssi;
    }

    if (uuidChar) {
      const uuidVal = await uuidChar.readAsync();
      espUUID = uuidVal.toString('utf8');
    }

    // Let frontend know and persist device
    const newDevice = {
      id: peripheral.id, // ← Unique BLE ID
      name: peripheral.advertisement.localName,
      address: espMac,
      role,
      type: deviceType,
      ip: espIp,
      signal: espRssi,
      uuid: espUUID,
    };
    const existing = store.get('pairedDevices') || [];
    const updated = existing.filter(d => d.id !== peripheral.id);
    store.set('pairedDevices', [...updated, newDevice]);
    mainWindow.webContents.send('ble-device-paired', newDevice);

    mainWindow.webContents.send('ble-device-connected', {
      id: peripheral.id,
      name: peripheral.advertisement.localName,
      role,
      type: deviceType,
      ip: espIp,
      address: espMac,
      signal: espRssi,
      uuid: espUUID,
    });
    broadcastConnectionStatus();
    mainWindow.webContents.send('device-status-update', {
      id: peripheral.id,
      name,
      isConnected: true,
      ip: espIp,
      mac: espMac,
      signal: espRssi,
      uuid: espUUID,
    });
    broadcastConnectionStatus();
  } catch (err) {
    console.error('❌ Pairing error:', err);
  }
});

ipcMain.on('start-ble-pairing', (event, deviceType) => {
  console.log(`📡 Received start-ble-pairing for ${deviceType}`);
  const TARGET_NAME = 'HALO Shoe';

  if (!nobleListenersSet) {
    noble.on('stateChange', async (state) => {
      if (state === 'poweredOn') {
        console.log('🔍 BLE adapter powered on. Ready to scan.');
      } else {
        console.warn('⚠️ BLE adapter not powered on:', state);
      }
    });

    // noble.on('discover', async (peripheral) => {
    //     console.log('🔍 BLE adapter powered on. Ready to scan.');
    //   const name = peripheral.advertisement.localName;
    //   console.log(`🔎 Found device: ${name || '(no name)'}, ID: ${peripheral.id}`);
    //   if (!name) return;

    //   const existingIndex = scannedBLEDevices.findIndex(d => d.id === peripheral.id);
    //   const deviceData = {
    //     id: peripheral.id,
    //     name,
    //     address: peripheral.address,
    //     rssi: peripheral.rssi,
    //     type: 'ble',
    //   };

    //   if (existingIndex === -1) {
    //     scannedBLEDevices.push(deviceData);
    //   } else {
    //     scannedBLEDevices[existingIndex] = deviceData;
    //   }

    //   if (name?.includes(TARGET_NAME)) {
    //     console.log(`✅ Found: ${name}`);
    //     noble.stopScanning();

    //     try {
    //       await peripheral.connectAsync();
    //       const { characteristics } = await peripheral.discoverSomeServicesAndCharacteristicsAsync(['1234'], [
    //         'abcd', // SSID
    //         'efgh', // Password
    //         'ijkl', // Role
    //       ]);

    //       const ssidChar = characteristics.find(c => c.uuid.includes('abcd'));
    //       const passChar = characteristics.find(c => c.uuid.includes('efgh'));
    //       const roleChar = characteristics.find(c => c.uuid.includes('ijkl'));

    //       const ssid = 'MAZRS-ACT';
    //       const password = 'Alpinetplink@412';
    //       const role = deviceType === 'shoe' ? 'L' : 'R';

    //       await ssidChar.writeAsync(Buffer.from(ssid));
    //       await passChar.writeAsync(Buffer.from(password));
    //       await roleChar.writeAsync(Buffer.from(role));

    //       console.log('🎉 BLE pairing complete!');
    //       peripheral.disconnect();
    //     } catch (err) {
    //       console.error('❌ BLE pairing failed:', err);
    //     }
    //   }
    // });

    // Stop BLE scanning when requested by renderer
ipcMain.on('stop-ble-pairing', () => {
  console.log('🛑 Received stop-ble-pairing');
  try {
    noble.stopScanning();
    console.log('🛑 BLE scan stopped');
  } catch (err) {
    console.error('❌ Error stopping BLE scan:', err);
  }
});

ipcMain.on('forget-wifi', async (_event, { id }) => {
  const peripheral = noble._peripherals[id];
  if (!peripheral) {
    console.warn(`❌ Peripheral not found for ID ${id}`);
    return;
  }

  try {
    await peripheral.connectAsync();
    const { characteristics } = await peripheral.discoverSomeServicesAndCharacteristicsAsync(
      [SERVICE_UUID],
      [ROLE_UUID] // or define a dedicated UUID like WIFI_CMD_UUID
    );

    const controlChar = characteristics.find(c => c.uuid.includes(ROLE_UUID));
    if (!controlChar) {
      console.warn(`⚠️ Control characteristic not found for ${id}`);
      return;
    }

    const forgetCommand = Buffer.from([0xF0]); // example
    await controlChar.writeAsync(forgetCommand, false);
    console.log(`📡 Sent WiFi forget command to ${id}`);
  } catch (err) {
    console.error(`❌ Failed to send forget WiFi command to ${id}`, err);
  }
});

noble.on('discover', async (peripheral) => {
  const name = peripheral.advertisement.localName;
  const deviceType = name && name.toUpperCase().includes('GUN') ? 'gun' : 'shoe';
  if (!name || !name.toUpperCase().includes('HALO')) return;

  const deviceData = {
    id: peripheral.id,
    name: name,
    address: peripheral.address,
    rssi: peripheral.rssi,
    type: deviceType,
  };

  console.log(`🔎 Found BLE device: ${name}`);

  const paired = store.get('pairedDevices') || [];
  const isPreviouslyPaired = paired.find(d => d.id === peripheral.id);

  if (isPreviouslyPaired) {
    console.log(`🤝 Auto-reconnecting to previously paired device: ${name}`);
    

    try {
      await peripheral.connectAsync();
      console.log(`✅ Connected to ${name}`);

      peripheral.on('disconnect', () => {
        console.log(`🔌 ${name} disconnected (per-device listener)`);

        const stored = store.get('pairedDevices') || [];
        const wasPaired = stored.find(d => d.id === peripheral.id);

        if (mainWindow && mainWindow.webContents) {
          mainWindow.webContents.send('ble-device-disconnected', {
            id: peripheral.id,
            name,
            role: wasPaired?.role || 'unpaired',
            type: wasPaired?.type || deviceType,
            ip: wasPaired?.ip || '',
          });
          mainWindow.webContents.send('device-status-update', {
            id: peripheral.id,
            name,
            isConnected: false,
            ip: '',
            mac: '',
            signal: 0,
          });
        }
      });

      mainWindow.webContents.send('ble-device-connected', {
        id: peripheral.id,
        name,
        role: isPreviouslyPaired.role,
        type: isPreviouslyPaired.type,
        ip: isPreviouslyPaired.ip,
        address: isPreviouslyPaired.address,
        signal: peripheral.rssi,
      });
      mainWindow.webContents.send('device-status-update', {
        id: peripheral.id,
        name,
        isConnected: true,
        ip: isPreviouslyPaired.ip,
        mac: isPreviouslyPaired.address,
        signal: peripheral.rssi,
      });

      // optional: keep peripheral object or set up characteristic reads/writes here

    } catch (err) {
      console.error(`❌ Failed to auto-connect to ${name}`, err);
    }
  }

  // Emit for UI regardless
  mainWindow.webContents.send('ble-device-found', {
    id: peripheral.id,
    name: name,
    role: isPreviouslyPaired?.role || 'unpaired',
    type: deviceType,
    ip: '',
  });
});

    nobleListenersSet = true;
  }


  // Ensure we always restart scanning fresh
  if (noble.state === 'poweredOn') {
    console.log('🔄 Restarting BLE scan...');
    noble.stopScanning();
    noble.startScanning([], true);
  } else {
    console.warn('BLE not powered on. Current state:', noble.state);
  }
});

ipcMain.handle('get-scanned-ble-devices', async () => {
  return scannedBLEDevices;
});

ipcMain.handle('unpair-device', async (_event, args) => {
  const { id } = args;
  const current = store.get('pairedDevices') || [];
  const updated = current.filter(d => d.id !== id);
  store.set('pairedDevices', updated);
  return true;
});

ipcMain.handle('get-paired-devices', () => {
  const storedDevices = store.get('pairedDevices') || [];

  const connectedIds = Object.values(noble._peripherals)
    .filter(p => p.state === 'connected')
    .map(p => p.id);

  const enrichedDevices = storedDevices.map(device => ({
    ...device,
    isConnected: connectedIds.includes(device.id),
    signal: device.signal || 0,
    ip: device.ip || '',
    address: device.address || '',
  }));

  return enrichedDevices;
});

// ipcMain.handle('unpair-device', (event, deviceName) => {
//   const existing = store.get('pairedDevices') || [];
//   const updated = existing.filter(d => d.name !== deviceName);
//   store.set('pairedDevices', updated);
//   return updated;
// });