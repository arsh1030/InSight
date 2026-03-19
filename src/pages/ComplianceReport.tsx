import { useState } from 'react';
import { FileText, Eye as EyeIcon, X, Download } from 'lucide-react';
import { complianceIncidents, employees } from '@/data/mockData';

export default function ComplianceReport() {
  const [incidents, setIncidents] = useState(complianceIncidents.map(i => ({ ...i, generated: false })));
  const [reportModal, setReportModal] = useState<string | null>(null);

  const modalIncident = reportModal ? incidents.find(i => i.id === reportModal) : null;
  const modalEmp = modalIncident ? employees.find(e => e.id === modalIncident.employeeId) : null;

  const handleGenerate = (id: string) => {
    setIncidents(prev => prev.map(i => i.id === id ? { ...i, generated: true, status: 'Generated' } : i));
    setReportModal(id);
  };

  const statusBadge = (status: string) => {
    if (status === 'Generated') return 'badge-generated';
    if (status === 'Resolved') return 'badge-success';
    if (status === 'Under Review') return 'badge-urgent';
    return 'badge-critical';
  };

  const now = new Date();
  const reportDate = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
  const reportTime = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

  return (
    <div className="space-y-6">
      <div className="glass-card overflow-hidden animate-fade-in-up">
        <table className="w-full text-sm">
          <thead className="glass-thead">
            <tr>
              <th className="text-left py-3 px-4 font-medium">ID</th>
              <th className="text-left py-3 px-4 font-medium">Employee</th>
              <th className="text-left py-3 px-4 font-medium">Date</th>
              <th className="text-left py-3 px-4 font-medium">Severity</th>
              <th className="text-left py-3 px-4 font-medium">Department</th>
              <th className="text-left py-3 px-4 font-medium">Status</th>
              <th className="text-center py-3 px-4 font-medium">Report</th>
            </tr>
          </thead>
          <tbody className="glass-tbody">
            {incidents.map(inc => (
              <tr key={inc.id}>
                <td className="py-3 px-4 font-mono text-foreground">{inc.id}</td>
                <td className="py-3 px-4 font-medium text-foreground">{inc.employeeName}</td>
                <td className="py-3 px-4 text-muted-foreground">{inc.date}</td>
                <td className="py-3 px-4">
                  <span className={`text-xs font-semibold ${inc.severity === 'Critical' ? 'badge-critical' : inc.severity === 'High' ? 'badge-urgent' : 'badge-investigate'}`}>
                    {inc.severity}
                  </span>
                </td>
                <td className="py-3 px-4 text-muted-foreground">{inc.department}</td>
                <td className="py-3 px-4">
                  <span className={`text-xs font-semibold ${statusBadge(inc.status)}`}>{inc.status}</span>
                </td>
                <td className="py-3 px-4 text-center">
                  <button
                    onClick={() => inc.generated ? setReportModal(inc.id) : handleGenerate(inc.id)}
                    className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-accent transition-colors duration-200"
                  >
                    {inc.generated ? <><EyeIcon className="h-3 w-3" /> View</> : <><FileText className="h-3 w-3" /> Generate</>}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Full-screen Report Modal */}
      {modalIncident && modalEmp && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-start justify-center overflow-y-auto py-6 px-4" onClick={() => setReportModal(null)}>
          <div className="glass-modal max-w-3xl w-full p-8 my-auto" onClick={e => e.stopPropagation()}>
            {/* Report Header */}
            <div className="flex items-start justify-between mb-6 pb-5 border-b" style={{ borderColor: 'rgba(30,91,181,0.15)' }}>
              <div className="flex items-center gap-3">
                <EyeIcon className="h-8 w-8 text-primary breathing-glow" />
                <div>
                  <h2 className="text-xl font-bold gradient-text">InSight — Compliance Report</h2>
                  <p className="text-xs text-muted-foreground">AI-Powered Insider Threat Detection Platform</p>
                  <p className="text-xs text-muted-foreground mt-1">Generated: {reportDate} at {reportTime}</p>
                </div>
              </div>
              <button onClick={() => setReportModal(null)} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6 text-sm">
              {/* Incident Reference */}
              <section>
                <h3 className="font-semibold text-foreground text-base mb-2">1. Incident Reference</h3>
                <div className="glass-inner p-4 space-y-1">
                  <p><span className="text-muted-foreground">Incident ID:</span> <span className="text-foreground font-mono font-bold">{modalIncident.id}</span></p>
                  <p><span className="text-muted-foreground">Date of Incident:</span> <span className="text-foreground">{modalIncident.date}</span></p>
                  <p><span className="text-muted-foreground">Classification:</span> <span className="text-foreground font-semibold">{modalIncident.severity}</span></p>
                  <p><span className="text-muted-foreground">Department:</span> <span className="text-foreground">{modalIncident.department}</span></p>
                </div>
              </section>

              <section>
                <h3 className="font-semibold text-foreground text-base mb-2">2. Executive Summary</h3>
                <div className="glass-inner p-4">
                  <p className="text-muted-foreground leading-relaxed">
                    This report documents a {modalIncident.severity.toLowerCase()}-severity insider threat incident involving {modalEmp.name} ({modalEmp.role}) in the {modalIncident.department} department. {modalIncident.description} The InSight AI engine detected {modalEmp.anomaliesDetected} behavioral anomalies with a composite risk score of {modalEmp.riskScore}/100, triggering automated compliance review protocols under the RBI Cybersecurity Framework 2021.
                  </p>
                </div>
              </section>

              <section>
                <h3 className="font-semibold text-foreground text-base mb-2">3. Employee Details</h3>
                <div className="glass-inner p-4">
                  <table className="w-full text-sm">
                    <tbody>
                      {[
                        ['Full Name', modalEmp.name],
                        ['Designation', modalEmp.role],
                        ['Department', modalEmp.department],
                        ['Employee ID', modalEmp.id],
                        ['Current Status', modalEmp.status],
                        ['Risk Score', `${modalEmp.riskScore}/100`],
                        ['Last System Login', modalEmp.lastLogin],
                        ['Peer Deviation Score', `${modalEmp.peerDeviationScore}%`],
                        ['Dark Web Exposure', modalEmp.credentialsBreached ? 'Confirmed' : 'None Detected'],
                      ].map(([label, val]) => (
                        <tr key={label} className="border-b last:border-0" style={{ borderColor: 'rgba(30,91,181,0.08)' }}>
                          <td className="py-1.5 text-muted-foreground w-1/3">{label}</td>
                          <td className="py-1.5 text-foreground font-medium">{val}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section>
                <h3 className="font-semibold text-foreground text-base mb-2">4. Chronological Anomaly Evidence</h3>
                <div className="space-y-2">
                  {modalIncident.anomalies.map((a, i) => (
                    <div key={i} className="flex items-center gap-3 glass-inner p-3">
                      <span className="text-xs font-bold badge-investigate">{i + 1}</span>
                      <span className="text-foreground flex-1">{a.type}</span>
                      <span className="text-xs text-muted-foreground font-mono">{a.timestamp}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="font-semibold text-foreground text-base mb-2">5. Behavioral Analysis</h3>
                <div className="glass-inner p-4 text-muted-foreground leading-relaxed">
                  <p>Behavioral biometric analysis reveals a keystroke dynamics score of {modalEmp.keystrokeDynamicsScore} and mouse movement pattern score of {modalEmp.mousePatternScore}. {modalEmp.keystrokeDynamicsScore > 60 || modalEmp.mousePatternScore > 60 ? 'These scores indicate significant deviation from established behavioral baselines, potentially suggesting credential sharing or unauthorized account usage.' : 'These scores are within acceptable parameters, indicating consistent user behavior patterns.'} The employee demonstrates a {modalEmp.peerDeviationScore}% deviation from department peer group averages, which is classified as {modalEmp.peerDeviationScore > 60 ? 'critical outlier behavior' : modalEmp.peerDeviationScore > 30 ? 'moderately elevated' : 'within normal range'}.</p>
                </div>
              </section>

              <section>
                <h3 className="font-semibold text-foreground text-base mb-2">6. HR Correlation</h3>
                <div className="glass-inner p-4">
                  {modalEmp.hrEvents.length > 0 ? (
                    <ul className="space-y-1.5 text-muted-foreground">
                      {modalEmp.hrEvents.map((ev, i) => (
                        <li key={i}>• <span className="text-foreground font-medium">{ev.type}</span> on {ev.date} — Risk contribution: <span className="font-semibold" style={{ color: '#F59E0B' }}>+{ev.riskContribution}</span></li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground">No relevant HR events found in the employee record.</p>
                  )}
                </div>
              </section>

              <section>
                <h3 className="font-semibold text-foreground text-base mb-2">7. AI Risk Assessment</h3>
                <div className="glass-inner p-4 text-muted-foreground leading-relaxed">
                  <p>The InSight AI engine has classified this incident as <strong className="text-foreground">{modalIncident.severity}</strong> based on multi-factor behavioral analysis. The composite risk score of {modalEmp.riskScore}/100 incorporates peer group deviation ({modalEmp.peerDeviationScore}%), predictive threat score ({modalEmp.predictionScore}%), and {modalEmp.anomaliesDetected} detected anomalies. {modalEmp.credentialsBreached ? 'Confirmed dark web credential exposure significantly elevates the overall threat assessment and necessitates immediate remediation.' : 'No dark web credential exposure has been detected at this time.'} The 30-day predictive model indicates a {modalEmp.predictionScore > 75 ? 'high' : modalEmp.predictionScore > 45 ? 'moderate' : 'low'} probability of escalated threat activity.</p>
                </div>
              </section>

              <section>
                <h3 className="font-semibold text-foreground text-base mb-2">8. Actions Taken</h3>
                <div className="glass-inner p-4 text-muted-foreground">
                  <ul className="space-y-1.5">
                    <li>• Automated behavioral monitoring escalated to real-time tracking</li>
                    <li>• Incident flagged in InSight AI threat dashboard</li>
                    <li>• Compliance report auto-generated for regulatory review</li>
                    {modalEmp.riskScore > 70 && <li>• Data access privileges recommended for immediate restriction</li>}
                    {modalEmp.credentialsBreached && <li>• Forced credential reset initiated via security team</li>}
                    <li>• Incident assigned to compliance officer for manual review</li>
                  </ul>
                </div>
              </section>

              <section>
                <h3 className="font-semibold text-foreground text-base mb-2">9. Regulatory References</h3>
                <div className="glass-inner p-4 text-muted-foreground">
                  <p className="mb-2">This report is prepared in compliance with:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li><strong className="text-foreground">RBI Cybersecurity Framework 2021 — Section 4.2</strong>: Insider Threat Detection and Monitoring Requirements</li>
                    <li><strong className="text-foreground">RBI Cybersecurity Framework 2021 — Section 7.1</strong>: Incident Reporting and Documentation Obligations</li>
                    <li>RBI Master Direction on IT Governance — Section 8.3</li>
                    <li>CERT-In Reporting Guidelines — Incident Category 3</li>
                  </ul>
                </div>
              </section>

              <section className="border-t pt-5" style={{ borderColor: 'rgba(30,91,181,0.15)' }}>
                <div className="glass-inner p-4 space-y-3">
                  <div>
                    <p className="text-muted-foreground text-xs">Prepared By</p>
                    <p className="text-foreground font-semibold">InSight AI System — Automated Compliance Engine v2.1</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Digital Signature</p>
                    <p className="text-foreground font-mono text-xs border-b border-dashed pb-3 mt-1" style={{ borderColor: 'rgba(30,91,181,0.3)' }}>
                      ________________________________________<br />
                      Authorized Signatory — [Name & Designation]
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground italic">This document is system-generated and constitutes an official compliance record under the InSight platform governance framework.</p>
                </div>
              </section>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setReportModal(null)}
                  className="btn-ghost text-muted-foreground hover:text-foreground px-4 py-2 text-sm font-medium"
                >
                  Close
                </button>
                <button
                  onClick={() => alert('PDF download feature coming in v3.0')}
                  className="flex items-center gap-1.5 btn-primary text-white px-4 py-2 text-sm font-medium"
                >
                  <Download className="h-4 w-4" /> Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
