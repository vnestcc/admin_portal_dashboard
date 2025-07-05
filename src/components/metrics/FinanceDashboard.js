import React from 'react';
import { Card, Progress, Divider, Typography } from 'antd';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const { Title, Text } = Typography;

const FinanceDashboard = ({ data, history }) => {
  console.log(data)
  if (!data || data.length === 0) return <div>No financial data available</div>;
  
  const financeData = data[0]; // Assuming we're showing the most recent data

  // Parse revenue trend data
  const revenueTrendData = history.map(item => ({
    name: `${item.quarter} ${item.year}`,
    revenue: parseInt(item.quarterly_revenue),
    growth: parseInt(item.revenue_growth)
  }));

  // Parse margin trend data
  const marginTrendData = history.map(item => ({
    name: `${item.quarter} ${item.year}`,
    gross: parseInt(item.gross_margin),
    net: parseInt(item.net_margin)
  }));

  // Data for Revenue Breakdown Pie Chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const RevenuePieChart = ({ revenueBreakdowns }) => {
    // Convert string values to numbers and format data for the pie chart
    const pieData = revenueBreakdowns.map(item => ({
      name: item.product,
      value: parseFloat(item.percentage),
      revenue: parseFloat(item.revenue)
    }));

    return (
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value, name, props) => [
                `₹${props.payload.revenue.toLocaleString('en-IN')} (${value.toFixed(1)}%)`,
                name
              ]}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <div className="finance-dashboard">
      <Title level={3} className="mb-6">Financial Health Overview</Title>
      
      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="shadow-sm">
          <Text strong className="block mb-2">Cash Balance</Text>
          {financeData.cash_balance &&<Title level={2} className="m-0">₹{financeData.cash_balance.toLocaleString('en-IN')}</Title>}
        </Card>
        
        <Card className="shadow-sm">
          <Text strong className="block mb-2">Quarterly Revenue</Text>
          {financeData.quarterly_revenue &&<Title level={2} className="m-0">₹{financeData.quarterly_revenue.toLocaleString('en-IN')}</Title>}
          <Text type={financeData.revenue_growth >= 0 ? 'success' : 'danger'}>
            {financeData.revenue_growth >= 0 ? '↑' : '↓'} {Math.abs(financeData.revenue_growth)}% YoY
          </Text>
        </Card>
        
        <Card className="shadow-sm">
          <Text strong className="block mb-2">Gross Margin</Text>
          <div className="flex items-center">
            <Progress
              type="circle"
              percent={financeData.gross_margin}
              width={50}
              strokeColor={financeData.gross_margin >= 50 ? '#52c41a' : '#faad14'}
              className="mr-3"
            />
            <Text>{financeData.gross_margin}%</Text>
          </div>
        </Card>
        
        <Card className="shadow-sm">
          <Text strong className="block mb-2">Net Margin</Text>
          <div className="flex items-center">
            <Progress
              type="circle"
              percent={financeData.net_margin}
              width={50}
              strokeColor={financeData.net_margin >= 10 ? '#52c41a' : '#f5222d'}
              className="mr-3"
            />
            <Text>{financeData.net_margin}%</Text>
          </div>
        </Card>
      </div>
      
      {/* Burn Rate Section */}
      <Card title="Burn Rate Analysis" className="mb-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Text strong className="block mb-1">Monthly Burn Rate</Text>
            {financeData.burn_rate &&<Title level={3}>₹{financeData.burn_rate.toLocaleString('en-IN')}</Title>}
            <Text type={financeData.burn_rate_change >= 0 ? 'danger' : 'success'}>
              {financeData.burn_rate_change >= 0 ? '↑' : '↓'} {Math.abs(financeData.burn_rate_change)}% from last period
            </Text>
          </div>
          
          <div>
            <Text strong className="block mb-1">Cash Runway</Text>
            <Title level={3}>{financeData.cash_runway} months</Title>
            <Text>At current burn rate</Text>
          </div>
          
          <div>
            <Text strong className="block mb-1">Projected Profitability</Text>
            <Title level={3}>Q{financeData.profitability_timeline}</Title>
            <Text>Based on current trajectory</Text>
          </div>
        </div>
      </Card>
      
      {/* Revenue Breakdown */}
      <Card title="Revenue Breakdown by Product" className="mb-6 shadow-sm">
        {financeData.revenue_breakdowns && <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            {financeData.revenue_breakdowns.map((product, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between mb-1">
                  <Text strong>{product.product}</Text>
                  {product.revenue &&<Text>₹{product.revenue.toLocaleString('en-IN')} ({product.percentage}%)</Text>}
                </div>
                <Progress 
                  percent={parseFloat(product.percentage)} 
                  strokeColor={COLORS[index % COLORS.length]}
                  strokeLinecap="square"
                  showInfo={false}
                />
              </div>
            ))}
          </div>
          
          <RevenuePieChart revenueBreakdowns={financeData.revenue_breakdowns} />
        </div>}
      </Card>
      
      {/* Trend Analysis */}
      <Card title="Financial Trends" className="shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64">
            <Text strong className="block mb-2">Revenue Growth Trend</Text>
            <ResponsiveContainer width="100%" height="90%">
              <LineChart data={revenueTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip 
                  formatter={(value, name, props) => {
                    // console.log('Tooltip Data:', { value, name, props });
                    return [
                      name === 'Revenue (₹)' ? `₹${value}` : `${value}%`,
                      name === 'Revenue (₹)' ? 'Revenue' : 'Growth'
                    ];
                  }}
                  labelFormatter={(label) => `Quarter: ${label}`}
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                  name="Revenue (₹)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="growth"
                  stroke="#82ca9d"
                  name="Growth (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="h-64">
            <Text strong className="block mb-2">Margin Trends</Text>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={marginTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${value}%`]}
                  labelFormatter={(label) => `Quarter: ${label}`}
                />
                <Legend />
                <Bar dataKey="gross" fill="#0088FE" name="Gross Margin (%)" />
                <Bar dataKey="net" fill="#FF8042" name="Net Margin (%)" />
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

export default FinanceDashboard;