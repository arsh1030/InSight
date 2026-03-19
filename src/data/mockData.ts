export interface HREvent {
  date: string;
  type: string;
  riskContribution: number;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  riskScore: number;
  baselineRiskScore: number;
  lastLogin: string;
  lastLoginHour: number;
  anomaliesDetected: number;
  status: string;
  hrEvents: HREvent[];
  peerDeviationScore: number;
  predictionScore: number;
  keystrokeDynamicsScore: number;
  mousePatternScore: number;
}

export interface Alert {
  id: string;
  employeeId: string;
  severity: 'Monitor' | 'Investigate' | 'Urgent' | 'Critical';
  triggerReason: string;
  timestamp: string;
  status: string;
  aiExplanation: {
    whatDetected: string;
    whySuspicious: string;
    contributingFactors: string[];
    recommendedAction: string;
  };
}

export interface ComplianceIncident {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  severity: string;
  department: string;
  status: string;
  description: string;
  anomalies: { type: string; timestamp: string }[];
}

export interface Branch {
  id: string;
  name: string;
  city: string;
  lastSync: string;
  localAnomalies: number;
  modelAccuracy: number;
  trainingStatus: 'Synced' | 'Training' | 'Pending' | 'Error';
}

export const employees: Employee[] = [
  {
    id: 'EMP001', name: 'Arjun Mehta', role: 'Senior Analyst', department: 'Risk Management',
    riskScore: 82, baselineRiskScore: 25, lastLogin: '2025-03-08 09:14', lastLoginHour: 9,
    anomaliesDetected: 7, status: 'Under Review',
    hrEvents: [
      { date: '2025-01-15', type: 'Performance Review', riskContribution: 5 },
      { date: '2025-02-10', type: 'Salary Dispute', riskContribution: 15 },
      { date: '2025-03-01', type: 'Resignation Notice', riskContribution: 25 }
    ],
peerDeviationScore: 78, predictionScore: 85,
    keystrokeDynamicsScore: 72, mousePatternScore: 68
  },
  {
    id: 'EMP002', name: 'Priya Sharma', role: 'Branch Manager', department: 'Operations',
    riskScore: 45, baselineRiskScore: 20, lastLogin: '2025-03-08 08:30', lastLoginHour: 8,
    anomaliesDetected: 3, status: 'Active',
    hrEvents: [{ date: '2025-02-20', type: 'Performance Review', riskContribution: 3 }],
peerDeviationScore: 35, predictionScore: 40,
    keystrokeDynamicsScore: 45, mousePatternScore: 42
  },
  {
    id: 'EMP003', name: 'Rahul Verma', role: 'Database Admin', department: 'IT',
    riskScore: 91, baselineRiskScore: 18, lastLogin: '2025-03-08 02:45', lastLoginHour: 2,
    anomaliesDetected: 12, status: 'Flagged',
    hrEvents: [
      { date: '2025-01-05', type: 'Demotion', riskContribution: 20 },
      { date: '2025-02-28', type: 'Salary Dispute', riskContribution: 18 }
    ],
peerDeviationScore: 92, predictionScore: 94,
    keystrokeDynamicsScore: 88, mousePatternScore: 85
  },
  {
    id: 'EMP004', name: 'Neha Gupta', role: 'Compliance Officer', department: 'Compliance',
    riskScore: 15, baselineRiskScore: 12, lastLogin: '2025-03-08 09:00', lastLoginHour: 9,
    anomaliesDetected: 0, status: 'Active',
    hrEvents: [],
peerDeviationScore: 8, predictionScore: 10,
    keystrokeDynamicsScore: 15, mousePatternScore: 12
  },
  {
    id: 'EMP005', name: 'Vikram Singh', role: 'Loan Officer', department: 'Lending',
    riskScore: 67, baselineRiskScore: 22, lastLogin: '2025-03-07 23:15', lastLoginHour: 23,
    anomaliesDetected: 5, status: 'Under Review',
    hrEvents: [
      { date: '2025-02-14', type: 'Performance Review', riskContribution: 8 },
      { date: '2025-03-05', type: 'Resignation Notice', riskContribution: 20 }
    ],
peerDeviationScore: 55, predictionScore: 62,
    keystrokeDynamicsScore: 58, mousePatternScore: 52
  },
  {
    id: 'EMP006', name: 'Ananya Patel', role: 'Treasury Analyst', department: 'Treasury',
    riskScore: 28, baselineRiskScore: 20, lastLogin: '2025-03-08 08:45', lastLoginHour: 8,
    anomaliesDetected: 1, status: 'Active',
    hrEvents: [{ date: '2025-01-30', type: 'Performance Review', riskContribution: 2 }],
peerDeviationScore: 18, predictionScore: 22,
    keystrokeDynamicsScore: 20, mousePatternScore: 18
  },
  {
    id: 'EMP007', name: 'Sanjay Kumar', role: 'IT Security Lead', department: 'IT',
    riskScore: 73, baselineRiskScore: 15, lastLogin: '2025-03-08 01:30', lastLoginHour: 1,
    anomaliesDetected: 8, status: 'Flagged',
    hrEvents: [
      { date: '2025-02-01', type: 'Demotion', riskContribution: 15 },
      { date: '2025-03-02', type: 'Salary Dispute', riskContribution: 12 }
    ],
peerDeviationScore: 70, predictionScore: 75,
    keystrokeDynamicsScore: 65, mousePatternScore: 70
  },
  {
    id: 'EMP008', name: 'Meera Reddy', role: 'Relationship Manager', department: 'Retail Banking',
    riskScore: 22, baselineRiskScore: 18, lastLogin: '2025-03-08 09:10', lastLoginHour: 9,
    anomaliesDetected: 1, status: 'Active',
    hrEvents: [],
peerDeviationScore: 12, predictionScore: 15,
    keystrokeDynamicsScore: 18, mousePatternScore: 14
  },
  {
    id: 'EMP009', name: 'Karthik Iyer', role: 'Financial Controller', department: 'Finance',
    riskScore: 55, baselineRiskScore: 20, lastLogin: '2025-03-07 22:00', lastLoginHour: 22,
    anomaliesDetected: 4, status: 'Under Review',
    hrEvents: [{ date: '2025-02-25', type: 'Performance Review', riskContribution: 10 }],
peerDeviationScore: 45, predictionScore: 50,
    keystrokeDynamicsScore: 48, mousePatternScore: 44
  },
  {
    id: 'EMP010', name: 'Divya Nair', role: 'AML Analyst', department: 'Compliance',
    riskScore: 12, baselineRiskScore: 10, lastLogin: '2025-03-08 08:55', lastLoginHour: 8,
    anomaliesDetected: 0, status: 'Active',
    hrEvents: [],
peerDeviationScore: 5, predictionScore: 8,
    keystrokeDynamicsScore: 10, mousePatternScore: 8
  },
  {
    id: 'EMP011', name: 'Rohan Desai', role: 'Systems Engineer', department: 'IT',
    riskScore: 38, baselineRiskScore: 15, lastLogin: '2025-03-08 07:30', lastLoginHour: 7,
    anomaliesDetected: 2, status: 'Active',
    hrEvents: [{ date: '2025-03-03', type: 'Performance Review', riskContribution: 5 }],
peerDeviationScore: 28, predictionScore: 32,
    keystrokeDynamicsScore: 30, mousePatternScore: 25
  },
  {
    id: 'EMP012', name: 'Fatima Sheikh', role: 'Credit Analyst', department: 'Lending',
    riskScore: 48, baselineRiskScore: 22, lastLogin: '2025-03-08 06:15', lastLoginHour: 6,
    anomaliesDetected: 3, status: 'Under Review',
    hrEvents: [
      { date: '2025-01-20', type: 'Performance Review', riskContribution: 4 },
      { date: '2025-02-18', type: 'Salary Dispute', riskContribution: 10 }
    ],
peerDeviationScore: 40, predictionScore: 45,
    keystrokeDynamicsScore: 42, mousePatternScore: 38
  }
];

export const alerts: Alert[] = [
  {
    id: 'ALT001', employeeId: 'EMP003', severity: 'Critical',
    triggerReason: 'Massive data download at 2:45 AM — 4.2 GB transferred to external device',
    timestamp: '2025-03-08 02:45', status: 'Open',
    aiExplanation: {
      whatDetected: 'Employee downloaded 4.2 GB of customer data to an external USB device during non-business hours (2:45 AM). This volume exceeds their 90-day average by 3200%.',
      whySuspicious: 'The combination of after-hours access, massive data volume, and external device transfer matches known data exfiltration patterns. The employee was recently demoted and has an ongoing salary dispute.',
      contributingFactors: ['After-hours access at 2:45 AM', 'Data volume 32x above baseline', 'External device transfer detected', 'Recent demotion and salary dispute', 'Keystroke dynamics mismatch — possible credential sharing'],
      recommendedAction: 'Immediately suspend data access privileges. Conduct forensic analysis of transferred files. Interview employee with HR and legal present.'
    }
  },
  {
    id: 'ALT003', employeeId: 'EMP007', severity: 'Urgent',
    triggerReason: 'Privilege escalation attempt detected — tried to access admin-level configurations',
    timestamp: '2025-03-07 23:10', status: 'Open',
    aiExplanation: {
      whatDetected: 'Multiple failed attempts to access system administration panels and firewall configurations outside authorized scope.',
      whySuspicious: 'As a recently demoted IT Security Lead, this employee retains knowledge of system architecture. Privilege escalation attempts after demotion follow a common insider threat pattern.',
      contributingFactors: ['4 failed admin access attempts', 'After-hours activity', 'Recent demotion', 'Knowledge of security systems', 'Mouse pattern anomaly detected'],
      recommendedAction: 'Review and restrict access privileges. Enable enhanced monitoring on all admin panels. Schedule security interview.'
    }
  },
  {
    id: 'ALT004', employeeId: 'EMP005', severity: 'Urgent',
    triggerReason: 'Unusual loan approval pattern — 3 high-value loans approved outside standard protocol',
    timestamp: '2025-03-07 16:30', status: 'Open',
    aiExplanation: {
      whatDetected: 'Three high-value loans (₹50L+) approved in rapid succession bypassing mandatory dual-approval workflow.',
      whySuspicious: 'Bypassing dual-approval for high-value loans violates compliance policy. Combined with resignation notice, this could indicate collusion or kickback scheme.',
      contributingFactors: ['Dual-approval bypass', '3 loans in 2 hours', 'All loans to new customers', 'Resignation notice submitted', 'Late evening processing'],
      recommendedAction: 'Freeze all pending loan approvals. Audit the 3 flagged loans. Cross-reference beneficiaries for known connections.'
    }
  },
  {
    id: 'ALT005', employeeId: 'EMP009', severity: 'Investigate',
    triggerReason: 'After-hours financial system access — querying large transaction reports at 10 PM',
    timestamp: '2025-03-07 22:05', status: 'Open',
    aiExplanation: {
      whatDetected: 'Financial controller accessed transaction reporting system at 10 PM, running queries for transactions above ₹10 crore.',
      whySuspicious: 'While the role permits access to financial reports, the timing and specific query parameters (filtering for high-value transactions) deviate from normal behavior.',
      contributingFactors: ['After-hours access', 'High-value transaction queries', 'First time accessing at this hour in 90 days', 'Moderate peer deviation'],
      recommendedAction: 'Review query logs for specific data accessed. Compare with legitimate business needs. Monitor for data export attempts.'
    }
  },
  {
    id: 'ALT006', employeeId: 'EMP012', severity: 'Investigate',
    triggerReason: 'Accessing customer records outside assigned portfolio — 45 records in 1 hour',
    timestamp: '2025-03-08 06:20', status: 'Open',
    aiExplanation: {
      whatDetected: 'Credit analyst accessed 45 customer records in one hour, none belonging to their assigned portfolio.',
      whySuspicious: 'Bulk access to unassigned records suggests either data harvesting or unauthorized research. Early morning timing adds suspicion.',
      contributingFactors: ['45 out-of-portfolio accesses', 'Early morning timing (6:15 AM)', 'Records span multiple branches', 'Salary dispute history'],
      recommendedAction: 'Restrict access to assigned portfolio only. Request justification for accessed records. Monitor for data export.'
    }
  },
  {
    id: 'ALT007', employeeId: 'EMP002', severity: 'Monitor',
    triggerReason: 'Slight increase in after-hours login frequency — 3 late logins this week',
    timestamp: '2025-03-08 07:00', status: 'Open',
    aiExplanation: {
      whatDetected: 'Branch manager logged in after hours 3 times this week compared to a baseline of once per month.',
      whySuspicious: 'While branch managers occasionally work late, the frequency increase is notable. No other anomalous behavior detected.',
      contributingFactors: ['3x increase in after-hours logins', 'No data access anomalies', 'Normal transaction patterns', 'Low peer deviation'],
      recommendedAction: 'Continue monitoring. No immediate action required. Flag for review if pattern persists beyond 2 weeks.'
    }
  },
  {
    id: 'ALT008', employeeId: 'EMP011', severity: 'Monitor',
    triggerReason: 'VPN connection from new geographic location — first time access from Pune',
    timestamp: '2025-03-08 07:35', status: 'Open',
    aiExplanation: {
      whatDetected: 'Systems engineer connected via VPN from Pune, a location not in their historical access pattern.',
      whySuspicious: 'New geographic locations can indicate credential compromise. However, this could also be legitimate travel.',
      contributingFactors: ['New location detected', 'VPN connection', 'Normal access patterns otherwise', 'No data anomalies'],
      recommendedAction: 'Verify with employee if travel is authorized. Add location to known patterns if confirmed legitimate.'
    }
  },
  {
    id: 'ALT009', employeeId: 'EMP001', severity: 'Urgent',
    triggerReason: 'Bulk customer data export to personal email detected',
    timestamp: '2025-03-08 09:20', status: 'Open',
    aiExplanation: {
      whatDetected: 'Employee sent 3 email attachments containing customer PII data to a personal Gmail account. Total size: 850 MB.',
      whySuspicious: 'Sending customer data to personal email is a severe policy violation. Given the resignation notice, this strongly suggests data theft.',
      contributingFactors: ['Personal email data transfer', 'Customer PII exposure', 'Post-resignation activity', 'Dark web credential flag', '850 MB total data'],
      recommendedAction: 'Immediately block email access. Initiate data breach protocol. Involve legal and compliance teams.'
    }
  },
  {
    id: 'ALT010', employeeId: 'EMP006', severity: 'Monitor',
    triggerReason: 'Unusual treasury system query patterns — accessing historical FX rate data',
    timestamp: '2025-03-08 08:50', status: 'Open',
    aiExplanation: {
      whatDetected: 'Treasury analyst accessed 6 months of historical FX rate data in a single session, which is unusual for daily operations.',
      whySuspicious: 'Bulk historical data access could indicate preparation for unauthorized trading analysis or data extraction.',
      contributingFactors: ['6 months of FX data accessed', 'Single session bulk download', 'Within business hours', 'Low overall risk profile'],
      recommendedAction: 'Verify business justification for historical data access. Monitor for subsequent trading anomalies.'
    }
  }
];

export const complianceIncidents: ComplianceIncident[] = [
  {
    id: 'INC001', employeeId: 'EMP003', employeeName: 'Rahul Verma',
    date: '2025-03-08', severity: 'Critical', department: 'IT', status: 'Open',
    description: 'Unauthorized data exfiltration of 4.2 GB customer data via external USB device during non-business hours.',
    anomalies: [
      { type: 'After-hours data access', timestamp: '2025-03-08 02:45' },
      { type: 'External device connection', timestamp: '2025-03-08 02:47' },
      { type: 'Bulk data transfer', timestamp: '2025-03-08 02:48' },
      { type: 'Keystroke dynamics mismatch', timestamp: '2025-03-08 02:44' }
    ]
  },
  {
    id: 'INC002', employeeId: 'EMP001', employeeName: 'Arjun Mehta',
    date: '2025-03-08', severity: 'Critical', department: 'Risk Management', status: 'Under Review',
    description: 'Customer PII data sent to personal email post-resignation notice.',
    anomalies: [
      { type: 'Personal email data transfer', timestamp: '2025-03-08 09:20' },
      { type: 'Post-resignation sensitive access', timestamp: '2025-03-08 08:30' }
    ]
  },
  {
    id: 'INC003', employeeId: 'EMP007', employeeName: 'Sanjay Kumar',
    date: '2025-03-07', severity: 'High', department: 'IT', status: 'Under Review',
    description: 'Privilege escalation attempts on admin systems post-demotion. Multiple failed access attempts to firewall configurations.',
    anomalies: [
      { type: 'Admin panel access attempt', timestamp: '2025-03-07 23:10' },
      { type: 'Firewall config access attempt', timestamp: '2025-03-07 23:15' },
      { type: 'After-hours activity', timestamp: '2025-03-07 23:10' }
    ]
  },
  {
    id: 'INC004', employeeId: 'EMP005', employeeName: 'Vikram Singh',
    date: '2025-03-07', severity: 'High', department: 'Lending', status: 'Open',
    description: 'Bypassed dual-approval workflow to approve 3 high-value loans exceeding ₹50 lakhs each.',
    anomalies: [
      { type: 'Dual-approval bypass', timestamp: '2025-03-07 16:30' },
      { type: 'Rapid loan approvals', timestamp: '2025-03-07 16:45' },
      { type: 'New customer accounts', timestamp: '2025-03-07 16:30' }
    ]
  },
  {
    id: 'INC005', employeeId: 'EMP012', employeeName: 'Fatima Sheikh',
    date: '2025-03-08', severity: 'Medium', department: 'Lending', status: 'Resolved',
    description: 'Accessed 45 customer records outside assigned portfolio. Investigation found legitimate cross-branch audit activity.',
    anomalies: [
      { type: 'Out-of-portfolio access', timestamp: '2025-03-08 06:20' },
      { type: 'Bulk record access', timestamp: '2025-03-08 06:20' }
    ]
  }
];

export const branches: Branch[] = [
  { id: 'BR001', name: 'Mumbai Central', city: 'Mumbai', lastSync: '2025-03-08 09:00', localAnomalies: 3, modelAccuracy: 94.2, trainingStatus: 'Synced' },
  { id: 'BR002', name: 'Delhi Connaught Place', city: 'Delhi', lastSync: '2025-03-08 08:45', localAnomalies: 5, modelAccuracy: 92.8, trainingStatus: 'Training' },
  { id: 'BR003', name: 'Bangalore Electronic City', city: 'Bangalore', lastSync: '2025-03-08 08:30', localAnomalies: 2, modelAccuracy: 95.1, trainingStatus: 'Synced' },
  { id: 'BR004', name: 'Chennai Anna Nagar', city: 'Chennai', lastSync: '2025-03-08 07:15', localAnomalies: 1, modelAccuracy: 93.5, trainingStatus: 'Pending' },
  { id: 'BR005', name: 'Kolkata Park Street', city: 'Kolkata', lastSync: '2025-03-07 23:00', localAnomalies: 4, modelAccuracy: 91.3, trainingStatus: 'Error' },
  { id: 'BR006', name: 'Hyderabad Hitech City', city: 'Hyderabad', lastSync: '2025-03-08 09:10', localAnomalies: 2, modelAccuracy: 94.7, trainingStatus: 'Synced' }
];

export const peerGroupAverages: Record<string, Record<string, number>> = {
  'Risk Management': { dailyLogins: 4, filesAccessed: 12, transactions: 8, afterHoursActivity: 1, systemsAccessed: 5, dataDownloadedGB: 0.3 },
  'Operations': { dailyLogins: 5, filesAccessed: 15, transactions: 20, afterHoursActivity: 2, systemsAccessed: 6, dataDownloadedGB: 0.5 },
  'IT': { dailyLogins: 6, filesAccessed: 25, transactions: 5, afterHoursActivity: 3, systemsAccessed: 12, dataDownloadedGB: 1.2 },
  'Compliance': { dailyLogins: 3, filesAccessed: 18, transactions: 6, afterHoursActivity: 1, systemsAccessed: 4, dataDownloadedGB: 0.2 },
  'Lending': { dailyLogins: 5, filesAccessed: 14, transactions: 15, afterHoursActivity: 1, systemsAccessed: 5, dataDownloadedGB: 0.4 },
  'Treasury': { dailyLogins: 4, filesAccessed: 10, transactions: 30, afterHoursActivity: 2, systemsAccessed: 4, dataDownloadedGB: 0.6 },
  'Retail Banking': { dailyLogins: 5, filesAccessed: 12, transactions: 25, afterHoursActivity: 1, systemsAccessed: 5, dataDownloadedGB: 0.3 },
  'Finance': { dailyLogins: 4, filesAccessed: 20, transactions: 12, afterHoursActivity: 2, systemsAccessed: 6, dataDownloadedGB: 0.8 }
};

export const alertTrendData = [
  { day: 'Mon', raised: 5, resolved: 3 },
  { day: 'Tue', raised: 8, resolved: 6 },
  { day: 'Wed', raised: 4, resolved: 5 },
  { day: 'Thu', raised: 12, resolved: 7 },
  { day: 'Fri', raised: 6, resolved: 8 },
  { day: 'Sat', raised: 3, resolved: 4 },
  { day: 'Sun', raised: 2, resolved: 2 },
];

export const recentActivityFeed = [
  { id: 1, employeeName: 'Rahul Verma', action: 'Downloaded 4.2 GB to external device', severity: 'Critical', timestamp: '2 mins ago' },
  { id: 3, employeeName: 'Sanjay Kumar', action: 'Admin access attempt blocked', severity: 'Urgent', timestamp: '1 hour ago' },
  { id: 4, employeeName: 'Vikram Singh', action: 'Bypassed dual-approval workflow', severity: 'Urgent', timestamp: '3 hours ago' },
  { id: 5, employeeName: 'Fatima Sheikh', action: 'Accessed 45 out-of-portfolio records', severity: 'Investigate', timestamp: '5 hours ago' },
  { id: 6, employeeName: 'Karthik Iyer', action: 'After-hours financial system access', severity: 'Investigate', timestamp: '8 hours ago' },
];

// Helper to generate employee-specific chart data
export function generateLoginHourData(empId: string) {
  const emp = employees.find(e => e.id === empId);
  const baseline = Array.from({ length: 24 }, (_, i) => {
    const isWorkHour = i >= 8 && i <= 18;
    return { hour: i, baseline: isWorkHour ? Math.floor(Math.random() * 5) + 2 : Math.floor(Math.random() * 2), current: 0 };
  });
  if (emp) {
    baseline[emp.lastLoginHour].current = Math.floor(Math.random() * 3) + 3;
    // Add some anomalous hours
    if (emp.riskScore > 50) {
      baseline[2].current = 3;
      baseline[23].current = 2;
      baseline[1].current = 2;
    }
    // Normal hours
    baseline[9].current = Math.floor(Math.random() * 4) + 3;
    baseline[10].current = Math.floor(Math.random() * 3) + 2;
    baseline[14].current = Math.floor(Math.random() * 3) + 2;
  }
  return baseline;
}

export function generateDailyAccessData() {
  return Array.from({ length: 14 }, (_, i) => ({
    day: `Day ${i + 1}`,
    baseline: Math.floor(Math.random() * 20) + 10,
    current: Math.floor(Math.random() * 40) + 5,
  }));
}

export function generateTransactionData() {
  return Array.from({ length: 14 }, (_, i) => ({
    day: `Day ${i + 1}`,
    baseline: Math.floor(Math.random() * 15) + 5,
    current: Math.floor(Math.random() * 25) + 3,
  }));
}

export function generateKeystrokeData() {
  return Array.from({ length: 7 }, (_, i) => ({
    day: `Day ${i + 1}`,
    score: Math.floor(Math.random() * 30) + 50,
  }));
}

export function generatePredictionTrajectory(empId: string) {
  const emp = employees.find(e => e.id === empId);
  const base = emp ? emp.riskScore : 30;
  return Array.from({ length: 60 }, (_, i) => ({
    day: i + 1,
    risk: Math.min(100, base + Math.floor(Math.random() * 15) - 5 + (i * 0.3)),
  }));
}
