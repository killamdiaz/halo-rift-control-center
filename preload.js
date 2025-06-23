const { contextBridge, ipcRenderer } = require('electron');

// 1-A  ── make sure these channels are in the allow-list
const validSendChannels = [
  'start-ble-pairing',
  'stop-ble-pairing',
  'pair-ble-device',
  'log-to-main',          // keep others you may need
];

const validReceiveChannels = [
  'ble-device-found',
  'ble-device-paired',
  'log-to-main',          // keep any others you already had
  'ble-device-connected',
  'ble-device-disconnected',
  'update-connection-status',
  'device-status-update',
];

const validInvokeChannels = [
  'get-paired-devices',
];

// 1-B  ── expose `ipcRenderer` with correct listener signatures
contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    send: (channel, data) => {
      if (validSendChannels.includes(channel)) {
        ipcRenderer.send(channel, data);
      }
    },

    // forward the *event* object so React gets (event, data)
    on: (channel, listener) => {
      if (validReceiveChannels.includes(channel)) {
        ipcRenderer.on(channel, listener);          // no wrapper that strips `event`
      }
    },

    removeListener: (channel, listener) => {
      if (validReceiveChannels.includes(channel)) {
        ipcRenderer.removeListener(channel, listener);
      }
    },

    invoke: (channel, data) => ipcRenderer.invoke(channel, data),
  },
});