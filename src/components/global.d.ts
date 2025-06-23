export {};

declare global {
  interface Window {
    electron?: {
      ipcRenderer: {
        send(channel: string, data?: any): void;
        on(channel: string, callback: (...args: any[]) => void): void;
      };
    };
  }
}