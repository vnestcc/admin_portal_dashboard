import React from 'react';
import { Card, List, Typography, Divider, Progress, Row, Col } from 'antd';
import { 
  LineChart, Line, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

const { Title, Text } = Typography;

const AdditionalInfo = ({ data, history }) => {
  if (!data || data.length === 0) return <div>No additional information available</div>;
  
  // Current data from props
  const currentData = data[0];
  
  // Focused historical data (only key metrics)
  // const historicalData = [
  //   {
  //     "business_model_adjustments": "1950",
  //     "growth_challenges": "2250",
  //     "initiative_progress": "110",
  //     "quarter": "Q3 2023"
  //   },
  //   {
  //     "business_model_adjustments": "1800",
  //     "growth_challenges": "2350",
  //     "initiative_progress": "105",
  //     "quarter": "Q2 2023"
  //   },
  //   {
  //     "business_model_adjustments": "1650",
  //     "growth_challenges": "2450",
  //     "initiative_progress": "100",
  //     "quarter": "Q1 2023"
  //   },
  //   {
  //     "business_model_adjustments": "1500",
  //     "growth_challenges": "2550",
  //     "initiative_progress": "95",
  //     "quarter": "Q4 2022"
  //   },
  //   {
  //     "business_model_adjustments": "1350",
  //     "growth_challenges": "2650",
  //     "initiative_progress": "90",
  //     "quarter": "Q3 2022"
  //   }
  // ];

  const historicalData = history.map(item => ({
    quarter: item.quarter,
    initiative_progress: parseInt(item.initiative_progress),
    growth_challenges: parseInt(item.growth_challenges),
    business_model_adjustments: parseInt(item.business_model_adjustments)
}));


  // Combine for trend analysis
  const trendData = [...historicalData].map(item => ({
    name: item.quarter,
    adjustments: parseInt(item.business_model_adjustments),
    challenges: parseInt(item.growth_challenges),
    initiatives: parseInt(item.initiative_progress)
  }));

  // Calculate initiative health score
  const healthScore = (
    (parseInt(currentData.initiative_progress) * 0.4 +
    parseInt(currentData.business_model_adjustments) * 0.3 -
    parseInt(currentData.growth_challenges) * 0.3) / 20
  );

  const normalizedScore = Math.min(Math.max(healthScore, 0), 100).toFixed(2);

  return (
    <div className="additional-info">
      <Title level={3} className="mb-6">Strategic Initiatives Dashboard</Title>
      
      {/* Overview Cards */}
      <Row gutter={16} className="mb-6">
        <Col span={8}>
          <Card className="shadow-sm">
            <div className="text-center">
              <Progress
                type="circle"
                percent={normalizedScore}
                width={150}
                strokeColor={normalizedScore >= 70 ? '#52c41a' : normalizedScore >= 40 ? '#faad14' : '#f5222d'}
              />
              <Title level={4} className="mt-4">Initiative Health</Title>
              <Text type="secondary">Overall progress score</Text>
            </div>
          </Card>
        </Col>
        
        <Col span={8}>
          <Card className="shadow-sm">
            <Title level={4} className="mb-4">Positive Indicators</Title>
            <List
              size="small"
              dataSource={[
                `Initiative Progress: ${currentData.initiative_progress}`,
                `New Initiatives: ${currentData.new_initiatives}`,
                `Business Model Adjustments: ${currentData.business_model_adjustments}`
              ]}
              renderItem={item => <List.Item><Text type="success">{item}</Text></List.Item>}
            />
          </Card>
        </Col>
        
        <Col span={8}>
          <Card className="shadow-sm">
            <Title level={4} className="mb-4">Challenges</Title>
            <List
              size="small"
              dataSource={[
                `Growth Challenges: ${currentData.growth_challenges}`,
                `Support Needed: ${currentData.support_needed}`,
                `Policy Impact: ${currentData.policy_impact}`
              ]}
              renderItem={item => <List.Item><Text type="danger">{item}</Text></List.Item>}
            />
          </Card>
        </Col>
      </Row>
      
      {/* Trend Analysis */}
      <Card title="Strategic Trends (Last 6 Quarters)" className="mb-6 shadow-sm">
        <Row gutter={16}>
          <Col span={12}>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="adjustments" 
                    stroke="#8884d8" 
                    name="Business Model Adjustments" 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="initiatives" 
                    stroke="#82ca9d" 
                    name="Initiative Progress" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Col>
          <Col span={12}>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar 
                    dataKey="challenges" 
                    fill="#f5222d" 
                    name="Growth Challenges" 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Col>
        </Row>
      </Card>
      
      {/* Current Initiatives */}
      <Card title="Current Strategic Position" className="mb-6 shadow-sm">
        <Row gutter={16}>
          <Col span={12}>
            <Title level={4} className="mb-4">Initiatives & Adjustments</Title>
            <List
              size="small"
              dataSource={[
                `Business Model Adjustments: ${currentData.business_model_adjustments} `,
                `Initiative Progress: ${currentData.initiative_progress} `,
                `New Initiatives: ${currentData.new_initiatives}`,
                `Policy Changes: ${currentData.policy_changes}`
              ]}
              renderItem={item => (
                <List.Item>
                  <Text>{item}</Text>
                </List.Item>
              )}
            />
          </Col>
          
          <Col span={12}>
            <Title level={4} className="mb-4">Challenges & Support</Title>
            <List
              size="small"
              dataSource={[
                `Growth Challenges: ${currentData.growth_challenges} `,
                `Support Needed: ${currentData.support_needed}`,
                `Policy Impact: ${currentData.policy_impact}`,
                `Mitigation Strategies: ${currentData.mitigation_strategies}`
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
      
      {/* Action Items */}
      {/* <Card title="Action Items & Strategies" className="mb-6 shadow-sm">
        <Row gutter={16}>
          <Col span={12}>
            <Title level={5}>Mitigation Strategies</Title>
            <Text>{currentData.mitigation_strategies}</Text>
            <Divider />
            <List
              size="small"
              dataSource={[
                'Business model optimization',
                'Initiative prioritization framework',
                'Policy impact assessment',
                'Resource reallocation'
              ]}
              renderItem={item => (
                <List.Item>
                  <Text type="success">{item}</Text>
                </List.Item>
              )}
            />
          </Col>
          <Col span={12}>
            <Title level={5}>Support Requirements</Title>
            <Text>{currentData.support_needed}</Text>
            <Divider />
            <List
              size="small"
              dataSource={[
                'Additional funding for key initiatives',
                'Cross-functional team support',
                'Executive sponsorship',
                'Technology infrastructure upgrades'
              ]}
              renderItem={item => (
                <List.Item>
                  <Text>{item}</Text>
                </List.Item>
              )}
            />
          </Col>
        </Row>
      </Card> */}
      
      <Divider />
      
      <div className="text-right">
        <Text type="secondary">Assessment as of {new Date().toLocaleDateString()}</Text>
      </div>
    </div>
  );
};

export default AdditionalInfo;