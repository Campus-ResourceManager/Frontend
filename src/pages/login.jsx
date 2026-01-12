import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Mail, Lock, User } from 'lucide-react';

import amritaLogo from '/src/assets/image.png'; 


const Login = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [resetEmail, setResetEmail] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const { login, resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    
    const result = login(email, password, role);
    if (result.success) {
      navigate(`/${role}-dashboard`);
    } else {
      setError(result.message);
    }
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    
    if (!resetEmail) {
      setError('Please enter your email');
      return;
    }
    
    const result = resetPassword(resetEmail);
    if (result.success) {
      setSuccessMessage(result.message);
      setTimeout(() => {
        setIsFlipped(false);
        setSuccessMessage('');
        setResetEmail('');
      }, 2000);
    }
  };

  const flipToForgot = () => {
    setError('');
    setSuccessMessage('');
    setIsFlipped(true);
  };

  const flipToLogin = () => {
    setError('');
    setSuccessMessage('');
    setIsFlipped(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 overflow-hidden">
      {/* outer layer */}
      <div className="w-full max-w-6xl h-[600px] perspective-1000">
        <div 
          className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* Login */}
          <div className="absolute inset-0 backface-hidden">
            <div className="w-full h-full flex rounded-2xl overflow-hidden shadow-2xl">
              {/* left side - img */}
              <div className="w-1/2 relative overflow-hidden">

                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${amritaLogo})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/10"></div>
                </div>
                
                
                {/* Diagonal cut effect */}
                <div className="absolute -right-20 top-0 bottom-0 w-40 bg-background transform skew-x-12"></div>
              </div>

              {/* right side - login */}
              <div className="w-1/2 bg-background flex items-center justify-center p-8">
                <Card className="w-full max-w-sm border-0 shadow-none">
                  <CardHeader className="text-center pb-2">
                    <CardTitle className="text-2xl font-bold text-amrita">Welcome Back</CardTitle>
                    <p className="text-muted-foreground">Sign in to your account</p>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-foreground-90">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-10 w-full focus:border-amrita focus:ring-amrita"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-foreground-90">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-10 w-full focus:border-amrita focus:ring-amrita"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="role" className="text-foreground-90">Role</Label>
                        <Select value={role} onValueChange={setRole}>
                          <SelectTrigger className="w-full focus:ring-amrita focus:border-amrita">
                            <User className="w-4 h-4 mr-2 text-muted-foreground" />
                            <SelectValue placeholder="Select your role" />
                          </SelectTrigger>
                          <SelectContent className="border-amrita/20">
                           
                            <SelectItem 
                              value="student" 
                              className="focus:bg-amrita/10 focus:text-amrita data-[state=checked]:text-amrita"
                            >
                              Student
                            </SelectItem>
                            <SelectItem 
                              value="faculty" 
                              className="focus:bg-amrita/10 focus:text-amrita data-[state=checked]:text-amrita"
                            >
                              Faculty
                            </SelectItem>
                            <SelectItem 
                              value="admin" 
                              className="focus:bg-amrita/10 focus:text-amrita data-[state=checked]:text-amrita"
                            >
                              Admin
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {error && (
                        <p className="text-destructive text-sm text-center">{error}</p>
                      )}

                      <Button type="submit" className="w-full bg-amrita hover:bg-amrita/90 text-white focus:ring-2 focus:ring-amrita focus:ring-offset-2">
                        Login
                      </Button>

                      <button
                        type="button"
                        onClick={flipToForgot}
                        className="w-full text-center text-amrita hover:underline text-sm focus:outline-none focus:ring-2 focus:ring-amrita focus:ring-offset-2 rounded px-2 py-1"
                      >
                        Forgot Password?
                      </button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
         
          <div className="absolute inset-0 backface-hidden rotate-y-180">
            <div className="w-full h-full flex rounded-2xl overflow-hidden shadow-2xl">
         
              <div className="w-1/2 bg-background flex items-center justify-center p-8">
                <Card className="w-full max-w-sm border-0 shadow-none">
                  <CardHeader className="text-center pb-2">
                    <CardTitle className="text-2xl font-bold text-amrita">Reset Password</CardTitle>
                    <p className="text-muted-foreground">Enter your email to reset</p>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleResetPassword} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="resetEmail" className="text-foreground-90">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="resetEmail"
                            type="email"
                            placeholder="Enter your email"
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                            className="pl-10 w-full focus:border-amrita focus:ring-amrita"
                            required
                          />
                        </div>
                      </div>

                      {error && (
                        <p className="text-destructive text-sm text-center">{error}</p>
                      )}

                      {successMessage && (
                        <p className="text-green-600 text-sm text-center">{successMessage}</p>
                      )}

                      <Button type="submit" className="w-full bg-amrita hover:bg-amrita/90 text-white focus:ring-2 focus:ring-amrita focus:ring-offset-2">
                        Reset Password
                      </Button>

                      <button
                        type="button"
                        onClick={flipToLogin}
                        className="w-full text-center text-amrita hover:underline text-sm focus:outline-none focus:ring-2 focus:ring-amrita focus:ring-offset-2 rounded px-2 py-1"
                      >
                        Back to Login
                      </button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Right side - amrita img (flipped) */}
              <div className="w-1/2 relative overflow-hidden">
               
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${amritaLogo})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  
                  <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/10"></div>
                </div>
                
          
                {/* diagonal cut effect (flipped side) */}
                <div className="absolute -left-20 top-0 bottom-0 w-40 bg-background transform skew-x-12"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;