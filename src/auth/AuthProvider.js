// src/components/auth/AuthProvider.js
import { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
const apiUrl = process.env.REACT_APP_BACKEND_API;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showQr, setShowQr]=useState(0);
  const navigate=useNavigate();

  useEffect(() => {
    const savedToken = sessionStorage.getItem('authToken');
    
    if (savedToken) {
      setToken(savedToken);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${apiUrl}/api/auth/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        sessionStorage.setItem('authToken', data.token);
        sessionStorage.setItem('userData', JSON.stringify(data.user));
        setShowQr(0);
        setToken(data.token);
        setUser(data.user);
        setIsAuthenticated(true);
        
        return { success: true, message: 'Login successful' };
      } else {
        return { success: false, message: data.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Network error. Please try again.' };
    }
  };
  
  const signup = async (userData) => {
    console.log(userData)
    try {
      const response = await fetch(`${apiUrl}/api/auth/user/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }, 
        body: JSON.stringify(userData),
      });
      
      const data = await response.json();

      if (response.ok && data.token) {
        sessionStorage.setItem('authToken', data.token);
        sessionStorage.setItem('userData', JSON.stringify(data.user));
        setShowQr(1);
        setToken(data.token);
        setUser(data.user);
        setIsAuthenticated(true);
        
        return { success: true, message: 'Account created successfully' };
      } else {
        return { success: false, message: data.message || 'Signup failed' };
      }
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const popupQr = async () => {
  try {
    const response = await fetch(`${apiUrl}/api/users/totp-qr`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob); 

      return {
        success: true,
        message: 'QR created successfully',
        qr: imageUrl,
      };
    } else {
      return { success: false, message: 'QR failed' };
    }
  } catch (error) {
    console.error('QR error:', error);
    return { success: false, message: 'Network error. Please try again.' };
  }
};

const popupBC = async () => {
  try {
    const response = await fetch(`${apiUrl}/api/users/backup-code`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const backupCode=await response.json(); 

      return {
        success: true,
        message: 'BackupCode created successfully',
        backupCode: backupCode,
      };
    } else {
      return { success: false, message: 'BackupCode failed' };
    }
  } catch (error) {
    console.error('BackupCode error:', error);
    return { success: false, message: 'Network error. Please try again.' };
  }
};
 

  const logout = () => {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userData');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    navigate("/admin/login")
  };

  const verifyToken = async () => {
    if (!token) return false;

    try {
      const response = await fetch('/api/auth/verify', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        logout();
        return false;
      }
      return true;
    } catch (error) {
      console.error('Token verification error:', error);
      logout();
      return false;
    }
  };

  const value = {
    isAuthenticated,
    token,
    user,
    loading,
    login,
    signup,
    logout,
    verifyToken,
    showQr,
    setShowQr,
    popupQr,
    popupBC,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 