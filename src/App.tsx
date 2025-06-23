import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import { useState, useEffect, createContext } from "react";
import { toast } from "@/hooks/use-toast";


declare global {
  interface Window {
    electron?: {
      ipcRenderer: {
        send(channel: string, data?: any): void;
        on(channel: string, callback: (...args: any[]) => void): void;
        removeAllListeners?(channel: string): void;
      };
    };
    toast?: any;
    sonnerToast?: any;
  }
}


// Create authentication context
export const AuthContext = createContext({
  isAuthenticated: false,
  login: () => {},
  logout: () => {}
});


// Create a client
const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is authenticated on mount
  useEffect(() => {
    const authStatus = localStorage.getItem("halo_auth");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  // Authentication functions
  const login = () => {
    localStorage.setItem("halo_auth", "true");
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("halo_auth");
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const handler = (_event: any, device: any) => {
      toast({
        title: "Device Connected",
        description: `${device.name} (${device.role}) is now connected.`,
      });
    };

    if (window.electron?.ipcRenderer) {
      window.electron.ipcRenderer.on("ble-device-connected", handler);
    }

    return () => {
      if (window.electron?.ipcRenderer) {
        window.electron.ipcRenderer?.removeAllListeners?.("ble-device-connected");
      }
    };
  }, []);

    useEffect(() => {
    const handler = (_event: any, device: any) => {
      toast({
        title: "Device Disonnected",
        description: `${device.name} (${device.role}) is now disconnected.`,
      });
    };

    if (window.electron?.ipcRenderer) {
      window.electron.ipcRenderer.on("ble-device-disconnected", handler);
    }

    return () => {
      if (window.electron?.ipcRenderer) {
        window.electron.ipcRenderer?.removeAllListeners?.("ble-device-disconnected");
      }
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={!isAuthenticated ? <Auth /> : <Navigate to="/" />} />
              <Route path="/" element={isAuthenticated ? <Index /> : <Navigate to="/login" />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthContext.Provider>
    </QueryClientProvider>
  );
};

export default App;
