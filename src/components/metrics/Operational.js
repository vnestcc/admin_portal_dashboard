import React from 'react';
import { Card, List, Typography, Divider, Tag, Progress, Row, Col } from 'antd';
import { 
  RadialBarChart, RadialBar, Legend, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid 
} from 'recharts';

const { Title, Text } = Typography;

const OperationalEfficiency = ({ data, history }) => {
  if (!data || data.length === 0) return <div>No operational data available</div>;
  
  // Current quarter data from props
  const currentData = data[0];
  console.log(currentData)
  
  // Sample historical data in the same format
  // const historicalData = [
  //   {
  //     "infrastructure_capacity": "195",
  //     "operational_bottlenecks": "2245",
  //     "optimization_areas": "110",
  //     "scaling_plans": "1150",
  //     "quarter": "Q3 2023"
  //   },
  //   {
  //     "infrastructure_capacity": "185",
  //     "operational_bottlenecks": "2300",
  //     "optimization_areas": "105",
  //     "scaling_plans": "1100",
  //     "quarter": "Q2 2023"
  //   },
  //   {
  //     "infrastructure_capacity": "175",
  //     "operational_bottlenecks": "2400",
  //     "optimization_areas": "98",
  //     "scaling_plans": "1050",
  //     "quarter": "Q1 2023"
  //   },
  //   {
  //     "infrastructure_capacity": "165",
  //     "operational_bottlenecks": "2500",
  //     "optimization_areas": "90",
  //     "scaling_plans": "980",
  //     "quarter": "Q4 2022"
  //   },
  //   {
  //     "infrastructure_capacity": "155",
  //     "operational_bottlenecks": "2600",
  //     "optimization_areas": "85",
  //     "scaling_plans": "920",
  //     "quarter": "Q3 2022"
  //   }
  // ];

  const historicalData = history.map(item => ({
    quarter: item.quarter,
    infrastructure_capacity: parseInt(item.infrastructure_capacity),
    operational_bottlenecks: parseInt(item.operational_bottlenecks),
    optimization_areas: parseInt(item.optimization_areas),
    scaling_plans: parseInt(item.scaling_plans)
}));

  // Combine historical and current data for trends
  const efficiencyTrendData = [...historicalData].map(quarter => ({
    name: quarter.quarter || "Current",
    impact: parseInt(quarter.impact_metrics),
    infrastructure: parseInt(quarter.infrastructure_capacity),
    bottlenecks: parseInt(quarter.operational_bottlenecks),
    changes: parseInt(quarter.operational_changes),
    optimization: parseInt(quarter.optimization_areas),
    scaling: parseInt(quarter.scaling_plans),
  }));

  // Prepare data for radial chart (current quarter only)
  const efficiencyRadialData = [
    { name: 'Impact', value: parseInt(currentData.impact_metrics), fill: '#8884d8' },
    { name: 'Infrastructure', value: parseInt(currentData.infrastructure_capacity), fill: '#83a6ed' },
    { name: 'Bottlenecks', value: parseInt(currentData.operational_bottlenecks), fill: '#8dd1e1' },
    { name: 'Changes', value: parseInt(currentData.operational_changes), fill: '#82ca9d' },
    { name: 'Optimization', value: parseInt(currentData.optimization_areas), fill: '#a4de6c' },
    { name: 'Scaling', value: parseInt(currentData.scaling_plans), fill: '#d0ed57' },
  ];

  // Calculate overall efficiency score
  const efficiencyScore = (
    (parseInt(currentData.impact_metrics) * 0.3 +
    parseInt(currentData.infrastructure_capacity) * 0.2 +
    parseInt(currentData.operational_changes) * 0.15 +
    parseInt(currentData.optimization_areas) * 0.2 +
    parseInt(currentData.scaling_plans) * 0.15 -
    parseInt(currentData.operational_bottlenecks) * 0.1)
  );

  const normalizedScore = Math.min(Math.max(efficiencyScore, 0), 100).toFixed(2);

  return (
    <div className="operational-efficiency">
      <Title level={3} className="mb-6">Operational Efficiency Dashboard</Title>
      
      {/* Overview Cards */}
      <Row gutter={16} className="mb-6">
        <Col span={8}>
          <Card className="shadow-sm">
            <div className="text-center">
              <Progress
                type="circle"
                percent={normalizedScore}
                width={150}
                strokeColor={normalizedScore >= 75 ? '#52c41a' : normalizedScore >= 50 ? '#faad14' : '#f5222d'}
              />
              <Title level={4} className="mt-4">Efficiency Score</Title>
              <Text type="secondary">Overall operational health</Text>
            </div>
          </Card>
        </Col>
        
        <Col span={8}>
          <Card className="shadow-sm">
            <Title level={4} className="mb-4">Top Strengths</Title>
            <List
              size="small"
              dataSource={[
                `Infrastructure: ${currentData.infrastructure_capacity}`,
                `Scaling Plans: ${currentData.scaling_plans}`,
                `Optimization: ${currentData.optimization_areas}`
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
                `Bottlenecks: ${currentData.operational_bottlenecks}`,
                `Impact: ${currentData.impact_metrics}`,
                `Changes Needed: ${currentData.operational_changes}`
              ]}
              renderItem={item => <List.Item><Text type="danger">{item}</Text></List.Item>}
            />
          </Card>
        </Col>
      </Row>
      
      {/* Trend Analysis */}

      
      {/* Current Quarter Analysis */}
      <Card title="Current Quarter Deep Dive" className="mb-6 shadow-sm">
        <Row gutter={16}>
          <Col span={12}>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart 
                  innerRadius="20%" 
                  outerRadius="80%" 
                  data={efficiencyRadialData}
                  startAngle={180}
                  endAngle={0}
                >
                  <RadialBar 
                    minAngle={15}
                    label={{ position: 'insideStart', fill: '#fff' }}
                    background
                    dataKey="value"
                  />
                  <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
                  <Tooltip 
                    formatter={(value) => [value, 'Score']}
                    labelFormatter={(label) => label}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
          </Col>
          
          <Col span={12}>
            <Title level={4} className="mb-4">Key Metrics Comparison</Title>
            <List
              size="small"
              dataSource={[
                `Infrastructure Capacity: ${currentData.infrastructure_capacity}`,
                `Operational Bottlenecks: ${currentData.operational_bottlenecks} `,
                `Optimization Areas: ${currentData.optimization_areas} `,
                `Scaling Plans: ${currentData.scaling_plans} `
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
      
      {/* Detailed Breakdown */}
      <Row gutter={16} className="mb-6">
        <Col span={12}>
          <Card title="Infrastructure & Scaling" className="shadow-sm">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={efficiencyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="infrastructure" fill="#8884d8" name="Infrastructure" />
                  <Bar dataKey="scaling" fill="#82ca9d" name="Scaling Plans" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
        
        <Col span={12}>
          <Card title="Bottlenecks & Optimization" className="shadow-sm">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={efficiencyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="bottlenecks" fill="#f5222d" name="Bottlenecks" />
                  <Bar dataKey="optimization" fill="#ffc658" name="Optimization" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>
      
      <Divider />
      
      <div className="text-right">
        <Text type="secondary">Analysis as of {new Date().toLocaleDateString()}</Text>
      </div>
    </div>
  );
};

export default OperationalEfficiency;