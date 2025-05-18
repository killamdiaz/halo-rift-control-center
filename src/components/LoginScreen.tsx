
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FiUsers, FiLock, FiMail, FiAlertCircle } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';

interface LoginScreenProps {
  onLogin: (email: string, password: string) => void;
  onSignUp: (name: string, email: string, password: string) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onSignUp }) => {
  const [activeTab, setActiveTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    setError('');
    onLogin(email, password);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill all required fields');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    onSignUp(name, email, password);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotPasswordEmail) {
      setError('Please enter your email');
      return;
    }
    // Mock password reset functionality
    setResetEmailSent(true);
    setError('');
    // In a real app, this would send a reset link via email
  };

  const handleGoogleSignIn = () => {
    // This would be replaced with actual Google auth implementation
    console.log('Signing in with Google');
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-halo-gradient p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Title */}
        <div className="text-center">
          <h1 className="text-6xl font-bold tracking-tighter neon-text mb-2">H.A.L.O</h1>
          <p className="text-halo-accent text-xl">Human Adaptive Locomotion Optimizer</p>
        </div>

        {/* Main Card */}
        <Card className="border border-halo-accent border-opacity-30 bg-black bg-opacity-50 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-center text-white">
              {showForgotPassword ? 'Reset Password' : 'Welcome to HALO OS'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {showForgotPassword ? (
              // Forgot Password Form
              <form onSubmit={handleForgotPassword} className="space-y-4">
                {resetEmailSent ? (
                  <div className="text-center p-4">
                    <div className="mx-auto text-green-400 mb-2 flex justify-center">
                      <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2"/>
                        <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <p className="text-white">Password reset email sent!</p>
                    <p className="text-gray-400 text-sm mt-1">Check your inbox for instructions.</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <label htmlFor="reset-email" className="text-sm text-gray-200">Email</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <FiMail className="text-gray-400" />
                        </div>
                        <Input
                          id="reset-email"
                          type="email"
                          placeholder="Enter your email"
                          value={forgotPasswordEmail}
                          onChange={e => setForgotPasswordEmail(e.target.value)}
                          className="pl-10 bg-halo-darker border border-halo-accent border-opacity-30 text-white"
                        />
                      </div>
                    </div>
                    
                    {error && (
                      <div className="flex items-center text-red-500 text-sm mt-2">
                        <FiAlertCircle className="mr-1" />
                        <span>{error}</span>
                      </div>
                    )}
                    
                    <div className="pt-2">
                      <Button 
                        type="submit" 
                        className="w-full bg-halo-accent hover:bg-halo-accent/80 text-black" 
                      >
                        Send Reset Link
                      </Button>
                    </div>
                  </>
                )}
                
                <div className="text-center pt-2">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setShowForgotPassword(false);
                      setResetEmailSent(false);
                    }}
                    className="text-halo-accent hover:text-halo-accent/80"
                  >
                    Back to login
                  </Button>
                </div>
              </form>
            ) : (
              // Login/Signup Tabs
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-2 mb-4 bg-halo-darker">
                  <TabsTrigger value="login" className="data-[state=active]:bg-halo-accent data-[state=active]:text-black">
                    Login
                  </TabsTrigger>
                  <TabsTrigger value="signup" className="data-[state=active]:bg-halo-accent data-[state=active]:text-black">
                    Sign Up
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="login" className="space-y-4">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm text-gray-200">Email</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <FiMail className="text-gray-400" />
                        </div>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          className="pl-10 bg-halo-darker border border-halo-accent border-opacity-30 text-white"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label htmlFor="password" className="text-sm text-gray-200">Password</label>
                        <Button
                          variant="link"
                          onClick={() => setShowForgotPassword(true)}
                          className="text-xs text-halo-accent hover:text-halo-accent/80 p-0 h-auto"
                          type="button"
                        >
                          Forgot password?
                        </Button>
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <FiLock className="text-gray-400" />
                        </div>
                        <Input
                          id="password"
                          type="password"
                          placeholder="Enter your password"
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          className="pl-10 bg-halo-darker border border-halo-accent border-opacity-30 text-white"
                        />
                      </div>
                    </div>
                    
                    {error && (
                      <div className="flex items-center text-red-500 text-sm">
                        <FiAlertCircle className="mr-1" />
                        <span>{error}</span>
                      </div>
                    )}
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-halo-accent hover:bg-halo-accent/80 text-black" 
                    >
                      Login
                    </Button>
                  </form>
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-gray-600"></span>
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="px-2 bg-black text-gray-400">Or continue with</span>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleGoogleSignIn}
                    variant="outline" 
                    className="w-full border border-gray-600 hover:bg-gray-800 text-white"
                  >
                    <FcGoogle className="mr-2 h-5 w-5" />
                    Google
                  </Button>
                </TabsContent>
                
                <TabsContent value="signup" className="space-y-4">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm text-gray-200">Full Name</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <FiUsers className="text-gray-400" />
                        </div>
                        <Input
                          id="name"
                          type="text"
                          placeholder="Enter your name"
                          value={name}
                          onChange={e => setName(e.target.value)}
                          className="pl-10 bg-halo-darker border border-halo-accent border-opacity-30 text-white"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="signup-email" className="text-sm text-gray-200">Email</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <FiMail className="text-gray-400" />
                        </div>
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          className="pl-10 bg-halo-darker border border-halo-accent border-opacity-30 text-white"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="signup-password" className="text-sm text-gray-200">Password</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <FiLock className="text-gray-400" />
                        </div>
                        <Input
                          id="signup-password"
                          type="password"
                          placeholder="Create a password"
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          className="pl-10 bg-halo-darker border border-halo-accent border-opacity-30 text-white"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="confirm-password" className="text-sm text-gray-200">Confirm Password</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <FiLock className="text-gray-400" />
                        </div>
                        <Input
                          id="confirm-password"
                          type="password"
                          placeholder="Confirm password"
                          value={confirmPassword}
                          onChange={e => setConfirmPassword(e.target.value)}
                          className="pl-10 bg-halo-darker border border-halo-accent border-opacity-30 text-white"
                        />
                      </div>
                    </div>
                    
                    {error && (
                      <div className="flex items-center text-red-500 text-sm">
                        <FiAlertCircle className="mr-1" />
                        <span>{error}</span>
                      </div>
                    )}
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-halo-accent hover:bg-halo-accent/80 text-black" 
                    >
                      Create Account
                    </Button>
                  </form>
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-gray-600"></span>
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="px-2 bg-black text-gray-400">Or continue with</span>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleGoogleSignIn}
                    variant="outline" 
                    className="w-full border border-gray-600 hover:bg-gray-800 text-white"
                  >
                    <FcGoogle className="mr-2 h-5 w-5" />
                    Google
                  </Button>
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginScreen;
