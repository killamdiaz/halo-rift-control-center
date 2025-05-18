
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginScreen from "./components/LoginScreen";

// Create a client
const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if user is logged in (would check local storage, tokens, etc.)
    const checkAuth = () => {
      // For demo purposes, we'll just set a timeout
      const hasToken = localStorage.getItem('halo_auth_token');
      setIsAuthenticated(!!hasToken);
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  const handleLogin = (email: string, password: string) => {
    // Mock login - in a real app this would verify credentials with a backend
    console.log('Login attempt:', email, password);
    localStorage.setItem('halo_auth_token', 'demo_token_123');
    localStorage.setItem('halo_user', JSON.stringify({ name: 'John Doe', email }));
    setIsAuthenticated(true);
  };

  const handleSignUp = (name: string, email: string, password: string) => {
    // Mock signup - in a real app this would create an account via API
    console.log('Signup:', name, email, password);
    localStorage.setItem('halo_auth_token', 'demo_token_123');
    localStorage.setItem('halo_user', JSON.stringify({ name, email }));
    setIsAuthenticated(true);
  };

  if (isLoading) {
    // Loading screen could be improved with branded spinner
    return (
      <div className="min-h-screen bg-halo-gradient flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold neon-text mb-4">HALO OS</h1>
          <div className="w-12 h-12 border-4 border-halo-accent border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={
              !isAuthenticated 
                ? <LoginScreen onLogin={handleLogin} onSignUp={handleSignUp} /> 
                : <Navigate to="/" replace />
            } />
            
            {/* Protected Routes */}
            <Route path="/" element={
              isAuthenticated 
                ? <Index /> 
                : <Navigate to="/login" replace />
            } />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
