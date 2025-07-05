import React from 'react';
import { Card, List, Typography, Divider, Tag, Progress, Row, Col } from 'antd';
import { 
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Legend, Tooltip, LineChart, Line, CartesianGrid, XAxis, YAxis,
} from 'recharts';

const { Title, Text } = Typography;

const SelfAssessment = ({ data, history }) => {
  if (!data || data.length === 0) return <div>No assessment data available</div>;
  
  // Current data from props
  const currentData = data[0];
  
  // Sample historical data (focusing only on ratings)
  // const historicalData = [
  //   {
  //     "financial_rating": 2,
  //     "market_rating": 1,
  //     "overall_rating": 5,
  //     "quarter": "Q3 2023"
  //   },
  //   {
  //     "financial_rating": 2,
  //     "market_rating": 1,
  //     "overall_rating": 5,
  //     "quarter": "Q2 2023"
  //   },
  //   {
  //     "financial_rating": 1,
  //     "market_rating": 1,
  //     "overall_rating": 4,
  //     "quarter": "Q1 2023"
  //   },
  //   {
  //     "financial_rating": 1,
  //     "market_rating": 1,
  //     "overall_rating": 4,
  //     "quarter": "Q4 2022"
  //   },
  //   {
  //     "financial_rating": 1,
  //     "market_rating": 1,
  //     "overall_rating": 4,
  //     "quarter": "Q3 2022"
  //   }
  // ];

  const historicalData = history.map(item => ({
    quarter: item.quarter,
    financial_rating: item.financial_rating,
    market_rating: item.market_rating,
    overall_rating: item.overall_rating
}));

  // Combine for trend analysis
  const ratingTrendData = [...historicalData];

  // Prepare data for radar chart
  const radarData = [
    { subject: 'Financial', A: currentData.financial_rating, fullMark: 5 },
    { subject: 'Market', A: currentData.market_rating, fullMark: 5 },
    { subject: 'Operational', A: currentData.operational_rating, fullMark: 5 },
    { subject: 'Product', A: currentData.product_rating, fullMark: 5 },
    { subject: 'Team', A: currentData.team_rating, fullMark: 5 },
  ];

  return (
    <div className="self-assessment">
      <Title level={3} className="mb-6">Startup Self-Assessment</Title>
      
      {/* Overview Cards */}
      <Row gutter={16} className="mb-6">
        <Col span={8}>
          <Card className="shadow-sm">
            <div className="text-center">
              <Title level={1} style={{ fontSize: '72px' }}>
                {currentData.overall_rating}/10
              </Title>
              <Title level={4} className="mt-0">Overall Rating</Title>
              <Progress
                percent={(currentData.overall_rating / 10) * 100}
                strokeColor={
                  currentData.overall_rating >= 8 ? '#52c41a' :
                  currentData.overall_rating >= 5 ? '#faad14' : '#f5222d'
                }
              />
            </div>
          </Card>
        </Col>
        
        <Col span={8}>
          <Card className="shadow-sm">
            <Title level={4} className="mb-4">Strengths</Title>
            <List
              size="small"
              dataSource={[
                `Financial Rating: ${currentData.financial_rating}/5`,
                `Operational Rating: ${currentData.operational_rating}/5`,
                `Incubator Support: ${currentData.incubator_support}`
              ]}
              renderItem={item => <List.Item><Text type="success">{item}</Text></List.Item>}
            />
          </Card>
        </Col>
        
        <Col span={8}>
          <Card className="shadow-sm">
            <Title level={4} className="mb-4">Improvement Areas</Title>
            <List
              size="small"
              dataSource={[
                `Market Rating: ${currentData.market_rating}/5`,
                `Product Rating: ${currentData.product_rating}/5`,
                `Team Rating: ${currentData.team_rating}/5`
              ]}
              renderItem={item => <List.Item><Text type="danger">{item}</Text></List.Item>}
            />
          </Card>
        </Col>
      </Row>
      
      {/* Rating Analysis */}
      <Card title="Rating Breakdown" className="mb-6 shadow-sm">
        <Row gutter={16}>
          <Col span={12}>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={30} domain={[0, 10]} />
                  <Radar 
                    name="Current Ratings" 
                    dataKey="A" 
                    stroke="#8884d8" 
                    fill="#8884d8" 
                    fillOpacity={0.6} 
                  />
                  <Tooltip />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </Col>
          
          <Col span={12}>
            <Title level={4} className="mb-4">Rating Trends</Title>
            <List
              size="small"
              dataSource={[
                `Overall Rating: ${currentData.overall_rating} `,
                `Financial Rating: ${currentData.financial_rating} `,
                `Market Rating: ${currentData.market_rating} `,
                `Operational Rating: ${currentData.operational_rating} `
              ]}
              renderItem={item => (
                <List.Item>
                  <Text>{item}</Text>
                </List.Item>
              )}
            />
          </Col>
        </Row>
      </Card>
      
      {/* Priorities */}
      <Card title="Strategic Priorities" className="mb-6 shadow-sm">
        <List
          size="large"
          dataSource={currentData.priorities}
          renderItem={(item, index) => (
            <List.Item>
              <Card className="w-full">
                <div className="flex items-center">
                  <div className="mr-4">
                    <Progress
                      type="circle"
                      percent={(index + 1) * 25} // Example progress
                      width={50}
                      strokeColor={['#f5222d', '#faad14', '#52c41a'][index]}
                    />
                  </div>
                  <div>
                    <Title level={5}>Priority #{index + 1}</Title>
                    <Text>{item}</Text>
                  </div>
                </div>
              </Card>
            </List.Item>
          )}
        />
      </Card>
      
      {/* Historical Trend */}
      <Card title="Overall Rating Trend (Last 6 Quarters)" className="mb-6 shadow-sm">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={ratingTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="quarter" />
              <YAxis domain={[0, 10]} />
              <Tooltip />
              <Legend />
              <Line  
                type="monotone" 
                dataKey="overall_rating" 
                stroke="#8884d8" 
                name="Overall Rating" 
                strokeWidth={3}
              />
              <Line 
                type="monotone" 
                dataKey="financial_rating" 
                stroke="#82ca9d" 
                name="Financial Rating" 
              />
              <Line 
                type="monotone" 
                dataKey="market_rating" 
                stroke="#ffc658" 
                name="Market Rating" 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
      
      <Divider />
      
      <div className="text-right">
        <Text type="secondary">Assessment as of {new Date().toLocaleDateString()}</Text>
      </div>
    </div>
  );
};

export default SelfAssessment;