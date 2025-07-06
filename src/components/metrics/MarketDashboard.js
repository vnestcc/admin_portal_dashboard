import React from 'react';
import { Card, Progress, Divider, Typography } from 'antd';
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const { Title, Text } = Typography;

const MarketDashboard = ({ data, history }) => {
  if (!data || data.length === 0) return <div>No market data available</div>;
  
  const marketData = data[0]; // Assuming we're showing the most recent data

  // Data for Customer Growth Trend Chart (last 6 quarters)
  const customerTrendData = history.map(item => ({
    name: `${item.quarter} ${item.year}`,
    customers: parseInt(item.total_customers),
    growth: parseFloat(item.customer_growth)
  }));

  // Parse conversion/retention data
  const conversionRetentionData = history.map(item => ({
    name: `${item.quarter} ${item.year}`,
    conversion: parseInt(item.conversion_rate),
    retention: parseInt(item.retention_rate),
    churn: parseInt(item.churn_rate)
  }));

  // Data for Sales Process Breakdown Pie Chart
  // const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  // const SalesProcessPieChart = ({ processData }) => {
  //   const pieData = [
  //     { name: 'Digital Marketing', value: 35 },
  //     { name: 'Direct Sales', value: 25 },
  //     { name: 'Partnerships', value: 20 },
  //     { name: 'Referrals', value: 15 },
  //     { name: 'Other', value: 5 }
  //   ];

  //   return (
  //     <div className="h-64">
  //       <ResponsiveContainer width="100%" height="100%">
  //         <PieChart>
  //           <Pie
  //             data={pieData}
  //             cx="50%"
  //             cy="50%"
  //             labelLine={false}
  //             outerRadius={80}
  //             fill="#8884d8"
  //             dataKey="value"
  //             nameKey="name"
  //             label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
  //           >
  //             {pieData.map((entry, index) => (
  //               <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
  //             ))}
  //           </Pie>
  //           <Tooltip 
  //             formatter={(value, name) => [
  //               `${value}%`,
  //               name
  //             ]}
  //           />
  //           <Legend />
  //         </PieChart>
  //       </ResponsiveContainer>
  //     </div>
  //   );
  // };

  return (
    <div className="market-dashboard">
      <Title level={3} className="mb-6">Market Performance Overview</Title>
      
      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="shadow-sm">
          <Text strong className="block mb-2">Total Customers</Text>
          <Title level={2} className="m-0">{marketData.total_customers}</Title>
          <Text type={parseInt(marketData.customer_growth) >= 0 ? 'success' : 'danger'}>
            {parseInt(marketData.customer_growth) >= 0 ? '↑' : '↓'} {Math.abs(parseInt(marketData.customer_growth))}% YoY
          </Text>
        </Card>
        
        <Card className="shadow-sm">
          <Text strong className="block mb-2">New Customers (QTD)</Text>
          <Title level={2} className="m-0">{marketData.new_customers}</Title>
          <Text>Latest quarter</Text>
        </Card>
        
        <Card className="shadow-sm">
          <Text strong className="block mb-2">Market Share</Text>
          <div className="flex items-center">
            <Progress
              type="circle"
              percent={parseInt(marketData.market_share)}
              width={50}
              strokeColor={parseInt(marketData.market_share) >= 30 ? '#52c41a' : '#faad14'}
              className="mr-3"
            />
            <div>
              <Text>{marketData.market_share}%</Text>
              <Text type={parseInt(marketData.market_share_change) >= 0 ? 'success' : 'danger'}>
                ({parseInt(marketData.market_share_change) >= 0 ? '+' : ''}{marketData.market_share_change}% change)
              </Text>
            </div>
          </div>
        </Card>
        
        <Card className="shadow-sm">
          <Text strong className="block mb-2">Sales Pipeline</Text>
          <Title level={2} className="m-0">₹{marketData.pipeline_value}</Title>
          <Text>Potential revenue</Text>
        </Card>
      </div>
      
      {/* Conversion & Retention Section */}
      <Card title="Customer Metrics" className="mb-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Text strong className="block mb-1">Conversion Rate</Text>
            <Title level={3}>{marketData.conversion_rate}%</Title>
            <Text>New customer acquisition</Text>
          </div>
          
          <div>
            <Text strong className="block mb-1">Retention Rate</Text>
            <Title level={3}>{marketData.retention_rate}%</Title>
            <Text>Customer loyalty</Text>
          </div>
          
          <div>
            <Text strong className="block mb-1">Churn Rate</Text>
            <Title level={3}>{marketData.churn_rate}%</Title>
            <Text>Customer attrition</Text>
          </div>
        </div>
      </Card>
      
      {/* Sales Process Breakdown */}
      <Card title="Sales Process Distribution" className="mb-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Text strong className="block mb-1">Recent Changes</Text>
            <Title level={3}>{marketData.sales_process_changes}</Title>
          </div>
          
          <div>
            <Text strong className="block mb-1">Average Sales Cycle</Text>
            <Title level={3}>{marketData.sales_cycle} days</Title>
          </div>
          
          <div>
            <Text strong className="block mb-1">Market Trends</Text>
            <Title level={3}>{marketData.market_trends}</Title>
          </div>
        </div>
      </Card>
      
      {/* Trend Analysis */}
      <Card title="Quarterly Trends" className="shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64">
            <Text strong className="block mb-2">Customer Growth</Text>
            <ResponsiveContainer width="100%" height="90%">
              <LineChart data={customerTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'Total Customers' ? value : `${value}%`,
                    name === 'Total Customers' ? 'Total Customers' : 'Growth Rate'
                  ]}
                  labelFormatter={(label) => `Quarter: ${label}`}
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="customers"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                  name="Total Customers"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="growth"
                  stroke="#82ca9d"
                  name="Growth Rate (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="h-64">
            <Text strong className="block mb-2">Conversion Metrics</Text>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={conversionRetentionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${value}%`]}
                  labelFormatter={(label) => `Quarter: ${label}`}
                />
                <Legend />
                <Bar dataKey="conversion" fill="#0088FE" name="Conversion Rate (%)" />
                <Bar dataKey="retention" fill="#00C49F" name="Retention Rate (%)" />
                <Bar dataKey="churn" fill="#FF8042" name="Churn Rate (%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>
      
      <Divider />
      
      <div className="text-right">
        <Text type="secondary">Data as of {new Date().toLocaleDateString()}</Text>
      </div>
    </div>
  );
};

export default MarketDashboard;