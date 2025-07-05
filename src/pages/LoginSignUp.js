// src/pages/LoginSignup.js
import { useState } from 'react';
import { useAuth } from '../auth/AuthProvider';
import Login from '../components/SignIn';
import Signup from '../components/SignUp';
import ForgotPassword from '../components/ForgotPaswd';
import { useNavigate } from 'react-router-dom';

const LoginSignup = () => {
  const { login, signup, forgotPswd } = useAuth();
  const [currentView, setCurrentView] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    company: '',
    backup_code:'',
    otp:'',
  });
  const navigate=useNavigate();
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let result; 
      
      if (currentView === 'login') {
        result = await login(formData.email, formData.password);
        if(result.success){
          navigate('/admin/dashboard');
        }
      } else if (currentView === 'signup') {
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        } 
        if (formData.password.length < 8) {
          setError('Password must be at least 8 characters long');
          setLoading(false);
          return;
        }
        result = await signup({
          email: formData.email,
          password: formData.password,
          name: formData.firstName+" "+formData.lastName
        });
      } else if (currentView === 'forgot') {
        result = await forgotPswd({
          ...(formData.backup_code && { backup_code: formData.backup_code }),
          ...(formData.email && { email: formData.email }),
          ...(formData.otp && { otp: formData.otp }),
        });

        result = { success: true, message: 'Password reset link sent to your email' };
      }
 
      if (!result.success) {
        setError(result.message);
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        {currentView === 'login' && (
          <Login
            onSubmit={handleSubmit}
            onViewChange={setCurrentView}
            loading={loading}
            error={error}
            setError={setError}
            formData={formData}
            setFormData={setFormData}
            onInputChange={handleInputChange}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
          />
        )}
        {currentView === 'signup' && (
          <Signup
            onSubmit={handleSubmit}
            onViewChange={setCurrentView}
            loading={loading}
            error={error}
            setError={setError}
            formData={formData}
            setFormData={setFormData}
            onInputChange={handleInputChange}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            showConfirmPassword={showConfirmPassword}
            setShowConfirmPassword={setShowConfirmPassword}
          />
        )}
        {currentView === 'forgot' && (
          <ForgotPassword onViewChange={setCurrentView}/>
        )}
      </div>
      
      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-orange-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>
    </div>
  );
};

export default LoginSignup;














// import React, { useState } from 'react';
// import SignIn from '../components/SignIn';
// import SignUp from '../components/SignUp';
// import ForgotPaswd from '../components/ForgotPaswd';

// export default function LoginPage() {
//   const [currentView, setCurrentView] = useState('login');
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//     confirmPassword: '',
//     firstName: '',
//     lastName: '',
//     company: ''
//   });

//   const handleInputChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log('Form submitted:', { view: currentView, data: formData });
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
//       <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
//         {currentView === 'login' && (
//           <SignIn
//             formData={formData}
//             handleInputChange={handleInputChange}
//             handleSubmit={handleSubmit}
//             setCurrentView={setCurrentView}
//             showPassword={showPassword}
//             setShowPassword={setShowPassword}
//           />
//         )}
//         {currentView === 'signup' && (
//           <SignUp
//             formData={formData}
//             handleInputChange={handleInputChange}
//             handleSubmit={handleSubmit}
//             setCurrentView={setCurrentView}
//             showPassword={showPassword}
//             setShowPassword={setShowPassword}
//             showConfirmPassword={showConfirmPassword}
//             setShowConfirmPassword={setShowConfirmPassword}
//           />
//         )}
//         {currentView === 'forgot' && (
//           <ForgotPaswd
//             formData={formData}
//             handleInputChange={handleInputChange}
//             handleSubmit={handleSubmit}
//             setCurrentView={setCurrentView}
//           />
//         )}
//       </div>

//       {/* Background decoration */}
//       <div className="fixed inset-0 -z-10 overflow-hidden">
//         <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
//         <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
//         <div className="absolute top-40 left-40 w-80 h-80 bg-orange-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
//       </div>
//     </div>
//   );
// }
























// import React, { useState, useEffect, createContext, useContext } from 'react';
// import { Eye, EyeOff, ArrowLeft, Building2, LogOut, User, Shield } from 'lucide-react';

// // Auth Context for managing authentication state
// const AuthContext = createContext();

// // Auth Provider Component
// const AuthProvider = ({ children }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [token, setToken] = useState(null);
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Check for existing token on app load
//   useEffect(() => {
//     const savedToken = sessionStorage.getItem('authToken');
//     const savedUser = sessionStorage.getItem('userData');
    
//     if (savedToken && savedUser) {
//       setToken(savedToken);
//       setUser(JSON.parse(savedUser));
//       setIsAuthenticated(true);
//     }
//     setLoading(false);
//   }, []);

//   const login = async (email, password) => {
//     try {
//       // Replace with your actual API endpoint
//       const response = await fetch('/api/auth/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await response.json();

//       if (response.ok && data.token) {
//         // Store token and user data
//         sessionStorage.setItem('authToken', data.token);
//         sessionStorage.setItem('userData', JSON.stringify(data.user));
        
//         setToken(data.token);
//         setUser(data.user);
//         setIsAuthenticated(true);
        
//         return { success: true, message: 'Login successful' };
//       } else {
//         return { success: false, message: data.message || 'Login failed' };
//       }
//     } catch (error) {
//       console.error('Login error:', error);
//       return { success: false, message: 'Network error. Please try again.' };
//     }
//   };

//   const signup = async (userData) => {
//     try {
//       // Replace with your actual API endpoint
//       const response = await fetch('/api/auth/signup', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(userData),
//       });

//       const data = await response.json();

//       if (response.ok && data.token) {
//         // Store token and user data
//         sessionStorage.setItem('authToken', data.token);
//         sessionStorage.setItem('userData', JSON.stringify(data.user));
        
//         setToken(data.token);
//         setUser(data.user);
//         setIsAuthenticated(true);
        
//         return { success: true, message: 'Account created successfully' };
//       } else {
//         return { success: false, message: data.message || 'Signup failed' };
//       }
//     } catch (error) {
//       console.error('Signup error:', error);
//       return { success: false, message: 'Network error. Please try again.' };
//     }
//   };

//   const logout = () => {
//     // Clear all stored data
//     sessionStorage.removeItem('authToken');
//     sessionStorage.removeItem('userData');
    
//     setToken(null);
//     setUser(null);
//     setIsAuthenticated(false);
//   };

//   const verifyToken = async () => {
//     if (!token) return false;

//     try {
//       const response = await fetch('/api/auth/verify', {
//         method: 'GET',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!response.ok) {
//         logout(); // Token is invalid, logout user
//         return false;
//       }

//       return true;
//     } catch (error) {
//       console.error('Token verification error:', error);
//       logout();
//       return false;
//     }
//   };

//   const value = {
//     isAuthenticated,
//     token,
//     user,
//     loading,
//     login,
//     signup,
//     logout,
//     verifyToken,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// // Custom hook to use auth context
// const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// // Protected Route Component
// const ProtectedRoute = ({ children }) => {
//   const { isAuthenticated, loading, verifyToken } = useAuth();
//   const [isVerifying, setIsVerifying] = useState(true);

//   useEffect(() => {
//     const checkAuth = async () => {
//       if (isAuthenticated) {
//         await verifyToken();
//       }
//       setIsVerifying(false);
//     };

//     checkAuth();
//   }, [isAuthenticated, verifyToken]);

//   if (loading || isVerifying) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   return isAuthenticated ? children : <LoginPage />;
// };

// // Login Page Component
// const LoginPage = () => {
//   const { login, signup } = useAuth();
//   const [currentView, setCurrentView] = useState('login');
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//     confirmPassword: '',
//     firstName: '',
//     lastName: '',
//     company: ''
//   });

//   const handleInputChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//     // Clear error when user starts typing
//     if (error) setError('');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     try {
//       let result;
      
//       if (currentView === 'login') {
//         result = await login(formData.email, formData.password);
//       } else if (currentView === 'signup') {
//         if (formData.password !== formData.confirmPassword) {
//           setError('Passwords do not match');
//           setLoading(false);
//           return;
//         }
//         result = await signup({
//           email: formData.email,
//           password: formData.password,
//           firstName: formData.firstName,
//           lastName: formData.lastName,
//           company: formData.company
//         });
//       } else if (currentView === 'forgot') {
//         // Handle forgot password
//         console.log('Forgot password for:', formData.email);
//         result = { success: true, message: 'Password reset link sent to your email' };
//       }

//       if (!result.success) {
//         setError(result.message);
//       }
//     } catch (error) {
//       setError('An unexpected error occurred. Please try again.');
//     }

//     setLoading(false);
//   };

//   const renderLogin = () => (
//     <div className="w-full max-w-md mx-auto">
//       <div className="text-center mb-8">
//         <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-xl mb-4">
//           <Building2 className="w-8 h-8 text-white" />
//         </div>
//         <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
//         <p className="text-gray-600">Sign in to access your portfolio dashboard</p>
//       </div>

//       {error && (
//         <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
//           <p className="text-red-600 text-sm">{error}</p>
//         </div>
//       )}

//       <div className="space-y-6">
//         <div>
//           <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
//             Email Address
//           </label>
//           <input
//             type="email"
//             id="email"
//             name="email"
//             value={formData.email}
//             onChange={handleInputChange}
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
//             placeholder="Enter your email"
//             required
//             disabled={loading}
//           />
//         </div>

//         <div>
//           <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
//             Password
//           </label>
//           <div className="relative">
//             <input
//               type={showPassword ? 'text' : 'password'}
//               id="password"
//               name="password"
//               value={formData.password}
//               onChange={handleInputChange}
//               className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
//               placeholder="Enter your password"
//               required
//               disabled={loading}
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
//               disabled={loading}
//             >
//               {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//             </button>
//           </div>
//         </div>

//         <div className="flex items-center justify-between">
//           <label className="flex items-center">
//             <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" disabled={loading} />
//             <span className="ml-2 text-sm text-gray-600">Remember me</span>
//           </label>
//           <button
//             type="button"
//             onClick={() => setCurrentView('forgot')}
//             className="text-sm text-blue-600 hover:text-blue-800 font-medium"
//             disabled={loading}
//           >
//             Forgot Password?
//           </button>
//         </div>

//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           {loading ? 'Signing In...' : 'Sign In'}
//         </button>
//       </div>

//       <div className="mt-6 text-center">
//         <p className="text-gray-600">
//           Don't have an account?{' '}
//           <button
//             onClick={() => setCurrentView('signup')}
//             className="text-blue-600 hover:text-blue-800 font-medium"
//             disabled={loading}
//           >
//             Sign up
//           </button>
//         </p>
//       </div>
//     </div>
//   );

//   const renderSignup = () => (
//     <div className="w-full max-w-md mx-auto">
//       <div className="text-center mb-8">
//         <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-xl mb-4">
//           <Building2 className="w-8 h-8 text-white" />
//         </div>
//         <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
//         <p className="text-gray-600">Join our portfolio management platform</p>
//       </div>

//       {error && (
//         <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
//           <p className="text-red-600 text-sm">{error}</p>
//         </div>
//       )}

//       <div className="space-y-6">
//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
//               First Name
//             </label>
//             <input
//               type="text"
//               id="firstName"
//               name="firstName"
//               value={formData.firstName}
//               onChange={handleInputChange}
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
//               placeholder="John"
//               required
//               disabled={loading}
//             />
//           </div>
//           <div>
//             <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
//               Last Name
//             </label>
//             <input
//               type="text"
//               id="lastName"
//               name="lastName"
//               value={formData.lastName}
//               onChange={handleInputChange}
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
//               placeholder="Doe"
//               required
//               disabled={loading}
//             />
//           </div>
//         </div>

//         <div>
//           <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
//             Company (Optional)
//           </label>
//           <input
//             type="text"
//             id="company"
//             name="company"
//             value={formData.company}
//             onChange={handleInputChange}
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
//             placeholder="Your company name"
//             disabled={loading}
//           />
//         </div>

//         <div>
//           <label htmlFor="signupEmail" className="block text-sm font-medium text-gray-700 mb-2">
//             Email Address
//           </label>
//           <input
//             type="email"
//             id="signupEmail"
//             name="email"
//             value={formData.email}
//             onChange={handleInputChange}
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
//             placeholder="Enter your email"
//             required
//             disabled={loading}
//           />
//         </div>

//         <div>
//           <label htmlFor="signupPassword" className="block text-sm font-medium text-gray-700 mb-2">
//             Password
//           </label>
//           <div className="relative">
//             <input
//               type={showPassword ? 'text' : 'password'}
//               id="signupPassword"
//               name="password"
//               value={formData.password}
//               onChange={handleInputChange}
//               className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
//               placeholder="Create a strong password"
//               required
//               disabled={loading}
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
//               disabled={loading}
//             >
//               {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//             </button>
//           </div>
//         </div>

//         <div>
//           <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
//             Confirm Password
//           </label>
//           <div className="relative">
//             <input
//               type={showConfirmPassword ? 'text' : 'password'}
//               id="confirmPassword"
//               name="confirmPassword"
//               value={formData.confirmPassword}
//               onChange={handleInputChange}
//               className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
//               placeholder="Confirm your password"
//               required
//               disabled={loading}
//             />
//             <button
//               type="button"
//               onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//               className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
//               disabled={loading}
//             >
//               {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//             </button>
//           </div>
//         </div>

//         <div className="flex items-start">
//           <input
//             type="checkbox"
//             id="terms"
//             className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 mt-1"
//             required
//             disabled={loading}
//           />
//           <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
//             I agree to the{' '}
//             <a href="#" className="text-green-600 hover:text-green-800 font-medium">
//               Terms of Service
//             </a>{' '}
//             and{' '}
//             <a href="#" className="text-green-600 hover:text-green-800 font-medium">
//               Privacy Policy
//             </a>
//           </label>
//         </div>

//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           {loading ? 'Creating Account...' : 'Create Account'}
//         </button>
//       </div>

//       <div className="mt-6 text-center">
//         <p className="text-gray-600">
//           Already have an account?{' '}
//           <button
//             onClick={() => setCurrentView('login')}
//             className="text-green-600 hover:text-green-800 font-medium"
//             disabled={loading}
//           >
//             Sign in
//           </button>
//         </p>
//       </div>
//     </div>
//   );

//   const renderForgotPassword = () => (
//     <div className="w-full max-w-md mx-auto">
//       <div className="text-center mb-8">
//         <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-600 rounded-xl mb-4">
//           <Building2 className="w-8 h-8 text-white" />
//         </div>
//         <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h1>
//         <p className="text-gray-600">Enter your email to receive a password reset link</p>
//       </div>

//       {error && (
//         <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
//           <p className="text-red-600 text-sm">{error}</p>
//         </div>
//       )}

//       <div className="space-y-6">
//         <div>
//           <label htmlFor="resetEmail" className="block text-sm font-medium text-gray-700 mb-2">
//             Email Address
//           </label>
//           <input
//             type="email"
//             id="resetEmail"
//             name="email"
//             value={formData.email}
//             onChange={handleInputChange}
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
//             placeholder="Enter your email"
//             required
//             disabled={loading}
//           />
//         </div>

//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           {loading ? 'Sending...' : 'Send Reset Link'}
//         </button>
//       </div>

//       <div className="mt-6 text-center">
//         <button
//           onClick={() => setCurrentView('login')}
//           className="inline-flex items-center text-orange-600 hover:text-orange-800 font-medium"
//           disabled={loading}
//         >
//           <ArrowLeft className="w-4 h-4 mr-2" />
//           Back to Sign In
//         </button>
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
//       <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
//         {currentView === 'login' && renderLogin()}
//         {currentView === 'signup' && renderSignup()}
//         {currentView === 'forgot' && renderForgotPassword()}
//       </div>
      
//       {/* Background decoration */}
//       <div className="fixed inset-0 -z-10 overflow-hidden">
//         <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
//         <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
//         <div className="absolute top-40 left-40 w-80 h-80 bg-orange-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
//       </div>
//     </div>
//   );
// };

// // Dashboard Component (Example protected page)
// const Dashboard = () => {
//   const { user, logout } = useAuth();

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <header className="bg-white shadow-sm border-b">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center py-4">
//             <div className="flex items-center">
//               <Building2 className="w-8 h-8 text-blue-600 mr-3" />
//               <h1 className="text-xl font-semibold text-gray-900">Portfolio Dashboard</h1>
//             </div>
//             <div className="flex items-center space-x-4">
//               <div className="flex items-center text-gray-700">
//                 <User className="w-5 h-5 mr-2" />
//                 <span>Welcome, {user?.firstName || 'User'}</span>
//               </div>
//               <button
//                 onClick={logout}
//                 className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
//               >
//                 <LogOut className="w-4 h-4 mr-2" />
//                 Logout
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
//         <div className="px-4 py-6 sm:px-0">
//           <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
//             <div className="text-center">
//               <Shield className="w-16 h-16 text-green-500 mx-auto mb-4" />
//               <h2 className="text-2xl font-bold text-gray-900 mb-2">Protected Dashboard</h2>
//               <p className="text-gray-600 mb-4">
//                 You are successfully authenticated and can access this protected content!
//               </p>
//               <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
//                 <h3 className="font-medium text-blue-900 mb-2">Your Information:</h3>
//                 <p className="text-sm text-blue-800">
//                   <strong>Email:</strong> {user?.email}<br />
//                   <strong>Name:</strong> {user?.firstName} {user?.lastName}<br />
//                   {user?.company && (
//                     <>
//                       <strong>Company:</strong> {user.company}
//                     </>
//                   )}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// // Main App Component
// export default function App() {
//   return (
//     <AuthProvider>
//       <ProtectedRoute>
//         <Dashboard />
//       </ProtectedRoute>
//     </AuthProvider>
//   );
// }