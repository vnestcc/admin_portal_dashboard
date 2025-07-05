export const SAMPLE_DATA = {
  companyId: "startup_123",
  metrics: [
    // 1. Funds Raised Over Time
    {
      timestamp: "2023-01-01",
      cash_balance: 500000,
      last_round: "Pre-seed"
    },
    {
      timestamp: "2023-04-01",
      cash_balance: 1500000,
      last_round: "Seed"
    },
    {
      timestamp: "2023-10-01",
      cash_balance: 4000000,
      last_round: "Series A"
    },

    // 2. Revenue Growth
    {
      timestamp: "2023-01-01",
      quarterly_revenue: 120000,
      revenue_growth: 0.15
    },
    {
      timestamp: "2023-04-01",
      quarterly_revenue: 185000,
      revenue_growth: 0.25
    },
    {
      timestamp: "2023-07-01",
      quarterly_revenue: 280000,
      revenue_growth: 0.18
    },

    // 3. Expense Breakdown
    {
      revenue_breakdowns: [
        { product: "SaaS Platform", revenue: 180000, percentage: 0.6 },
        { product: "Consulting", revenue: 80000, percentage: 0.25 },
        { product: "Training", revenue: 40000, percentage: 0.15 }
      ]
    },

    // 4. Runway Metrics
    {
      cash_balance: 3200000,
      burn_rate: 250000,
      cash_runway: 12.8 // months
    },

    // 5. User Growth
    {
      timestamp: "2023-01-01",
      active_users: 1500,
      total_customers: 45
    },
    {
      timestamp: "2023-04-01",
      active_users: 4200,
      total_customers: 112
    },
    {
      timestamp: "2023-07-01",
      active_users: 8900,
      total_customers: 215
    },

    // 6. Milestones
    {
      milestones_achieved: [
        "MVP Launched (Q1 2023)",
        "First 100 Customers (Q2 2023)",
        "Seed Round Closed"
      ],
      roadmap: [
        "Series A Closing (Q4 2023)",
        "Mobile App Launch",
        "European Expansion"
      ]
    },

    // 7. CAC/LTV
    {
      timestamp: "2023-01-01",
      cac: 1200,
      ltv: 8000,
      ltv_ratio: 6.7
    },
    {
      timestamp: "2023-04-01",
      cac: 950,
      ltv: 9200,
      ltv_ratio: 9.7
    },

    // 8. Market Share
    {
      total_customers: 215,
      market_share: 2.4 // %
    },

    // 9. KPIs
    {
      timestamp: "2023-01-01",
      active_users: 1500,
      conversion_rate: 0.03, // 3%
      churn_rate: 0.08,      // 8%
      gross_margin: 0.65     // 65%
    },
    {
      timestamp: "2023-04-01",
      active_users: 4200,
      conversion_rate: 0.042,
      churn_rate: 0.065,
      gross_margin: 0.68
    }
  ]
};

// Mock API response format
// export const mockFetchData = (companyId, columns) => {
//   const neededColumns = columns.split(',');
  
//   return Promise.resolve(
//     SAMPLE_DATA.metrics
//       .filter(metric => 
//         Object.keys(metric).some(key => neededColumns.includes(key))
//       .map(metric => {
//         const filtered = {};
//         neededColumns.forEach(col => {
//           if (metric[col] !== undefined) filtered[col] = metric[col];
//         });
//         return filtered;
//       })
//   );
// };

export const mockFetchData = (companyId, columns) => {
  const neededColumns = columns.split(',');

  return Promise.resolve(
    SAMPLE_DATA.metrics
      .filter(metric =>
        Object.keys(metric).some(key => neededColumns.includes(key))
      )
      .map(metric => {
        const filtered = {};
        neededColumns.forEach(col => {
          if (metric[col] !== undefined) filtered[col] = metric[col];
        });
        return filtered;
      })
  );
};
