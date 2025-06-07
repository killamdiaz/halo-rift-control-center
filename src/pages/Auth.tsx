
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { AuthContext } from '../App';

const Auth: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate login
    setTimeout(() => {
      setLoading(false);
      login();
      toast({
        title: "Login successful",
        description: "Welcome to HALO OS",
      });
      navigate('/');
    }, 1500);
  };
  
  const handleGoogleLogin = () => {
    setLoading(true);
    
    // Simulate Google login
    setTimeout(() => {
      setLoading(false);
      login();
      toast({
        title: "Google login successful",
        description: "Welcome to HALO OS",
      });
      navigate('/');
    }, 1500);
  };
  
  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate sign up
    setTimeout(() => {
      setLoading(false);
      login();
      toast({
        title: "Account created",
        description: "Welcome to HALO OS",
      });
      navigate('/');
    }, 1500);
  };
  
  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Password reset link sent",
      description: "Check your email for instructions",
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-halo-gradient p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-white tracking-tight">H.A.L.O</h1>
          <h2 className="text-xl mt-2 text-halo-accent neon-text">Haptic Assisted Locomotion Object</h2>
        </div>
        
        <Card className="border border-halo-accent border-opacity-30 bg-black bg-opacity-60 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-center text-white">Authentication</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid grid-cols-2 mb-6 bg-halo-darker">
                <TabsTrigger value="login" className="data-[state=active]:bg-halo-accent data-[state=active]:text-black">Login</TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:bg-halo-accent data-[state=active]:text-black">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="your@email.com" 
                      className="bg-halo-darker border-halo-accent border-opacity-30 text-white placeholder:text-gray-500" 
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-white">Password</Label>
                      <button 
                        type="button" 
                        className="text-xs text-halo-accent hover:underline" 
                        onClick={handleForgotPassword}
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="••••••••" 
                      className="bg-halo-darker border-halo-accent border-opacity-30 text-white placeholder:text-gray-500" 
                      required 
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-halo-accent text-black hover:bg-opacity-90"
                    disabled={loading}
                  >
                    {loading ? "Logging in..." : "Login"}
                  </Button>
                  
                  <div className="relative flex items-center justify-center mt-4">
                    <div className="absolute w-full h-px bg-gray-700"></div>
                    <span className="relative px-2 bg-black text-gray-400 text-xs">or continue with</span>
                  </div>
                  
                  <Button 
                    type="button" 
                    className="w-full bg-white text-black hover:bg-gray-200 flex items-center justify-center space-x-2"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span>Google</span>
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white">Full Name</Label>
                    <Input 
                      id="name" 
                      type="text" 
                      placeholder="John Doe" 
                      className="bg-halo-darker border-halo-accent border-opacity-30 text-white placeholder:text-gray-500" 
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email-signup" className="text-white">Email</Label>
                    <Input 
                      id="email-signup" 
                      type="email" 
                      placeholder="your@email.com" 
                      className="bg-halo-darker border-halo-accent border-opacity-30 text-white placeholder:text-gray-500" 
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password-signup" className="text-white">Password</Label>
                    <Input 
                      id="password-signup" 
                      type="password" 
                      placeholder="••••••••" 
                      className="bg-halo-darker border-halo-accent border-opacity-30 text-white placeholder:text-gray-500" 
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password-confirm" className="text-white">Confirm Password</Label>
                    <Input 
                      id="password-confirm" 
                      type="password" 
                      placeholder="••••••••" 
                      className="bg-halo-darker border-halo-accent border-opacity-30 text-white placeholder:text-gray-500" 
                      required 
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-halo-accent text-black hover:bg-opacity-90"
                    disabled={loading}
                  >
                    {loading ? "Creating Account..." : "Sign Up"}
                  </Button>
                  
                  <div className="relative flex items-center justify-center mt-4">
                    <div className="absolute w-full h-px bg-gray-700"></div>
                    <span className="relative px-2 bg-black text-gray-400 text-xs">or continue with</span>
                  </div>
                  
                  <Button 
                    type="button" 
                    className="w-full bg-white text-black hover:bg-gray-200 flex items-center justify-center space-x-2"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span>Google</span>
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
