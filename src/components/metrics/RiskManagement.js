import React from 'react';
import { Card, List, Typography, Divider, Progress, Row, Col } from 'antd';
import { 
  LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

const { Title, Text } = Typography;

const RiskManagement = ({ data, history }) => {
  if (!data || data.length === 0) return <div>No risk management data available</div>;
  
  // Current data from props
  const currentData = data[0];
  
  // Focused historical data (only key metrics)
  // const historicalData = [
  //   {
  //     "compliance_status": "1180",
  //     "security_incidents": "135",
  //     "regulatory_concerns": "1150",
  //     "quarter": "Q3 2023"
  //   },
  //   {
  //     "compliance_status": "1150",
  //     "security_incidents": "145",
  //     "regulatory_concerns": "1200",
  //     "quarter": "Q2 2023"
  //   },
  //   {
  //     "compliance_status": "1120",
  //     "security_incidents": "155",
  //     "regulatory_concerns": "1250",
  //     "quarter": "Q1 2023"
  //   },
  //   {
  //     "compliance_status": "1080",
  //     "security_incidents": "170",
  //     "regulatory_concerns": "1300",
  //     "quarter": "Q4 2022"
  //   },
  //   {
  //     "compliance_status": "1050",
  //     "security_incidents": "185",
  //     "regulatory_concerns": "1350",
  //     "quarter": "Q3 2022"
  //   }
  // ];

  const historicalData = history.map(item => ({
    quarter: `${item.quarter} ${item.year}`,
    compliance_status: parseInt(item.compliance_status),
    security_incidents: parseInt(item.security_incidents),
    regulatory_concerns: parseInt(item.regulatory_concerns)
}));

  // Combine for trend analysis
  const riskTrendData = [...historicalData].map(item => ({
    name: item.quarter,
    compliance: parseInt(item.compliance_status),
    incidents: parseInt(item.security_incidents),
    concerns: parseInt(item.regulatory_concerns)
  }));

  // Calculate risk score (example calculation)
  const riskScore = (
    (parseInt(currentData.compliance_status) * 0.4 -
    parseInt(currentData.security_incidents) * 0.3 -
    parseInt(currentData.regulatory_concerns) * 0.3
  ) / 10);

  const normalizedScore = Math.min(Math.max(riskScore, 0), 100);

  return (
    <div className="risk-management">
      <Title level={3} className="mb-6">Risk Management Dashboard</Title>
      
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
              <Title level={4} className="mt-4">Risk Score</Title>
              <Text type="secondary">Lower is better</Text>
            </div>
          </Card>
        </Col>
        
        <Col span={8}>
          <Card className="shadow-sm">
            <Title level={4} className="mb-4">Positive Indicators</Title>
            <List
              size="small"
              dataSource={[
                `Compliance Status: ${currentData.compliance_status}`,
                `Security Audits: ${currentData.security_audits}`,
                `Data Protection: ${currentData.data_protection}`
              ]}
              renderItem={item => <List.Item><Text type="success">{item}</Text></List.Item>}
            />
          </Card>
        </Col>
        
        <Col span={8}>
          <Card className="shadow-sm">
            <Title level={4} className="mb-4">Risk Areas</Title>
            <List
              size="small"
              dataSource={[
                `Security Incidents: ${currentData.security_incidents}`,
                `Regulatory Concerns: ${currentData.regulatory_concerns}`,
                `Key Dependencies: ${currentData.key_dependencies}`
              ]}
              renderItem={item => <List.Item><Text type="danger">{item}</Text></List.Item>}
            />
          </Card>
        </Col>
      </Row>
      
      {/* Trend Analysis */}
      <Card title="Risk Trends (Last 6 Quarters)" className="mb-6 shadow-sm">
        <Row gutter={16}>
          <Col span={12}>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={riskTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="compliance" 
                    stroke="#52c41a" 
                    name="Compliance Status" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Col>
          <Col span={12}>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={riskTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="incidents" 
                    stroke="#f5222d" 
                    name="Security Incidents" 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="concerns" 
                    stroke="#faad14" 
                    name="Regulatory Concerns" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Col>
        </Row>
      </Card>
      
      {/* Current Risk Breakdown */}
      <Card title="Current Risk Assessment" className="mb-6 shadow-sm">
        <Row gutter={16}>
          <Col span={12}>
            <Title level={4} className="mb-4">Compliance & Security</Title>
            <List
              size="small"
              dataSource={[
                `Compliance Status: ${currentData.compliance_status}`,
                `Security Audits: ${currentData.security_audits}`,
                `Data Protection: ${currentData.data_protection}`,
                `Security Incidents: ${currentData.security_incidents} `
              ]}
              renderItem={item => (
                <List.Item>
                  <Text>{item}</Text>
                </List.Item>
              )}
            />
          </Col>
          
          <Col span={12}>
            <Title level={4} className="mb-4">Regulatory & Dependencies</Title>
            <List
              size="small"
              dataSource={[
                `Regulatory Concerns: ${currentData.regulatory_concerns} `,
                `Regulatory Changes: ${currentData.regulatory_changes}`,
                `Key Dependencies: ${currentData.key_dependencies}`,
                `Contingency Plans: ${currentData.contingency_plans}`
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
      
      {/* Risk Mitigation */}
      {/* <Card title="Risk Mitigation Strategies" className="mb-6 shadow-sm">
        <Row gutter={16}>
          <Col span={12}>
            <Title level={5}>Active Measures</Title>
            <List
              size="small"
              dataSource={[
                'Enhanced security protocols',
                'Compliance training programs',
                'Vendor risk assessments',
                'Incident response planning'
              ]}
              renderItem={item => (
                <List.Item>
                  <Text type="success">{item}</Text>
                </List.Item>
              )}
            />
          </Col>
          <Col span={12}>
            <Title level={5}>Planned Improvements</Title>
            <List
              size="small"
              dataSource={[
                'Automated compliance monitoring',
                'Third-party audit schedule',
                'Regulatory change tracking system',
                'Dependency diversification'
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

export default RiskManagement;