import React, { useState } from 'react';
import { ArrowLeft, Building2, Check, X, Eye, EyeOff, Shield } from 'lucide-react';
const apiUrl = process.env.REACT_APP_BACKEND_API;

const PasswordResetFlow = ({onViewChange}) => {
  const [currentStage, setCurrentStage] = useState('request'); // 'request', 'newPassword', 'success', 'failure'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetToken, setResetToken]=useState("");
  
  const [formData, setFormData] = useState({
    email: '',
    backup_code: '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleResetRequest = async () => {
    setLoading(true);
    setError('');
    setFormData({
    email: '',
    backup_code: '',
    otp: '',
    })

    // Validation
    if (!formData.email) {
      setError('Email is required');
      setLoading(false);
      return;
    }

    if (!formData.backup_code && !formData.otp) {
      setError('Please enter either Backup Code or OTP');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          },
          body: JSON.stringify({
          ...(formData.backup_code && { backup_code: formData.backup_code }),
          ...(formData.email && { email: formData.email }),
          ...(formData.otp && { otp: formData.otp }),
          }),
        });
        if (response.ok) {
          const data = await response.json();
          console.log(data)
          setCurrentStage('newPassword');
          setResetToken(data.reset_token);
          return {
            success: true,
            message: 'Password reset email sent',
            reset_token:data.reset_token
            };
        } else {
          setError("Password reset failed");
          return { success: false, message: 'Password reset failed' };
          }
    } catch (error) {
      console.error('Forgot password error:', error);
      return { success: false, message: 'Network error. Please try again.' };
      }finally{
        setLoading(false)
      }

    // try {
    //   // Simulate API call
    //   await new Promise(resolve => setTimeout(resolve, 2000));
      
    //   // Simulate random success/failure for demo
    //   const isValid = Math.random() > 0.3;
      
    //   if (isValid) {
    //     setCurrentStage('newPassword');
    //   } else {
    //     setError('Invalid credentials. Please check your email, backup code, or OTP.');
    //   }
    // } catch (err) {
    //   setError('Something went wrong. Please try again.');
    // } finally {
    //   setLoading(false);
    // }
  };

  const handlePasswordReset = async () => {
    setFormData({
    newPassword: '',
    confirmPassword: ''
    })
    setLoading(true);
    setError('');

    // Validation
    if (!formData.newPassword || !formData.confirmPassword) {
      setError('Both password fields are required');
      setLoading(false);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    // try {
    //   // Simulate API call
    //   await new Promise(resolve => setTimeout(resolve, 2000));
      
    //   // Simulate random success/failure for demo
    //   const isSuccess = Math.random() > 0.2;
      
    //   if (isSuccess) {
    //     setCurrentStage('success');
    //   } else {
    //     setCurrentStage('failure');
    //   }
    // } catch (err) {
    //   setCurrentStage('failure');
    // } finally {
    //   setLoading(false);
    // }

    try {
      const response = await fetch(`${apiUrl}/api/auth/reset-password/${resetToken}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            password:formData.newPassword
          }),
        });
        if (response.ok) {
          const data = await response.json();
          console.log(data)
          setCurrentStage('success');
          return {
            success: true,
            message: 'Password reset email sent',
            };
        } else {
          setCurrentStage('failure');
          return { success: false, message: 'Password reset failed' };
          }
    } catch (error) {
      console.error('Forgot password error:', error);
      return { success: false, message: 'Network error. Please try again.' };
      }finally{
        setLoading(false)
      }
  };

  const resetFlow = () => {
    setCurrentStage('request');
    setFormData({
      email: '',
      backup_code: '',
      otp: '',
      newPassword: '',
      confirmPassword: ''
    });
    setError('');
    setLoading(false);
  };

  // Stage 1: Reset Request Form
  if (currentStage === 'request') {
    return (
      <div className="">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-600 rounded-xl mb-4">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h1>
          <p className="text-gray-600">Enter your email to receive a password reset link</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label htmlFor="resetEmail" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="resetEmail"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </div>
          
          <p className="font-medium text-center uppercase">Enter either <span className="underline">Backup Code</span> or <span className="underline">OTP</span></p>
          
          <div>
            <label htmlFor="resetBackup" className="block text-sm font-medium text-gray-700 mb-2">
              Backup Code
            </label>
            <input
              type="text"
              id="resetBackup"
              name="backup_code"
              value={formData.backup_code}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
              placeholder="Enter your Backup Code"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="resetOtp" className="block text-sm font-medium text-gray-700 mb-2">
              Enter OTP through Authenticator App
            </label>
            <input
              type="text"
              id="resetOtp"
              name="otp"
              value={formData.otp}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
              placeholder="Enter your OTP"
              disabled={loading}
            />
          </div>

          <button
            onClick={handleResetRequest}
            disabled={loading}
            className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Verifying...' : 'Verify & Continue'}
          </button>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => onViewChange('login')}
            className="inline-flex items-center text-orange-600 hover:text-orange-800 font-medium"
            disabled={loading}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  // Stage 2: New Password Form
  if (currentStage === 'newPassword') {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-xl mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Set New Password</h1>
          <p className="text-gray-600">Enter your new password to complete the reset</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors pr-12"
                placeholder="Enter new password"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                disabled={loading}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">Password must be at least 8 characters long</p>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors pr-12"
                placeholder="Confirm new password"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                disabled={loading}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <button
            onClick={handlePasswordReset}
            disabled={loading}
            className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Updating Password...' : 'Update Password'}
          </button>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => setCurrentStage('request')}
            className="inline-flex items-center text-orange-600 hover:text-orange-800 font-medium"
            disabled={loading}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Verification
          </button>
        </div>
      </div>
    );
  }

  // Stage 3: Success State
  if (currentStage === 'success') {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Password Reset Successful!</h1>
          <p className="text-gray-600">Your password has been successfully updated. You can now sign in with your new password.</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => onViewChange('login')}
            className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors"
          >
            Continue to Sign In
          </button>
          
          <button
            onClick={resetFlow}
            className="w-full text-gray-600 hover:text-gray-800 font-medium"
          >
            Reset Another Password
          </button>
        </div>
      </div>
    );
  }

  // Stage 4: Failure State
  if (currentStage === 'failure') {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
            <X className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Password Reset Failed</h1>
          <p className="text-gray-600">We encountered an error while updating your password. This could be due to a server issue or expired session.</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => setCurrentStage('request')}
            className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors"
          >
            Try Again
          </button>
          
          <button
            onClick={() => console.log('Contact support')}
            className="w-full text-orange-600 hover:text-orange-800 font-medium border border-orange-600 py-3 px-4 rounded-lg hover:bg-orange-50 transition-colors"
          >
            Contact Support
          </button>
          
          <button
            onClick={() => onViewChange('login')}
            className="w-full text-gray-600 hover:text-gray-800 font-medium"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }
};

export default PasswordResetFlow;













// // src/components/auth/ForgotPassword.js
// import { ArrowLeft, Building2 } from 'lucide-react';

// const ForgotPassword = ({ 
//   onSubmit, 
//   onViewChange, 
//   loading, 
//   error, 
//   formData, 
//   onInputChange 
// }) => {
//   return (
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

//       <form onSubmit={onSubmit} className="space-y-6">
//         <div>
//           <label htmlFor="resetEmail" className="block text-sm font-medium text-gray-700 mb-2">
//             Email Address
//           </label>
//           <input
//             type="email"
//             id="resetEmail"
//             name="email"
//             value={formData.email}
//             onChange={onInputChange}
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
//             placeholder="Enter your email"
//             required
//             disabled={loading}
//           />
//         </div>
//         <p className="font-medium text-center uppercase">Enter either <span className="underline">Backup Code</span> or <span className="underline">OTP</span> </p>
//         <div>
//           <label htmlFor="resetBackup" className="block text-sm font-medium text-gray-700 mb-2">
//             Backup Code
//           </label>
//           <input
//             type="text"
//             id="resetBackup"
//             name="backup_code"
//             value={formData.backup_code}
//             onChange={onInputChange}
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
//             placeholder="Enter your Backup Code"
//             disabled={loading}
//           />
//         </div>

//         <div>
//           <label htmlFor="resetOtp" className="block text-sm font-medium text-gray-700 mb-2">
//             Enter OTP through Authenticator App
//           </label>
//           <input
//             type="text"
//             id="resetOtp"
//             name="otp"
//             value={formData.otp}
//             onChange={onInputChange}
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
//             placeholder="Enter your OTP"
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
//       </form>

//       <div className="mt-6 text-center">
//         <button
//           onClick={() => onViewChange('login')}
//           className="inline-flex items-center text-orange-600 hover:text-orange-800 font-medium"
//           disabled={loading}
//         >
//           <ArrowLeft className="w-4 h-4 mr-2" />
//           Back to Sign In
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ForgotPassword;
















// // import { ArrowLeft, Building2 } from 'lucide-react';

// // export default function ForgotPaswd({formData,handleInputChange,handleSubmit,setCurrentView}) {
// //   return (
// //     <div className="w-full max-w-md mx-auto">
// //       <div className="text-center mb-8">
// //         <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-600 rounded-xl mb-4">
// //           <Building2 className="w-8 h-8 text-white" />
// //         </div>
// //         <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h1>
// //         <p className="text-gray-600">Enter your email to receive a password reset link</p>
// //       </div>

// //       <form onSubmit={handleSubmit} className="space-y-6">
// //         <div>
// //           <label htmlFor="resetEmail" className="block text-sm font-medium text-gray-700 mb-2">
// //             Email Address
// //           </label>
// //           <input
// //             type="email"
// //             id="resetEmail"
// //             name="email"
// //             value={formData.email}
// //             onChange={handleInputChange}
// //             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
// //             placeholder="Enter your email"
// //             required
// //           />
// //         </div>

// //         <button
// //           type="submit"
// //           className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors"
// //         >
// //           Send Reset Link
// //         </button>
// //       </form>

// //       <div className="mt-6 text-center">
// //         <button
// //           onClick={() => setCurrentView('login')}
// //           className="inline-flex items-center text-orange-600 hover:text-orange-800 font-medium"
// //         >
// //           <ArrowLeft className="w-4 h-4 mr-2" />
// //           Back to Sign In
// //         </button>
// //       </div>
// //     </div>
// //   )
// // }
