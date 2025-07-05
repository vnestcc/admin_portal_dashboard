import React from 'react';
import { Card, Progress, Divider, Typography, Tag, Statistic, Timeline } from 'antd';
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const FundRaising = ({ data, history }) => {
  console.log(data)
  if (!data || data.length === 0) return <div>No fundraising data available</div>;
  
  const fundraisingData = data[0];

  // Data for Funding History
  const fundingHistoryData = history.map(item => ({
    date: `${item.quarter} ${item.year}`,
    amount: parseInt(item.target_amount),
    valuation: parseInt(item.valuation_expectations || item.valuation_expectations) // Handling potential typo in field name
  }));

  // Data for Investor Pipeline
  const investorPipelineData = [
    { name: 'VC Firms', value: 45 },
    { name: 'Angel Investors', value: 30 },
    { name: 'Corporate VCs', value: 15 },
    { name: 'Family Offices', value: 10 },
  ];

  // Funding round timeline items
  const roundTimeline = [
    { 
      label: 'Seed Round', 
      date: 'Q1 2022', 
      amount: '₹50L', 
      valuation: '₹20Cr',
      color: 'green'
    },
    { 
      label: 'Series A', 
      date: 'Q3 2022', 
      amount: '₹2Cr', 
      valuation: '₹80Cr',
      color: 'blue'
    },
    { 
      label: 'Series B', 
      date: 'Q2 2023', 
      amount: '₹5Cr', 
      valuation: '₹200Cr',
      color: 'purple'
    },
    { 
      label: 'Series C (Current)', 
      date: new Date(fundraisingData.last_round).toLocaleDateString('en-IN', { year: 'numeric', quarter: 'numeric' }),
      amount: `₹${fundraisingData.target_amount}Cr`, 
      valuation: `₹${fundraisingData.valuation_expectations}Cr`,
      color: 'orange'
    },
    { 
      label: 'Next Round (Target)', 
      date: new Date(fundraisingData.next_round).toLocaleDateString('en-IN', { year: 'numeric', quarter: 'numeric' }),
      amount: 'TBD', 
      valuation: 'TBD',
      color: 'gray'
    },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="fundraising-dashboard">
      <Title level={3} className="mb-6">Fundraising Overview</Title>
      
      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="shadow-sm">
          <Text strong className="block mb-2">Current Round Target</Text>
          <Title level={2} className="m-0">₹{fundraisingData.target_amount}Cr</Title>
          <Text>at ₹{fundraisingData.valuation_expectations}Cr valuation</Text>
        </Card>
        
        <Card className="shadow-sm">
          <Text strong className="block mb-2">Investor Pipeline</Text>
          <Title level={2} className="m-0">{fundraisingData.investor_pipeline}</Title>
          <Text>active conversations</Text>
        </Card>
        
        <Card className="shadow-sm">
          <Text strong className="block mb-2">Current Investors</Text>
          <Title level={2} className="m-0">{fundraisingData.current_investors}</Title>
          <Text>committed to follow-on</Text>
        </Card>
        
        <Card className="shadow-sm">
          <Text strong className="block mb-2">Investor Relations</Text>
          <Progress 
            percent={parseInt(fundraisingData.investor_relations)} 
            status={
              parseInt(fundraisingData.investor_relations) > 80 ? 'success' : 
              parseInt(fundraisingData.investor_relations) > 50 ? 'active' : 'exception'
            } 
          />
          <Text>Engagement score: {fundraisingData.investor_relations}/100</Text>
        </Card>
      </div>
      
      {/* Funding History Section */}
      <Card title="Funding History" className="mb-6 shadow-sm">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={fundingHistoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" orientation="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'Amount Raised (₹Cr)' ? `₹${value}Cr` : `₹${value}Cr`,
                  name === 'Amount Raised (₹Cr)' ? 'Amount Raised' : 'Valuation'
                ]}
                labelFormatter={(label) => `Quarter: ${label}`}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="amount" fill="#8884d8" name="Amount Raised (₹Cr)" />
              <Bar yAxisId="right" dataKey="valuation" fill="#82ca9d" name="Valuation (₹Cr)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
      
      {/* Next Round Targets */}
      <Card title="Next Round Targets" className="mb-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="shadow-sm">
            <Statistic
              title="Target Amount"
              value={parseInt(fundraisingData.target_amount) * 1.5}
              precision={1}
              prefix="₹"
              suffix="Cr"
              valueStyle={{ color: '#3f8600' }}
            />
            <Text>Projected based on current traction</Text>
          </Card>
          
          <Card className="shadow-sm">
            <Statistic
              title="Valuation Target"
              value={parseInt(fundraisingData.valuation_expectations) * 1.8}
              prefix="₹"
              suffix="Cr"
              valueStyle={{ color: '#3f8600' }}
            />
            <Text>Expected multiple</Text>
          </Card>
          
          <Card className="shadow-sm">
            <Statistic
              title="Time to Next Round"
              value={Math.round((new Date(fundraisingData.next_round) - new Date()) / (1000 * 60 * 60 * 24))}
              suffix="days"
            />
            <Text>Projected close: {new Date(fundraisingData.next_round).toLocaleDateString('en-IN')}</Text>
          </Card>
        </div>
      </Card>
      
      <Divider />
      
      <div className="text-right">
        <Text type="secondary">Data as of {new Date().toLocaleDateString('en-IN')}</Text>
      </div>
    </div>
  );
};

export default FundRaising;