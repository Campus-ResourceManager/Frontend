import React from 'react';
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-[#90243A]">404</h1>
        <h2 className="text-3xl font-bold mt-4">Page Not Found</h2>
        <p className="text-gray-600 mt-2">The page you're looking for doesn't exist.</p>
        <Link href="/">
          <button className="mt-6 px-6 py-3 bg-[#90243A] text-white rounded-lg hover:bg-[#7a1e30]">
            Go Back Home
          </button>
        </Link>
      </div>
    </div>
  );
}