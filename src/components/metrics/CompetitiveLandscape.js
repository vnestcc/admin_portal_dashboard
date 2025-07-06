import React from 'react';
import { Card, List, Typography, Divider, Progress } from 'antd';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const { Title, Text } = Typography;

const CompetitiveLandscape = ({ data }) => {
  if (!data || data.length === 0) return <div>No competitive data available</div>;
  
  const competitiveData = data[0]; // Using the most recent data
  // console.log(competitiveData)
  // Prepare data for radar chart
  const radarChartData = [
    { subject: 'Differentiators', A: competitiveData.differentiators, fullMark: 15000 },
    { subject: 'Threats', A: competitiveData.threats, fullMark: 15000 },
    { subject: 'New Competitors', A: competitiveData.new_competitors, fullMark: 15000 },
    { subject: 'Market Shifts', A: competitiveData.market_shifts, fullMark: 15000 },
    { subject: 'Defensive Strategies', A: competitiveData.defensive_strategies, fullMark: 15000 },
    { subject: 'Competitor Strategies', A: competitiveData.competitor_strategies, fullMark: 15000 },
  ];

  // Calculate overall competitive score (example calculation)
  const competitiveScore = (
    (parseInt(competitiveData.differentiators) * 2) - 
    (parseInt(competitiveData.threats) + parseInt(competitiveData.new_competitors)) +
    (parseInt(competitiveData.defensive_strategies) * 1.5)
  ) / 100;

  // Normalize score to 0-100 for display
  const normalizedScore = Math.min(Math.max(competitiveScore, 0), 100);

  return (
    <div className="competitive-landscape">
      <Title level={3} className="mb-6">Competitive Landscape Analysis</Title>
      
      {/* Overview Card */}
      <Card className="mb-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <Progress
              type="circle"
              percent={normalizedScore}
              width={150}
              strokeColor={normalizedScore >= 70 ? '#52c41a' : normalizedScore >= 40 ? '#faad14' : '#f5222d'}
            />
            <Title level={4} className="mt-4">Competitive Health Score</Title>
            <Text type="secondary">Higher is better</Text>
          </div>
          
          <div>
            <Title level={4} className="mb-4">Key Strengths</Title>
            <List
              size="small"
              dataSource={[
                `Differentiators score: ${competitiveData.differentiators}`,
                `Defensive strategies: ${competitiveData.defensive_strategies}`,
                'Strong market positioning'
              ]}
              renderItem={item => <List.Item><Text>{item}</Text></List.Item>}
            />
          </div>
          
          <div>
            <Title level={4} className="mb-4">Potential Risks</Title>
            <List
              size="small"
              dataSource={[
                `Threats score: ${competitiveData.threats}`,
                `New competitors: ${competitiveData.new_competitors}`,
                `Market shifts: ${competitiveData.market_shifts}`
              ]}
              renderItem={item => <List.Item><Text type="danger">{item}</Text></List.Item>}
            />
          </div>
        </div>
      </Card>
      
      {/* Radar Chart */}
      <Card title="Competitive Metrics Radar" className="mb-6 shadow-sm">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarChartData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar 
                name="Competitive Metrics" 
                dataKey="A" 
                stroke="#8884d8" 
                fill="#8884d8" 
                fillOpacity={0.6} 
              />
              <Tooltip 
                formatter={(value) => [value, 'Score']}
                labelFormatter={(label) => label}
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </Card>
      
      <Divider />
      
      <div className="text-right">
        <Text type="secondary">Analysis as of {new Date().toLocaleDateString()}</Text>
      </div>
    </div>
  );
};

export default CompetitiveLandscape;