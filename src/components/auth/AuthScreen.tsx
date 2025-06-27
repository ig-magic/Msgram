import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { MessageCircle, Loader2, Eye, EyeOff } from 'lucide-react';

export const AuthScreen: React.FC = () => {
  const { login, register, isLoading, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    displayName: '',
    confirmPassword: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.password) return;
    
    await login(formData.username, formData.password);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.password || !formData.displayName) return;
    
    if (formData.password !== formData.confirmPassword) {
      return;
    }
    
    await register(formData.username, formData.password, formData.displayName);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Telegram-style Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg mb-4">
            <MessageCircle className="w-10 h-10 text-blue-500" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Msgram</h1>
          <p className="text-blue-100">A cloud-based mobile and desktop messaging app</p>
        </div>

        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-semibold text-gray-800">
              Welcome to Msgram
            </CardTitle>
            <CardDescription className="text-gray-600">
              Please sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="register">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="space-y-4 mt-6">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-username">Username</Label>
                    <Input
                      id="login-username"
                      type="text"
                      placeholder="Enter your username"
                      value={formData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      className="h-12"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className="h-12 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                      {error}
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white"
                    disabled={isLoading || !formData.username || !formData.password}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Signing In...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="register" className="space-y-4 mt-6">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-displayname">Display Name</Label>
                    <Input
                      id="register-displayname"
                      type="text"
                      placeholder="Your full name"
                      value={formData.displayName}
                      onChange={(e) => handleInputChange('displayName', e.target.value)}
                      className="h-12"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-username">Username</Label>
                    <Input
                      id="register-username"
                      type="text"
                      placeholder="Choose a username"
                      value={formData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      className="h-12"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="register-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className="h-12 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className="h-12"
                      required
                    />
                  </div>

                  {error && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                      {error}
                    </div>
                  )}

                  {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                      Passwords do not match
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white"
                    disabled={
                      isLoading || 
                      !formData.username || 
                      !formData.password || 
                      !formData.displayName ||
                      formData.password !== formData.confirmPassword
                    }
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-blue-100 text-sm">
          <p>By signing up, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </div>
    </div>
  );
};
