import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

const demoUsers = {
  'cb.sc.u4cse23155@cb.students.amrita.edu': { password: 'student123', role: 'student', name: 'Kanishka' },
  'cb.sc.u4ece23109@cb.students.amrita.edu': { password: 'student123', role: 'student', name: 'Aravind' },
  'TKumar@cb.amrita.edu': { password: 'faculty123', role: 'faculty', name: 'Dr.Kumar' },
  'admin@cb.amrita.edu': { password: 'admin123', role: 'admin', name: 'Admin' },
};

// email val
const validateEmail = (email, role) => {
  if (role === 'student') {
    // for student cb.sc.u4[dept][5digits]@cb.students.amrita.edu
    const studentPattern = /^cb\.sc\.u4[a-z]{2,4}\d{5}@cb\.students\.amrita\.edu$/i;
    return studentPattern.test(email);
  } else {
    // for faculty/admin: username@cb.amrita.edu
    const facultyPattern = /^[a-zA-Z0-9._-]+@cb\.amrita\.edu$/i;
    return facultyPattern.test(email);
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (email, password, role) => {
    if (!validateEmail(email, role)) {
      if (role === 'student') {
        return { success: false, message: 'Invalid student email format. Use: cb.sc.u4[dept][number]@cb.students.amrita.edu' };
      } else {
        return { success: false, message: 'Invalid email format. Use: username@cb.amrita.edu' };
      }
    }

    const demoUser = demoUsers[email.toLowerCase()];
    if (demoUser && demoUser.password === password && demoUser.role === role) {
      setUser({ email, role, name: demoUser.name });
      setIsAuthenticated(true);
      return { success: true };
    }

    // just in case for demo purpose 
    if (password === 'demo123') {
      const name = role === 'student' ? 'Student User' : role === 'faculty' ? 'Faculty User' : 'Admin User';
      setUser({ email, role, name });
      setIsAuthenticated(true);
      return { success: true };
    }

    return { success: false, message: 'Invalid credentials' };
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const resetPassword = (email) => {
    return { success: true, message: 'Password reset link sent to your email!' };
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
