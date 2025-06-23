// src/types.ts
export interface Device {
  id: string;
  name: string;
  type: string;
  role: string;
  battery?: number;
  signal?: number;
  lastConnected?: Date;
  firmwareVersion?: string;
  ipAddress?: string;
  macAddress?: string;
  uuid?: string;
  isConnected?: boolean;
}