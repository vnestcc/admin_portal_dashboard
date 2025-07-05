import { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { useParams, useNavigate } from 'react-router-dom';

import FinanceDashboard from '../components/metrics/FinanceDashboard';
import MarketDashboard from '../components/metrics/MarketDashboard';
import UnitEconomics from '../components/metrics/UnitEconomics';
import ProductDevelopment from '../components/metrics/ProductDevelopment';
import TeamPerformance from '../components/metrics/TeamPerformance';
import Fundraising from '../components/metrics/FundRaising';
import CompetitiveLandscape from '../components/metrics/CompetitiveLandscape';
import OperationalEfficiency from '../components/metrics/Operational';
import RiskManagement from '../components/metrics/RiskManagement';
import AdditionalInfo from '../components/metrics/AdditionalInfo';
import SelfAssessment from '../components/metrics/SelfAssessment';

const CompanyDetails = () => {
  const [activeTab, setActiveTab] = useState('finance');
  const [timePeriod, setTimePeriod] = useState({ quarter: 'Q1', year: new Date().getFullYear() });
  const [companyData, setCompanyData] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
 
  const { id } = useParams();

  const { token } = useAuth();

  useEffect(() => {
    const fetchCompanyData = async () => {
      // console.log("Bearer:",token)
      // console.log("company id:", id);
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_API}/api/company/${id}?data=${activeTab}&quarter=${timePeriod.quarter}&year=${timePeriod.year}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          // console.log(data.data)
          setCompanyData(data);
        } else {
          setCompanyData([])
          console.error('Failed to fetch company data');
        }
      } catch (error) {
        console.error('Error fetching company data:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchHistroyData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_API}/api/company/metrics/${id}?key=${(activeTab!=="uniteconomics"?(activeTab!=="operation"?activeTab:"operational"):"economics")}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data1 = await response.json();
          // console.log("Here:", data1.metrics)
          setHistoryData(data1.metrics)
          // console.log(data1)
          // setCompanyData(data);
        } else {
          console.error('Failed to fetch company data');
        }
      } catch (error) {
        console.error('Error fetching company data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
    fetchHistroyData();
  }, [timePeriod, token, id, activeTab]);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading dashboard data...</div>;
  }

  // if (!companyData) {
  //   return <div className="flex justify-center items-center h-64">No data available for the selected period.</div>;
  // }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{'Startup Dashboard'}</h1>
          {/* <div className="flex items-center mt-2 space-x-4 text-sm text-gray-600">
            <span><strong>Stage:</strong> {'Not specified'}</span>
            <span><strong>Industry:</strong> {'Not specified'}</span>
            <span><strong>Location:</strong> {'Not specified'}</span>
          </div> */}
        </div>
        {/* <div className="mt-4 md:mt-0">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            Export as PDF
          </button>
        </div> */}
      </div>

      {/* Time Period Selector */}
      <div className="flex space-x-4 mb-6">
        <select
          value={timePeriod.quarter}
          onChange={(e) => setTimePeriod({...timePeriod, quarter: e.target.value})}
          className="px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        >
          <option value="Q1">Q1</option>
          <option value="Q2">Q2</option>
          <option value="Q3">Q3</option>
          <option value="Q4">Q4</option>
        </select>
        <select
          value={timePeriod.year}
          onChange={(e) => setTimePeriod({...timePeriod, year: e.target.value})}
          className="px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        >
          {Array.from({length: 10}, (_, i) => new Date().getFullYear() - i).map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('finance')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'finance' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Financial Health
          </button>
          <button
            onClick={() => setActiveTab('market')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'market' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Market Traction
          </button>
          <button
            onClick={() => setActiveTab('uniteconomics')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'uniteconomics' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Unit Economics
          </button>
          <button
            onClick={() => setActiveTab('product')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'product' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Product Development
          </button>
          <button
            onClick={() => setActiveTab('teamperf')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'teamperf' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Team Performance
          </button>
        </nav>
      </div>

      {/* Additional Navigation Tabs (second row if needed) */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('fund')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'fund' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Fundraising Status
          </button>
          <button
            onClick={() => setActiveTab('competitive')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'competitive' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Competitive Landscape
          </button>
          <button
            onClick={() => setActiveTab('operation')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'operation' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Operational Efficiency
          </button>
          <button
            onClick={() => setActiveTab('risk')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'risk' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Risk Management
          </button>
          <button
            onClick={() => setActiveTab('additional')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'additional' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Additional Information
          </button>
          <button
            onClick={() => setActiveTab('self')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'self' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Self-Assessment
          </button>
        </nav>
      </div>
         {/* { console.log(companyData)} */}
      {/* Dynamic Dashboard Content */}
      <div className="bg-gray-50 rounded-lg p-6">
        {activeTab === 'finance' && companyData && <FinanceDashboard data={companyData.data} history={historyData} />}
        {activeTab === 'market' && companyData && <MarketDashboard data={companyData.data} history={historyData} />}
        {activeTab === 'uniteconomics' && companyData && <UnitEconomics data={companyData.data} history={historyData} />}
        {activeTab === 'product' && companyData && <ProductDevelopment data={companyData.data} history={historyData} />}
        {activeTab === 'teamperf' && companyData && <TeamPerformance data={companyData.data} history={historyData} />}
        {activeTab === 'fund' && companyData && <Fundraising data={companyData.data} history={historyData} />}
        {activeTab === 'competitive' && companyData && <CompetitiveLandscape data={companyData.data} history={historyData} />}
        {activeTab === 'operation' && companyData && <OperationalEfficiency data={companyData.data} history={historyData} />}
        {activeTab === 'risk' && companyData && <RiskManagement data={companyData.data} history={historyData} />}
        {activeTab === 'additional' && companyData && <AdditionalInfo data={companyData.data} history={historyData} />}
        {activeTab === 'self' && companyData && <SelfAssessment data={companyData.data} history={historyData} />}
      </div>
    </div>
  );
};

export default CompanyDetails;













// import { useParams, useNavigate } from 'react-router-dom';
// import { ArrowLeft } from 'lucide-react';
// import { useAuth } from '../auth/AuthProvider';
// import { useEffect } from 'react';

// const apiUrl = process.env.REACT_APP_BACKEND_API;

// // Use the same companyDetails object from the Dashboard
// const companyDetails = {
//   "1": {
//     description: "ZVIA Tech provides an AI-powered platform that offers personalized learning experiences and data-driven insights.",
//     letter: "Z",
//     color: "from-purple-500 to-indigo-600",
//     tags: ["EdTech", "Digital Learning", "Education Analytics"]
//   },
//   "2": {
//     description: "Autonomous ship hull cleaning and inspection robots",
//     letter: "M",
//     color: "from-green-500 to-teal-600",
//     tags: ["HealthTech", "Medical Imaging"]
//   },
//   "3": {
//     description: "Cittaa Health Services is transforming mental healthcare in educational institutions through integrated solutions.",
//     letter: "C",
//     color: "from-orange-500 to-red-500",
//     tags: ["Healthcare", "Telemedicine", "Patient Care"]
//   },
//   "4": {
//     description: "Advanced workflow automation and AI-driven business process optimization platform.",
//     letter: "T",
//     color: "from-blue-500 to-cyan-600",
//     tags: ["AI Diagnostics", "Healthcare"]
//   }
// };

// const CompanyDetailsPage = () => {
//   const { id, name } = useParams();
//   const navigate = useNavigate();
//   const { token } = useAuth();
  
//   // Get company details or use defaults
//   const details = companyDetails[id] || {
//     description: "No description available",
//     letter: name.charAt(0),
//     color: "from-gray-500 to-gray-600",
//     tags: []
//   };


//   useEffect(()=>{
//     const fetchCompanyDetails = async () => {
//       try {
//         const response = await fetch(`${apiUrl}/api/company/${id}`, {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`
//           },
//         });

//         const data = await response.json();

//         if (response.ok) {
//         //   setCompanies(data);
//           return { success: true, message: 'Company Details Fetch successful' };
//         } else {
//           return { success: false, message: data.message || 'Company Details Fetch failed' };
//         }
//       } catch (error) {
//         console.error('Company Details Fetch error:', error);
//         return { success: false, message: 'Network error. Please try again.' };
//       }
//     }

//     fetchCompanyDetails();
//   },[token])

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-4xl mx-auto px-4 py-8">
//         <button 
//           onClick={() => navigate(-1)}
//           className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
//         >
//           <ArrowLeft className="w-5 h-5 mr-2" />
//           Back to Dashboard
//         </button>

//         <div className={`bg-gradient-to-br ${details.color} rounded-lg shadow-lg overflow-hidden`}>
//           <div className="p-8 text-white">
//             <div className="flex items-center">
//               <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-6">
//                 <span className="text-4xl font-bold">{details.letter}</span>
//               </div>
//               <h1 className="text-3xl font-bold">{decodeURIComponent(name)}</h1>
//             </div>
//           </div>
          
//           <div className="bg-white p-8">
//             <div className="mb-8">
//               <h2 className="text-xl font-semibold mb-4">About the Company</h2>
//               <p className="text-gray-700 leading-relaxed">{details.description}</p>
//             </div>
            
//             <div className="mb-8">
//               <h2 className="text-xl font-semibold mb-4">Key Focus Areas</h2>
//               <div className="flex flex-wrap gap-2">
//                 {details.tags.map(tag => (
//                   <span 
//                     key={tag} 
//                     className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
//                   >
//                     {tag}
//                   </span>
//                 ))}
//               </div>
//             </div>
            
//             <div className="bg-gray-50 p-6 rounded-lg">
//               <h2 className="text-xl font-semibold mb-4">Investment Details</h2>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 <div>
//                   <h3 className="text-sm font-medium text-gray-500">Investment Stage</h3>
//                   <p className="mt-1 text-lg font-semibold">Series A</p>
//                 </div>
//                 <div>
//                   <h3 className="text-sm font-medium text-gray-500">Investment Year</h3>
//                   <p className="mt-1 text-lg font-semibold">2022</p>
//                 </div>
//                 <div>
//                   <h3 className="text-sm font-medium text-gray-500">Sector</h3>
//                   <p className="mt-1 text-lg font-semibold">{details.tags[0] || 'N/A'}</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CompanyDetailsPage;