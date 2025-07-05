// src/components/auth/ProtectedRoute.js
import { useEffect, useState } from 'react';
import { useAuth } from './AuthProvider';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, verifyToken } = useAuth();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (isAuthenticated) {
        await verifyToken();
      }
      setIsVerifying(false);
    };

    checkAuth();
  }, [isAuthenticated, verifyToken]);

  if (loading || isVerifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // return isAuthenticated ? children : <LoginSignup />;
  return isAuthenticated ? children : <Navigate to="/admin/login" />;
};

export default ProtectedRoute;