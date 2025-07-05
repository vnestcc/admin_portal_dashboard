import {useState,useEffect} from 'react'
import { Shield, X, Copy, Check } from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';

export default function PopUpQR() {

    const {popupQr,popupBC,setShowQr}=useAuth();
    const [qrCodeUrl,setQrCodeUrl]=useState(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/${encodeURIComponent('user')}?secret=JBSWY3DPEHPK3PXP&issuer=Portfolio%20Dashboard`);
    const [backupCodes,setBackupCodes]=useState([]);
    
    useEffect(() => {
        const qrgenerator=async ()=>{
            const qr = await popupQr();
            setQrCodeUrl(qr);;
        }

        const backupCodegenerator=async()=>{
            const backupCode = await popupBC();
            setBackupCodes([backupCode.backupCode.backup_code]);
        }
        qrgenerator();
        backupCodegenerator();
    }, [])
    

  const [copiedCode, setCopiedCode] = useState(null);
  

  const copyToClipboard = async (code, index) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(index);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center">
                <Shield className="w-6 h-6 text-blue-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Two-Factor Authentication Setup
                </h3>
              </div>
              <button
                onClick={() => {setShowQr(0)}}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Left Side - QR Code */}
                <div className="text-center">
                  <div className="bg-gray-50 rounded-lg p-6 mb-4">
                    <img
                      src={qrCodeUrl.qr}
                      alt="QR Code for 2FA setup"
                      className="mx-auto mb-4 border-2 border-gray-200 rounded-lg"
                    />
                    <div className="bg-white rounded-md p-3 border border-gray-200">
                      <p className="text-xs text-gray-600 font-mono break-all">
                        Manual Entry Key: JBSWY3DPEHPK3PXP
                      </p>
                    </div>
                  </div>
                  <div className="text-left">
                    <h4 className="font-medium text-gray-900 mb-2">Scan QR Code</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Use your authenticator app to scan this QR code:
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Google Authenticator</li>
                      <li>• Microsoft Authenticator</li>
                      <li>• Authy</li>
                      <li>• Any TOTP-compatible app</li>
                    </ul>
                  </div>
                </div>

                {/* Right Side - Backup Codes */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Backup Codes</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Save these backup codes in a secure location. Each code can only be used once to access your account if you lose your authenticator device.
                  </p>
                  
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="grid grid-cols-1 gap-2">
                      {backupCodes.map((code, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-white rounded-md p-3 border border-gray-200"
                        >
                          <span className="font-mono text-sm text-gray-800">{code}</span>
                          <button
                            onClick={() => copyToClipboard(code, index)}
                            className="ml-2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                            title="Copy to clipboard"
                          >
                            {copiedCode === index ? (
                              <Check className="w-4 h-4 text-green-500" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800">
                      <strong>Important:</strong> Store these codes securely. We recommend printing them or saving them in a password manager.
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={() => {setShowQr(0)}}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {setShowQr(0)}}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Complete Setup
                </button>
              </div>
            </div>
          </div>
        </div>
  )
}
