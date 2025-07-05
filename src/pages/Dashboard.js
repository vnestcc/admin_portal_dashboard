import { User, LogOut, Building2, Check, X, Trash2, ExternalLink } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthProvider';

const apiUrl = process.env.REACT_APP_BACKEND_API;


const colors=[
  "from-green-500 to-teal-600",
  "from-purple-500 to-indigo-600",
  "from-orange-500 to-red-500",
  "from-blue-500 to-cyan-600"
]

const mockCompanies = [
  {
    id: 1,
    name: "ZVIA Tech Pvt. Ltd.",
    description: "ZVIA Tech provides an AI-powered platform that offers personalized learning experiences and data-driven insights.",
    letter: "Z",
    color: "from-purple-500 to-indigo-600",
    tags: ["EdTech", "Digital Learning", "Education Analytics"]
  },
  {
    id: 2,
    name: "Mafkin Robotics",
    description: "Autonomous ship hull cleaning and inspection robots",
    letter: "M",
    color: "from-green-500 to-teal-600",
    tags: ["HealthTech", "Medical Imaging"]
  },
  {
    id: 3,
    name: "Cittaa Health Service",
    description: "Cittaa Health Services is transforming mental healthcare in educational institutions through integrated solutions.",
    letter: "C",
    color: "from-orange-500 to-red-500",
    tags: ["Healthcare", "Telemedicine", "Patient Care"]
  },
  {
    id: 4,
    name: "TechFlow Solutions",
    description: "Advanced workflow automation and AI-driven business process optimization platform.",
    letter: "T",
    color: "from-blue-500 to-cyan-600",
    tags: ["AI Diagnostics", "Healthcare"]
  }
];


const companyDisplayDetails = {
  "1": {
    letter: "Z",
    color: "from-purple-500 to-indigo-600",
    tags: ["EdTech", "Digital Learning", "Education Analytics"]
  },
  "2": {
    letter: "M",
    color: "from-green-500 to-teal-600",
    tags: ["HealthTech", "Medical Imaging"]
  },
  "3": {
    letter: "C",
    color: "from-orange-500 to-red-500",
    tags: ["Healthcare", "Telemedicine", "Patient Care"]
  },
  "4": {
    letter: "T",
    color: "from-blue-500 to-cyan-600",
    tags: ["AI", "Automation", "Business Process"]
  }
};


const DashboardPage = () => {
  // Use actual auth context
  const { user, logout, token } = useAuth();
  const [vcs, setVcs] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('All Sectors');
  const [currentSection, setCurrentSection] = useState('companies'); // 'companies' or 'vcs'
  const [companies, setCompanies] = useState([]);

  const sectors = ['All Sectors', 'EdTech', 'Digital Learning', 'Education Analytics', 'HealthTech', 'Medical Imaging', 'AI Diagnostics', 'Healthcare', 'Telemedicine', 'Patient Care'];

  
  useEffect(()=>{
    const fetchVCList=async()=>{
      try {
        const response = await fetch(`${apiUrl}/api/manage/vc/list`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization':`Bearer ${token}`
          },
        });

        const data = await response.json();

        if (response.ok) {
          setVcs(data);
          // console.log(data)
          return { success: true, message: 'VC List Fetch successful' };
        } else {
          return { success: false, message: data.message || 'VC List Fetch failed' };
        }
      } catch (error) {
        console.error('VC List Fetch error:', error);
        return { success: false, message: 'Network error. Please try again.' };
      }
    }

    const fetchUserList=async()=>{
      try {
        const response = await fetch(`${apiUrl}/api/manage/users`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization':`Bearer ${token}`
          },
        });

        const data = await response.json();

        if (response.ok) {
          setUsers(data);
          // console.log(data)
          return { success: true, message: 'User List Fetch successful' };
        } else {
          return { success: false, message: data.message || 'User List Fetch failed' };
        }
      } catch (error) {
        console.error('User List Fetch error:', error);
        return { success: false, message: 'Network error. Please try again.' };
      }
    }



  const fetchCompanyList = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/manage/company/list`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });

        const data = await response.json();
        if (response.ok) {
          console.log(data)
          setCompanies(data);
          return { success: true, message: 'Company List Fetch successful' };
        } else {
          return { success: false, message: data.message || 'Company List Fetch failed' };
        }
      } catch (error) {
        console.error('Company List Fetch error:', error);
        return { success: false, message: 'Network error. Please try again.' };
      }
    }
  fetchCompanyList();
  fetchVCList();
  fetchUserList();
  },[token,currentSection])

  const handleUserAction= async(userId,action)=>{
    try {
      const response = await fetch(`${apiUrl}/api/manage/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      const data = await response.json();

      if (response.ok) {
        setUsers(prevUsers => {
          if (action === 'delete') {
            return prevUsers.filter(user => user.id !== userId);
          }
        });

        return { success: true, message: `User ${action} successful` };
      } else {
        return { success: false, message: data.message || `User ${action} failed` };
      }
    } catch (error) {
      console.error(`User ${action} error:`, error);
      return { success: false, message: 'Network error. Please try again.' };
    }
  }


  const handleVCAction = async (vcId, action) => {
  let endpoint = '';
  let method = 'PUT';

  if (action === 'approve') {
    endpoint = `${apiUrl}/api/manage/vc/${vcId}/approve`;
  } else if (action === 'unapprove') {
    endpoint = `${apiUrl}/api/manage/vc/${vcId}/remove`;
  } else if (action === 'delete') {
    endpoint = `${apiUrl}/api/manage/vc/${vcId}`;
    method = 'DELETE';
  } else {
    console.warn('Unknown action:', action);
    return { success: false, message: 'Unknown action' };
  }

  try {
    const response = await fetch(endpoint, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    const data = await response.json();

    if (response.ok) {
      setVcs(prevVcs => {
        if (action === 'delete') {
          return prevVcs.filter(vc => vc.id !== vcId);
        }
        return prevVcs.map(vc =>
          vc.id === vcId ? { ...vc, approved: action === 'approve' ? true : false } : vc
        );
      });

      return { success: true, message: `VC ${action} successful` };
    } else {
      return { success: false, message: data.message || `VC ${action} failed` };
    }
  } catch (error) {
    console.error(`VC ${action} error:`, error);
    return { success: false, message: 'Network error. Please try again.' };
  }
};

  const handleCompanyClick = (companyId, companyName) => {
    console.log(companyId)
    const url=`/admin/company/${companyId}/${encodeURIComponent(companyName)}`;
    window.open(url, '_blank');
  };

  const filteredCompanies = activeTab === 'All Sectors' 
    ? Object.entries(companies)
    : Object.entries(companies).filter(([id, company]) => {
        const displayDetails = company[id];
        return company.sector === activeTab || 
               (displayDetails && displayDetails.tags.includes(activeTab));
      });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Building2 className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">Portfolio Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-gray-700">
                <User className="w-5 h-5 mr-2" />
                <span>Welcome, {user?.firstName || 'User'}</span>
              </div>
              <button
                onClick={logout}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          
          {/* Main Navigation Tabs */}
          <div className="mb-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setCurrentSection('companies')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    currentSection === 'companies'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Portfolio Companies
                </button>
                <button
                  onClick={() => setCurrentSection('vcs')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    currentSection === 'vcs'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  VC Management
                </button>
                <button
                  onClick={() => setCurrentSection('users')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    currentSection === 'users'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  User Management
                </button>
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          {currentSection === 'vcs' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">VC Management</h2>
              {vcs && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        VC Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        VC Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {vcs.map((vc) => (
                      <tr key={vc.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {vc.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {vc.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 text-xs font-semibold rounded-full ${
                            vc.approved === true 
                              ? 'bg-green-100 text-green-800' 
                              : vc.approved === false
                              ? 'bg-red-100 text-red-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {vc.approved===true?'approved':'not approved'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() => handleVCAction(vc.id, 'approve')}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                          >
                            <Check className="w-3 h-3 mr-1" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleVCAction(vc.id, 'unapprove')}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700"
                          >
                            <X className="w-3 h-3 mr-1" />
                            Unapprove
                          </button>
                          <button
                            onClick={() => handleVCAction(vc.id, 'delete')}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              )}
            </div>
          )}

          {currentSection === 'companies' && (
        <div className="px-4 py-6 sm:px-0">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Portfolio Companies</h2>
              
              {/* Sector Filter Tabs */}
              <div className="flex flex-wrap gap-2 mb-8">
                {sectors.map((sector) => (
                  <button
                    key={sector}
                    onClick={() => setActiveTab(sector)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      activeTab === sector
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {sector}
                  </button>
                ))}
              </div>

              {/* Companies Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCompanies.map(([id, company]) => {
                  // Get additional display details
                  const displayDetails = company[id] || {
                    letter: company.name.charAt(0),
                    color: colors[id%4],
                    tags: company.sector ? [company.sector] : []
                  };

                  return (
                    <div
                      key={id}
                      onClick={() => handleCompanyClick(id, company.name)}
                      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
                    >
                      <div className={`h-32 bg-gradient-to-br ${displayDetails.color} rounded-t-lg flex items-center justify-center`}>
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                          <span className="text-2xl font-bold text-gray-700">{displayDetails.letter}</span>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{company.name}</h3>
                          <ExternalLink className="w-4 h-4 text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{company.description || "No description available"}</p>
                        <div className="flex flex-wrap gap-1">
                          {displayDetails.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
        </div>
          )}


          {currentSection === 'users' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">User Management</h2>
              {users && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User StartUp ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((vc) => (
                      !vc.is_deleted && <tr key={vc.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {vc.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {vc.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {vc.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {vc.startup_id?vc.startup_id:'No company yet'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() => handleUserAction(vc.id, 'delete')}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;


















// import { User, LogOut, Shield, Building2 } from 'lucide-react';
// import { useAuth } from '../auth/AuthProvider';
// import PopUpQR from '../components/PopUpQR';

// const DashboardPage = () => {
//   const { user, logout, showQr } = useAuth();
  

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

//       {/* QR Code Modal */}
//       {showQr && (
//         <PopUpQR/>
//       )}
//     </div>
//   );
// };

// export default DashboardPage;


















// // src/pages/DashboardPage.js
// import { User, LogOut, Shield, Building2 } from 'lucide-react';
// import { useAuth } from '../auth/AuthProvider';

// const DashboardPage = () => {
//   const { user, logout, showQr } = useAuth();

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
//             {showQr?<>Show QR</>:<>Dont't Show QR</>}
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default DashboardPage;