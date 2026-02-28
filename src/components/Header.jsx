import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const getDisplayName = () => {
    if (user?.username) return user.username;
    if (user?.role === "admin") return "Admin";
    if (user?.role === "coordinator") return "Student Coordinator";
    if (user?.role) return user.role.charAt(0).toUpperCase() + user.role.slice(1);
    return "User";
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-amrita text-amrita-foreground shadow-lg">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold tracking-wide">IntelliReserve</h1>
        </div>
        
        <div className="flex items-center gap-6">
          <span className="text-lg">
            Welcome, <span className="font-semibold">{getDisplayName()}!</span>
          </span>
          <Button 
            onClick={handleLogout}
            variant="outline"
            className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white flex items-center gap-1"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
