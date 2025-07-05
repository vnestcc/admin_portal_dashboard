import React from 'react';
import { Card, Progress, Divider, Typography, Tag, List, Statistic } from 'antd';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const { Title, Text } = Typography;

const TeamPerformance = ({ data, history }) => {
  if ((!data )) return <div>No team performance data available</div>;
  
  const teamData = data[0];
  console.log(history)

  // Data for Team Growth Chart (last 6 quarters)
  // const teamGrowthData = [
  //   { name: 'Q1 2022', size: 8, hires: 2, turnover: 1 },
  //   { name: 'Q2 2022', size: 9, hires: 3, turnover: 2 },
  //   { name: 'Q3 2022', size: 10, hires: 2, turnover: 1 },
  //   { name: 'Q4 2022', size: 11, hires: 3, turnover: 2 },
  //   { name: 'Q1 2023', size: 12, hires: 4, turnover: 3 },
  //   { name: 'Q2 2023', size: parseInt(teamData.team_size), hires: parseInt(teamData.new_hires), turnover: parseInt(teamData.turnover) },
  // ];

  const teamGrowthData = history.map(item => ({
    name: `${item.quarter} ${item.year}`,
    size: parseInt(item.team_size),
    hires: parseInt(item.new_hires),
    turnover: parseInt(item.turnover),
  }));

  // Team strengths data
  // const teamStrengths = [
  //   'Agile Development',
  //   'Cross-functional Collaboration',
  //   'Technical Innovation',
  //   'Rapid Prototyping',
  //   'Continuous Integration'
  // ];
  const teamStrengths = history
  .map(item => item.team_strengths ? item.team_strengths.replace(/^"+|"+$/g, '') : '')
  .flatMap(item => item.split(',').map(str => str.trim()));

  // Development initiatives
  // const developmentInitiatives = [
  //   'Mentorship Program',
  //   'Technical Training',
  //   'Leadership Workshops',
  //   'Certification Support',
  //   'Conference Attendance'
  // ];
  const developmentInitiatives=history
    .map(item => item.development_initiatives ? item.development_initiatives.replace(/^"+|"+$/g, ''):'')
    .flatMap(item => item.split(',').map(str => str.trim()))

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="team-dashboard">
      <Title level={3} className="mb-6">Team Performance Overview</Title>
      
      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="shadow-sm">
          <Text strong className="block mb-2">Team Size</Text>
          <Title level={2} className="m-0">{teamData.team_size}</Title>
          <Text type={parseInt(teamData.new_hires) > 0 ? 'success' : 'default'}>
            {parseInt(teamData.new_hires) > 0 ? `↑ ${teamData.new_hires} new hires` : 'No new hires'}
          </Text>
        </Card>
        
        <Card className="shadow-sm">
          <Text strong className="block mb-2">Turnover Rate</Text>
          <div className="flex items-center">
            <Progress
              type="circle"
              percent={Math.min(parseInt(teamData.turnover) * 5, 100)}
              width={50}
              strokeColor={parseInt(teamData.turnover) > 3 ? '#f5222d' : parseInt(teamData.turnover) > 1 ? '#faad14' : '#52c41a'}
              className="mr-3"
              format={() => `${teamData.turnover}`}
            />
            <Text>{teamData.turnover} departures this quarter</Text>
          </div>
        </Card>
        
        <Card className="shadow-sm">
          <Text strong className="block mb-2">Vacant Positions</Text>
          <Title level={2} className="m-0">{teamData.vacant_positions}</Title>
          <Text>Open roles</Text>
        </Card>
        
        <Card className="shadow-sm">
          <Text strong className="block mb-2">Leadership Alignment</Text>
          <Progress 
            percent={parseInt(teamData.leadership_alignment)} 
            status={
              parseInt(teamData.leadership_alignment) > 80 ? 'success' : 
              parseInt(teamData.leadership_alignment) > 50 ? 'active' : 'exception'
            } 
          />
          <Text>Survey score: {teamData.leadership_alignment}/100</Text>
        </Card>
      </div>
      
      {/* Team Growth Section */}
      <Card title="Team Growth Trends" className="mb-6 shadow-sm">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={teamGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" orientation="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'size' ? value : `${value} employees`,
                  name === 'size' ? 'Team Size' : name === 'hires' ? 'New Hires' : 'Turnover'
                ]}
                labelFormatter={(label) => `Quarter: ${label}`}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="size" fill="#8884d8" name="Team Size" />
              <Bar yAxisId="right" dataKey="hires" fill="#82ca9d" name="New Hires" />
              <Bar yAxisId="right" dataKey="turnover" fill="#f5222d" name="Turnover" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
      
      {/* Team Composition Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
  <Card title="Team Strengths" className="shadow-sm">
    <List
      size="small"
      dataSource={teamStrengths}
      renderItem={item => (
        <List.Item>
          <Tag color="green">{item}</Tag>
        </List.Item>
      )}
    />
  </Card>

  <Card title="Current Development Initiatives" className="shadow-sm">
    <List
      size="small"
      dataSource={developmentInitiatives}
      renderItem={item => (
        <List.Item>
          <Text>{item}</Text>
        </List.Item>
      )}
    />
  </Card>
</div>

      
      {/* Quarterly Performance */}
      {/* <Card title="Quarterly Performance Highlights" className="mb-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="shadow-sm">
            <Statistic
              title="Team Velocity"
              value={12.5}
              precision={1}
              suffix="% increase"
            />
            <Text>From previous quarter</Text>
          </Card>
          
          <Card className="shadow-sm">
            <Statistic
              title="Feature Delivery"
              value={92}
              suffix="% on time"
            />
            <Text>Milestone completion rate</Text>
          </Card>
          
          <Card className="shadow-sm">
            <Statistic
              title="Employee Engagement"
              value={84}
              suffix="/100"
            />
            <Text>Quarterly survey score</Text>
          </Card>
        </div>
      </Card> */}
      
      <Divider />
      
      <div className="text-right">
        <Text type="secondary">Data as of {new Date().toLocaleDateString()}</Text>
      </div>
    </div>
  );
};

export default TeamPerformance;