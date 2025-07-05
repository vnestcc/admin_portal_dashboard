import React from 'react';
import { Card, Progress, Divider, Typography, Table } from 'antd';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const { Title, Text } = Typography;

const UnitEconomics = ({ data, history }) => {
  if (!data || data.length === 0) return <div>No unit economics data available</div>;
  
  const unitData = data[0]; // Assuming we're showing the most recent data

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
  const MARKETING_COLORS = ['#3366CC', '#DC3912', '#FF9900', '#109618', '#990099'];

  // Data for CAC Trend Chart
  const cacTrendData = history.map(item => ({
    name: `${item.quarter} ${item.year}`,
    cac: parseInt(item.cac),
    payback: parseInt(item.cac_payback)
  }));

  // Parse ARPU vs LTV trend data
  const arpuLtvTrendData = history.map(item => ({
    name: `${item.quarter} ${item.year}`,
    arpu: parseInt(item.arpu),
    ltv: parseInt(item.ltv)
  }));

  // Marketing CAC Pie Chart
  const MarketingPieChart = ({ marketingData }) => {
    // Convert string values to numbers and format data for the pie chart
    const pieData = marketingData.map(item => ({
      name: item.channel,
      value: parseFloat(item.spend),
      cac: parseFloat(item.cac)
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
                <Cell key={`cell-${index}`} fill={MARKETING_COLORS[index % MARKETING_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value, name, props) => [
                `₹${value} (CAC: ₹${props.payload.cac})`,
                name
              ]}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  };

  // Marketing Channels Table
  const marketingColumns = [
    {
      title: 'Channel',
      dataIndex: 'channel',
      key: 'channel',
    },
    {
      title: 'Spend (₹)',
      dataIndex: 'spend',
      key: 'spend',
      render: (text) => `₹${parseInt(text)}`
    },
    {
      title: 'Budget (₹)',
      dataIndex: 'budget',
      key: 'budget',
      render: (text) => text ? `₹${parseInt(text)}` : 'N/A'
    },
    {
      title: 'CAC (₹)',
      dataIndex: 'cac',
      key: 'cac',
      render: (text) => `₹${parseInt(text)}`
    },
    {
      title: 'Efficiency',
      key: 'efficiency',
      render: (_, record) => {
        if (!record.budget || record.budget === "0") return 'N/A';
        const efficiency = (parseFloat(record.spend) / parseFloat(record.budget)) * 100;
        return (
          <Progress 
            percent={Math.round(efficiency)} 
            status={efficiency > 100 ? 'exception' : efficiency > 90 ? 'normal' : 'success'}
            size="small"
          />
        );
      },
    },
  ];

  return (
    <div className="unit-economics-dashboard">
      <Title level={3} className="mb-6">Unit Economics Overview</Title>
      
      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="shadow-sm">
          <Text strong className="block mb-2">ARPU</Text>
          <Title level={2} className="m-0">₹{parseInt(unitData.arpu)}</Title>
          <Text>Average Revenue Per User</Text>
        </Card>
        
        <Card className="shadow-sm">
          <Text strong className="block mb-2">Customer CAC</Text>
          <Title level={2} className="m-0">₹{parseInt(unitData.cac)}</Title>
          <Text type={parseInt(unitData.cac_change) >= 0 ? 'danger' : 'success'}>
            {parseInt(unitData.cac_change) >= 0 ? '↑' : '↓'} {Math.abs(parseInt(unitData.cac_change))}% YoY
          </Text>
        </Card>
        
        <Card className="shadow-sm">
          <Text strong className="block mb-2">LTV</Text>
          <Title level={2} className="m-0">₹{parseInt(unitData.ltv)}</Title>
          <Text>Customer Lifetime Value</Text>
        </Card>
        
        <Card className="shadow-sm">
          <Text strong className="block mb-2">LTV:CAC Ratio</Text>
          <Title level={2} className="m-0">{unitData.ltv_ratio}</Title>
          <Text type={parseInt(unitData.ltv_ratio) >= 3 ? 'success' : parseInt(unitData.ltv_ratio) >= 2 ? 'warning' : 'danger'}>
            {parseInt(unitData.ltv_ratio) >= 3 ? 'Healthy' : parseInt(unitData.ltv_ratio) >= 2 ? 'Moderate' : 'Concerning'}
          </Text>
        </Card>
      </div>
      
      {/* Efficiency Metrics */}
      <Card title="Customer Acquisition Efficiency" className="mb-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Text strong className="block mb-1">CAC Payback Period</Text>
            <Title level={3}>{unitData.cac_payback} months</Title>
            <Text>Time to recover CAC</Text>
          </div>
          
          <div>
            <Text strong className="block mb-1">LTV:CAC Ratio</Text>
            <Title level={3}>{unitData.ltv_ratio}x</Title>
            <Text type={parseInt(unitData.ltv_ratio) >= 3 ? 'success' : 'warning'}>
              {parseInt(unitData.ltv_ratio) >= 3 ? 'Ideal' : 'Needs improvement'}
            </Text>
          </div>
          
          <div>
            <Text strong className="block mb-1">CAC Change</Text>
            <Title level={3} type={parseInt(unitData.cac_change) >= 0 ? 'danger' : 'success'}>
              {parseInt(unitData.cac_change) >= 0 ? '+' : ''}{unitData.cac_change}%
            </Title>
            <Text>Year-over-year change</Text>
          </div>
        </div>
      </Card>
      
      {/* Marketing Breakdown */}
      {unitData.marketing_breakdowns && <Card title="Marketing Spend & CAC by Channel" className="mb-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Table 
              columns={marketingColumns}
              dataSource={unitData.marketing_breakdowns}
              pagination={false}
              size="small"
              rowKey="channel"
            />
          
          <MarketingPieChart marketingData={unitData.marketing_breakdowns} />
        </div>
      </Card>}
      
      {/* Trend Analysis */}
      <Card title="Unit Economics Trends" className="shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64">
            <Text strong className="block mb-2">CAC & Payback Period Trend</Text>
            <ResponsiveContainer width="100%" height="90%">
              <LineChart data={cacTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'CAC (₹)' ? `₹${value}` : `${value} months`,
                    name === 'CAC (₹)' ? 'CAC' : 'Payback Period'
                  ]}
                  labelFormatter={(label) => `Quarter: ${label}`}
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="cac"
                  stroke="#FF8042"
                  activeDot={{ r: 8 }}
                  name="CAC (₹)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="payback"
                  stroke="#8884d8"
                  name="Payback (months)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="h-64">
            <Text strong className="block mb-2">ARPU vs LTV Trend</Text>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={arpuLtvTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'arpu' ? `₹${value}` : `₹${value}`,
                    name === 'arpu' ? 'ARPU' : 'LTV'
                  ]}
                  labelFormatter={(label) => `Quarter: ${label}`}
                />
                <Legend />
                <Bar 
                  yAxisId="left"
                  dataKey="arpu" 
                  fill="#0088FE" 
                  name="ARPU (₹)" 
                />
                <Bar 
                  yAxisId="right"
                  dataKey="ltv" 
                  fill="#00C49F" 
                  name="LTV (₹)" 
                />
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

export default UnitEconomics;