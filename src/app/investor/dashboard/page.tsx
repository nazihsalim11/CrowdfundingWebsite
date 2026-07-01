"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useApp } from "@/context/AppContext";
import CustomSelect from "@/components/ui/select";
import SupportChat from "@/components/SupportChat";

function DashboardCalculator() {
  const [amount, setAmount] = useState(50000); // default ₹50,000
  const [projectType, setProjectType] = useState<'labs' | 'digital' | 'buses'>('labs');

  const roiRates = {
    labs: 0.10,   // 10%
    digital: 0.08, // 8%
    buses: 0.05    // 5%
  };

  const selectedRate = roiRates[projectType];
  const annualReturn = amount * selectedRate;
  const monthlyReturn = annualReturn / 12;
  const fiveYearReturn = annualReturn * 5;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '40px', alignItems: 'center' }}>
      <div>
        <div className="form-group" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <label className="label">Contribution Amount</label>
            <strong style={{ color: 'var(--primary)', fontSize: '1.1rem' }}>₹{amount.toLocaleString()}</strong>
          </div>
          <input 
            type="range" 
            min="5000" 
            max="1000000" 
            step="5000"
            value={amount} 
            onChange={(e) => setAmount(Number(e.target.value))}
            style={{ 
              width: '100%', 
              accentColor: 'var(--primary)',
              height: '6px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--bg-tertiary)',
              outline: 'none',
              cursor: 'pointer'
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '6px' }}>
            <span>₹5,000</span>
            <span>₹10,00,000</span>
          </div>
        </div>

        <div className="form-group">
          <label className="label" style={{ marginBottom: '8px' }}>Select Project Category</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={() => setProjectType('labs')} 
              className="btn" 
              style={{ 
                flex: 1, 
                fontSize: '0.85rem',
                backgroundColor: projectType === 'labs' ? 'var(--primary)' : 'var(--bg-tertiary)',
                color: projectType === 'labs' ? 'white' : 'var(--text-secondary)',
                border: 'none'
              }}
            >
              🖥️ Computer Labs (10%)
            </button>
            <button 
              onClick={() => setProjectType('digital')} 
              className="btn"
              style={{ 
                flex: 1, 
                fontSize: '0.85rem',
                backgroundColor: projectType === 'digital' ? 'var(--primary)' : 'var(--bg-tertiary)',
                color: projectType === 'digital' ? 'white' : 'var(--text-secondary)',
                border: 'none'
              }}
            >
              💻 Smart Classrooms (8%)
            </button>
            <button 
              onClick={() => setProjectType('buses')} 
              className="btn"
              style={{ 
                flex: 1, 
                fontSize: '0.85rem',
                backgroundColor: projectType === 'buses' ? 'var(--primary)' : 'var(--bg-tertiary)',
                color: projectType === 'buses' ? 'white' : 'var(--text-secondary)',
                border: 'none'
              }}
            >
              🚌 EV School Buses (5%)
            </button>
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: 'var(--bg-tertiary)', padding: '30px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
        <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>PROJECTED PAYOUTS</h4>
        
        <div style={{ marginBottom: '20px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', display: 'block', fontWeight: 600 }}>MONTHLY RETURN</span>
          <strong style={{ fontSize: '1.6rem', color: 'var(--text-primary)' }}>₹{Math.round(monthlyReturn).toLocaleString()}</strong>
        </div>
        <div style={{ marginBottom: '20px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', display: 'block', fontWeight: 600 }}>ANNUAL YIELD</span>
          <strong style={{ fontSize: '1.6rem', color: 'var(--text-primary)' }}>₹{Math.round(annualReturn).toLocaleString()}</strong>
        </div>
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', display: 'block', fontWeight: 600 }}>5-YEAR TOTAL PAYOUT</span>
          <strong style={{ fontSize: '1.8rem', color: 'var(--success)' }}>₹{Math.round(fiveYearReturn).toLocaleString()}</strong>
        </div>
      </div>
    </div>
  );
}

export default function InvestorDashboard() {
  const { 
    isLoggedIn, 
    role, 
    userEmail, 
    kycStatus, 
    walletBalance, 
    totalEarnings, 
    investments, 
    submitKyc,
    campaigns,
    withdrawals,
    requestWithdrawal
  } = useApp();

  const [activeTab, setActiveTab] = useState<"overview" | "portfolio" | "kyc" | "withdraw" | "calculator" | "messages">("overview");
  const [chartType, setChartType] = useState<"line" | "bar">("line");
  const [hoveredData, setHoveredData] = useState<{ label: string; value: string } | null>(null);

  // KYC Form State
  const [docType, setDocType] = useState("Aadhaar");
  const [docNumber, setDocNumber] = useState("");
  const [docFile, setDocFile] = useState("");

  // Bank Form State
  const [bankName, setBankName] = useState("State Bank of India");
  const [accountNum, setAccountNum] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [bankAdded, setBankAdded] = useState(false);

  // Withdrawal State
  const [withdrawAmount, setWithdrawAmount] = useState<number>(10000);

  if (!isLoggedIn || role !== "investor") {
    return (
      <>
        <Navbar />
        <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
          <h2>Access Denied</h2>
          <p style={{ margin: '16px 0 24px 0', color: 'var(--text-secondary)' }}>You must be logged in as an **Investor** to view this portal.</p>
          <Link href="/login" className="btn btn-primary">Go to Login</Link>
        </div>
        <Footer />
      </>
    );
  }

  const handleKycSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docNumber) {
      alert("Please enter document number.");
      return;
    }
    submitKyc({ docType, docNumber, file: docFile });
    alert("KYC documents submitted. Status is now PENDING administrator approval.");
  };

  const handleAddBank = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountNum || !ifsc) {
      alert("Please fill in bank account and IFSC code.");
      return;
    }
    setBankAdded(true);
    alert("Bank account linked successfully!");
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    if (withdrawAmount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }
    requestWithdrawal(withdrawAmount);
  };

  const totalInvested = investments.reduce((acc, inv) => acc + (inv.status === 'completed' ? inv.amount : 0), 0);

  return (
    <>
      <Navbar />

      <div className="dashboard-layout animate-fade-in">
        {/* Sidebar */}
        <aside className="sidebar">
          <div style={{ padding: '0 16px 20px 16px', borderBottom: '1px solid var(--border-color)', marginBottom: '16px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Investor Portal</span>
            <h4 style={{ fontSize: '0.98rem', marginTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{userEmail || "investor@seedglobal.com"}</h4>
          </div>

          <button 
            onClick={() => setActiveTab("overview")} 
            className={`sidebar-link ${activeTab === "overview" ? "active" : ""}`}
          >
            📊 Portfolio Summary
          </button>
          
          <button 
            onClick={() => setActiveTab("portfolio")} 
            className={`sidebar-link ${activeTab === "portfolio" ? "active" : ""}`}
          >
            📈 My Investments
          </button>

          <button 
            onClick={() => setActiveTab("calculator")} 
            className={`sidebar-link ${activeTab === "calculator" ? "active" : ""}`}
          >
            🧮 ROI Calculator
          </button>

          <button 
            onClick={() => setActiveTab("kyc")} 
            className={`sidebar-link ${activeTab === "kyc" ? "active" : ""}`}
          >
            🛡️ KYC & Verification
          </button>

          <button 
            onClick={() => setActiveTab("withdraw")} 
            className={`sidebar-link ${activeTab === "withdraw" ? "active" : ""}`}
          >
            💰 Withdrawal Requests
          </button>

          <button 
            onClick={() => setActiveTab("messages")} 
            className={`sidebar-link ${activeTab === "messages" ? "active" : ""}`}
          >
            💬 Support Chat
          </button>

          <div style={{ marginTop: 'auto', padding: '16px' }}>
            <Link href="/campaigns" className="btn btn-primary" style={{ width: '100%', padding: '8px 12px', fontSize: '0.85rem' }}>
              + Invest More
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="dashboard-content">
          
          {activeTab === "overview" && (
            <div>
              <div style={{ marginBottom: '30px' }}>
                <h1 style={{ fontSize: '2rem' }}>Investor Dashboard</h1>
                <p style={{ color: 'var(--text-secondary)', marginTop: '6px' }}>Real-time statistics of your crowdfunding investments.</p>
              </div>

              {/* Stats Widgets */}
              <div className="stats-grid">
                <div className="stat-card">
                  <span className="stat-lbl">Active Capital Invested</span>
                  <span className="stat-val" style={{ color: 'var(--primary)' }}>₹{totalInvested.toLocaleString()}</span>
                </div>
                <div className="stat-card">
                  <span className="stat-lbl">Total Profits Distributed</span>
                  <span className="stat-val" style={{ color: 'var(--success)' }}>₹{totalEarnings.toLocaleString()}</span>
                </div>
                <div className="stat-card">
                  <span className="stat-lbl">Simulated Bank Wallet</span>
                  <span className="stat-val" style={{ color: 'var(--secondary)' }}>₹{walletBalance.toLocaleString()}</span>
                </div>
                <div className="stat-card">
                  <span className="stat-lbl">KYC Status</span>
                  <div>
                    <span className={`badge ${
                      kycStatus === 'verified' ? 'badge-success' : 
                      kycStatus === 'pending' ? 'badge-warning' : 'badge-danger'
                    }`} style={{ fontSize: '0.85rem', padding: '6px 12px', marginTop: '4px' }}>
                      {kycStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Premium Portfolio Yield Performance Graph */}
              <div className="card" style={{ border: '1.5px solid var(--border-color)', marginBottom: '30px', padding: '30px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '15px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Portfolio Yield Performance</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '2px' }}>
                      {chartType === "line" ? "Cumulative ROI Growth trend line" : "Monthly payouts distribution history"}
                    </p>
                  </div>

                  {/* Chart Type Selector Switch */}
                  <div style={{ display: 'flex', gap: '8px', backgroundColor: 'var(--bg-tertiary)', padding: '4px', borderRadius: '8px' }}>
                    <button 
                      onClick={() => { setChartType("line"); setHoveredData(null); }}
                      className="btn" 
                      style={{ 
                        padding: '6px 12px', 
                        fontSize: '0.8rem', 
                        borderRadius: '6px',
                        border: 'none',
                        background: chartType === "line" ? '#ffffff' : 'transparent',
                        color: chartType === "line" ? 'var(--primary)' : 'var(--text-primary)',
                        boxShadow: chartType === "line" ? 'var(--shadow-sm)' : 'none',
                        fontWeight: 700
                      }}
                    >
                      Line Trend
                    </button>
                    <button 
                      onClick={() => { setChartType("bar"); setHoveredData(null); }}
                      className="btn" 
                      style={{ 
                        padding: '6px 12px', 
                        fontSize: '0.8rem', 
                        borderRadius: '6px',
                        border: 'none',
                        background: chartType === "bar" ? '#ffffff' : 'transparent',
                        color: chartType === "bar" ? 'var(--primary)' : 'var(--text-primary)',
                        boxShadow: chartType === "bar" ? 'var(--shadow-sm)' : 'none',
                        fontWeight: 700
                      }}
                    >
                      Bar Columns
                    </button>
                  </div>
                </div>

                {/* SVG Canvas Area */}
                <div style={{ position: 'relative', width: '100%', height: '240px', backgroundColor: '#fcfdfe', borderRadius: '12px', border: '1px solid var(--border-color)', padding: '20px 10px 10px 10px' }}>
                  
                  {/* Floating Interactive Tooltip */}
                  {hoveredData && (
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '16px',
                      backgroundColor: 'var(--bg-secondary)',
                      border: '1.5px solid var(--border-color)',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      boxShadow: 'var(--shadow-md)',
                      pointerEvents: 'none',
                      animation: 'fadeIn 0.15s ease-out',
                      zIndex: 10
                    }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>{hoveredData.label}</span>
                      <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--primary)' }}>{hoveredData.value}</span>
                    </div>
                  )}

                  {!hoveredData && (
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '16px',
                      fontSize: '0.8rem',
                      color: 'var(--text-tertiary)',
                      fontStyle: 'italic'
                    }}>
                      Hover points to inspect values
                    </div>
                  )}

                  {chartType === "line" ? (
                    <svg viewBox="0 0 600 200" width="100%" height="100%" style={{ overflow: 'visible' }}>
                      <defs>
                        <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.2" />
                          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
                        </linearGradient>
                      </defs>

                      {/* Grid Lines */}
                      <line x1="50" y1="30" x2="570" y2="30" stroke="#f1f5f9" strokeWidth="1.5" />
                      <line x1="50" y1="80" x2="570" y2="80" stroke="#f1f5f9" strokeWidth="1.5" />
                      <line x1="50" y1="130" x2="570" y2="130" stroke="#f1f5f9" strokeWidth="1.5" />
                      <line x1="50" y1="180" x2="570" y2="180" stroke="#cbd5e1" strokeWidth="1.5" />

                      {/* Y-Axis scale label */}
                      <text x="40" y="35" textAnchor="end" fill="var(--text-secondary)" style={{ fontSize: '0.72rem', fontWeight: 600 }}>₹40,000</text>
                      <text x="40" y="85" textAnchor="end" fill="var(--text-secondary)" style={{ fontSize: '0.72rem', fontWeight: 600 }}>₹25,000</text>
                      <text x="40" y="135" textAnchor="end" fill="var(--text-secondary)" style={{ fontSize: '0.72rem', fontWeight: 600 }}>₹10,000</text>
                      <text x="40" y="185" textAnchor="end" fill="var(--text-secondary)" style={{ fontSize: '0.72rem', fontWeight: 600 }}>₹0</text>

                      {/* Cumulative yield line path */}
                      <path 
                        d="M 50 180 Q 102 169 154 158 Q 206 146 258 135 Q 310 117 362 100 Q 414 75 466 50 Q 518 40 570 30" 
                        fill="none" 
                        stroke="var(--primary)" 
                        strokeWidth="3.5" 
                        strokeLinecap="round" 
                      />
                      
                      {/* Gradient fill area */}
                      <path 
                        d="M 50 180 Q 102 169 154 158 Q 206 146 258 135 Q 310 117 362 100 Q 414 75 466 50 Q 518 40 570 30 L 570 180 Z" 
                        fill="url(#lineGrad)" 
                      />

                      {/* Interactive Point circles */}
                      {[
                        { x: 50, y: 180, val: "₹0", label: "Initial deposit" },
                        { x: 154, y: 158, val: "₹5,000", label: "Month 1 payouts" },
                        { x: 258, y: 135, val: "₹12,000", label: "Month 2 payouts" },
                        { x: 362, y: 100, val: "₹22,000", label: "Month 3 payouts" },
                        { x: 466, y: 50, val: "₹35,000", label: "Month 4 payouts" },
                        { x: 570, y: 30, val: "₹42,000", label: "Month 5 payouts" }
                      ].map((pt, idx) => (
                        <circle 
                          key={idx}
                          cx={pt.x} 
                          cy={pt.y} 
                          r={idx === 5 ? "6" : "5"} 
                          fill="var(--secondary)" 
                          stroke="#ffffff" 
                          strokeWidth="2" 
                          style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}
                          onMouseEnter={() => setHoveredData({ label: pt.label, value: pt.val })}
                        />
                      ))}

                      {/* X-axis Month Labels */}
                      <text x="50" y="198" textAnchor="middle" fill="var(--text-secondary)" style={{ fontSize: '0.72rem', fontWeight: 600 }}>Start</text>
                      <text x="154" y="198" textAnchor="middle" fill="var(--text-secondary)" style={{ fontSize: '0.72rem', fontWeight: 600 }}>Month 1</text>
                      <text x="258" y="198" textAnchor="middle" fill="var(--text-secondary)" style={{ fontSize: '0.72rem', fontWeight: 600 }}>Month 2</text>
                      <text x="362" y="198" textAnchor="middle" fill="var(--text-secondary)" style={{ fontSize: '0.72rem', fontWeight: 600 }}>Month 3</text>
                      <text x="466" y="198" textAnchor="middle" fill="var(--text-secondary)" style={{ fontSize: '0.72rem', fontWeight: 600 }}>Month 4</text>
                      <text x="570" y="198" textAnchor="middle" fill="var(--text-secondary)" style={{ fontSize: '0.72rem', fontWeight: 600 }}>Month 5</text>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 600 200" width="100%" height="100%" style={{ overflow: 'visible' }}>
                      {/* Grid Lines */}
                      <line x1="50" y1="30" x2="570" y2="30" stroke="#f1f5f9" strokeWidth="1.5" />
                      <line x1="50" y1="80" x2="570" y2="80" stroke="#f1f5f9" strokeWidth="1.5" />
                      <line x1="50" y1="130" x2="570" y2="130" stroke="#f1f5f9" strokeWidth="1.5" />
                      <line x1="50" y1="180" x2="570" y2="180" stroke="#cbd5e1" strokeWidth="1.5" />

                      {/* Y-Axis scale label */}
                      <text x="40" y="35" textAnchor="end" fill="var(--text-secondary)" style={{ fontSize: '0.72rem', fontWeight: 600 }}>₹15,000</text>
                      <text x="40" y="85" textAnchor="end" fill="var(--text-secondary)" style={{ fontSize: '0.72rem', fontWeight: 600 }}>₹10,000</text>
                      <text x="40" y="135" textAnchor="end" fill="var(--text-secondary)" style={{ fontSize: '0.72rem', fontWeight: 600 }}>₹5,000</text>
                      <text x="40" y="185" textAnchor="end" fill="var(--text-secondary)" style={{ fontSize: '0.72rem', fontWeight: 600 }}>₹0</text>

                      {/* Columns */}
                      {[
                        { label: "January", val: "₹4,000", x: 90, height: 40, y: 140 },
                        { label: "February", val: "₹6,500", x: 190, height: 65, y: 115 },
                        { label: "March", val: "₹8,000", x: 290, height: 80, y: 100 },
                        { label: "April", val: "₹11,500", x: 390, height: 115, y: 65 },
                        { label: "May", val: "₹12,000", x: 490, height: 120, y: 60 }
                      ].map((col, idx) => (
                        <g key={idx}>
                          <rect 
                            x={col.x} 
                            y={col.y} 
                            width="40" 
                            height={col.height} 
                            rx="6" 
                            fill="var(--primary)" 
                            style={{ 
                              cursor: 'pointer', 
                              transition: 'all 0.2s ease-out'
                            }}
                            onMouseEnter={() => setHoveredData({ label: col.label + " Distribution", value: col.val })}
                          />
                          <text x={col.x + 20} y="198" textAnchor="middle" fill="var(--text-secondary)" style={{ fontSize: '0.72rem', fontWeight: 600 }}>{col.label.substring(0, 3)}</text>
                        </g>
                      ))}
                    </svg>
                  )}
                </div>
              </div>

              {/* Recent Investments */}
              <div className="card" style={{ border: '1.5px solid var(--border-color)' }}>
                <h3 style={{ marginBottom: '16px' }}>Recent Investments</h3>
                {investments.length > 0 ? (
                  <div className="table-container" style={{ marginTop: 0 }}>
                    <table>
                      <thead>
                        <tr>
                          <th>Campaign Name</th>
                          <th>Amount</th>
                          <th>Date</th>
                          <th>Method</th>
                          <th>ROI Earned</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {investments.map((inv) => (
                          <tr key={inv.id}>
                            <td style={{ fontWeight: 600 }}>{inv.campaignTitle}</td>
                            <td style={{ fontWeight: 700 }}>₹{inv.amount.toLocaleString()}</td>
                            <td>{inv.date}</td>
                            <td>{inv.paymentMethod}</td>
                            <td style={{ color: 'var(--success)', fontWeight: 600 }}>
                              +₹{inv.roiEarned.toLocaleString()}
                            </td>
                            <td>
                              <span className={`badge ${inv.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>
                                {inv.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p style={{ fontStyle: 'italic', color: 'var(--text-tertiary)', textAlign: 'center', padding: '20px' }}>
                    You have not made any investments yet.
                  </p>
                )}
              </div>
            </div>
          )}

          {activeTab === "portfolio" && (
            <div>
              <div style={{ marginBottom: '30px' }}>
                <h1 style={{ fontSize: '2rem' }}>Portfolio Breakdown</h1>
                <p style={{ color: 'var(--text-secondary)', marginTop: '6px' }}>Check transparency utilization reports of the campaigns you support.</p>
              </div>

              <div className="grid-2" style={{ marginTop: 0 }}>
                {investments.map((inv) => {
                  const camp = campaigns.find(c => c.id === inv.campaignId);
                  const progress = camp ? Math.min(100, Math.round((camp.raisedAmount / camp.goalAmount) * 100)) : 100;
                  return (
                    <div className="card" key={inv.id} style={{ border: '1px solid var(--border-color)' }}>
                      <span className="badge badge-info" style={{ position: 'absolute', top: '20px', right: '20px' }}>
                        {camp ? camp.type : "Education"}
                      </span>
                      <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>{inv.campaignTitle}</h3>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-tertiary)' }}>Invested: ₹{inv.amount.toLocaleString()} on {inv.date}</span>

                      <div style={{ marginTop: '20px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                          <span>Campaign Goal raised</span>
                          <strong>{progress}%</strong>
                        </div>
                        <div className="progress-track" style={{ height: '6px' }}>
                          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                        <Link href={`/campaigns/${inv.campaignId}`} className="btn btn-outline" style={{ flex: 1, padding: '8px', fontSize: '0.82rem' }}>
                          🔍 Audit expenses
                        </Link>
                        <button onClick={() => alert("Loading legal PDF agreement...")} className="btn btn-outline" style={{ flex: 1, padding: '8px', fontSize: '0.82rem' }}>
                          📄 Legal contract
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === "calculator" && (
            <div>
              <div style={{ marginBottom: '30px' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Projected Return Estimator</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '6px' }}>Select investment details to estimate your projected returns.</p>
              </div>

              <div className="card" style={{ border: '1px solid var(--border-color)' }}>
                <DashboardCalculator />
              </div>
            </div>
          )}

          {activeTab === "kyc" && (
            <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '30px' }}>
              {/* KYC Submission Card */}
              <div className="card" style={{ border: '1px solid var(--border-color)' }}>
                <h3 style={{ marginBottom: '16px' }}>Submit KYC Verification</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '20px' }}>
                  Aadhaar or PAN verification is required by financial regulations to support crowdfunding return distributions.
                </p>

                {kycStatus === 'verified' ? (
                  <div style={{ backgroundColor: 'rgba(22, 163, 74, 0.08)', color: 'var(--success)', padding: '16px', borderRadius: 'var(--radius-md)', fontWeight: 600 }}>
                    ✓ Your KYC has been approved and verified.
                  </div>
                ) : kycStatus === 'pending' ? (
                  <div style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)', padding: '16px', borderRadius: 'var(--radius-md)', fontWeight: 600 }}>
                    ⏳ Review is currently pending.
                  </div>
                ) : (
                  <form onSubmit={handleKycSubmit}>
                    <div className="form-group">
                      <label className="label">Verification Document Type</label>
                      <CustomSelect 
                        value={docType} 
                        onChange={setDocType} 
                        options={[
                          { label: "Aadhaar Card", value: "Aadhaar" },
                          { label: "PAN Card", value: "PAN" },
                          { label: "Passport", value: "Passport" }
                        ]}
                      />
                    </div>

                    <div className="form-group">
                      <label className="label">Document Identification Number</label>
                      <input 
                        type="text" 
                        value={docNumber} 
                        onChange={(e) => setDocNumber(e.target.value)} 
                        className="input" 
                        placeholder="Enter ID number" 
                      />
                    </div>

                    <div className="form-group">
                      <label className="label">Upload File Proof</label>
                      <input 
                        type="file" 
                        onChange={(e) => setDocFile(e.target.value)} 
                        className="input" 
                        id="kyc-file-input"
                      />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }} id="kyc-submit-btn">
                      Submit Verification
                    </button>
                  </form>
                )}
              </div>

              {/* Linked Bank Account Card */}
              <div className="card" style={{ border: '1px solid var(--border-color)' }}>
                <h3 style={{ marginBottom: '16px' }}>Linked Bank Account</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '20px' }}>
                  Provide your primary account details. ROI payout settlements will disburse directly to this account.
                </p>

                {bankAdded ? (
                  <div style={{ backgroundColor: 'var(--bg-tertiary)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '6px' }}>Account Linked Successfully</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Account Number: ************4821</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Bank: {bankName}</p>
                    <button onClick={() => setBankAdded(false)} className="btn btn-outline" style={{ width: '100%', marginTop: '16px', padding: '6px' }}>
                      Change Account
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleAddBank}>
                    <div className="form-group">
                      <label className="label">Select Bank Name</label>
                      <CustomSelect 
                        value={bankName} 
                        onChange={setBankName} 
                        options={[
                          { label: "State Bank of India", value: "State Bank of India" },
                          { label: "HDFC Bank", value: "HDFC Bank" },
                          { label: "ICICI Bank", value: "ICICI Bank" },
                          { label: "Axis Bank", value: "Axis Bank" }
                        ]}
                      />
                    </div>

                    <div className="form-group">
                      <label className="label">Account Number</label>
                      <input 
                        type="text" 
                        value={accountNum} 
                        onChange={(e) => setAccountNum(e.target.value)} 
                        className="input" 
                        placeholder="Enter account number" 
                      />
                    </div>

                    <div className="form-group">
                      <label className="label">IFSC Code</label>
                      <input 
                        type="text" 
                        value={ifsc} 
                        onChange={(e) => setIfsc(e.target.value)} 
                        className="input" 
                        placeholder="Enter IFSC code" 
                      />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }} id="bank-submit-btn">
                      Link Bank Account
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

          {activeTab === "withdraw" && (
            <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '30px' }}>
              <div className="card" style={{ border: '1px solid var(--border-color)' }}>
                <h3 style={{ marginBottom: '16px' }}>Request Payout</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '20px' }}>
                  Transfer your earned ROI profits from Seed Global wallet back to your linked bank account.
                </p>

                <form onSubmit={handleWithdraw}>
                  <div className="form-group">
                    <label className="label">Withdrawal Amount (₹)</label>
                    <input 
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                      className="input"
                      min="100"
                      id="withdraw-amount-input"
                    />
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
                      Withdrawable Profits: ₹{totalEarnings.toLocaleString()}
                    </span>
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: '100%' }} id="withdraw-submit-btn">
                    Initiate Withdrawal
                  </button>
                </form>
              </div>

              <div className="card" style={{ border: '1px solid var(--border-color)' }}>
                <h3 style={{ marginBottom: '16px' }}>Payout Transactions</h3>
                <div className="table-container" style={{ marginTop: 0 }}>
                  <table>
                    <thead>
                      <tr>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {withdrawals.map(wd => (
                        <tr key={wd.id}>
                          <td style={{ fontWeight: 700 }}>₹{wd.amount.toLocaleString()}</td>
                          <td>{wd.date}</td>
                          <td>
                            <span className={`badge ${
                              wd.status === 'completed' ? 'badge-success' :
                              wd.status === 'rejected' ? 'badge-danger' : 'badge-warning'
                            }`}>
                              {wd.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "messages" && (
            <div>
              <div style={{ marginBottom: '30px' }}>
                <h1 style={{ fontSize: '2rem' }}>Helpdesk Support Chat</h1>
                <p style={{ color: 'var(--text-secondary)', marginTop: '6px' }}>Direct messaging channel with Seed Global Super Admins.</p>
              </div>
              <SupportChat mode="investor" />
            </div>
          )}

        </main>
      </div>

      <Footer />
    </>
  );
}
