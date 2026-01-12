import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Mail, Lock, User } from 'lucide-react';
import { Alert, AlertDescription } from '../components/ui/alert';

import amritaLogo from '/src/assets/amrita.png'; 

const Login = () => {
  const [currentView, setCurrentView] = useState('login'); // 'login', 'forgot', 'register'
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationDirection, setAnimationDirection] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('student');
  const [resetEmail, setResetEmail] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  
  const { login, resetPassword, register } = useAuth();
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
        flipToLogin();
        setSuccessMessage('');
        setResetEmail('');
      }, 2000);
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setError('');
    
    if (!registerEmail || !password || !confirmPassword) {
      setError('Please fill all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    // Show success popup
    setShowSuccessPopup(true);
    
    // Redirect to login after 2 seconds
    setTimeout(() => {
      setShowSuccessPopup(false);
      setRegisterEmail('');
      setPassword('');
      setConfirmPassword('');
      flipToLogin();
    }, 2000);
  };

  const flipToForgot = () => {
    if (isAnimating) return;
    setError('');
    setSuccessMessage('');
    setIsAnimating(true);
    setAnimationDirection('to-forgot');
    
    setTimeout(() => {
      setCurrentView('forgot');
    }, 350);
    
    setTimeout(() => {
      setIsAnimating(false);
      setAnimationDirection('');
    }, 750);
  };

  const flipToRegister = () => {
    if (isAnimating) return;
    setError('');
    setSuccessMessage('');
    setIsAnimating(true);
    setAnimationDirection('to-register');
    
    setTimeout(() => {
      setCurrentView('register');
    }, 350);
    
    setTimeout(() => {
      setIsAnimating(false);
      setAnimationDirection('');
    }, 750);
  };

  const flipToLogin = () => {
    if (isAnimating) return;
    setError('');
    setSuccessMessage('');
    setIsAnimating(true);
    setAnimationDirection('to-login');
    
    setTimeout(() => {
      setCurrentView('login');
    }, 350);
    
    setTimeout(() => {
      setIsAnimating(false);
      setAnimationDirection('');
    }, 750);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 overflow-hidden">
      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-8 shadow-2xl max-w-md mx-4 animate-in fade-in zoom-in duration-300">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h3>
              <p className="text-gray-600">Your account has been created successfully. Redirecting to login...</p>
            </div>
          </div>
        </div>
      )}

      {/* outer layer */}
      <div className="w-full max-w-6xl h-[600px] relative">
        <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
          {/* Red Diagonal Overlay - Grows and Shrinks */}
          <div className={`absolute inset-0 z-30 pointer-events-none overflow-hidden ${
            isAnimating ? 'opacity-100' : 'opacity-0'
          }`}>
            <div
              className="absolute w-full h-full bg-amrita transition-all duration-700 ease-in-out"
              style={{
                clipPath: animationDirection === 'to-forgot' || animationDirection === 'to-register'
                  ? (currentView !== 'login'
                      ? 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)'
                      : 'polygon(0 0, 100% 0, 100% 100%, 0 100%)')
                  : animationDirection === 'to-login'
                  ? (currentView === 'login'
                      ? 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
                      : 'polygon(0 0, 0 0, 0 100%, 0 100%)')
                  : (currentView !== 'login'
                      ? 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)'
                      : 'polygon(0 0, 0 0, 0 100%, 0 100%)'),
              }}
            ></div>
          </div>

          {/* Login Form */}
          <div className={`absolute inset-0 w-full h-full z-10 transition-opacity duration-300 ${
            currentView === 'login' ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}>
            <div className="w-full h-full flex">
              {/* left side - img */}
              <div className="w-1/2 relative overflow-hidden">
                <div 
                  className={`absolute inset-0 bg-cover bg-center transition-all duration-500 ${
                    isAnimating ? 'opacity-0 translate-x-10 translate-y-10' : 'opacity-100'
                  }`}
                  style={{
                    backgroundImage: `url(${amritaLogo})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/10"></div>
                </div>
                
                <div className={`absolute -right-20 top-0 bottom-0 w-40 bg-background transform skew-x-12 transition-all duration-700 ${
                  isAnimating ? 'opacity-0' : 'opacity-100'
                }`}></div>
              </div>

              {/* right side - login form */}
              <div className="w-1/2 bg-background flex items-center justify-center p-8">
                <Card
                  className={`w-full max-w-sm border-0 shadow-none transition-all duration-500 ${
                    isAnimating ? 'opacity-0 translate-x-10 translate-y-10' : 'opacity-100'
                  }`}
                >
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
                            <SelectItem value="student">Student</SelectItem>
                            <SelectItem value="faculty">Faculty</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {error && (
                        <p className="text-destructive text-sm text-center">{error}</p>
                      )}

                      <Button type="submit" className="w-full bg-amrita hover:bg-amrita/90 text-white">
                        Login
                      </Button>

                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t border-gray-300" />
                          </div>
                          <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">Or</span>
                            </div>
                            </div>

                      <button
                        type="button"
                        onClick={flipToRegister}
                        disabled={isAnimating}
                        className="w-full text-center text-amrita hover:underline text-sm"> New? Create an account!
                        </button>


                      <div className="space-y-2 text-center">
                        <button
                        type="button"
                        onClick={flipToForgot}
                        disabled={isAnimating}
                        className="w-full text-center text-amrita hover:underline text-sm">Forgot Password?
                        </button>
                        
                        
                        </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
         
          {/* Forgot Password Form */}
          <div className={`absolute inset-0 w-full h-full z-20 transition-opacity duration-300 ${
            currentView === 'forgot' ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}>
            <div className="w-full h-full flex">
              <div className="w-1/2 bg-background flex items-center justify-center p-8">
                <Card
                  className={`w-full max-w-sm border-0 shadow-none transition-all duration-500 ${
                    isAnimating ? 'opacity-0 -translate-x-10 translate-y-10' : 'opacity-100'
                  }`}
                >
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

                      <Button type="submit" className="w-full bg-amrita hover:bg-amrita/90 text-white">
                        Reset Password
                      </Button>

                      <button
                        type="button"
                        onClick={flipToLogin}
                        disabled={isAnimating}
                        className="w-full text-center text-amrita hover:underline text-sm"
                      >
                        Back to Login
                      </button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Right side - image */}
              <div className="w-1/2 relative overflow-hidden">
                <div 
                  className={`absolute inset-0 bg-cover bg-center transition-all duration-500 ${
                    isAnimating ? 'opacity-0 -translate-x-10 translate-y-10' : 'opacity-100'
                  }`}
                  style={{
                    backgroundImage: `url(${amritaLogo})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/10"></div>
                </div>
                
                <div className={`absolute -left-20 top-0 bottom-0 w-40 bg-background transform skew-x-12 transition-all duration-700 ${
                  isAnimating ? 'opacity-0' : 'opacity-100'
                }`}></div>
              </div>
            </div>
          </div>

          {/* Register Form */}
          <div className={`absolute inset-0 w-full h-full z-20 transition-opacity duration-300 ${
            currentView === 'register' ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}>
            <div className="w-full h-full flex">
              <div className="w-1/2 bg-background flex items-center justify-center p-8">
                <Card
                  className={`w-full max-w-sm border-0 shadow-none transition-all duration-500 ${
                    isAnimating ? 'opacity-0 -translate-x-10 translate-y-10' : 'opacity-100'
                  }`}
                >
                  <CardHeader className="text-center pb-2">
                    <CardTitle className="text-2xl font-bold text-amrita">Create Account</CardTitle>
                    <p className="text-muted-foreground">Register for a new account</p>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="registerEmail" className="text-foreground-90">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="registerEmail"
                            type="email"
                            placeholder="Enter your email"
                            value={registerEmail}
                            onChange={(e) => setRegisterEmail(e.target.value)}
                            className="pl-10 w-full focus:border-amrita focus:ring-amrita"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="registerPassword" className="text-foreground-90">Create Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="registerPassword"
                            type="password"
                            placeholder="Create password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-10 w-full focus:border-amrita focus:ring-amrita"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-foreground-90">Confirm Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirm password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="pl-10 w-full focus:border-amrita focus:ring-amrita"
                            required
                          />
                        </div>
                      </div>

                      {error && (
                        <p className="text-destructive text-sm text-center">{error}</p>
                      )}

                      <Button type="submit" className="w-full bg-amrita hover:bg-amrita/90 text-white">
                        Register
                      </Button>

                      <button
                        type="button"
                        onClick={flipToLogin}
                        disabled={isAnimating}
                        className="w-full text-center text-amrita hover:underline text-sm"
                      >
                        Login
                      </button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Right side - image */}
              <div className="w-1/2 relative overflow-hidden">
                <div 
                  className={`absolute inset-0 bg-cover bg-center transition-all duration-500 ${
                    isAnimating ? 'opacity-0 -translate-x-10 translate-y-10' : 'opacity-100'
                  }`}
                  style={{
                    backgroundImage: `url(${amritaLogo})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/10"></div>
                </div>
                
                <div className={`absolute -left-20 top-0 bottom-0 w-40 bg-background transform skew-x-12 transition-all duration-700 ${
                  isAnimating ? 'opacity-0' : 'opacity-100'
                }`}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;