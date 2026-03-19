import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Shield, Brain, Calendar, TrendingUp, Keyboard, Mouse, Loader2 } from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { useAppContext } from '@/context/AppContext';
import {
  generateLoginHourData, generateDailyAccessData, generateTransactionData,
  generateKeystrokeData, generatePredictionTrajectory
} from '@/data/mockData';

// Placeholder: paste your Anthropic API key here
const ANTHROPIC_API_KEY = '';

const chartTooltipStyle = {
  backgroundColor: 'rgba(6, 13, 31, 0.95)',
  border: '1px solid rgba(30, 91, 181, 0.3)',
  borderRadius: 12,
  color: '#F0F4FF',
};

export default function EmployeeProfile() {
  const { employees, selectedEmployeeId, setSelectedEmployeeId } = useAppContext();
  const navigate = useNavigate();
  const [aiText, setAiText] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const emp = employees.find(e => e.id === selectedEmployeeId);

  useEffect(() => {
    if (!emp) {
      if (employees.length > 0) setSelectedEmployeeId(employees[0].id);
    }
  }, [emp, employees, setSelectedEmployeeId]);

  const loginData = useMemo(() => emp ? generateLoginHourData(emp.id) : [], [emp?.id]);
  const accessData = useMemo(() => generateDailyAccessData(), [emp?.id]);
  const txData = useMemo(() => generateTransactionData(), [emp?.id]);
  const keystrokeData = useMemo(() => generateKeystrokeData(), [emp?.id]);
  const mouseData = useMemo(() => generateKeystrokeData(), [emp?.id]);
  const predictionData = useMemo(() => emp ? generatePredictionTrajectory(emp.id) : [], [emp?.id]);

  if (!emp) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <Shield className="h-12 w-12 mb-4 opacity-50" />
        <p className="text-lg">No employee selected</p>
        <button onClick={() => navigate('/employees')} className="mt-3 text-primary text-sm hover:underline">
          Go to Employee Monitor
        </button>
      </div>
    );
  }

  const riskColor = emp.riskScore > 70 ? '#E8201A' : emp.riskScore > 30 ? '#F59E0B' : '#10B981';
  const biometricVerdict = (score: number) => score > 70 ? 'Critical' : score > 50 ? 'Suspicious' : 'Normal';
  const verdictBadge = (score: number) => score > 70 ? 'badge-critical' : score > 50 ? 'badge-urgent' : 'badge-success';

  const forecast30 = Math.min(99, emp.predictionScore + Math.floor(Math.random() * 5));
  const forecast60 = Math.min(99, emp.predictionScore + Math.floor(Math.random() * 15));
  const forecastVerdict = emp.predictionScore > 75 ? 'Imminent Threat' : emp.predictionScore > 45 ? 'Elevated Threat' : 'Low Threat';
  const forecastVerdictBadge = emp.predictionScore > 75 ? 'badge-critical' : emp.predictionScore > 45 ? 'badge-urgent' : 'badge-success';

  const digitalRisk = emp.riskScore - emp.hrEvents.reduce((s, e) => s + e.riskContribution, 0);
  const hrRisk = emp.hrEvents.reduce((s, e) => s + e.riskContribution, 0);

  const typewriterEffect = (text: string) => {
    let i = 0;
    setAiText('');
    const interval = setInterval(() => {
      if (i < text.length) {
        setAiText(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        setAiGenerating(false);
      }
    }, 8);
  };

  const generateAIExplanation = async () => {
    setAiGenerating(true);
    setAiText('');
    setAiLoading(true);

    const prompt = `Analyze this bank employee for insider threat risk and return a structured assessment.

Employee Data:
- Name: ${emp.name}
- Role: ${emp.role}
- Risk Score: ${emp.riskScore}/100
- Anomalies Detected: ${emp.anomaliesDetected}
- HR Events: ${JSON.stringify(emp.hrEvents)}
- Keystroke Dynamics Score: ${emp.keystrokeDynamicsScore}
- Mouse Pattern Score: ${emp.mousePatternScore}
- Peer Deviation Score: ${emp.peerDeviationScore}%
- Prediction Score: ${emp.predictionScore}%

Respond with exactly these sections:
**Summary:** (one paragraph)
**Key Risk Indicators:**
• (bullet list of 4-5 indicators)
**HR Correlation Analysis:** (one paragraph)
**Peer Comparison:** (one paragraph)
**Recommended Actions:**
• (bullet list of 3-4 actions)`;

    if (ANTHROPIC_API_KEY) {
      try {
        abortRef.current = new AbortController();
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true',
          },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 1000,
            messages: [{ role: 'user', content: prompt }],
          }),
          signal: abortRef.current.signal,
        });

        setAiLoading(false);

        if (!response.ok) {
          const errText = await response.text();
          typewriterEffect(`**Error:** API request failed (${response.status}). ${errText.slice(0, 200)}`);
          return;
        }

        const data = await response.json();
        const text = data.content?.[0]?.text || 'No response received.';
        typewriterEffect(text);
      } catch (err: any) {
        setAiLoading(false);
        if (err.name === 'AbortError') return;
        typewriterEffect(`**Error:** Failed to connect to Claude API. ${err.message || ''}`);
      }
    } else {
      // Fallback: generate locally when no API key
      setAiLoading(false);
      const fullText = `**Summary:** ${emp.name} (${emp.role}, ${emp.department}) presents a ${emp.riskScore > 70 ? 'critical' : emp.riskScore > 40 ? 'moderate' : 'low'} risk profile with a score of ${emp.riskScore}/100.\n\n**Key Risk Indicators:**\n• Peer deviation score: ${emp.peerDeviationScore}% above department average\n• ${emp.anomaliesDetected} anomalies detected in recent activity\n• Keystroke dynamics score: ${emp.keystrokeDynamicsScore} — ${biometricVerdict(emp.keystrokeDynamicsScore)}\n• Mouse pattern score: ${emp.mousePatternScore} — ${biometricVerdict(emp.mousePatternScore)}\n\n**HR Correlation Analysis:**\n${emp.hrEvents.length > 0 ? emp.hrEvents.map(e => `• ${e.type} on ${e.date} contributes +${e.riskContribution} to risk score`).join('\n') : '• No significant HR events recorded'}\n\n**Peer Comparison:**\nCompared to peers in ${emp.department}, this employee shows ${emp.peerDeviationScore > 60 ? 'significant deviation' : emp.peerDeviationScore > 30 ? 'moderate deviation' : 'normal behavior patterns'} across key behavioral metrics. Prediction score of ${emp.predictionScore}% indicates ${emp.predictionScore > 75 ? 'imminent threat level' : emp.predictionScore > 45 ? 'elevated concern' : 'low risk trajectory'}.\n\n**Recommended Actions:**\n${emp.riskScore > 70 ? '• Immediate security review required\n• Restrict data access privileges\n• Schedule management interview\n• Initiate forensic audit of recent activities' : emp.riskScore > 40 ? '• Enhanced monitoring recommended\n• Review access logs weekly\n• Schedule routine check-in\n• Cross-reference with peer activity' : '• Continue standard monitoring\n• No immediate action required\n• Maintain regular review cycle'}`;
      typewriterEffect(fullText);
    }
  };

  // Semicircle gauge
  const gaugeAngle = (emp.riskScore / 100) * 180;

  const anomalyCards = [
    { label: 'Login Anomaly', score: Math.min(100, emp.riskScore + 5), desc: 'Deviation in login time and frequency patterns' },
    { label: 'Data Access', score: Math.min(100, emp.riskScore - 3), desc: 'Unusual volume or scope of data access' },
    { label: 'Transaction', score: Math.min(100, emp.riskScore + 2), desc: 'Transaction patterns outside normal range' },
    { label: 'Peer Deviation', score: emp.peerDeviationScore, desc: 'Behavioral divergence from peer group' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Section */}
      <div className="glass-card p-6 animate-fade-in-up">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="w-16 h-16 rounded-full avatar-gradient-1 flex items-center justify-center text-xl font-bold text-white" style={{ boxShadow: '0 0 0 3px rgba(30,91,181,0.5)' }}>
            {emp.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-foreground">{emp.name}</h2>
            <p className="text-sm text-muted-foreground">{emp.role} • {emp.department}</p>
            <span className={`inline-block mt-1 text-xs font-semibold ${emp.status === 'Active' ? 'badge-success' : emp.status === 'Flagged' ? 'badge-critical' : 'badge-urgent'}`}>
              {emp.status}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <svg viewBox="0 0 200 110" className="w-40">
              <defs>
                <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="50%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#E8201A" />
                </linearGradient>
              </defs>
              <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="rgba(30,91,181,0.1)" strokeWidth="12" strokeLinecap="round" />
              <path
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                stroke="url(#gaugeGradient)"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={`${(gaugeAngle / 180) * 251.2} 251.2`}
                className="transition-all duration-1000"
                style={{ filter: `drop-shadow(0 0 6px ${riskColor})` }}
              />
              <text x="100" y="90" textAnchor="middle" className={`text-3xl font-bold ${emp.riskScore > 70 ? 'pulse-glow-score' : ''}`} fill={riskColor} fontSize="28">
                {emp.riskScore}
              </text>
              <text x="100" y="108" textAnchor="middle" fill="#8BA3C7" fontSize="10">Risk Score</text>
            </svg>
          </div>
        </div>
      </div>

      {/* Behavior Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {[
          { title: 'Login Hour Distribution', data: loginData, type: 'bar', keys: ['baseline', 'current'], colors: ['#1E5BB5', '#E8201A'] },
          { title: 'Daily Data Access Volume', data: accessData, type: 'line', keys: ['baseline', 'current'], colors: ['#1E5BB5', '#E8201A'] },
          { title: 'Transaction Count / Day', data: txData, type: 'bar', keys: ['baseline', 'current'], colors: ['#1E5BB5', '#F59E0B'] },
        ].map((chart, idx) => (
          <div key={chart.title} className="glass-card p-4 animate-fade-in-up" style={{ animationDelay: `${0.1 + idx * 0.05}s` }}>
            <h3 className="text-sm font-semibold text-foreground mb-3">{chart.title}</h3>
            <ResponsiveContainer width="100%" height={180}>
              {chart.type === 'bar' ? (
                <BarChart data={chart.data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,91,181,0.08)" />
                  <XAxis dataKey={chart.data[0] && 'hour' in chart.data[0] ? 'hour' : 'day'} tick={{ fill: '#8BA3C7', fontSize: 10 }} />
                  <YAxis tick={{ fill: '#8BA3C7', fontSize: 10 }} />
                  <Tooltip contentStyle={chartTooltipStyle} />
                  <Legend />
                  <Bar dataKey={chart.keys[0]} fill={chart.colors[0]} name="Baseline" radius={[2, 2, 0, 0]} />
                  <Bar dataKey={chart.keys[1]} fill={chart.colors[1]} name="Current" radius={[2, 2, 0, 0]} />
                </BarChart>
              ) : (
                <LineChart data={chart.data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,91,181,0.08)" />
                  <XAxis dataKey="day" tick={{ fill: '#8BA3C7', fontSize: 10 }} />
                  <YAxis tick={{ fill: '#8BA3C7', fontSize: 10 }} />
                  <Tooltip contentStyle={chartTooltipStyle} />
                  <Legend />
                  <Line type="monotone" dataKey={chart.keys[0]} stroke={chart.colors[0]} strokeWidth={2.5} name="Baseline" dot={false} />
                  <Line type="monotone" dataKey={chart.keys[1]} stroke={chart.colors[1]} strokeWidth={2.5} name="Current" dot={false} />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        ))}
      </div>

      {/* Anomaly Breakdown */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {anomalyCards.map((card, idx) => {
          const barColor = card.score > 70 ? '#E8201A' : card.score > 30 ? '#F59E0B' : '#10B981';
          const glowClass = card.score > 70 ? 'glow-bar-red' : card.score > 30 ? 'glow-bar-amber' : 'glow-bar-green';
          return (
            <div key={card.label} className="glass-card p-4 animate-fade-in-up" style={{ animationDelay: `${0.2 + idx * 0.05}s` }}>
              <p className="text-xs text-muted-foreground mb-1">{card.label}</p>
              <p className="text-2xl font-bold" style={{ color: barColor }}>{card.score}</p>
              <div className="h-1.5 rounded-full mt-2 overflow-hidden" style={{ background: 'rgba(30,91,181,0.1)' }}>
                <div className={`h-full rounded-full animate-fill ${glowClass}`} style={{ width: `${card.score}%`, backgroundColor: barColor }} />
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">{card.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Behavioral Biometrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[
          { icon: Keyboard, label: 'Keystroke Dynamics', data: keystrokeData, score: emp.keystrokeDynamicsScore },
          { icon: Mouse, label: 'Mouse Movement Pattern', data: mouseData, score: emp.mousePatternScore },
        ].map((bio, idx) => (
          <div key={bio.label} className="glass-card p-4 animate-fade-in-up" style={{ animationDelay: `${0.3 + idx * 0.05}s` }}>
            <div className="flex items-center gap-2 mb-3">
              <bio.icon className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">{bio.label}</h3>
            </div>
            <ResponsiveContainer width="100%" height={100}>
              <LineChart data={bio.data}>
                <Line type="monotone" dataKey="score" stroke="#2E7BC4" strokeWidth={2.5} dot={{ r: 3, fill: '#2E7BC4' }} />
                <Tooltip contentStyle={chartTooltipStyle} />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-between mt-2">
              <span className="text-lg font-bold text-foreground">{bio.score}</span>
              <span className={`text-xs font-semibold ${verdictBadge(bio.score)}`}>
                {biometricVerdict(bio.score)}
              </span>
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground italic -mt-3 px-1">Behavioral pattern mismatch may indicate credential theft.</p>

      {/* HR Intelligence */}
      <div className="glass-card p-5 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary" /> Human Risk Intelligence
        </h3>
        {emp.hrEvents.length > 0 ? (
          <>
            <div className="relative border-l-2 ml-3 space-y-4" style={{ borderColor: 'rgba(30,91,181,0.15)' }}>
              {emp.hrEvents.map((ev, i) => (
                <div key={i} className="ml-6 relative">
                  <div className="absolute -left-[30px] top-1 w-3 h-3 rounded-full border-2 border-card" style={{ background: 'linear-gradient(135deg, #1A3B7A, #1E5BB5)' }} />
                  <p className="text-xs text-muted-foreground">{ev.date}</p>
                  <p className="text-sm font-medium text-foreground">{ev.type}</p>
                  <span className="badge-urgent text-xs">+{ev.riskContribution} risk</span>
                </div>
              ))}
            </div>
            <div className="mt-5 p-3 glass-inner flex items-center justify-center gap-3 text-sm">
              <span className="font-semibold text-foreground">Digital Risk: {Math.max(0, digitalRisk)}</span>
              <span className="text-muted-foreground">+</span>
              <span className="font-semibold" style={{ color: '#F59E0B' }}>HR Risk: {hrRisk}</span>
              <span className="text-muted-foreground">=</span>
              <span className="font-bold text-lg" style={{ color: riskColor }}>{emp.riskScore}</span>
            </div>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">No significant HR events recorded.</p>
        )}
      </div>

      {/* Predictive Forecast */}
      <div className="glass-card p-5 animate-fade-in-up" style={{ animationDelay: '0.45s' }}>
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" /> Predictive Threat Forecast
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="text-center p-3 glass-inner">
            <p className="text-xs text-muted-foreground">30-Day Probability</p>
            <p className="text-2xl font-bold gradient-text">{forecast30}%</p>
          </div>
          <div className="text-center p-3 glass-inner">
            <p className="text-xs text-muted-foreground">60-Day Probability</p>
            <p className="text-2xl font-bold gradient-text">{forecast60}%</p>
          </div>
          <div className="flex items-center justify-center">
            <span className={`px-4 py-2 text-sm font-bold ${forecastVerdictBadge}`}>{forecastVerdict}</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={150}>
          <AreaChart data={predictionData.slice(0, 30)}>
            <defs>
              <linearGradient id="predGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#E8201A" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#E8201A" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,91,181,0.08)" />
            <XAxis dataKey="day" tick={{ fill: '#8BA3C7', fontSize: 10 }} />
            <YAxis tick={{ fill: '#8BA3C7', fontSize: 10 }} domain={[0, 100]} />
            <Tooltip contentStyle={chartTooltipStyle} />
            <Area type="monotone" dataKey="risk" stroke="#E8201A" fill="url(#predGradient)" strokeWidth={2.5} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* AI Explanation */}
      <div className="glass-card p-5 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Brain className="h-4 w-4 text-primary" /> AI Explanation Panel
        </h3>
        <button
          onClick={generateAIExplanation}
          disabled={aiGenerating}
          className="btn-primary text-white px-4 py-2 text-sm font-medium disabled:opacity-50 mb-4 flex items-center gap-2"
        >
          {aiLoading ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Connecting to Claude...</>
          ) : aiGenerating ? (
            'Generating...'
          ) : (
            'Generate AI Explanation'
          )}
        </button>
        {aiText && (
          <div className={`text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed ${aiGenerating ? 'typewriter-cursor' : ''}`}>
            {aiText.split('\n').map((line, i) => {
              if (line.startsWith('**') && line.endsWith('**')) {
                return <p key={i} className="font-semibold text-foreground mt-3 mb-1">{line.replace(/\*\*/g, '')}</p>;
              }
              if (line.startsWith('• ')) {
                return <p key={i} className="ml-3">{line}</p>;
              }
              return <p key={i}>{line}</p>;
            })}
          </div>
        )}
      </div>
    </div>
  );
}
