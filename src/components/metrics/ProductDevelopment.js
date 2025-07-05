import React, { useEffect, useState } from 'react';
import { Card, Progress, Divider, Typography, Tag, List } from 'antd';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const { Title, Text } = Typography;

const ProductDevelopment = ({ data, history }) => {

  const [challenges, setChallenges] = useState([]);
  const [bottlenecks, setBottlenecks] = useState([]);

  useEffect(() => {
    if (data && data.length > 0) {
      setChallenges(data[0].technical_challenges || []);
      setBottlenecks(data[0].product_bottlenecks || []);
    }
  }, [data]);

  if (!data || data.length === 0) return <div>No product development data available</div>;
  
  const productData = data[0]; // Assuming we're showing the most recent data

  // Parse user growth data
  const userGrowthData = history.map(item => ({
    name: `${item.quarter} ${item.year}`,
    active: parseInt(item.active_users),
    engaged: parseInt(item.engagement_metrics)
  }));

  // Parse milestones data
  const milestonesData = history.map(item => ({
    name: `${item.quarter} ${item.year}`,
    achieved: parseInt(item.milestones_achieved),
    missed: parseInt(item.milestones_missed)
  }));

  // Parse roadmap items (filtering out empty roadmaps)
  const roadmapItems = history
    .filter(item => item.roadmap && item.roadmap.trim() !== "")
    .map(item => ({
      quarter: `${item.quarter} ${item.year}`,
      roadmap: [item.roadmap]
    }));


  return (
    <div className="product-dashboard">
      <Title level={3} className="mb-6">Product Development Overview</Title>
      
      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="shadow-sm">
          <Text strong className="block mb-2">Active Users</Text>
          <Title level={2} className="m-0">{parseInt(productData.active_users)}</Title>
          <Text type="success">↑ 12% QoQ</Text>
        </Card>
        
        <Card className="shadow-sm">
          <Text strong className="block mb-2">Engagement</Text>
          <Title level={2} className="m-0">{parseInt(productData.engagement_metrics)}</Title>
          <Text>minutes per user</Text>
        </Card>
        
        <Card className="shadow-sm">
          <Text strong className="block mb-2">Feature Adoption</Text>
          <div className="flex items-center">
            <Progress
              type="circle"
              percent={parseInt(productData.feature_adoption)}
              width={50}
              strokeColor={parseInt(productData.feature_adoption) >= 50 ? '#52c41a' : '#faad14'}
              className="mr-3"
            />
            <Text>{productData.feature_adoption}%</Text>
          </div>
        </Card>
        
        <Card className="shadow-sm">
          <Text strong className="block mb-2">Net Promoter Score</Text>
          <div className="flex items-center">
            <Progress
              type="circle"
              percent={parseInt(productData.nps) + 100}
              format={() => productData.nps}
              width={50}
              strokeColor={parseInt(productData.nps) >= 50 ? '#52c41a' : parseInt(productData.nps) >= 0 ? '#faad14' : '#f5222d'}
              className="mr-3"
            />
            <Text>{productData.nps} (Industry avg: 32)</Text>
          </div>
        </Card>
      </div>
      
      {/* User Growth Section */}
      <Card title="User Growth & Engagement" className="mb-6 shadow-sm">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  `${value}`,
                  name === 'Active Users' ? 'Active Users' : 'Engaged Users'
                ]}
                labelFormatter={(label) => `Quarter: ${label}`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="active"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
                name="Active Users"
              />
              <Line
                type="monotone"
                dataKey="engaged"
                stroke="#82ca9d"
                name="Engaged Users"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
      
      {/* Milestones & Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card title="Development Milestones" className="shadow-sm">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={milestonesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${value}`]}
                  labelFormatter={(label) => `Quarter: ${label}`}
                />
                <Legend />
                <Bar dataKey="achieved" fill="#52c41a" name="Achieved" />
                <Bar dataKey="missed" fill="#f5222d" name="Missed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4">
            <Text strong>Milestone Completion Rate:</Text>
            <Progress 
              percent={Math.round(
                (parseInt(productData.milestones_achieved)) / 
                (parseInt(productData.milestones_achieved) + parseInt(productData.milestones_missed)) * 100
              )} 
              status="active" 
            />
          </div>
        </Card>
        
        <Card title="Technical Health" className="shadow-sm">
        <div className="mb-4">
          <Text strong className="block mb-1">Current Challenges</Text>
          <div className="flex flex-wrap gap-2">
            {challenges && challenges.length > 0 ? (
              challenges.map((item, index) => {
                return (
                  <Tag key={index} color="red">
                    {item}
                  </Tag>
                )
              }
              )
            ) : (
              <Text type="secondary">No challenges reported</Text>
            )}
          </div>
        </div>
        
        <div>
          <Text strong className="block mb-1">Product Bottlenecks</Text>
          {bottlenecks && bottlenecks.length > 0 ? (
            <List
              size="small"
              dataSource={bottlenecks}
              renderItem={(item, index) => <List.Item key={index}>{item}</List.Item>}
            />
          ) : (
            <Text type="secondary">No bottlenecks reported</Text>
          )}
        </div>
      </Card>

      </div>
      
      {/* Roadmap */}
      <Card title="Product Roadmap" className="mb-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {roadmapItems.map((item, index) => (
            <Card key={index} title={item.quarter} className="shadow-sm">
              <List
                dataSource={item.roadmap}
                renderItem={feature => (
                  <List.Item>
                    <Text>{feature.replace(/"/g, '')}</Text>
                  </List.Item>
                )}
              />
            </Card>
          ))}
        </div>
      </Card>
      
      <Divider />
      
      <div className="text-right">
        <Text type="secondary">Data as of {new Date().toLocaleDateString()}</Text>
      </div>
    </div>
  );
};

export default ProductDevelopment;