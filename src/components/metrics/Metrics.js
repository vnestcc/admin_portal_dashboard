import { useState, useEffect, useRef } from 'react';
import {
  LineChart, BarChart, PieChart, RadarChart,
  Line, Bar, Pie, Radar, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, AreaChart, Area, PolarRadiusAxis, PolarAngleAxis, PolarGrid
} from 'recharts';

import { useAuth } from '../../auth/AuthProvider';

// Graph configurations with data formatting
const GRAPH_CONFIGS = [
  // 1. Funds Raised Over Time
  {
    id: 'funds_raised',
    title: 'Funds Raised Over Time',
    render: (data) => (
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="quarter" />
          <YAxis />
          <Tooltip formatter={(value) => [`$${value}K`, 'Cash Balance']} />
          <Area 
            type="monotone" 
            dataKey="cash_balance" 
            stroke="#8884d8" 
            fill="#8884d8" 
            fillOpacity={0.3}
          />
          <Legend />
        </AreaChart>
      </ResponsiveContainer>
    ),
    transformData: (apiData) => apiData.metrics.map(entry => ({
      quarter: `${entry.quarter} ${entry.year}`,
      cash_balance: parseFloat(entry.cash_balance),
      last_round: new Date(entry.last_round).toLocaleDateString()
    }))
  },

  // 2. Revenue Growth
  {
    id: 'revenue_growth',
    title: 'Revenue Growth (Quarterly)',
    render: (data) => (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="quarter" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Line 
            yAxisId="left"
            type="monotone" 
            dataKey="quarterly_revenue" 
            stroke="#82ca9d" 
            activeDot={{ r: 8 }} 
            name="Quarterly Revenue"
          />
          <Line 
            yAxisId="right"
            type="monotone" 
            dataKey="revenue_growth_percent" 
            stroke="#ff7300" 
            strokeDasharray="5 5"
            name="Growth %"
          />
        </LineChart>
      </ResponsiveContainer>
    ),
    transformData: (apiData) => apiData.metrics.map(entry => ({
      quarter: `${entry.quarter} ${entry.year}`,
      quarterly_revenue: parseFloat(entry.quarterly_revenue),
      revenue_growth_percent: (parseFloat(entry.revenue_growth) * 100).toFixed(1)
    }))
  },

  // 3. Expense Breakdown
  {
    id: 'expense_breakdown',
    title: 'Revenue Breakdown',
    render: (data) => (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042'][index % 4]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`$${value}K`, 'Revenue']} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    ),
    transformData: (apiData) => [
      { name: 'Product A', value: 45 },
      { name: 'Product B', value: 30 },
      { name: 'Product C', value: 25 }
    ]
  },

  // 4. Runway vs. Burn Rate
  {
    id: 'runway',
    title: 'Runway vs. Burn Rate',
    render: (data) => (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="quarter" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="burn_rate" fill="#ff7300" name="Monthly Burn ($K)" />
          <Bar dataKey="runway" fill="#8884d8" name="Runway (months)" />
        </BarChart>
      </ResponsiveContainer>
    ),
    transformData: (apiData) => apiData.metrics.map(entry => ({
      quarter: `${entry.quarter} ${entry.year}`,
      burn_rate: 25, // Example value - replace with actual data when available
      runway: 12     // Example value - replace with actual data when available
    }))
  },

  // 5. User/Customer Growth
  {
    id: 'user_growth',
    title: 'User Growth',
    render: (data) => (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="quarter" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="active_users" 
            stroke="#8884d8" 
            name="Active Users" 
          />
          <Line 
            type="monotone" 
            dataKey="total_customers" 
            stroke="#82ca9d" 
            name="Total Customers" 
          />
        </LineChart>
      </ResponsiveContainer>
    ),
    transformData: (apiData) => apiData.metrics.map(entry => ({
      quarter: `${entry.quarter} ${entry.year}`,
      active_users: 1500, // Example value - replace with actual data when available
      total_customers: 45  // Example value - replace with actual data when available
    }))
  },

  // 6. Milestone Timeline
  {
    id: 'milestones',
    title: 'Milestone Timeline',
    render: (data) => (
      <div className="p-4 h-full">
        <div className="h-full overflow-y-auto">
          <h4 className="text-lg font-semibold text-green-600 mb-3">✅ Achieved</h4>
          <ul className="space-y-2 mb-6">
            {data?.achieved?.map((item, i) => (
              <li key={i} className="flex items-center">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-3 flex-shrink-0"></span>
                <span className="text-sm">{item}</span>
              </li>
            ))}
          </ul>
          
          <h4 className="text-lg font-semibold text-blue-600 mb-3">🎯 Upcoming</h4>
          <ul className="space-y-2">
            {data?.roadmap?.map((item, i) => (
              <li key={i} className="flex items-center">
                <span className="w-3 h-3 bg-blue-500 rounded-full mr-3 flex-shrink-0"></span>
                <span className="text-sm">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    ),
    transformData: (apiData) => ({
      achieved: [
        `Seed Round Closed (${apiData.metrics[0].quarter} ${apiData.metrics[0].year})`,
        "First 100 Customers"
      ],
      roadmap: [
        `Series A (${apiData.metrics[0].quarter} ${apiData.metrics[0].year})`,
        "Product Launch v2.0"
      ]
    })
  },

  // 7. CAC vs. LTV
  {
    id: 'cac_ltv',
    title: 'CAC vs. LTV',
    render: (data) => (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="quarter" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="cac" fill="#ff7300" name="CAC ($)" />
          <Bar dataKey="ltv" fill="#8884d8" name="LTV ($)" />
        </BarChart>
      </ResponsiveContainer>
    ),
    transformData: (apiData) => apiData.metrics.map(entry => ({
      quarter: `${entry.quarter} ${entry.year}`,
      cac: 1200, // Example value - replace with actual data when available
      ltv: 8000  // Example value - replace with actual data when available
    }))
  },

  // 8. Market Opportunity
  {
    id: 'market_share',
    title: 'Market Opportunity',
    render: (data) => (
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart outerRadius={90} data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis angle={30} domain={[0, 100]} />
          <Radar 
            name="Market Coverage" 
            dataKey="value" 
            stroke="#8884d8" 
            fill="#8884d8" 
            fillOpacity={0.6} 
          />
          <Legend />
          <Tooltip />
        </RadarChart>
      </ResponsiveContainer>
    ),
    transformData: (apiData) => [
      { subject: 'TAM', value: 100 },
      { subject: 'SAM', value: 60 },
      { subject: 'SOM', value: 2.4 }, // Example value - replace with actual data when available
      { subject: 'Current', value: 0.45 } // Example value - replace with actual data when available
    ]
  },

  // 9. KPI Trends
  {
    id: 'kpis',
    title: 'KPI Trends',
    render: (data) => (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="quarter" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Line 
            yAxisId="left"
            type="monotone" 
            dataKey="active_users" 
            stroke="#8884d8" 
            name="Active Users" 
          />
          <Line 
            yAxisId="right"
            type="monotone" 
            dataKey="conversion_rate" 
            stroke="#82ca9d" 
            name="Conversion %" 
          />
          <Line 
            yAxisId="right"
            type="monotone" 
            dataKey="churn_rate" 
            stroke="#ff0000" 
            name="Churn %" 
          />
          <Line 
            yAxisId="right"
            type="monotone" 
            dataKey="gross_margin" 
            stroke="#ff7300" 
            name="Margin %" 
            strokeDasharray="5 5"
          />
        </LineChart>
      </ResponsiveContainer>
    ),
    transformData: (apiData) => apiData.metrics.map(entry => ({
      quarter: `${entry.quarter} ${entry.year}`,
      active_users: 1500, // Example value - replace with actual data when available
      conversion_rate: 3.0, // Example value - replace with actual data when available
      churn_rate: 8.0,     // Example value - replace with actual data when available
      gross_margin: 65.0   // Example value - replace with actual data when available
    }))
  }
];

const GraphPlaceholder = () => (
  <div className="animate-pulse bg-gray-200 rounded-lg h-80 w-full flex items-center justify-center">
    <div className="text-gray-500">Loading chart...</div>
  </div>
);

const GraphComponent = ({ config, data }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border h-full min-h-96">
      <h3 className="font-semibold text-xl mb-4 text-gray-800">{config.title}</h3>
      <div className="h-80">
        {data ? 
          config.render(data) : 
          <GraphPlaceholder />
        }
      </div>
    </div>
  );
};

const Metrics = ({ companyId = 1 }) => {
  const [graphData, setGraphData] = useState({});
  const [loading, setLoading] = useState({});
  const [errors, setErrors] = useState({});
  const graphRefs = useRef([]);

  const { token } = useAuth();


  const fetchGraphData = async (graphId) => {
    if (graphData[graphId] || loading[graphId]) return;

    setLoading(prev => ({ ...prev, [graphId]: true }));
    setErrors(prev => ({ ...prev, [graphId]: null }));

    console.log("token: ", token)
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/api/company/metrics/${companyId}?key=${graphId}`,{
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          },
      });
      const data = await response.json();

      console.log(data)
      
      if (!response.ok) throw new Error(data.message || 'Failed to fetch data');

      const config = GRAPH_CONFIGS.find(c => c.id === graphId);
      const transformedData = config.transformData(data);

      setGraphData(prev => ({
        ...prev,
        [graphId]: transformedData
      }));
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        [graphId]: error.message || 'Failed to load data'
      }));
    } finally {
      setLoading(prev => ({ ...prev, [graphId]: false }));
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const graphId = entry.target.getAttribute('data-graph-id');
            fetchGraphData(graphId);
          }
        });
      },
      { threshold: 0.1 }
    );

    graphRefs.current.forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  },);

  // Group graphs into rows of two
  const graphRows = [];
  for (let i = 0; i < GRAPH_CONFIGS.length; i += 2) {
    graphRows.push(GRAPH_CONFIGS.slice(i, i + 2));
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Company Metrics Dashboard</h1>
          <p className="text-gray-600">Real-time insights into your startup's performance</p>
        </div>
        
        {graphRows.map((row, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {row.map((config, colIndex) => {
              const index = rowIndex * 2 + colIndex;
              return (
                <div 
                  key={config.id}
                  ref={el => graphRefs.current[index] = el}
                  data-graph-id={config.id}
                  className="w-full"
                >
                  {errors[config.id] ? (
                    <div className="bg-red-50 border border-red-200 p-6 rounded-lg text-red-700">
                      <div className="font-medium mb-2">Error loading {config.title}</div>
                      <div className="text-sm mb-3">{errors[config.id]}</div>
                      <button 
                        onClick={() => fetchGraphData(config.id)}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                      >
                        Retry
                      </button>
                    </div>
                  ) : (
                    <GraphComponent 
                      config={config}
                      data={graphData[config.id]}
                    />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Metrics;




















// import { useState, useEffect, useRef } from 'react';
// import {
//   LineChart, BarChart, PieChart, RadarChart,
//   Line, Bar, Pie, Radar, Cell,
//   XAxis, YAxis, CartesianGrid, Tooltip, Legend,
//   ResponsiveContainer, AreaChart, Area, PolarRadiusAxis, PolarAngleAxis, PolarGrid
// } from 'recharts';

// // Sample data
// const SAMPLE_DATA = {
//   companyId: "startup_123",
//   metrics: [
//     // 1. Funds Raised Over Time
//     {
//       timestamp: "2023-01-01",
//       cash_balance: 500000,
//       last_round: "Pre-seed"
//     },
//     {
//       timestamp: "2023-04-01",
//       cash_balance: 1500000,
//       last_round: "Seed"
//     },
//     {
//       timestamp: "2023-10-01",
//       cash_balance: 4000000,
//       last_round: "Series A"
//     },

//     // 2. Revenue Growth
//     {
//       timestamp: "2023-01-01",
//       quarterly_revenue: 120000,
//       revenue_growth: 0.15
//     },
//     {
//       timestamp: "2023-04-01",
//       quarterly_revenue: 185000,
//       revenue_growth: 0.25
//     },
//     {
//       timestamp: "2023-07-01",
//       quarterly_revenue: 280000,
//       revenue_growth: 0.18
//     },

//     // 3. Expense Breakdown
//     {
//       revenue_breakdowns: [
//         { product: "SaaS Platform", revenue: 180000, percentage: 0.6 },
//         { product: "Consulting", revenue: 80000, percentage: 0.25 },
//         { product: "Training", revenue: 40000, percentage: 0.15 }
//       ]
//     },

//     // 4. Runway Metrics
//     {
//       cash_balance: 3200000,
//       burn_rate: 250000,
//       cash_runway: 12.8 // months
//     },

//     // 5. User Growth
//     {
//       timestamp: "2023-01-01",
//       active_users: 1500,
//       total_customers: 45
//     },
//     {
//       timestamp: "2023-04-01",
//       active_users: 4200,
//       total_customers: 112
//     },
//     {
//       timestamp: "2023-07-01",
//       active_users: 8900,
//       total_customers: 215
//     },

//     // 6. Milestones
//     {
//       milestones_achieved: [
//         "MVP Launched (Q1 2023)",
//         "First 100 Customers (Q2 2023)",
//         "Seed Round Closed"
//       ],
//       roadmap: [
//         "Series A Closing (Q4 2023)",
//         "Mobile App Launch",
//         "European Expansion"
//       ]
//     },

//     // 7. CAC/LTV
//     {
//       timestamp: "2023-01-01",
//       cac: 1200,
//       ltv: 8000,
//       ltv_ratio: 6.7
//     },
//     {
//       timestamp: "2023-04-01",
//       cac: 950,
//       ltv: 9200,
//       ltv_ratio: 9.7
//     },

//     // 8. Market Share
//     {
//       total_customers: 215,
//       market_share: 2.4 // %
//     },

//     // 9. KPIs
//     {
//       timestamp: "2023-01-01",
//       active_users: 1500,
//       conversion_rate: 0.03, // 3%
//       churn_rate: 0.08,      // 8%
//       gross_margin: 0.65     // 65%
//     },
//     {
//       timestamp: "2023-04-01",
//       active_users: 4200,
//       conversion_rate: 0.042,
//       churn_rate: 0.065,
//       gross_margin: 0.68
//     }
//   ]
// };

// // Mock API function
// const mockFetchData = (companyId, columns) => {
//   const neededColumns = columns.split(',');

//   const filteredData = SAMPLE_DATA.metrics
//     .filter(metric =>
//       Object.keys(metric).some(key => neededColumns.includes(key))
//     )
//     .map(metric => {
//       const filtered = {};
//       neededColumns.forEach(col => {
//         if (metric[col] !== undefined) filtered[col] = metric[col];
//       });
//       return filtered;
//     });

//   return Promise.resolve({ data: filteredData });
// };

// // Graph configurations with data formatting
// const GRAPH_CONFIGS = [
//   // 1. Funds Raised Over Time
//   {
//     id: 'funds-raised',
//     title: 'Funds Raised Over Time',
//     columns: ['last_round', 'cash_balance', 'timestamp'],
//     render: (data) => (
//       <ResponsiveContainer width="100%" height={300}>
//         <AreaChart data={data}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="timestamp" />
//           <YAxis />
//           <Tooltip formatter={(value) => [`$${(value/1000).toFixed(0)}K`, 'Cash Balance']} />
//           <Area 
//             type="monotone" 
//             dataKey="cash_balance" 
//             stroke="#8884d8" 
//             fill="#8884d8" 
//             fillOpacity={0.3}
//           />
//           <Legend />
//         </AreaChart>
//       </ResponsiveContainer>
//     ),
//     calculate: (data) => data?.filter(entry => entry.timestamp && entry.cash_balance)
//       .map(entry => ({
//         timestamp: new Date(entry.timestamp).toLocaleDateString(),
//         cash_balance: entry.cash_balance,
//         last_round: entry.last_round
//       })) || []
//   },

//   // 2. Revenue Growth
//   {
//     id: 'revenue-growth',
//     title: 'Revenue Growth (MoM/YoY)',
//     columns: ['quarterly_revenue', 'revenue_growth', 'timestamp'],
//     render: (data) => (
//       <ResponsiveContainer width="100%" height={300}>
//         <LineChart data={data}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="timestamp" />
//           <YAxis />
//           <Tooltip />
//           <Line 
//             type="monotone" 
//             dataKey="quarterly_revenue" 
//             stroke="#82ca9d" 
//             activeDot={{ r: 8 }} 
//             name="Quarterly Revenue"
//           />
//           <Line 
//             type="monotone" 
//             dataKey="revenue_growth_percent" 
//             stroke="#ff7300" 
//             strokeDasharray="5 5"
//             name="Growth %"
//           />
//           <Legend />
//         </LineChart>
//       </ResponsiveContainer>
//     ),
//     calculate: (data) => data?.filter(entry => entry.timestamp && entry.quarterly_revenue)
//       .map(entry => ({
//         timestamp: new Date(entry.timestamp).toLocaleDateString(),
//         quarterly_revenue: entry.quarterly_revenue,
//         revenue_growth_percent: (entry.revenue_growth * 100).toFixed(1)
//       })) || []
//   },

//   // 3. Expense Breakdown
//   {
//     id: 'expense-breakdown',
//     title: 'Revenue Breakdown',
//     columns: ['revenue_breakdowns'],
//     render: (data) => (
//       <ResponsiveContainer width="100%" height={300}>
//         <PieChart>
//           <Pie
//             data={data}
//             cx="50%"
//             cy="50%"
//             outerRadius={80}
//             fill="#8884d8"
//             dataKey="value"
//             label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
//           >
//             {data.map((entry, index) => (
//               <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042'][index % 4]} />
//             ))}
//           </Pie>
//           <Tooltip formatter={(value) => [`$${(value/1000).toFixed(0)}K`, 'Revenue']} />
//           <Legend />
//         </PieChart>
//       </ResponsiveContainer>
//     ),
//     calculate: (data) => {
//       const breakdownData = data?.find(entry => entry.revenue_breakdowns);
//       return breakdownData?.revenue_breakdowns?.map(item => ({
//         name: item.product,
//         value: item.revenue,
//         percentage: item.percentage
//       })) || [];
//     }
//   },

//   // 4. Runway vs. Burn Rate
//   {
//     id: 'runway-burnrate',
//     title: 'Runway vs. Burn Rate',
//     columns: ['cash_balance', 'burn_rate', 'cash_runway'],
//     render: (data) => (
//       <ResponsiveContainer width="100%" height={300}>
//         <BarChart data={data}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="name" />
//           <YAxis />
//           <Tooltip />
//           <Legend />
//           <Bar dataKey="burn_rate" fill="#ff7300" name="Monthly Burn ($K)" />
//           <Bar dataKey="runway" fill="#8884d8" name="Runway (months)" />
//         </BarChart>
//       </ResponsiveContainer>
//     ),
//     calculate: (data) => {
//       const runwayData = data?.find(entry => entry.burn_rate);
//       return runwayData ? [{
//         name: 'Current',
//         burn_rate: runwayData.burn_rate / 1000, // Convert to K
//         runway: runwayData.cash_runway || 0
//       }] : [];
//     }
//   },

//   // 5. User/Customer Growth
//   {
//     id: 'user-growth',
//     title: 'User Growth',
//     columns: ['active_users', 'total_customers', 'timestamp'],
//     render: (data) => (
//       <ResponsiveContainer width="100%" height={300}>
//         <LineChart data={data}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="timestamp" />
//           <YAxis />
//           <Tooltip />
//           <Legend />
//           <Line 
//             type="monotone" 
//             dataKey="active_users" 
//             stroke="#8884d8" 
//             name="Active Users" 
//           />
//           <Line 
//             type="monotone" 
//             dataKey="total_customers" 
//             stroke="#82ca9d" 
//             name="Total Customers" 
//           />
//         </LineChart>
//       </ResponsiveContainer>
//     ),
//     calculate: (data) => data?.filter(entry => entry.timestamp && entry.active_users)
//       .map(entry => ({
//         timestamp: new Date(entry.timestamp).toLocaleDateString(),
//         active_users: entry.active_users,
//         total_customers: entry.total_customers
//       })) || []
//   },

//   // 6. Milestone Timeline
//   {
//     id: 'milestones',
//     title: 'Milestone Timeline',
//     columns: ['milestones_achieved', 'milestones_missed', 'roadmap'],
//     render: (data) => (
//       <div className="p-4 h-full">
//         <div className="h-full overflow-y-auto">
//           <h4 className="text-lg font-semibold text-green-600 mb-3">✅ Achieved</h4>
//           <ul className="space-y-2 mb-6">
//             {data?.achieved?.map((item, i) => (
//               <li key={i} className="flex items-center">
//                 <span className="w-3 h-3 bg-green-500 rounded-full mr-3 flex-shrink-0"></span>
//                 <span className="text-sm">{item}</span>
//               </li>
//             ))}
//           </ul>
          
//           <h4 className="text-lg font-semibold text-blue-600 mb-3">🎯 Upcoming</h4>
//           <ul className="space-y-2">
//             {data?.roadmap?.map((item, i) => (
//               <li key={i} className="flex items-center">
//                 <span className="w-3 h-3 bg-blue-500 rounded-full mr-3 flex-shrink-0"></span>
//                 <span className="text-sm">{item}</span>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
//     ),
//     calculate: (data) => {
//       const milestoneData = data?.find(entry => entry.milestones_achieved || entry.roadmap);
//       return {
//         achieved: milestoneData?.milestones_achieved || [],
//         roadmap: milestoneData?.roadmap || []
//       };
//     }
//   },

//   // 7. CAC vs. LTV
//   {
//     id: 'cac-ltv',
//     title: 'CAC vs. LTV',
//     columns: ['cac', 'ltv', 'ltv_ratio', 'timestamp'],
//     render: (data) => (
//       <ResponsiveContainer width="100%" height={300}>
//         <BarChart data={data}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="timestamp" />
//           <YAxis />
//           <Tooltip />
//           <Legend />
//           <Bar dataKey="cac" fill="#ff7300" name="CAC ($)" />
//           <Bar dataKey="ltv" fill="#8884d8" name="LTV ($)" />
//         </BarChart>
//       </ResponsiveContainer>
//     ),
//     calculate: (data) => data?.filter(entry => entry.timestamp && entry.cac)
//       .map(entry => ({
//         timestamp: new Date(entry.timestamp).toLocaleDateString(),
//         cac: entry.cac,
//         ltv: entry.ltv,
//         ltv_ratio: entry.ltv_ratio
//       })) || []
//   },

//   // 8. Market Opportunity
//   {
//     id: 'market-opportunity',
//     title: 'Market Opportunity',
//     columns: ['total_customers', 'market_share'],
//     render: (data) => (
//       <ResponsiveContainer width="100%" height={300}>
//         <RadarChart outerRadius={90} data={data}>
//           <PolarGrid />
//           <PolarAngleAxis dataKey="subject" />
//           <PolarRadiusAxis angle={30} domain={[0, 100]} />
//           <Radar 
//             name="Market Coverage" 
//             dataKey="value" 
//             stroke="#8884d8" 
//             fill="#8884d8" 
//             fillOpacity={0.6} 
//           />
//           <Legend />
//           <Tooltip />
//         </RadarChart>
//       </ResponsiveContainer>
//     ),
//     calculate: (data) => {
//       const marketData = data?.find(entry => entry.market_share);
//       return [
//         { subject: 'TAM', value: 100 },
//         { subject: 'SAM', value: 60 },
//         { subject: 'SOM', value: marketData?.market_share || 0 },
//         { subject: 'Current', value: ((marketData?.total_customers || 0) / 100) }
//       ];
//     }
//   },

//   // 9. KPI Trends
//   {
//     id: 'kpi-trends',
//     title: 'KPI Trends',
//     columns: ['active_users', 'conversion_rate', 'churn_rate', 'gross_margin', 'timestamp'],
//     render: (data) => (
//       <ResponsiveContainer width="100%" height={300}>
//         <LineChart data={data}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="timestamp" />
//           <YAxis yAxisId="left" />
//           <YAxis yAxisId="right" orientation="right" />
//           <Tooltip />
//           <Legend />
//           <Line 
//             yAxisId="left"
//             type="monotone" 
//             dataKey="active_users" 
//             stroke="#8884d8" 
//             name="Active Users" 
//           />
//           <Line 
//             yAxisId="right"
//             type="monotone" 
//             dataKey="conversion_rate" 
//             stroke="#82ca9d" 
//             name="Conversion %" 
//           />
//           <Line 
//             yAxisId="right"
//             type="monotone" 
//             dataKey="churn_rate" 
//             stroke="#ff0000" 
//             name="Churn %" 
//           />
//           <Line 
//             yAxisId="right"
//             type="monotone" 
//             dataKey="gross_margin" 
//             stroke="#ff7300" 
//             name="Margin %" 
//             strokeDasharray="5 5"
//           />
//         </LineChart>
//       </ResponsiveContainer>
//     ),
//     calculate: (data) => data?.filter(entry => entry.timestamp && entry.active_users)
//       .map(entry => ({
//         timestamp: new Date(entry.timestamp).toLocaleDateString(),
//         active_users: entry.active_users,
//         conversion_rate: (entry.conversion_rate * 100).toFixed(1),
//         churn_rate: (entry.churn_rate * 100).toFixed(1),
//         gross_margin: (entry.gross_margin * 100).toFixed(1)
//       })) || []
//   }
// ];

// const GraphPlaceholder = () => (
//   <div className="animate-pulse bg-gray-200 rounded-lg h-80 w-full flex items-center justify-center">
//     <div className="text-gray-500">Loading chart...</div>
//   </div>
// );

// const GraphComponent = ({ config, companyId, data }) => {
//   const [graphData, setGraphData] = useState(null);
  
//   useEffect(() => {
//     if (data && data.length > 0) {
//       const calculatedData = config.calculate(data);
//       setGraphData(calculatedData);
//     }
//   }, [data, config]);

//   return (
//     <div className="bg-white p-6 rounded-lg shadow-lg border h-full min-h-96">
//       <h3 className="font-semibold text-xl mb-4 text-gray-800">{config.title}</h3>
//       <div className="h-80">
//         {graphData && (Array.isArray(graphData) ? graphData.length > 0 : Object.keys(graphData).length > 0) ? 
//           config.render(graphData) : 
//           <GraphPlaceholder />
//         }
//       </div>
//     </div>
//   );
// };

// const Metrics = ({ companyId = "startup_123" }) => {
//   const [loadedGraphs, setLoadedGraphs] = useState({});
//   const [loading, setLoading] = useState({});
//   const [errors, setErrors] = useState({});
//   const graphRefs = useRef([]);

//   const fetchGraphData = async (graphId, columns) => {
//     if (loadedGraphs[graphId] || loading[graphId]) return;

//     setLoading(prev => ({ ...prev, [graphId]: true }));
//     setErrors(prev => ({ ...prev, [graphId]: null }));

//     try {
//       const response = await mockFetchData(companyId, columns.join(','));

//       setLoadedGraphs(prev => ({
//         ...prev,
//         [graphId]: response.data
//       }));
//     } catch (error) {
//       setErrors(prev => ({
//         ...prev,
//         [graphId]: 'Failed to load data'
//       }));
//     } finally {
//       setLoading(prev => ({ ...prev, [graphId]: false }));
//     }
//   };

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach(entry => {
//           if (entry.isIntersecting) {
//             const graphId = entry.target.getAttribute('data-graph-id');
//             const config = GRAPH_CONFIGS.find(g => g.id === graphId);
//             if (config) {
//               fetchGraphData(graphId, config.columns);
//             }
//           }
//         });
//       },
//       { threshold: 0.1 }
//     );

//     graphRefs.current.forEach(ref => {
//       if (ref) observer.observe(ref);
//     });

//     return () => observer.disconnect();
//   }, [companyId]);

//   // Group graphs into rows of two
//   const graphRows = [];
//   for (let i = 0; i < GRAPH_CONFIGS.length; i += 2) {
//     graphRows.push(GRAPH_CONFIGS.slice(i, i + 2));
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="container mx-auto px-4 py-8">
//         <div className="text-center mb-8">
//           <h1 className="text-4xl font-bold text-gray-900 mb-2">Company Metrics Dashboard</h1>
//           <p className="text-gray-600">Real-time insights into your startup's performance</p>
//         </div>
        
//         {graphRows.map((row, rowIndex) => (
//           <div key={rowIndex} className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
//             {row.map((config, colIndex) => {
//               const index = rowIndex * 2 + colIndex;
//               return (
//                 <div 
//                   key={config.id}
//                   ref={el => graphRefs.current[index] = el}
//                   data-graph-id={config.id}
//                   className="w-full"
//                 >
//                   {errors[config.id] ? (
//                     <div className="bg-red-50 border border-red-200 p-6 rounded-lg text-red-700">
//                       <div className="font-medium mb-2">Error loading {config.title}</div>
//                       <div className="text-sm mb-3">{errors[config.id]}</div>
//                       <button 
//                         onClick={() => fetchGraphData(config.id, config.columns)}
//                         className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
//                       >
//                         Retry
//                       </button>
//                     </div>
//                   ) : (
//                     <GraphComponent 
//                       config={config}
//                       companyId={companyId}
//                       data={loadedGraphs[config.id]}
//                     />
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Metrics;












// import { useState, useEffect, useRef } from 'react';
// import {
//   LineChart, BarChart, PieChart, RadarChart,
//   Line, Bar, Pie, Radar, Cell,
//   XAxis, YAxis, CartesianGrid, Tooltip, Legend,
//   ResponsiveContainer, AreaChart, Area, PolarRadiusAxis, PolarAngleAxis, PolarGrid
// } from 'recharts';

// // Sample data
// const SAMPLE_DATA = {
//   companyId: "startup_123",
//   metrics: [
//     // 1. Funds Raised Over Time
//     {
//       timestamp: "2023-01-01",
//       cash_balance: 500000,
//       last_round: "Pre-seed"
//     },
//     {
//       timestamp: "2023-04-01",
//       cash_balance: 1500000,
//       last_round: "Seed"
//     },
//     {
//       timestamp: "2023-10-01",
//       cash_balance: 4000000,
//       last_round: "Series A"
//     },

//     // 2. Revenue Growth
//     {
//       timestamp: "2023-01-01",
//       quarterly_revenue: 120000,
//       revenue_growth: 0.15
//     },
//     {
//       timestamp: "2023-04-01",
//       quarterly_revenue: 185000,
//       revenue_growth: 0.25
//     },
//     {
//       timestamp: "2023-07-01",
//       quarterly_revenue: 280000,
//       revenue_growth: 0.18
//     },

//     // 3. Expense Breakdown
//     {
//       revenue_breakdowns: [
//         { product: "SaaS Platform", revenue: 180000, percentage: 0.6 },
//         { product: "Consulting", revenue: 80000, percentage: 0.25 },
//         { product: "Training", revenue: 40000, percentage: 0.15 }
//       ]
//     },

//     // 4. Runway Metrics
//     {
//       cash_balance: 3200000,
//       burn_rate: 250000,
//       cash_runway: 12.8 // months
//     },

//     // 5. User Growth
//     {
//       timestamp: "2023-01-01",
//       active_users: 1500,
//       total_customers: 45
//     },
//     {
//       timestamp: "2023-04-01",
//       active_users: 4200,
//       total_customers: 112
//     },
//     {
//       timestamp: "2023-07-01",
//       active_users: 8900,
//       total_customers: 215
//     },

//     // 6. Milestones
//     {
//       milestones_achieved: [
//         "MVP Launched (Q1 2023)",
//         "First 100 Customers (Q2 2023)",
//         "Seed Round Closed"
//       ],
//       roadmap: [
//         "Series A Closing (Q4 2023)",
//         "Mobile App Launch",
//         "European Expansion"
//       ]
//     },

//     // 7. CAC/LTV
//     {
//       timestamp: "2023-01-01",
//       cac: 1200,
//       ltv: 8000,
//       ltv_ratio: 6.7
//     },
//     {
//       timestamp: "2023-04-01",
//       cac: 950,
//       ltv: 9200,
//       ltv_ratio: 9.7
//     },

//     // 8. Market Share
//     {
//       total_customers: 215,
//       market_share: 2.4 // %
//     },

//     // 9. KPIs
//     {
//       timestamp: "2023-01-01",
//       active_users: 1500,
//       conversion_rate: 0.03, // 3%
//       churn_rate: 0.08,      // 8%
//       gross_margin: 0.65     // 65%
//     },
//     {
//       timestamp: "2023-04-01",
//       active_users: 4200,
//       conversion_rate: 0.042,
//       churn_rate: 0.065,
//       gross_margin: 0.68
//     }
//   ]
// };

// // Mock API function
// const mockFetchData = (companyId, columns) => {
//   const neededColumns = columns.split(',');

//   const filteredData = SAMPLE_DATA.metrics
//     .filter(metric =>
//       Object.keys(metric).some(key => neededColumns.includes(key))
//     )
//     .map(metric => {
//       const filtered = {};
//       neededColumns.forEach(col => {
//         if (metric[col] !== undefined) filtered[col] = metric[col];
//       });
//       return filtered;
//     });

//   return Promise.resolve({ data: filteredData });
// };

// // Graph configurations with data formatting
// const GRAPH_CONFIGS = [
//   // 1. Funds Raised Over Time
//   {
//     id: 'funds-raised',
//     title: 'Funds Raised Over Time',
//     columns: ['last_round', 'cash_balance', 'timestamp'],
//     render: (data) => (
//       <ResponsiveContainer width="100%" height={300}>
//         <AreaChart data={data}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="timestamp" />
//           <YAxis />
//           <Tooltip formatter={(value) => [`$${(value/1000).toFixed(0)}K`, 'Cash Balance']} />
//           <Area 
//             type="monotone" 
//             dataKey="cash_balance" 
//             stroke="#8884d8" 
//             fill="#8884d8" 
//             fillOpacity={0.3}
//           />
//           <Legend />
//         </AreaChart>
//       </ResponsiveContainer>
//     ),
//     calculate: (data) => data?.filter(entry => entry.timestamp && entry.cash_balance)
//       .map(entry => ({
//         timestamp: new Date(entry.timestamp).toLocaleDateString(),
//         cash_balance: entry.cash_balance,
//         last_round: entry.last_round
//       })) || []
//   },

//   // 2. Revenue Growth
//   {
//     id: 'revenue-growth',
//     title: 'Revenue Growth (MoM/YoY)',
//     columns: ['quarterly_revenue', 'revenue_growth', 'timestamp'],
//     render: (data) => (
//       <ResponsiveContainer width="100%" height={300}>
//         <LineChart data={data}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="timestamp" />
//           <YAxis />
//           <Tooltip />
//           <Line 
//             type="monotone" 
//             dataKey="quarterly_revenue" 
//             stroke="#82ca9d" 
//             activeDot={{ r: 8 }} 
//             name="Quarterly Revenue"
//           />
//           <Line 
//             type="monotone" 
//             dataKey="revenue_growth_percent" 
//             stroke="#ff7300" 
//             strokeDasharray="5 5"
//             name="Growth %"
//           />
//           <Legend />
//         </LineChart>
//       </ResponsiveContainer>
//     ),
//     calculate: (data) => data?.filter(entry => entry.timestamp && entry.quarterly_revenue)
//       .map(entry => ({
//         timestamp: new Date(entry.timestamp).toLocaleDateString(),
//         quarterly_revenue: entry.quarterly_revenue,
//         revenue_growth_percent: (entry.revenue_growth * 100).toFixed(1)
//       })) || []
//   },

//   // 3. Expense Breakdown
//   {
//     id: 'expense-breakdown',
//     title: 'Revenue Breakdown',
//     columns: ['revenue_breakdowns'],
//     render: (data) => (
//       <ResponsiveContainer width="100%" height={300}>
//         <PieChart>
//           <Pie
//             data={data}
//             cx="50%"
//             cy="50%"
//             outerRadius={80}
//             fill="#8884d8"
//             dataKey="value"
//             label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
//           >
//             {data.map((entry, index) => (
//               <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042'][index % 4]} />
//             ))}
//           </Pie>
//           <Tooltip formatter={(value) => [`$${(value/1000).toFixed(0)}K`, 'Revenue']} />
//           <Legend />
//         </PieChart>
//       </ResponsiveContainer>
//     ),
//     calculate: (data) => {
//       const breakdownData = data?.find(entry => entry.revenue_breakdowns);
//       return breakdownData?.revenue_breakdowns?.map(item => ({
//         name: item.product,
//         value: item.revenue,
//         percentage: item.percentage
//       })) || [];
//     }
//   },

//   // 4. Runway vs. Burn Rate
//   {
//     id: 'runway-burnrate',
//     title: 'Runway vs. Burn Rate',
//     columns: ['cash_balance', 'burn_rate', 'cash_runway'],
//     render: (data) => (
//       <ResponsiveContainer width="100%" height={300}>
//         <BarChart data={data}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="name" />
//           <YAxis />
//           <Tooltip />
//           <Legend />
//           <Bar dataKey="burn_rate" fill="#ff7300" name="Monthly Burn ($K)" />
//           <Bar dataKey="runway" fill="#8884d8" name="Runway (months)" />
//         </BarChart>
//       </ResponsiveContainer>
//     ),
//     calculate: (data) => {
//       const runwayData = data?.find(entry => entry.burn_rate);
//       return runwayData ? [{
//         name: 'Current',
//         burn_rate: runwayData.burn_rate / 1000, // Convert to K
//         runway: runwayData.cash_runway || 0
//       }] : [];
//     }
//   },

//   // 5. User/Customer Growth
//   {
//     id: 'user-growth',
//     title: 'User Growth',
//     columns: ['active_users', 'total_customers', 'timestamp'],
//     render: (data) => (
//       <ResponsiveContainer width="100%" height={300}>
//         <LineChart data={data}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="timestamp" />
//           <YAxis />
//           <Tooltip />
//           <Legend />
//           <Line 
//             type="monotone" 
//             dataKey="active_users" 
//             stroke="#8884d8" 
//             name="Active Users" 
//           />
//           <Line 
//             type="monotone" 
//             dataKey="total_customers" 
//             stroke="#82ca9d" 
//             name="Total Customers" 
//           />
//         </LineChart>
//       </ResponsiveContainer>
//     ),
//     calculate: (data) => data?.filter(entry => entry.timestamp && entry.active_users)
//       .map(entry => ({
//         timestamp: new Date(entry.timestamp).toLocaleDateString(),
//         active_users: entry.active_users,
//         total_customers: entry.total_customers
//       })) || []
//   },

//   // 6. Milestone Timeline
//   {
//     id: 'milestones',
//     title: 'Milestone Timeline',
//     columns: ['milestones_achieved', 'milestones_missed', 'roadmap'],
//     render: (data) => (
//       <div className="p-4 h-full">
//         <div className="h-full overflow-y-auto">
//           <h4 className="text-lg font-semibold text-green-600 mb-3">✅ Achieved</h4>
//           <ul className="space-y-2 mb-6">
//             {data?.achieved?.map((item, i) => (
//               <li key={i} className="flex items-center">
//                 <span className="w-3 h-3 bg-green-500 rounded-full mr-3 flex-shrink-0"></span>
//                 <span className="text-sm">{item}</span>
//               </li>
//             ))}
//           </ul>
          
//           <h4 className="text-lg font-semibold text-blue-600 mb-3">🎯 Upcoming</h4>
//           <ul className="space-y-2">
//             {data?.roadmap?.map((item, i) => (
//               <li key={i} className="flex items-center">
//                 <span className="w-3 h-3 bg-blue-500 rounded-full mr-3 flex-shrink-0"></span>
//                 <span className="text-sm">{item}</span>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
//     ),
//     calculate: (data) => {
//       const milestoneData = data?.find(entry => entry.milestones_achieved || entry.roadmap);
//       return {
//         achieved: milestoneData?.milestones_achieved || [],
//         roadmap: milestoneData?.roadmap || []
//       };
//     }
//   },

//   // 7. CAC vs. LTV
//   {
//     id: 'cac-ltv',
//     title: 'CAC vs. LTV',
//     columns: ['cac', 'ltv', 'ltv_ratio', 'timestamp'],
//     render: (data) => (
//       <ResponsiveContainer width="100%" height={300}>
//         <BarChart data={data}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="timestamp" />
//           <YAxis />
//           <Tooltip />
//           <Legend />
//           <Bar dataKey="cac" fill="#ff7300" name="CAC ($)" />
//           <Bar dataKey="ltv" fill="#8884d8" name="LTV ($)" />
//         </BarChart>
//       </ResponsiveContainer>
//     ),
//     calculate: (data) => data?.filter(entry => entry.timestamp && entry.cac)
//       .map(entry => ({
//         timestamp: new Date(entry.timestamp).toLocaleDateString(),
//         cac: entry.cac,
//         ltv: entry.ltv,
//         ltv_ratio: entry.ltv_ratio
//       })) || []
//   },

//   // 8. Market Opportunity
//   {
//     id: 'market-opportunity',
//     title: 'Market Opportunity',
//     columns: ['total_customers', 'market_share'],
//     render: (data) => (
//       <ResponsiveContainer width="100%" height={300}>
//         <RadarChart outerRadius={90} data={data}>
//           <PolarGrid />
//           <PolarAngleAxis dataKey="subject" />
//           <PolarRadiusAxis angle={30} domain={[0, 100]} />
//           <Radar 
//             name="Market Coverage" 
//             dataKey="value" 
//             stroke="#8884d8" 
//             fill="#8884d8" 
//             fillOpacity={0.6} 
//           />
//           <Legend />
//           <Tooltip />
//         </RadarChart>
//       </ResponsiveContainer>
//     ),
//     calculate: (data) => {
//       const marketData = data?.find(entry => entry.market_share);
//       return [
//         { subject: 'TAM', value: 100 },
//         { subject: 'SAM', value: 60 },
//         { subject: 'SOM', value: marketData?.market_share || 0 },
//         { subject: 'Current', value: ((marketData?.total_customers || 0) / 100) }
//       ];
//     }
//   },

//   // 9. KPI Trends
//   {
//     id: 'kpi-trends',
//     title: 'KPI Trends',
//     columns: ['active_users', 'conversion_rate', 'churn_rate', 'gross_margin', 'timestamp'],
//     render: (data) => (
//       <ResponsiveContainer width="100%" height={300}>
//         <LineChart data={data}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="timestamp" />
//           <YAxis yAxisId="left" />
//           <YAxis yAxisId="right" orientation="right" />
//           <Tooltip />
//           <Legend />
//           <Line 
//             yAxisId="left"
//             type="monotone" 
//             dataKey="active_users" 
//             stroke="#8884d8" 
//             name="Active Users" 
//           />
//           <Line 
//             yAxisId="right"
//             type="monotone" 
//             dataKey="conversion_rate" 
//             stroke="#82ca9d" 
//             name="Conversion %" 
//           />
//           <Line 
//             yAxisId="right"
//             type="monotone" 
//             dataKey="churn_rate" 
//             stroke="#ff0000" 
//             name="Churn %" 
//           />
//           <Line 
//             yAxisId="right"
//             type="monotone" 
//             dataKey="gross_margin" 
//             stroke="#ff7300" 
//             name="Margin %" 
//             strokeDasharray="5 5"
//           />
//         </LineChart>
//       </ResponsiveContainer>
//     ),
//     calculate: (data) => data?.filter(entry => entry.timestamp && entry.active_users)
//       .map(entry => ({
//         timestamp: new Date(entry.timestamp).toLocaleDateString(),
//         active_users: entry.active_users,
//         conversion_rate: (entry.conversion_rate * 100).toFixed(1),
//         churn_rate: (entry.churn_rate * 100).toFixed(1),
//         gross_margin: (entry.gross_margin * 100).toFixed(1)
//       })) || []
//   }
// ];

// const GraphPlaceholder = () => (
//   <div className="animate-pulse bg-gray-200 rounded-lg h-80 w-full flex items-center justify-center">
//     <div className="text-gray-500">Loading chart...</div>
//   </div>
// );

// const GraphComponent = ({ config, companyId, data }) => {
//   const [graphData, setGraphData] = useState(null);
  
//   useEffect(() => {
//     if (data && data.length > 0) {
//       const calculatedData = config.calculate(data);
//       setGraphData(calculatedData);
//     }
//   }, [data, config]);

//   return (
//     <div className="bg-white p-6 rounded-lg shadow-lg border h-full min-h-96">
//       <h3 className="font-semibold text-xl mb-4 text-gray-800">{config.title}</h3>
//       <div className="h-80">
//         {graphData && (Array.isArray(graphData) ? graphData.length > 0 : Object.keys(graphData).length > 0) ? 
//           config.render(graphData) : 
//           <GraphPlaceholder />
//         }
//       </div>
//     </div>
//   );
// };

// const Metrics = ({ companyId = "startup_123" }) => {
//   const [loadedGraphs, setLoadedGraphs] = useState({});
//   const [loading, setLoading] = useState({});
//   const [errors, setErrors] = useState({});
//   const graphRefs = useRef([]);

//   const fetchGraphData = async (graphId, columns) => {
//     if (loadedGraphs[graphId] || loading[graphId]) return;

//     setLoading(prev => ({ ...prev, [graphId]: true }));
//     setErrors(prev => ({ ...prev, [graphId]: null }));

//     try {
//       const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/api/company/metrics/1?key=${}`,{
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             quarter:timePeriod.quarter,
//             year:timePeriod.year
//           })
//       });

//       setLoadedGraphs(prev => ({
//         ...prev,
//         [graphId]: response.data
//       }));
//     } catch (error) {
//       setErrors(prev => ({
//         ...prev,
//         [graphId]: 'Failed to load data'
//       }));
//     } finally {
//       setLoading(prev => ({ ...prev, [graphId]: false }));
//     }
//   };

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach(entry => {
//           if (entry.isIntersecting) {
//             const graphId = entry.target.getAttribute('data-graph-id');
//             const config = GRAPH_CONFIGS.find(g => g.id === graphId);
//             if (config) {
//               fetchGraphData(graphId, config.columns);
//             }
//           }
//         });
//       },
//       { threshold: 0.1 }
//     );

//     graphRefs.current.forEach(ref => {
//       if (ref) observer.observe(ref);
//     });

//     return () => observer.disconnect();
//   }, [companyId]);

//   // Group graphs into rows of two
//   const graphRows = [];
//   for (let i = 0; i < GRAPH_CONFIGS.length; i += 2) {
//     graphRows.push(GRAPH_CONFIGS.slice(i, i + 2));
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="container mx-auto px-4 py-8">
//         <div className="text-center mb-8">
//           <h1 className="text-4xl font-bold text-gray-900 mb-2">Company Metrics Dashboard</h1>
//           <p className="text-gray-600">Real-time insights into your startup's performance</p>
//         </div>
        
//         {graphRows.map((row, rowIndex) => (
//           <div key={rowIndex} className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
//             {row.map((config, colIndex) => {
//               const index = rowIndex * 2 + colIndex;
//               return (
//                 <div 
//                   key={config.id}
//                   ref={el => graphRefs.current[index] = el}
//                   data-graph-id={config.id}
//                   className="w-full"
//                 >
//                   {errors[config.id] ? (
//                     <div className="bg-red-50 border border-red-200 p-6 rounded-lg text-red-700">
//                       <div className="font-medium mb-2">Error loading {config.title}</div>
//                       <div className="text-sm mb-3">{errors[config.id]}</div>
//                       <button 
//                         onClick={() => fetchGraphData(config.id, config.columns)}
//                         className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
//                       >
//                         Retry
//                       </button>
//                     </div>
//                   ) : (
//                     <GraphComponent 
//                       config={config}
//                       companyId={companyId}
//                       data={loadedGraphs[config.id]}
//                     />
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Metrics;















// import { useState, useEffect, useRef } from 'react';
// import {
//   LineChart, BarChart, PieChart, RadarChart,
//   Line, Bar, Pie, Radar, Cell,
//   XAxis, YAxis, CartesianGrid, Tooltip, Legend,
//   ResponsiveContainer, AreaChart, Area, PolarRadiusAxis, PolarAngleAxis, PolarGrid
// } from 'recharts';

// // Mock data generator
// const generateMockData = (companyId, columns) => {
//   const baseData = [
//     {
//       timestamp: new Date(Date.now() - 5 * 30 * 24 * 60 * 60 * 1000).toISOString(),
//       cash_balance: 1200000,
//       burn_rate: 50000,
//       cash_runway: 24,
//       quarterly_revenue: 300000,
//       revenue_growth: 15,
//       active_users: 5000,
//       total_customers: 1200,
//       cac: 150,
//       ltv: 1800,
//       ltv_ratio: 12,
//       conversion_rate: 0.05,
//       churn_rate: 0.02,
//       gross_margin: 0.75,
//       market_share: 2.5,
//       last_round: 'Series A',
//       revenue_breakdowns: [
//         { product: 'Product A', revenue: 150000, percentage: 50 },
//         { product: 'Product B', revenue: 90000, percentage: 30 },
//         { product: 'Services', revenue: 60000, percentage: 20 }
//       ],
//       milestones_achieved: ['MVP Launch', 'First 1000 Users', 'Product-Market Fit', 'Series A Completed'],
//       milestones_missed: ['Q1 Revenue Target', 'Beta Launch Timeline'],
//       roadmap: ['Series B Funding', 'International Expansion', 'New Product Line', 'Mobile App Launch'],
//       differentiators: ['AI-Powered', 'Best Support', 'Competitive Pricing'],
//       sam: 65,
//       som: 28,
//       competitor_analysis: [
//         { name: 'Us', features: 90, pricing: 70, support: 85, market_share: 15, ux: 88 },
//         { name: 'Competitor A', features: 80, pricing: 90, support: 60, market_share: 45, ux: 75 },
//         { name: 'Competitor B', features: 70, pricing: 80, support: 90, market_share: 25, ux: 82 }
//       ]
//     },
//     {
//       timestamp: new Date(Date.now() - 4 * 30 * 24 * 60 * 60 * 1000).toISOString(),
//       cash_balance: 1150000,
//       burn_rate: 52000,
//       cash_runway: 22,
//       quarterly_revenue: 345000,
//       revenue_growth: 18,
//       active_users: 5800,
//       total_customers: 1380,
//       cac: 140,
//       ltv: 1950,
//       ltv_ratio: 13.9,
//       conversion_rate: 0.055,
//       churn_rate: 0.018,
//       gross_margin: 0.78,
//       sam: 68,
//       som: 30,
//       milestones_missed: ['Q2 Marketing Campaign']
//     },
//     {
//       timestamp: new Date(Date.now() - 3 * 30 * 24 * 60 * 60 * 1000).toISOString(),
//       cash_balance: 1100000,
//       burn_rate: 55000,
//       cash_runway: 20,
//       quarterly_revenue: 395000,
//       revenue_growth: 22,
//       active_users: 6700,
//       total_customers: 1580,
//       cac: 135,
//       ltv: 2100,
//       ltv_ratio: 15.6,
//       conversion_rate: 0.06,
//       churn_rate: 0.015,
//       gross_margin: 0.80,
//       sam: 72,
//       som: 35,
//       milestones_missed: ['Partnership Deal Closure']
//     }
//   ];
  
//   return Promise.resolve({ data: baseData });
// };

// // Graph configurations with data formatting
// const GRAPH_CONFIGS = [
//   // 1. Funds Raised Over Time
//   {
//     id: 'funds-raised',
//     title: 'Funds Raised Over Time',
//     columns: ['last_round', 'cash_balance', 'timestamp'],
//     render: (data) => (
//       <ResponsiveContainer width="100%" height={250}>
//         <AreaChart data={data}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="timestamp" />
//           <YAxis />
//           <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Cash Balance']} />
//           <Area 
//             type="monotone" 
//             dataKey="cash_balance" 
//             stroke="#8884d8" 
//             fill="#8884d8" 
//             fillOpacity={0.6}
//           />
//           <Legend />
//         </AreaChart>
//       </ResponsiveContainer>
//     ),
//     calculate: (data) => {
//       if (!data || !Array.isArray(data)) return [];
//       return data.map(entry => ({
//         timestamp: new Date(entry.timestamp).toLocaleDateString(),
//         cash_balance: entry.cash_balance,
//         last_round: entry.last_round
//       }));
//     }
//   },

//   // 2. Revenue Growth
//   {
//     id: 'revenue-growth',
//     title: 'Revenue Growth (MoM/YoY)',
//     columns: ['quarterly_revenue', 'revenue_growth', 'timestamp'],
//     render: (data) => (
//       <ResponsiveContainer width="100%" height={250}>
//         <LineChart data={data}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="timestamp" />
//           <YAxis />
//           <Tooltip />
//           <Line 
//             type="monotone" 
//             dataKey="quarterly_revenue" 
//             stroke="#82ca9d" 
//             activeDot={{ r: 6 }} 
//             name="Quarterly Revenue"
//           />
//           <Line 
//             type="monotone" 
//             dataKey="revenue_growth" 
//             stroke="#ff7300" 
//             strokeDasharray="5 5" 
//             name="Growth %"
//           />
//           <Legend />
//         </LineChart>
//       </ResponsiveContainer>
//     ),
//     calculate: (data) => {
//       if (!data || !Array.isArray(data)) return [];
//       return data.map(entry => ({
//         timestamp: new Date(entry.timestamp).toLocaleDateString(),
//         quarterly_revenue: entry.quarterly_revenue,
//         revenue_growth: entry.revenue_growth
//       }));
//     }
//   },

//   // 3. Expense Breakdown
//   {
//     id: 'expense-breakdown',
//     title: 'Revenue Breakdown',
//     columns: ['revenue_breakdowns'],
//     render: (data) => (
//       <ResponsiveContainer width="100%" height={250}>
//         <PieChart>
//           <Pie
//             data={data}
//             cx="50%"
//             cy="50%"
//             outerRadius={80}
//             fill="#8884d8"
//             dataKey="value"
//             label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
//           >
//             {data.map((entry, index) => (
//               <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042'][index % 4]} />
//             ))}
//           </Pie>
//           <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} />
//           <Legend />
//         </PieChart>
//       </ResponsiveContainer>
//     ),
//     calculate: (data) => {
//       if (!data || !Array.isArray(data) || !data[0]?.revenue_breakdowns) return [];
//       return data[0].revenue_breakdowns.map(item => ({
//         name: item.product,
//         value: item.revenue,
//         percentage: item.percentage
//       }));
//     }
//   },

//   // 4. Runway vs. Burn Rate
//   {
//     id: 'runway-burnrate',
//     title: 'Runway vs. Burn Rate',
//     columns: ['cash_balance', 'burn_rate', 'cash_runway'],
//     render: (data) => (
//       <ResponsiveContainer width="100%" height={250}>
//         <BarChart data={data}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="name" />
//           <YAxis />
//           <Tooltip />
//           <Legend />
//           <Bar dataKey="burn_rate" fill="#ff7300" name="Monthly Burn ($)" />
//           <Bar dataKey="runway" fill="#8884d8" name="Runway (months)" />
//         </BarChart>
//       </ResponsiveContainer>
//     ),
//     calculate: (data) => {
//       if (!data || !Array.isArray(data) || data.length === 0) return [];
//       const latest = data[data.length - 1];
//       return [
//         {
//           name: 'Current',
//           burn_rate: latest.burn_rate || 0,
//           runway: latest.cash_runway || 0
//         }
//       ];
//     }
//   },

//   // 5. User/Customer Growth
//   {
//     id: 'user-growth',
//     title: 'User Growth',
//     columns: ['active_users', 'total_customers', 'timestamp'],
//     render: (data) => (
//       <ResponsiveContainer width="100%" height={250}>
//         <LineChart data={data}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="timestamp" />
//           <YAxis />
//           <Tooltip />
//           <Legend />
//           <Line 
//             type="monotone" 
//             dataKey="active_users" 
//             stroke="#8884d8" 
//             name="Active Users" 
//           />
//           <Line 
//             type="monotone" 
//             dataKey="total_customers" 
//             stroke="#82ca9d" 
//             name="Total Customers" 
//           />
//         </LineChart>
//       </ResponsiveContainer>
//     ),
//     calculate: (data) => {
//       if (!data || !Array.isArray(data)) return [];
//       return data.map(entry => ({
//         timestamp: new Date(entry.timestamp).toLocaleDateString(),
//         active_users: entry.active_users,
//         total_customers: entry.total_customers
//       }));
//     }
//   },

//   // 6. CAC vs. LTV
//   {
//     id: 'cac-ltv',
//     title: 'CAC vs. LTV',
//     columns: ['cac', 'ltv', 'ltv_ratio', 'timestamp'],
//     render: (data) => (
//       <ResponsiveContainer width="100%" height={250}>
//         <BarChart data={data}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="timestamp" />
//           <YAxis />
//           <Tooltip />
//           <Legend />
//           <Bar dataKey="cac" fill="#ff7300" name="CAC ($)" />
//           <Bar dataKey="ltv" fill="#8884d8" name="LTV ($)" />
//         </BarChart>
//       </ResponsiveContainer>
//     ),
//     calculate: (data) => {
//       if (!data || !Array.isArray(data)) return [];
//       return data.map(entry => ({
//         timestamp: new Date(entry.timestamp).toLocaleDateString(),
//         cac: entry.cac,
//         ltv: entry.ltv,
//         ltv_ratio: entry.ltv_ratio
//       }));
//     }
//   },

//   // 7. Milestone Timeline
//   {
//     id: 'milestones',
//     title: 'Milestone Timeline',
//     columns: ['milestones_achieved', 'milestones_missed', 'roadmap'],
//     render: (data) => (
//       <div className="p-4 h-full overflow-y-auto">
//         <div className="mb-4">
//           <h4 className="text-lg font-semibold text-green-600 mb-3">✅ Achieved Milestones</h4>
//           <ul className="space-y-2">
//             {data?.achieved?.map((item, i) => (
//               <li key={i} className="flex items-center">
//                 <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
//                 <span className="text-sm">{item}</span>
//               </li>
//             ))}
//           </ul>
//         </div>
        
//         <div className="mb-4">
//           <h4 className="text-lg font-semibold text-red-600 mb-3">❌ Missed Milestones</h4>
//           <ul className="space-y-2">
//             {data?.missed?.map((item, i) => (
//               <li key={i} className="flex items-center">
//                 <span className="w-3 h-3 bg-red-500 rounded-full mr-3"></span>
//                 <span className="text-sm">{item}</span>
//               </li>
//             ))}
//           </ul>
//         </div>
        
//         <div>
//           <h4 className="text-lg font-semibold text-blue-600 mb-3">🎯 Upcoming Roadmap</h4>
//           <ul className="space-y-2">
//             {data?.roadmap?.map((item, i) => (
//               <li key={i} className="flex items-center">
//                 <span className="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
//                 <span className="text-sm">{item}</span>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
//     ),
//     calculate: (data) => {
//       if (!data || !Array.isArray(data) || data.length === 0) return {};
//       const latest = data[data.length - 1];
//       return {
//         achieved: latest.milestones_achieved || [],
//         missed: latest.milestones_missed || [],
//         roadmap: latest.roadmap || []
//       };
//     }
//   },

//   // 8. Market Opportunity
//   {
//     id: 'market-opportunity',
//     title: 'Market Opportunity (TAM/SAM/SOM)',
//     columns: ['total_customers', 'market_share', 'tam', 'sam', 'som'],
//     render: (data) => (
//       <ResponsiveContainer width="100%" height={250}>
//         <RadarChart outerRadius={90} data={data}>
//           <PolarGrid />
//           <PolarAngleAxis dataKey="subject" />
//           <PolarRadiusAxis angle={30} domain={[0, 100]} tickCount={5} />
//           <Radar 
//             name="Market Coverage" 
//             dataKey="value" 
//             stroke="#8884d8" 
//             fill="#8884d8" 
//             fillOpacity={0.6} 
//           />
//           <Legend />
//           <Tooltip formatter={(value) => [`${value}%`, 'Coverage']} />
//         </RadarChart>
//       </ResponsiveContainer>
//     ),
//     calculate: (data) => {
//       if (!data || !Array.isArray(data) || data.length === 0) return [];
//       const latest = data[data.length - 1];
//       return [
//         { subject: 'TAM', value: 100 },
//         { subject: 'SAM', value: latest.sam || 60 },
//         { subject: 'SOM', value: latest.som || 25 },
//         { subject: 'Current Share', value: latest.market_share || 2.5 }
//       ];
//     }
//   },

//   // 9. Competitor Comparison
//   {
//     id: 'competitors',
//     title: 'Competitor Comparison',
//     columns: ['competitor_analysis'],
//     render: (data) => (
//       <ResponsiveContainer width="100%" height={250}>
//         <RadarChart data={data[0]?.metrics || []}>
//           <PolarGrid />
//           <PolarAngleAxis dataKey="subject" />
//           <PolarRadiusAxis domain={[0, 100]} tickCount={5} />
//           {data?.map((company, i) => (
//             <Radar 
//               key={i}
//               name={company.name}
//               dataKey="value"
//               stroke={['#8884d8', '#82ca9d', '#ff7300'][i]}
//               fill={['#8884d8', '#82ca9d', '#ff7300'][i]}
//               fillOpacity={0.3}
//             />
//           ))}
//           <Legend />
//           <Tooltip />
//         </RadarChart>
//       </ResponsiveContainer>
//     ),
//     calculate: (data) => {
//       if (!data || !Array.isArray(data) || data.length === 0) return [];
      
//       const metrics = [
//         { subject: 'Features', us: 90, compA: 80, compB: 70 },
//         { subject: 'Pricing', us: 70, compA: 90, compB: 80 },
//         { subject: 'Support', us: 85, compA: 60, compB: 90 },
//         { subject: 'Market Share', us: 15, compA: 45, compB: 25 },
//         { subject: 'User Experience', us: 88, compA: 75, compB: 82 }
//       ];

//       return [
//         {
//           name: 'Us',
//           metrics: metrics.map(m => ({ subject: m.subject, value: m.us }))
//         },
//         {
//           name: 'Competitor A',
//           metrics: metrics.map(m => ({ subject: m.subject, value: m.compA }))
//         },
//         {
//           name: 'Competitor B',
//           metrics: metrics.map(m => ({ subject: m.subject, value: m.compB }))
//         }
//       ];
//     }
//   },

//   // 10. KPI Trends
//   {
//     id: 'kpi-trends',
//     title: 'Key Performance Indicators Trends',
//     columns: ['active_users', 'conversion_rate', 'churn_rate', 'gross_margin', 'timestamp'],
//     render: (data) => (
//       <ResponsiveContainer width="100%" height={250}>
//         <LineChart data={data}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="timestamp" />
//           <YAxis yAxisId="left" />
//           <YAxis yAxisId="right" orientation="right" />
//           <Tooltip />
//           <Legend />
//           <Line 
//             yAxisId="left"
//             type="monotone" 
//             dataKey="active_users" 
//             stroke="#8884d8" 
//             name="Active Users" 
//           />
//           <Line 
//             yAxisId="right"
//             type="monotone" 
//             dataKey="conversion_rate" 
//             stroke="#82ca9d" 
//             name="Conversion %" 
//           />
//           <Line 
//             yAxisId="right"
//             type="monotone" 
//             dataKey="churn_rate" 
//             stroke="#ff0000" 
//             name="Churn %" 
//           />
//           <Line 
//             yAxisId="right"
//             type="monotone" 
//             dataKey="gross_margin" 
//             stroke="#ff7300" 
//             name="Margin %" 
//             strokeDasharray="5 5"
//           />
//         </LineChart>
//       </ResponsiveContainer>
//     ),
//     calculate: (data) => {
//       if (!data || !Array.isArray(data)) return [];
//       return data.map(entry => ({
//         timestamp: new Date(entry.timestamp).toLocaleDateString(),
//         active_users: entry.active_users,
//         conversion_rate: (entry.conversion_rate * 100).toFixed(1),
//         churn_rate: (entry.churn_rate * 100).toFixed(1),
//         gross_margin: (entry.gross_margin * 100).toFixed(1)
//       }));
//     }
//   }
// ];

// const GraphPlaceholder = () => (
//   <div className="animate-pulse bg-gray-200 rounded-lg h-64 w-full flex items-center justify-center">
//     <span className="text-gray-500">Loading...</span>
//   </div>
// );

// const GraphComponent = ({ config, companyId, data }) => {
//   const [graphData, setGraphData] = useState(null);
//   const [error, setError] = useState(null);
  
//   useEffect(() => {
//     try {
//       if (data) {
//         const calculatedData = config.calculate(data);
//         console.log(`Graph ${config.id}:`, calculatedData); // Debug log
//         setGraphData(calculatedData);
//         setError(null);
//       }
//     } catch (err) {
//       console.error(`Error calculating data for ${config.id}:`, err);
//       setError(err.message);
//     }
//   }, [data, config]);

//   if (error) {
//     return (
//       <div className="bg-white p-4 rounded-lg shadow h-full">
//         <h3 className="font-medium text-lg mb-2">{config.title}</h3>
//         <div className="h-64 flex items-center justify-center bg-red-50 text-red-600 rounded">
//           Error: {error}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white p-4 rounded-lg shadow h-full">
//       <h3 className="font-medium text-lg mb-2">{config.title}</h3>
//       <div className="h-64">
//         {graphData && graphData.length > 0 ? (
//           config.render(graphData)
//         ) : (
//           <GraphPlaceholder />
//         )}
//       </div>
//     </div>
//   );
// };

// const Metrics = ({ companyId = 'demo-company' }) => {
//   const [loadedGraphs, setLoadedGraphs] = useState({});
//   const [loading, setLoading] = useState({});
//   const [errors, setErrors] = useState({});
//   const graphRefs = useRef([]);

//   const fetchGraphData = async (graphId, columns) => {
//     if (loadedGraphs[graphId] || loading[graphId]) return;

//     setLoading(prev => ({ ...prev, [graphId]: true }));
//     setErrors(prev => ({ ...prev, [graphId]: null }));

//     try {
//       console.log(`Fetching data for ${graphId}...`); // Debug log
      
//       const response = await generateMockData(companyId, columns.join(','));
      
//       console.log(`Data received for ${graphId}:`, response.data); // Debug log

//       setLoadedGraphs(prev => ({
//         ...prev,
//         [graphId]: response.data
//       }));
//     } catch (error) {
//       console.error(`Error fetching ${graphId}:`, error);
//       setErrors(prev => ({
//         ...prev,
//         [graphId]: 'Failed to load data'
//       }));
//     } finally {
//       setLoading(prev => ({ ...prev, [graphId]: false }));
//     }
//   };

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach(entry => {
//           if (entry.isIntersecting) {
//             const graphId = entry.target.getAttribute('data-graph-id');
//             const config = GRAPH_CONFIGS.find(g => g.id === graphId);
//             if (config) {
//               fetchGraphData(graphId, config.columns);
//             }
//           }
//         });
//       },
//       { threshold: 0.1 }
//     );

//     graphRefs.current.forEach(ref => {
//       if (ref) observer.observe(ref);
//     });

//     return () => observer.disconnect();
//   }, [companyId]);

//   // Group graphs into rows of two
//   const graphRows = [];
//   for (let i = 0; i < GRAPH_CONFIGS.length; i += 2) {
//     graphRows.push(GRAPH_CONFIGS.slice(i, i + 2));
//   }

//   return (
//     <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
//       <h1 className="text-3xl font-bold mb-8 text-gray-800">Company Metrics Dashboard</h1>
      
//       {graphRows.map((row, rowIndex) => (
//         <div key={rowIndex} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//           {row.map((config, colIndex) => {
//             const index = rowIndex * 2 + colIndex;
//             return (
//               <div 
//                 key={config.id}
//                 ref={el => graphRefs.current[index] = el}
//                 data-graph-id={config.id}
//                 className="min-h-80"
//               >
//                 {errors[config.id] ? (
//                   <div className="bg-red-50 p-4 rounded-lg text-red-600 border border-red-200">
//                     <h3 className="font-medium text-lg mb-2">{config.title}</h3>
//                     <div className="mb-2">{errors[config.id]}</div>
//                     <button 
//                       onClick={() => fetchGraphData(config.id, config.columns)}
//                       className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
//                     >
//                       Retry
//                     </button>
//                   </div>
//                 ) : (
//                   <GraphComponent 
//                     config={config}
//                     companyId={companyId}
//                     data={loadedGraphs[config.id]}
//                   />
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Metrics;



















// import { useState, useEffect, useRef } from 'react';
// import {
//   LineChart, BarChart, PieChart, RadarChart,
//   Line, Bar, Pie, Radar, Cell,
//   XAxis, YAxis, CartesianGrid, Tooltip, Legend,
//   ResponsiveContainer, AreaChart, Area, PolarRadiusAxis, PolarAngleAxis, PolarGrid
// } from 'recharts';

// // Mock data generator
// const generateMockData = (companyId, columns) => {
//   const baseData = [
//     {
//       timestamp: new Date(Date.now() - 5 * 30 * 24 * 60 * 60 * 1000).toISOString(),
//       cash_balance: 1200000,
//       burn_rate: 50000,
//       cash_runway: 24,
//       quarterly_revenue: 300000,
//       revenue_growth: 15,
//       active_users: 5000,
//       total_customers: 1200,
//       cac: 150,
//       ltv: 1800,
//       ltv_ratio: 12,
//       conversion_rate: 0.05,
//       churn_rate: 0.02,
//       gross_margin: 0.75,
//       market_share: 2.5,
//       last_round: 'Series A',
//       revenue_breakdowns: [
//         { product: 'Product A', revenue: 150000, percentage: 50 },
//         { product: 'Product B', revenue: 90000, percentage: 30 },
//         { product: 'Services', revenue: 60000, percentage: 20 }
//       ],
//       milestones_achieved: ['MVP Launch', 'First 1000 Users', 'Product-Market Fit'],
//       roadmap: ['Series B Funding', 'International Expansion', 'New Product Line'],
//       differentiators: ['AI-Powered', 'Best Support', 'Competitive Pricing']
//     },
//     {
//       timestamp: new Date(Date.now() - 4 * 30 * 24 * 60 * 60 * 1000).toISOString(),
//       cash_balance: 1150000,
//       burn_rate: 52000,
//       cash_runway: 22,
//       quarterly_revenue: 345000,
//       revenue_growth: 18,
//       active_users: 5800,
//       total_customers: 1380,
//       cac: 140,
//       ltv: 1950,
//       ltv_ratio: 13.9,
//       conversion_rate: 0.055,
//       churn_rate: 0.018,
//       gross_margin: 0.78
//     },
//     {
//       timestamp: new Date(Date.now() - 3 * 30 * 24 * 60 * 60 * 1000).toISOString(),
//       cash_balance: 1100000,
//       burn_rate: 55000,
//       cash_runway: 20,
//       quarterly_revenue: 395000,
//       revenue_growth: 22,
//       active_users: 6700,
//       total_customers: 1580,
//       cac: 135,
//       ltv: 2100,
//       ltv_ratio: 15.6,
//       conversion_rate: 0.06,
//       churn_rate: 0.015,
//       gross_margin: 0.80
//     }
//   ];
  
//   return Promise.resolve({ data: baseData });
// };

// // Graph configurations with data formatting
// const GRAPH_CONFIGS = [
//   // 1. Funds Raised Over Time
//   {
//     id: 'funds-raised',
//     title: 'Funds Raised Over Time',
//     columns: ['last_round', 'cash_balance', 'timestamp'],
//     render: (data) => (
//       <ResponsiveContainer width="100%" height={250}>
//         <AreaChart data={data}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="timestamp" />
//           <YAxis />
//           <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Cash Balance']} />
//           <Area 
//             type="monotone" 
//             dataKey="cash_balance" 
//             stroke="#8884d8" 
//             fill="#8884d8" 
//             fillOpacity={0.6}
//           />
//           <Legend />
//         </AreaChart>
//       </ResponsiveContainer>
//     ),
//     calculate: (data) => {
//       if (!data || !Array.isArray(data)) return [];
//       return data.map(entry => ({
//         timestamp: new Date(entry.timestamp).toLocaleDateString(),
//         cash_balance: entry.cash_balance,
//         last_round: entry.last_round
//       }));
//     }
//   },

//   // 2. Revenue Growth
//   {
//     id: 'revenue-growth',
//     title: 'Revenue Growth (MoM/YoY)',
//     columns: ['quarterly_revenue', 'revenue_growth', 'timestamp'],
//     render: (data) => (
//       <ResponsiveContainer width="100%" height={250}>
//         <LineChart data={data}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="timestamp" />
//           <YAxis />
//           <Tooltip />
//           <Line 
//             type="monotone" 
//             dataKey="quarterly_revenue" 
//             stroke="#82ca9d" 
//             activeDot={{ r: 6 }} 
//             name="Quarterly Revenue"
//           />
//           <Line 
//             type="monotone" 
//             dataKey="revenue_growth" 
//             stroke="#ff7300" 
//             strokeDasharray="5 5" 
//             name="Growth %"
//           />
//           <Legend />
//         </LineChart>
//       </ResponsiveContainer>
//     ),
//     calculate: (data) => {
//       if (!data || !Array.isArray(data)) return [];
//       return data.map(entry => ({
//         timestamp: new Date(entry.timestamp).toLocaleDateString(),
//         quarterly_revenue: entry.quarterly_revenue,
//         revenue_growth: entry.revenue_growth
//       }));
//     }
//   },

//   // 3. Expense Breakdown
//   {
//     id: 'expense-breakdown',
//     title: 'Revenue Breakdown',
//     columns: ['revenue_breakdowns'],
//     render: (data) => (
//       <ResponsiveContainer width="100%" height={250}>
//         <PieChart>
//           <Pie
//             data={data}
//             cx="50%"
//             cy="50%"
//             outerRadius={80}
//             fill="#8884d8"
//             dataKey="value"
//             label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
//           >
//             {data.map((entry, index) => (
//               <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042'][index % 4]} />
//             ))}
//           </Pie>
//           <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} />
//           <Legend />
//         </PieChart>
//       </ResponsiveContainer>
//     ),
//     calculate: (data) => {
//       if (!data || !Array.isArray(data) || !data[0]?.revenue_breakdowns) return [];
//       return data[0].revenue_breakdowns.map(item => ({
//         name: item.product,
//         value: item.revenue,
//         percentage: item.percentage
//       }));
//     }
//   },

//   // 4. Runway vs. Burn Rate
//   {
//     id: 'runway-burnrate',
//     title: 'Runway vs. Burn Rate',
//     columns: ['cash_balance', 'burn_rate', 'cash_runway'],
//     render: (data) => (
//       <ResponsiveContainer width="100%" height={250}>
//         <BarChart data={data}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="name" />
//           <YAxis />
//           <Tooltip />
//           <Legend />
//           <Bar dataKey="burn_rate" fill="#ff7300" name="Monthly Burn ($)" />
//           <Bar dataKey="runway" fill="#8884d8" name="Runway (months)" />
//         </BarChart>
//       </ResponsiveContainer>
//     ),
//     calculate: (data) => {
//       if (!data || !Array.isArray(data) || data.length === 0) return [];
//       const latest = data[data.length - 1];
//       return [
//         {
//           name: 'Current',
//           burn_rate: latest.burn_rate || 0,
//           runway: latest.cash_runway || 0
//         }
//       ];
//     }
//   },

//   // 5. User/Customer Growth
//   {
//     id: 'user-growth',
//     title: 'User Growth',
//     columns: ['active_users', 'total_customers', 'timestamp'],
//     render: (data) => (
//       <ResponsiveContainer width="100%" height={250}>
//         <LineChart data={data}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="timestamp" />
//           <YAxis />
//           <Tooltip />
//           <Legend />
//           <Line 
//             type="monotone" 
//             dataKey="active_users" 
//             stroke="#8884d8" 
//             name="Active Users" 
//           />
//           <Line 
//             type="monotone" 
//             dataKey="total_customers" 
//             stroke="#82ca9d" 
//             name="Total Customers" 
//           />
//         </LineChart>
//       </ResponsiveContainer>
//     ),
//     calculate: (data) => {
//       if (!data || !Array.isArray(data)) return [];
//       return data.map(entry => ({
//         timestamp: new Date(entry.timestamp).toLocaleDateString(),
//         active_users: entry.active_users,
//         total_customers: entry.total_customers
//       }));
//     }
//   },

//   // 6. CAC vs. LTV
//   {
//     id: 'cac-ltv',
//     title: 'CAC vs. LTV',
//     columns: ['cac', 'ltv', 'ltv_ratio', 'timestamp'],
//     render: (data) => (
//       <ResponsiveContainer width="100%" height={250}>
//         <BarChart data={data}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="timestamp" />
//           <YAxis />
//           <Tooltip />
//           <Legend />
//           <Bar dataKey="cac" fill="#ff7300" name="CAC ($)" />
//           <Bar dataKey="ltv" fill="#8884d8" name="LTV ($)" />
//         </BarChart>
//       </ResponsiveContainer>
//     ),
//     calculate: (data) => {
//       if (!data || !Array.isArray(data)) return [];
//       return data.map(entry => ({
//         timestamp: new Date(entry.timestamp).toLocaleDateString(),
//         cac: entry.cac,
//         ltv: entry.ltv,
//         ltv_ratio: entry.ltv_ratio
//       }));
//     }
//   },

//     // 7. CAC vs. LTV
//   {
//     id: 'cac-ltv',
//     title: 'CAC vs. LTV',
//     columns: ['cac', 'ltv', 'ltv_ratio', 'timestamp'],
//     render: (data) => (
//       <ResponsiveContainer width="100%" height={300}>
//         <BarChart data={data}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="timestamp" />
//           <YAxis />
//           <Tooltip />
//           <Legend />
//           <Bar dataKey="cac" fill="#ff7300" name="CAC" />
//           <Bar dataKey="ltv" fill="#8884d8" name="LTV" />
//           <Line 
//             type="monotone" 
//             dataKey="ltv_ratio" 
//             stroke="#ff0000" 
//             name="LTV Ratio" 
//             yAxisId="right"
//           />
//           <YAxis yAxisId="right" orientation="right" />
//         </BarChart>
//       </ResponsiveContainer>
//     ),
//     calculate: (data) => data?.map(entry => ({
//       timestamp: new Date(entry.timestamp).toLocaleDateString(),
//       cac: entry.cac,
//       ltv: entry.ltv,
//       ltv_ratio: entry.ltv_ratio
//     })) || []
//   },

//   // 8. Market Opportunity
//   {
//     id: 'market-opportunity',
//     title: 'Market Opportunity',
//     columns: ['total_customers', 'market_share'],
//     render: (data) => (
//       <ResponsiveContainer width="100%" height={300}>
//         <RadarChart outerRadius={90} data={data}>
//           <PolarGrid />
//           <PolarAngleAxis dataKey="subject" />
//           <PolarRadiusAxis angle={30} domain={[0, 100]} />
//           <Radar 
//             name="Coverage" 
//             dataKey="value" 
//             stroke="#8884d8" 
//             fill="#8884d8" 
//             fillOpacity={0.6} 
//           />
//           <Legend />
//           <Tooltip />
//         </RadarChart>
//       </ResponsiveContainer>
//     ),
//     calculate: (data) => [
//       { subject: 'TAM', value: 100 },
//       { subject: 'SAM', value: 60 },
//       { subject: 'SOM', value: data?.[0]?.market_share || 0 },
//       { subject: 'Current', value: (data?.[0]?.total_customers / 1000) || 0 }
//     ]
//   },

//   // 9. Competitor Comparison
//   {
//     id: 'competitors',
//     title: 'Competitor Comparison',
//     columns: ['differentiators'],
//     render: (data) => (
//       <ResponsiveContainer width="100%" height={300}>
//         <RadarChart data={data}>
//           <PolarGrid />
//           <PolarAngleAxis dataKey="subject" />
//           <PolarRadiusAxis />
//           {data?.map((company, i) => (
//             <Radar 
//               key={i}
//               name={company.name}
//               dataKey="value"
//               stroke={['#8884d8', '#82ca9d', '#ff7300'][i]}
//               fill={['#8884d8', '#82ca9d', '#ff7300'][i]}
//               fillOpacity={0.6}
//             />
//           ))}
//           <Legend />
//           <Tooltip />
//         </RadarChart>
//       </ResponsiveContainer>
//     ),
//     calculate: (data) => [
//       {
//         name: 'Us',
//         subject: 'Features', value: 90,
//         subject: 'Pricing', value: 70,
//         subject: 'Support', value: 80
//       },
//       {
//         name: 'Competitor A',
//         subject: 'Features', value: 80,
//         subject: 'Pricing', value: 90,
//         subject: 'Support', value: 60
//       },
//       {
//         name: 'Competitor B',
//         subject: 'Features', value: 70,
//         subject: 'Pricing', value: 80,
//         subject: 'Support', value: 90
//       }
//     ]
//   },

//   // 10. KPI Trends
//   {
//     id: 'kpi-trends',
//     title: 'KPI Trends',
//     columns: ['active_users', 'conversion_rate', 'churn_rate', 'gross_margin', 'timestamp'],
//     render: (data) => (
//       <ResponsiveContainer width="100%" height={300}>
//         <LineChart data={data}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="timestamp" />
//           <YAxis yAxisId="left" />
//           <YAxis yAxisId="right" orientation="right" />
//           <Tooltip />
//           <Legend />
//           <Line 
//             yAxisId="left"
//             type="monotone" 
//             dataKey="active_users" 
//             stroke="#8884d8" 
//             name="Active Users" 
//           />
//           <Line 
//             yAxisId="left"
//             type="monotone" 
//             dataKey="conversion_rate" 
//             stroke="#82ca9d" 
//             name="Conversion %" 
//           />
//           <Line 
//             yAxisId="right"
//             type="monotone" 
//             dataKey="churn_rate" 
//             stroke="#ff0000" 
//             name="Churn %" 
//           />
//           <Line 
//             yAxisId="right"
//             type="monotone" 
//             dataKey="gross_margin" 
//             stroke="#ff7300" 
//             name="Margin %" 
//             strokeDasharray="5 5"
//           />
//         </LineChart>
//       </ResponsiveContainer>
//     ),
//     calculate: (data) => data?.map(entry => ({
//       timestamp: new Date(entry.timestamp).toLocaleDateString(),
//       active_users: entry.active_users,
//       conversion_rate: entry.conversion_rate * 100,
//       churn_rate: entry.churn_rate * 100,
//       gross_margin: entry.gross_margin * 100
//     })) || []
//   }
// ];

// const GraphPlaceholder = () => (
//   <div className="animate-pulse bg-gray-200 rounded-lg h-64 w-full flex items-center justify-center">
//     <span className="text-gray-500">Loading...</span>
//   </div>
// );

// const GraphComponent = ({ config, companyId, data }) => {
//   const [graphData, setGraphData] = useState(null);
//   const [error, setError] = useState(null);
  
//   useEffect(() => {
//     try {
//       if (data) {
//         const calculatedData = config.calculate(data);
//         console.log(`Graph ${config.id}:`, calculatedData); // Debug log
//         setGraphData(calculatedData);
//         setError(null);
//       }
//     } catch (err) {
//       console.error(`Error calculating data for ${config.id}:`, err);
//       setError(err.message);
//     }
//   }, [data, config]);

//   if (error) {
//     return (
//       <div className="bg-white p-4 rounded-lg shadow h-full">
//         <h3 className="font-medium text-lg mb-2">{config.title}</h3>
//         <div className="h-64 flex items-center justify-center bg-red-50 text-red-600 rounded">
//           Error: {error}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white p-4 rounded-lg shadow h-full">
//       <h3 className="font-medium text-lg mb-2">{config.title}</h3>
//       <div className="h-64">
//         {graphData && graphData.length > 0 ? (
//           config.render(graphData)
//         ) : (
//           <GraphPlaceholder />
//         )}
//       </div>
//     </div>
//   );
// };

// const Metrics = ({ companyId = 'demo-company' }) => {
//   const [loadedGraphs, setLoadedGraphs] = useState({});
//   const [loading, setLoading] = useState({});
//   const [errors, setErrors] = useState({});
//   const graphRefs = useRef([]);

//   const fetchGraphData = async (graphId, columns) => {
//     if (loadedGraphs[graphId] || loading[graphId]) return;

//     setLoading(prev => ({ ...prev, [graphId]: true }));
//     setErrors(prev => ({ ...prev, [graphId]: null }));

//     try {
//       console.log(`Fetching data for ${graphId}...`); // Debug log
      
//       const response = await generateMockData(companyId, columns.join(','));
      
//       console.log(`Data received for ${graphId}:`, response.data); // Debug log

//       setLoadedGraphs(prev => ({
//         ...prev,
//         [graphId]: response.data
//       }));
//     } catch (error) {
//       console.error(`Error fetching ${graphId}:`, error);
//       setErrors(prev => ({
//         ...prev,
//         [graphId]: 'Failed to load data'
//       }));
//     } finally {
//       setLoading(prev => ({ ...prev, [graphId]: false }));
//     }
//   };

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach(entry => {
//           if (entry.isIntersecting) {
//             const graphId = entry.target.getAttribute('data-graph-id');
//             const config = GRAPH_CONFIGS.find(g => g.id === graphId);
//             if (config) {
//               fetchGraphData(graphId, config.columns);
//             }
//           }
//         });
//       },
//       { threshold: 0.1 }
//     );

//     graphRefs.current.forEach(ref => {
//       if (ref) observer.observe(ref);
//     });

//     return () => observer.disconnect();
//   }, [companyId]);

//   // Group graphs into rows of two
//   const graphRows = [];
//   for (let i = 0; i < GRAPH_CONFIGS.length; i += 2) {
//     graphRows.push(GRAPH_CONFIGS.slice(i, i + 2));
//   }

//   return (
//     <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
//       <h1 className="text-3xl font-bold mb-8 text-gray-800">Company Metrics Dashboard</h1>
      
//       {graphRows.map((row, rowIndex) => (
//         <div key={rowIndex} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//           {row.map((config, colIndex) => {
//             const index = rowIndex * 2 + colIndex;
//             return (
//               <div 
//                 key={config.id}
//                 ref={el => graphRefs.current[index] = el}
//                 data-graph-id={config.id}
//                 className="min-h-80"
//               >
//                 {errors[config.id] ? (
//                   <div className="bg-red-50 p-4 rounded-lg text-red-600 border border-red-200">
//                     <h3 className="font-medium text-lg mb-2">{config.title}</h3>
//                     <div className="mb-2">{errors[config.id]}</div>
//                     <button 
//                       onClick={() => fetchGraphData(config.id, config.columns)}
//                       className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
//                     >
//                       Retry
//                     </button>
//                   </div>
//                 ) : (
//                   <GraphComponent 
//                     config={config}
//                     companyId={companyId}
//                     data={loadedGraphs[config.id]}
//                   />
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Metrics;


















// import { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import {
//   LineChart, BarChart, PieChart, RadarChart,
//   Line, Bar, Pie, Radar, Cell,
//   XAxis, YAxis, CartesianGrid, Tooltip, Legend,
//   ResponsiveContainer, AreaChart, Area, PolarRadiusAxis, PolarAngleAxis, PolarGrid
// } from 'recharts';

// import { mockFetchData } from './SampleData';

// // Graph configurations with data formatting
// const GRAPH_CONFIGS = [
//   // 1. Funds Raised Over Time
//   {
//     id: 'funds-raised',
//     title: 'Funds Raised Over Time',
//     columns: ['last_round', 'cash_balance', 'timestamp'],
//     render: (data) => (
//       <ResponsiveContainer width="100%" height={300}>
//         <AreaChart data={data}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="timestamp" />
//           <YAxis />
//           <Tooltip />
//           <Area 
//             type="monotone" 
//             dataKey="cash_balance" 
//             stroke="#8884d8" 
//             fill="#8884d8" 
//           />
//           {data?.[0]?.last_round && (
//             <Legend payload={[{ value: `Last Round: ${data[0].last_round}`, type: 'line' }]} />
//           )}
//         </AreaChart>
//       </ResponsiveContainer>
//     ),
//     calculate: (data) => data?.map(entry => ({
//       timestamp: new Date(entry.timestamp).toLocaleDateString(),
//       cash_balance: entry.cash_balance,
//       last_round: entry.last_round
//     })) || []
//   },

//   // 2. Revenue Growth
//   {
//     id: 'revenue-growth',
//     title: 'Revenue Growth (MoM/YoY)',
//     columns: ['quarterly_revenue', 'revenue_growth', 'timestamp'],
//     render: (data) => (
//       <ResponsiveContainer width="100%" height={300}>
//         <LineChart data={data}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="timestamp" />
//           <YAxis />
//           <Tooltip />
//           <Line 
//             type="monotone" 
//             dataKey="quarterly_revenue" 
//             stroke="#82ca9d" 
//             activeDot={{ r: 8 }} 
//           />
//           <Line 
//             type="monotone" 
//             dataKey="revenue_growth" 
//             stroke="#ff7300" 
//             strokeDasharray="5 5" 
//           />
//           <Legend />
//         </LineChart>
//       </ResponsiveContainer>
//     ),
//     calculate: (data) => data?.map(entry => ({
//       timestamp: new Date(entry.timestamp).toLocaleDateString(),
//       quarterly_revenue: entry.quarterly_revenue,
//       revenue_growth: entry.revenue_growth
//     })) || []
//   },

//   // 3. Expense Breakdown
//   {
//     id: 'expense-breakdown',
//     title: 'Expense Breakdown',
//     columns: ['revenue_breakdowns'],
//     render: (data) => (
//       <ResponsiveContainer width="100%" height={300}>
//         <PieChart>
//           <Pie
//             data={data}
//             cx="50%"
//             cy="50%"
//             outerRadius={80}
//             fill="#8884d8"
//             dataKey="value"
//             label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
//           >
//             {data.map((entry, index) => (
//               <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042'][index % 4]} />
//             ))}
//           </Pie>
//           <Tooltip />
//           <Legend />
//         </PieChart>
//       </ResponsiveContainer>
//     ),
//     calculate: (data) => 
//       data?.[0]?.revenue_breakdowns?.map(item => ({
//         name: item.product,
//         value: item.revenue,
//         percentage: item.percentage
//       })) || []
//   },

//   // 4. Runway vs. Burn Rate
//   {
//     id: 'runway-burnrate',
//     title: 'Runway vs. Burn Rate',
//     columns: ['cash_balance', 'burn_rate', 'cash_runway'],
//     render: (data) => (
//       <ResponsiveContainer width="100%" height={300}>
//         <BarChart data={data}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="name" />
//           <YAxis />
//           <Tooltip />
//           <Legend />
//           <Bar dataKey="burn_rate" fill="#ff7300" name="Monthly Burn" />
//           <Bar dataKey="runway" fill="#8884d8" name="Runway (months)" />
//         </BarChart>
//       </ResponsiveContainer>
//     ),
//     calculate: (data) => [
//       {
//         name: 'Current',
//         burn_rate: data?.[0]?.burn_rate || 0,
//         runway: data?.[0]?.cash_runway || 0
//       }
//     ]
//   },

//   // 5. User/Customer Growth
//   {
//     id: 'user-growth',
//     title: 'User Growth',
//     columns: ['active_users', 'total_customers', 'timestamp'],
//     render: (data) => (
//       <ResponsiveContainer width="100%" height={300}>
//         <LineChart data={data}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="timestamp" />
//           <YAxis />
//           <Tooltip />
//           <Legend />
//           <Line 
//             type="monotone" 
//             dataKey="active_users" 
//             stroke="#8884d8" 
//             name="Active Users" 
//           />
//           <Line 
//             type="monotone" 
//             dataKey="total_customers" 
//             stroke="#82ca9d" 
//             name="Total Customers" 
//           />
//         </LineChart>
//       </ResponsiveContainer>
//     ),
//     calculate: (data) => data?.map(entry => ({
//       timestamp: new Date(entry.timestamp).toLocaleDateString(),
//       active_users: entry.active_users,
//       total_customers: entry.total_customers
//     })) || []
//   },

//   // 6. Milestone Timeline
//   {
//     id: 'milestones',
//     title: 'Milestone Timeline',
//     columns: ['milestones_achieved', 'milestones_missed', 'roadmap'],
//     render: (data) => (
//       <div className="p-4">
//         <h4 className="text-center mb-2">Achieved</h4>
//         <ul className="space-y-2">
//           {data?.achieved?.map((item, i) => (
//             <li key={i} className="flex items-center">
//               <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
//               <span>{item}</span>
//             </li>
//           ))}
//         </ul>
        
//         <h4 className="text-center mt-4 mb-2">Upcoming</h4>
//         <ul className="space-y-2">
//           {data?.roadmap?.map((item, i) => (
//             <li key={i} className="flex items-center">
//               <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
//               <span>{item}</span>
//             </li>
//           ))}
//         </ul>
//       </div>
//     ),
//     calculate: (data) => ({
//       achieved: data?.[0]?.milestones_achieved || [],
//       roadmap: data?.[0]?.roadmap || []
//     })
//   },

//   // 7. CAC vs. LTV
//   {
//     id: 'cac-ltv',
//     title: 'CAC vs. LTV',
//     columns: ['cac', 'ltv', 'ltv_ratio', 'timestamp'],
//     render: (data) => (
//       <ResponsiveContainer width="100%" height={300}>
//         <BarChart data={data}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="timestamp" />
//           <YAxis />
//           <Tooltip />
//           <Legend />
//           <Bar dataKey="cac" fill="#ff7300" name="CAC" />
//           <Bar dataKey="ltv" fill="#8884d8" name="LTV" />
//           <Line 
//             type="monotone" 
//             dataKey="ltv_ratio" 
//             stroke="#ff0000" 
//             name="LTV Ratio" 
//             yAxisId="right"
//           />
//           <YAxis yAxisId="right" orientation="right" />
//         </BarChart>
//       </ResponsiveContainer>
//     ),
//     calculate: (data) => data?.map(entry => ({
//       timestamp: new Date(entry.timestamp).toLocaleDateString(),
//       cac: entry.cac,
//       ltv: entry.ltv,
//       ltv_ratio: entry.ltv_ratio
//     })) || []
//   },

//   // 8. Market Opportunity
//   {
//     id: 'market-opportunity',
//     title: 'Market Opportunity',
//     columns: ['total_customers', 'market_share'],
//     render: (data) => (
//       <ResponsiveContainer width="100%" height={300}>
//         <RadarChart outerRadius={90} data={data}>
//           <PolarGrid />
//           <PolarAngleAxis dataKey="subject" />
//           <PolarRadiusAxis angle={30} domain={[0, 100]} />
//           <Radar 
//             name="Coverage" 
//             dataKey="value" 
//             stroke="#8884d8" 
//             fill="#8884d8" 
//             fillOpacity={0.6} 
//           />
//           <Legend />
//           <Tooltip />
//         </RadarChart>
//       </ResponsiveContainer>
//     ),
//     calculate: (data) => [
//       { subject: 'TAM', value: 100 },
//       { subject: 'SAM', value: 60 },
//       { subject: 'SOM', value: data?.[0]?.market_share || 0 },
//       { subject: 'Current', value: (data?.[0]?.total_customers / 1000) || 0 }
//     ]
//   },

//   // 9. Competitor Comparison
//   {
//     id: 'competitors',
//     title: 'Competitor Comparison',
//     columns: ['differentiators'],
//     render: (data) => (
//       <ResponsiveContainer width="100%" height={300}>
//         <RadarChart data={data}>
//           <PolarGrid />
//           <PolarAngleAxis dataKey="subject" />
//           <PolarRadiusAxis />
//           {data?.map((company, i) => (
//             <Radar 
//               key={i}
//               name={company.name}
//               dataKey="value"
//               stroke={['#8884d8', '#82ca9d', '#ff7300'][i]}
//               fill={['#8884d8', '#82ca9d', '#ff7300'][i]}
//               fillOpacity={0.6}
//             />
//           ))}
//           <Legend />
//           <Tooltip />
//         </RadarChart>
//       </ResponsiveContainer>
//     ),
//     calculate: (data) => [
//       {
//         name: 'Us',
//         subject: 'Features', value: 90,
//         subject: 'Pricing', value: 70,
//         subject: 'Support', value: 80
//       },
//       {
//         name: 'Competitor A',
//         subject: 'Features', value: 80,
//         subject: 'Pricing', value: 90,
//         subject: 'Support', value: 60
//       },
//       {
//         name: 'Competitor B',
//         subject: 'Features', value: 70,
//         subject: 'Pricing', value: 80,
//         subject: 'Support', value: 90
//       }
//     ]
//   },

//   // 10. KPI Trends
//   {
//     id: 'kpi-trends',
//     title: 'KPI Trends',
//     columns: ['active_users', 'conversion_rate', 'churn_rate', 'gross_margin', 'timestamp'],
//     render: (data) => (
//       <ResponsiveContainer width="100%" height={300}>
//         <LineChart data={data}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="timestamp" />
//           <YAxis yAxisId="left" />
//           <YAxis yAxisId="right" orientation="right" />
//           <Tooltip />
//           <Legend />
//           <Line 
//             yAxisId="left"
//             type="monotone" 
//             dataKey="active_users" 
//             stroke="#8884d8" 
//             name="Active Users" 
//           />
//           <Line 
//             yAxisId="left"
//             type="monotone" 
//             dataKey="conversion_rate" 
//             stroke="#82ca9d" 
//             name="Conversion %" 
//           />
//           <Line 
//             yAxisId="right"
//             type="monotone" 
//             dataKey="churn_rate" 
//             stroke="#ff0000" 
//             name="Churn %" 
//           />
//           <Line 
//             yAxisId="right"
//             type="monotone" 
//             dataKey="gross_margin" 
//             stroke="#ff7300" 
//             name="Margin %" 
//             strokeDasharray="5 5"
//           />
//         </LineChart>
//       </ResponsiveContainer>
//     ),
//     calculate: (data) => data?.map(entry => ({
//       timestamp: new Date(entry.timestamp).toLocaleDateString(),
//       active_users: entry.active_users,
//       conversion_rate: entry.conversion_rate * 100,
//       churn_rate: entry.churn_rate * 100,
//       gross_margin: entry.gross_margin * 100
//     })) || []
//   }
// ];

// const GraphPlaceholder = () => (
//   <div className="animate-pulse bg-gray-200 rounded-lg h-64 w-full"></div>
// );

// const GraphComponent = ({ config, companyId, data }) => {
//   const [graphData, setGraphData] = useState(null);
  
//   useEffect(() => {
//     if (data) {
//       setGraphData(config.calculate(data));
//     }
//   }, [data, config]);

//   return (
//     <div className="bg-white p-4 rounded-lg shadow h-full">
//       <h3 className="font-medium text-lg mb-2">{config.title}</h3>
//       <div className="h-64">
//         {graphData ? config.render(graphData) : <GraphPlaceholder />}
//       </div>
//     </div>
//   );
// };

// const Metrics = ({ companyId }) => {
//   const [loadedGraphs, setLoadedGraphs] = useState({});
//   const [loading, setLoading] = useState({});
//   const [errors, setErrors] = useState({});
//   const graphRefs = useRef([]);

//   const fetchGraphData = async (graphId, columns) => {
//     if (loadedGraphs[graphId] || loading[graphId]) return;

//     setLoading(prev => ({ ...prev, [graphId]: true }));
//     setErrors(prev => ({ ...prev, [graphId]: null }));

//     try {
//       // const response = await axios.get('/api/metrics', {
//       //   params: {
//       //     companyId,
//       //     columns: columns.join(','),
//       //     // Add timestamp if needed for time-series
//       //   }
//       // });

//       const response = await mockFetchData(companyId, columns.join(','));

//       setLoadedGraphs(prev => ({
//         ...prev,
//         [graphId]: response.data
//       }));
//     } catch (error) {
//       setErrors(prev => ({
//         ...prev,
//         [graphId]: 'Failed to load data'
//       }));
//     } finally {
//       setLoading(prev => ({ ...prev, [graphId]: false }));
//     }
//   };

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach(entry => {
//           if (entry.isIntersecting) {
//             const graphId = entry.target.getAttribute('data-graph-id');
//             const config = GRAPH_CONFIGS.find(g => g.id === graphId);
//             if (config) {
//               fetchGraphData(graphId, config.columns);
//             }
//           }
//         });
//       },
//       { threshold: 0.1 }
//     );

//     graphRefs.current.forEach(ref => {
//       if (ref) observer.observe(ref);
//     });

//     return () => observer.disconnect();
//   }, [companyId]);

//   // Group graphs into rows of two
//   const graphRows = [];
//   for (let i = 0; i < GRAPH_CONFIGS.length; i += 2) {
//     graphRows.push(GRAPH_CONFIGS.slice(i, i + 2));
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-2xl font-bold mb-6">Company Metrics Dashboard</h1>
      
//       {graphRows.map((row, rowIndex) => (
//         <div key={rowIndex} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//           {row.map((config, colIndex) => {
//             const index = rowIndex * 2 + colIndex;
//             return (
//               <div 
//                 key={config.id}
//                 ref={el => graphRefs.current[index] = el}
//                 data-graph-id={config.id}
//               >
//                 {errors[config.id] ? (
//                   <div className="bg-red-50 p-4 rounded-lg text-red-600">
//                     {errors[config.id]}
//                     <button 
//                       onClick={() => fetchGraphData(config.id, config.columns)}
//                       className="ml-2 text-blue-600"
//                     >
//                       Retry
//                     </button>
//                   </div>
//                 ) : (
//                   <GraphComponent 
//                     config={config}
//                     companyId={companyId}
//                     data={loadedGraphs[config.id]}
//                   />
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Metrics;