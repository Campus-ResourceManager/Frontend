import React from 'react';
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";

export default function DashboardPage() {
  const { user, logout, isLoggingOut } = useAuth();

  if (!user) {
    console.log('No user, redirecting to login');
    return <Redirect to="/login" />;
  }

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#90243A] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">AMRITA PORTAL</h1>
            <div className="flex items-center gap-4">
              <span className="font-medium">Welcome, {user.username}!</span>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="px-4 py-2 bg-white text-[#90243A] rounded-lg hover:bg-gray-100 disabled:opacity-50"
              >
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-[#90243A] mb-4">Dashboard</h2>
          <p className="text-gray-600">Welcome to your student portal</p>
        </div>
        
  
      </main>
    </div>
  );
}