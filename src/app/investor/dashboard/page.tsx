"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useApp } from "@/context/AppContext";
import CustomSelect from "@/components/ui/select";
import SupportChat from "@/components/SupportChat";

function DashboardCalculator() {
  const [amount, setAmount] = useState(50000); // default ₹50,000
  const [projectType, setProjectType] = useState<'labs' | 'digital' | 'buses'>('labs');
  const { roiRates } = useApp();

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
              🖥️ Computer Labs ({Math.round(roiRates.labs * 100)}%)
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
              💻 Smart Classrooms ({Math.round(roiRates.digital * 100)}%)
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
              🚌 EV School Buses ({Math.round(roiRates.buses * 100)}%)
            </button>
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: 'var(--bg-tertiary)', padding: '30px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
        <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>PROJECTED PAYOUTS</h4>
        
        <div style={{ marginBottom: '20px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', display: 'block', fontWeight: 200 }}>MONTHLY RETURN</span>
          <strong style={{ fontSize: '1.6rem', color: 'var(--text-primary)' }}>₹{Math.round(monthlyReturn).toLocaleString()}</strong>
        </div>
        <div style={{ marginBottom: '20px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', display: 'block', fontWeight: 200 }}>ANNUAL YIELD</span>
          <strong style={{ fontSize: '1.6rem', color: 'var(--text-primary)' }}>₹{Math.round(annualReturn).toLocaleString()}</strong>
        </div>
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', display: 'block', fontWeight: 200 }}>5-YEAR TOTAL PAYOUT</span>
          <strong style={{ fontSize: '1.8rem', color: 'var(--success)' }}>₹{Math.round(fiveYearReturn).toLocaleString()}</strong>
        </div>
      </div>
    </div>
  );
}

function TaxCalculator({ investments, campaigns }: { investments: any[], campaigns: any[] }) {
  const [donationAmt, setDonationAmt] = useState(50000);
  const [incomeSlab, setIncomeSlab] = useState<'5' | '20' | '30'>('20');
  const taxRate = Number(incomeSlab) / 100;
  const deductible = Math.min(donationAmt, donationAmt); // 50% of donation (50% deduction)
  const taxSaved = Math.round(deductible * 0.5 * taxRate);
  const effectiveCost = donationAmt - taxSaved;

  return (
    <div className="card" style={{ border: '1px solid var(--border-color)' }}>
      <h3 style={{ marginBottom: '16px' }}>80G Tax Savings Estimator</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '30px', alignItems: 'start' }}>
        <div>
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label className="label">Donation / Investment Amount</label>
              <strong style={{ color: 'var(--primary)' }}>₹{donationAmt.toLocaleString()}</strong>
            </div>
            <input type="range" min="1000" max="500000" step="1000" value={donationAmt}
              onChange={(e) => setDonationAmt(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--primary)', height: '6px' }}/>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '4px' }}>
              <span>₹1,000</span><span>₹5,00,000</span>
            </div>
          </div>
          <div className="form-group">
            <label className="label" style={{ marginBottom: '8px' }}>Your Income Tax Slab</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {(['5', '20', '30'] as const).map(slab => (
                <button key={slab} onClick={() => setIncomeSlab(slab)}
                  className="btn"
                  style={{ flex: 1, fontSize: '0.85rem',
                    backgroundColor: incomeSlab === slab ? 'var(--primary)' : 'var(--bg-tertiary)',
                    color: incomeSlab === slab ? 'white' : 'var(--text-secondary)', border: 'none' }}
                >{slab}% Slab</button>
              ))}
            </div>
          </div>
        </div>
        <div style={{ backgroundColor: 'var(--bg-tertiary)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
          <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>SAVINGS BREAKDOWN</h4>
          <div style={{ marginBottom: '12px' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', display: 'block', fontWeight: 200 }}>DONATION AMOUNT</span>
            <strong style={{ fontSize: '1.4rem' }}>₹{donationAmt.toLocaleString()}</strong>
          </div>
          <div style={{ marginBottom: '12px' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', display: 'block', fontWeight: 200 }}>80G DEDUCTIBLE (50%)</span>
            <strong style={{ fontSize: '1.4rem' }}>₹{Math.round(donationAmt * 0.5).toLocaleString()}</strong>
          </div>
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', display: 'block', fontWeight: 200 }}>TAX SAVED</span>
            <strong style={{ fontSize: '1.8rem', color: 'var(--success)' }}>₹{taxSaved.toLocaleString()}</strong>
          </div>
          <div style={{ marginTop: '12px', padding: '10px', background: 'rgba(16,185,129,0.1)', borderRadius: '8px', fontSize: '0.82rem', color: 'var(--success)', fontWeight: 200 }}>
            Effective cost after tax: ₹{effectiveCost.toLocaleString()}
          </div>
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
    requestWithdrawal,
    announcements,
    username,
    password,
    updateProfile,
    requestPasswordReset,
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    impactReports,
    investmentPrograms,
    programInvestments
  } = useApp();

  const [activeTab, setActiveTab] = useState<"overview" | "portfolio" | "kyc" | "withdraw" | "calculator" | "messages" | "announcements" | "profile" | "watchlist" | "tax" | "impact">("overview");
  const [expandedWatchCamp, setExpandedWatchCamp] = useState<string | null>(null);
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

  // Profile Form State
  const [editUsername, setEditUsername] = useState(username);
  const [editEmail, setEditEmail] = useState(userEmail || "investor@seedglobal.com");

  // Password Modal State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [prevPasswordInput, setPrevPasswordInput] = useState("");
  const [newPasswordInput, setNewPasswordInput] = useState("");
  const [confirmPasswordInput, setConfirmPasswordInput] = useState("");

  useEffect(() => {
    setEditUsername(username);
    setEditEmail(userEmail || "investor@seedglobal.com");
  }, [username, userEmail]);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUsername.trim()) {
      alert("Username cannot be empty.");
      return;
    }
    if (!editEmail.trim()) {
      alert("Email cannot be empty.");
      return;
    }
    updateProfile(editUsername, editEmail);
    alert("Profile updated successfully!");
  };

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prevPasswordInput !== password) {
      alert("Previous password does not match your current password.");
      return;
    }
    if (!newPasswordInput.trim()) {
      alert("New password cannot be empty.");
      return;
    }
    if (newPasswordInput !== confirmPasswordInput) {
      alert("New passwords do not match.");
      return;
    }
    updateProfile(username, userEmail, newPasswordInput);
    alert("Password changed successfully!");
    setPrevPasswordInput("");
    setNewPasswordInput("");
    setConfirmPasswordInput("");
    setIsPasswordModalOpen(false);
  };

  const handleForgotPasswordRequest = () => {
    requestPasswordReset(userEmail || "investor@seedglobal.com", username);
    alert("Your forgot password request has been sent to the Admin. Please wait for verification and approval.");
    setPrevPasswordInput("");
    setNewPasswordInput("");
    setConfirmPasswordInput("");
    setIsPasswordModalOpen(false);
  };

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

  const totalCampaignInvested = investments.reduce((acc, inv) => acc + (inv.status === 'completed' ? inv.amount : 0), 0);
  const totalProgramInvested = programInvestments ? programInvestments.filter(inv => inv.investorEmail === userEmail && inv.paymentStatus === 'completed').reduce((acc, inv) => acc + inv.amountInvested, 0) : 0;
  const totalInvested = totalCampaignInvested + totalProgramInvested;
  const totalUnitsOwned = programInvestments ? programInvestments.filter(inv => inv.investorEmail === userEmail && inv.paymentStatus === 'completed').reduce((acc, inv) => acc + inv.unitsPurchased, 0) : 0;

  return (
    <>
      <Navbar />

      <div className="dashboard-layout animate-fade-in">
        {/* Sidebar */}
        <aside className="sidebar">
          <div style={{ padding: '0 16px 20px 16px', borderBottom: '1px solid var(--border-color)', marginBottom: '16px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 200, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Investor Portal</span>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 200, marginTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{username}</h4>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis' }}>{userEmail || "investor@seedglobal.com"}</span>
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
            onClick={() => setActiveTab("announcements")} 
            className={`sidebar-link ${activeTab === "announcements" ? "active" : ""}`}
          >
            📪 School Announcements
          </button>

          <button 
            onClick={() => setActiveTab("watchlist")} 
            className={`sidebar-link ${activeTab === "watchlist" ? "active" : ""}`}
          >
            🔖 Campaign Watchlist
            {watchlist.length > 0 && (
              <span className="badge badge-info" style={{ marginLeft: 'auto', fontSize: '0.7rem', padding: '2px 6px' }}>{watchlist.length}</span>
            )}
          </button>

          <button 
            onClick={() => setActiveTab("tax")} 
            className={`sidebar-link ${activeTab === "tax" ? "active" : ""}`}
          >
            💰 Tax Benefit (80G)
          </button>

          <button 
            onClick={() => setActiveTab("impact")} 
            className={`sidebar-link ${activeTab === "impact" ? "active" : ""}`}
          >
            🌱 My Impact
          </button>

          <button 
            onClick={() => setActiveTab("messages")} 
            className={`sidebar-link ${activeTab === "messages" ? "active" : ""}`}
          >
            💬 Support Chat
          </button>

          <button 
            onClick={() => setActiveTab("profile")} 
            className={`sidebar-link ${activeTab === "profile" ? "active" : ""}`}
          >
            👤 Customize Profile
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
                <div>
                  <h1 style={{ fontSize: '2rem' }}>Investor Dashboard</h1>
                  <p style={{ color: 'var(--text-secondary)', marginTop: '6px' }}>Real-time statistics of your school investments.</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>KYC Status:</span>
                  <span className={`badge ${
                    kycStatus === 'verified' ? 'badge-success' : 
                    kycStatus === 'pending' ? 'badge-warning' : 'badge-danger'
                  }`} style={{ fontSize: '0.82rem', padding: '5px 10px', textTransform: 'capitalize' }}>
                    {kycStatus}
                  </span>
                </div>
              </div>

              {/* Stats Widgets */}
              <div className="stats-grid">
                <div className="stat-card">
                  <span className="stat-lbl">Active Capital Invested</span>
                  <span className="stat-val" style={{ color: 'var(--primary)' }}>₹{totalInvested.toLocaleString()}</span>
                </div>
                <div className="stat-card">
                  <span className="stat-lbl">Program Units Owned</span>
                  <span className="stat-val" style={{ color: 'var(--secondary)' }}>{totalUnitsOwned} unit{totalUnitsOwned !== 1 ? 's' : ''}</span>
                </div>
                <div className="stat-card">
                  <span className="stat-lbl">Total Profits Distributed</span>
                  <span className="stat-val" style={{ color: 'var(--success)' }}>₹{totalEarnings.toLocaleString()}</span>
                </div>
                <div className="stat-card">
                  <span className="stat-lbl">Simulated Bank Wallet</span>
                  <span className="stat-val" style={{ color: 'var(--secondary)' }}>₹{walletBalance.toLocaleString()}</span>
                </div>
              </div>

              {/* Premium Portfolio Yield Performance Graph */}
              <div className="card" style={{ border: '1.5px solid var(--border-color)', marginBottom: '30px', padding: '30px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '15px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 200 }}>Portfolio Yield Performance</h3>
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
                        fontWeight: 200
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
                        fontWeight: 200
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
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 200, display: 'block' }}>{hoveredData.label}</span>
                      <span style={{ fontSize: '0.95rem', fontWeight: 200, color: 'var(--primary)' }}>{hoveredData.value}</span>
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
                      <text x="40" y="35" textAnchor="end" fill="var(--text-secondary)" style={{ fontSize: '0.72rem', fontWeight: 200 }}>₹40,000</text>
                      <text x="40" y="85" textAnchor="end" fill="var(--text-secondary)" style={{ fontSize: '0.72rem', fontWeight: 200 }}>₹25,000</text>
                      <text x="40" y="135" textAnchor="end" fill="var(--text-secondary)" style={{ fontSize: '0.72rem', fontWeight: 200 }}>₹10,000</text>
                      <text x="40" y="185" textAnchor="end" fill="var(--text-secondary)" style={{ fontSize: '0.72rem', fontWeight: 200 }}>₹0</text>

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
                      <text x="50" y="198" textAnchor="middle" fill="var(--text-secondary)" style={{ fontSize: '0.72rem', fontWeight: 200 }}>Start</text>
                      <text x="154" y="198" textAnchor="middle" fill="var(--text-secondary)" style={{ fontSize: '0.72rem', fontWeight: 200 }}>Month 1</text>
                      <text x="258" y="198" textAnchor="middle" fill="var(--text-secondary)" style={{ fontSize: '0.72rem', fontWeight: 200 }}>Month 2</text>
                      <text x="362" y="198" textAnchor="middle" fill="var(--text-secondary)" style={{ fontSize: '0.72rem', fontWeight: 200 }}>Month 3</text>
                      <text x="466" y="198" textAnchor="middle" fill="var(--text-secondary)" style={{ fontSize: '0.72rem', fontWeight: 200 }}>Month 4</text>
                      <text x="570" y="198" textAnchor="middle" fill="var(--text-secondary)" style={{ fontSize: '0.72rem', fontWeight: 200 }}>Month 5</text>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 600 200" width="100%" height="100%" style={{ overflow: 'visible' }}>
                      {/* Grid Lines */}
                      <line x1="50" y1="30" x2="570" y2="30" stroke="#f1f5f9" strokeWidth="1.5" />
                      <line x1="50" y1="80" x2="570" y2="80" stroke="#f1f5f9" strokeWidth="1.5" />
                      <line x1="50" y1="130" x2="570" y2="130" stroke="#f1f5f9" strokeWidth="1.5" />
                      <line x1="50" y1="180" x2="570" y2="180" stroke="#cbd5e1" strokeWidth="1.5" />

                      {/* Y-Axis scale label */}
                      <text x="40" y="35" textAnchor="end" fill="var(--text-secondary)" style={{ fontSize: '0.72rem', fontWeight: 200 }}>₹15,000</text>
                      <text x="40" y="85" textAnchor="end" fill="var(--text-secondary)" style={{ fontSize: '0.72rem', fontWeight: 200 }}>₹10,000</text>
                      <text x="40" y="135" textAnchor="end" fill="var(--text-secondary)" style={{ fontSize: '0.72rem', fontWeight: 200 }}>₹5,000</text>
                      <text x="40" y="185" textAnchor="end" fill="var(--text-secondary)" style={{ fontSize: '0.72rem', fontWeight: 200 }}>₹0</text>

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
                          <text x={col.x + 20} y="198" textAnchor="middle" fill="var(--text-secondary)" style={{ fontSize: '0.72rem', fontWeight: 200 }}>{col.label.substring(0, 3)}</text>
                        </g>
                      ))}
                    </svg>
                  )}
                </div>
              </div>

              {/* Recent Investments & Purchases */}
              <div className="card" style={{ border: '1.5px solid var(--border-color)', marginBottom: '30px' }}>
                <h3 style={{ marginBottom: '20px', fontWeight: 200 }}>💼 Program Unit Purchases</h3>
                {(() => {
                  const myProgramInvs = programInvestments ? programInvestments.filter(inv => inv.investorEmail === userEmail) : [];
                  return myProgramInvs.length > 0 ? (
                    <div className="table-container" style={{ marginTop: 0, marginBottom: '30px' }}>
                      <table>
                        <thead>
                          <tr>
                            <th>Program Title</th>
                            <th>Units Purchased</th>
                            <th>Amount Invested</th>
                            <th>Date</th>
                            <th>Payment Method</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {myProgramInvs.map((inv) => (
                            <tr key={inv.id}>
                              <td style={{ fontWeight: 200 }}>{inv.programTitle}</td>
                              <td style={{ fontWeight: 200 }}>{inv.unitsPurchased} unit{inv.unitsPurchased !== 1 ? 's' : ''}</td>
                              <td style={{ fontWeight: 200 }}>₹{inv.amountInvested.toLocaleString()}</td>
                              <td>{inv.date}</td>
                              <td>{inv.paymentMethod}</td>
                              <td>
                                <span className={`badge ${inv.paymentStatus === 'completed' ? 'badge-success' : 'badge-warning'}`}>
                                  {inv.paymentStatus}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p style={{ fontStyle: 'italic', color: 'var(--text-tertiary)', padding: '10px 0 30px 0' }}>
                      You have not purchased any program units yet.
                    </p>
                  );
                })()}

                <h3 style={{ marginBottom: '20px', fontWeight: 200, borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>📢 Campaign Donation History</h3>
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
                            <td style={{ fontWeight: 200 }}>{inv.campaignTitle}</td>
                            <td style={{ fontWeight: 200 }}>₹{inv.amount.toLocaleString()}</td>
                            <td>{inv.date}</td>
                            <td>{inv.paymentMethod}</td>
                            <td style={{ color: 'var(--success)', fontWeight: 200 }}>
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
                  <p style={{ fontStyle: 'italic', color: 'var(--text-tertiary)', padding: '10px 0' }}>
                    You have not made any campaign donations yet.
                  </p>
                )}
              </div>
            </div>
          )}

          {activeTab === "portfolio" && (
            <div>
              <div style={{ marginBottom: '30px' }}>
                <h1 style={{ fontSize: '2rem' }}>Portfolio Breakdown</h1>
                <p style={{ color: 'var(--text-secondary)', marginTop: '6px' }}>Check transparency utilization reports of the campaigns and investment programs you support.</p>
              </div>

              <h2 style={{ fontSize: '1.4rem', fontWeight: 200, marginBottom: '20px' }}>📢 Backed Campaigns</h2>
              {investments.length > 0 ? (
                <div className="grid-2" style={{ marginTop: 0, marginBottom: '40px' }}>
                  {investments.map((inv) => {
                    const camp = campaigns.find(c => c.id === inv.campaignId);
                    const progress = camp ? Math.min(100, Math.round((camp.raisedAmount / camp.goalAmount) * 100)) : 100;
                    return (
                      <div className="card" key={inv.id} style={{ border: '1px solid var(--border-color)' }}>
                        <span className="badge badge-info" style={{ position: 'absolute', top: '20px', right: '20px' }}>
                          {camp ? camp.type : "Education"}
                        </span>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', fontWeight: 200 }}>{inv.campaignTitle}</h3>
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
              ) : (
                <p style={{ fontStyle: 'italic', color: 'var(--text-tertiary)', marginBottom: '40px' }}>You have not backed any campaigns yet.</p>
              )}

              <h2 style={{ fontSize: '1.4rem', fontWeight: 200, marginBottom: '20px' }}>💼 Backed Investment Programs</h2>
              {/* Filter programs where this investor has completed investments */}
              {(() => {
                const backedProgs = investmentPrograms.filter(prog => 
                  programInvestments.some(inv => inv.programId === prog.id && inv.investorEmail === userEmail && inv.paymentStatus === 'completed')
                );

                return backedProgs.length > 0 ? (
                  <div className="grid-2" style={{ marginTop: 0 }}>
                    {backedProgs.map(prog => {
                      const progInvList = programInvestments.filter(inv => inv.programId === prog.id && inv.investorEmail === userEmail && inv.paymentStatus === 'completed');
                      const unitsOwned = progInvList.reduce((sum, inv) => sum + inv.unitsPurchased, 0);
                      const amtInvested = progInvList.reduce((sum, inv) => sum + inv.amountInvested, 0);
                      
                      const getTier = (units: number) => {
                        if (units >= prog.tierThresholds.platinum) return "Platinum";
                        if (units >= prog.tierThresholds.gold) return "Gold";
                        if (units >= prog.tierThresholds.silver) return "Silver";
                        if (units >= prog.tierThresholds.bronze) return "Bronze";
                        return "None";
                      };

                      const currentTier = getTier(unitsOwned);

                      const totalRaised = prog.unitsSold * prog.unitPrice;
                      const percent = Math.min(100, Math.round((totalRaised / prog.fundingGoal) * 100));

                      return (
                        <div className="card" key={prog.id} style={{ border: '1px solid var(--border-color)' }}>
                          <span className="badge badge-success" style={{ position: 'absolute', top: '20px', right: '20px', fontWeight: 200 }}>
                            {currentTier} Tier
                          </span>
                          <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', fontWeight: 200 }}>{prog.title}</h3>
                          
                          <div style={{ fontSize: '0.82rem', color: 'var(--text-tertiary)', display: 'flex', flexDirection: 'column', gap: '4px', margin: '10px 0' }}>
                            <span>Units Owned: <strong>{unitsOwned} units</strong></span>
                            <span>Total Invested: <strong>₹{amtInvested.toLocaleString()}</strong></span>
                          </div>

                          <div style={{ marginTop: '20px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                              <span>Program Progress</span>
                              <strong>{percent}%</strong>
                            </div>
                            <div className="progress-track" style={{ height: '6px' }}>
                              <div className="progress-fill" style={{ width: `${percent}%` }}></div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                            <Link href={`/investment-programs/${prog.id}`} className="btn btn-primary" style={{ flex: 1, padding: '8px', fontSize: '0.82rem' }}>
                              🔓 View Transparency Portal
                            </Link>
                            <button onClick={() => alert("Loading legal investment certificate...")} className="btn btn-outline" style={{ flex: 1, padding: '8px', fontSize: '0.82rem' }}>
                              📄 Unit Certificate
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p style={{ fontStyle: 'italic', color: 'var(--text-tertiary)' }}>You do not own units in any investment programs yet.</p>
                );
              })()}
            </div>
          )}

          {activeTab === "calculator" && (
            <div>
              <div style={{ marginBottom: '30px' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 200 }}>Projected Return Estimator</h1>
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
                  <div style={{ backgroundColor: 'rgba(22, 163, 74, 0.08)', color: 'var(--success)', padding: '16px', borderRadius: 'var(--radius-md)', fontWeight: 200 }}>
                    ✓ Your KYC has been approved and verified.
                  </div>
                ) : kycStatus === 'pending' ? (
                  <div style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)', padding: '16px', borderRadius: 'var(--radius-md)', fontWeight: 200 }}>
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
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 200, marginBottom: '6px' }}>Account Linked Successfully</h4>
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
                          <td style={{ fontWeight: 200 }}>₹{wd.amount.toLocaleString()}</td>
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

          {activeTab === "announcements" && (
            <div>
              <div style={{ marginBottom: '30px' }}>
                <h1 style={{ fontSize: '2rem' }}>School Board Announcements</h1>
                <p style={{ color: 'var(--text-secondary)', marginTop: '6px' }}>Official updates from school admins regarding active and completed campaigns.</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '800px' }}>
                {announcements.length > 0 ? (
                  announcements.map((ann) => {
                    const hasSupported = investments.some(inv => inv.campaignId === ann.campaignId && inv.status === 'completed');
                    return (
                      <div key={ann.id} className="card" style={{
                        border: '1.5px solid var(--border-color)',
                        borderLeft: hasSupported ? '5px solid var(--primary)' : '1.5px solid var(--border-color)',
                        backgroundColor: 'var(--bg-secondary)',
                        padding: '24px',
                        position: 'relative'
                      }}>
                        {hasSupported && (
                          <span className="badge badge-success" style={{ position: 'absolute', top: '24px', right: '24px', fontSize: '0.75rem' }}>
                            ✓ You backed this campaign
                          </span>
                        )}
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '12px' }}>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', backgroundColor: 'var(--bg-tertiary)', padding: '4px 8px', borderRadius: '4px', fontWeight: 200 }}>
                            {ann.schoolName}
                          </span>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            Campaign: <strong>{ann.campaignTitle}</strong>
                          </span>
                        </div>

                        <h3 style={{ fontSize: '1.25rem', fontWeight: 200, marginBottom: '8px', color: 'var(--text-primary)' }}>
                          {ann.title}
                        </h3>

                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', lineHeight: '1.6', marginBottom: '20px' }}>
                          {ann.content}
                        </p>

                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          borderTop: '1px solid var(--border-color)',
                          paddingTop: '14px',
                          fontSize: '0.82rem',
                          color: 'var(--text-tertiary)'
                        }}>
                          <span>Posted on: <strong>{ann.date}</strong></span>
                          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <span>Backers: <strong>{ann.investorsCount}</strong> (Raised: ₹{ann.totalContributions.toLocaleString()})</span>
                            {ann.broadcastEmail && (
                              <span style={{ color: 'var(--primary)', fontWeight: 200, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                📧 Broadcasted to Inbox
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
                    <h3>No Announcements</h3>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>There are no school announcements to display.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "watchlist" && (
            <div>
              <div style={{ marginBottom: '30px' }}>
                <h1 style={{ fontSize: '2rem' }}>Campaign Watchlist</h1>
                <p style={{ color: 'var(--text-secondary)', marginTop: '6px' }}>Monitor campaigns you are considering before committing capital.</p>
              </div>

              {/* Browse & Add to watchlist */}
              <div className="card" style={{ border: '1px solid var(--border-color)', marginBottom: '24px' }}>
                <h3 style={{ marginBottom: '16px' }}>Browse Active Campaigns</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {campaigns.filter(c => c.status === 'active').map(camp => {
                    const inWatchlist = watchlist.includes(camp.id);
                    const progress = Math.min(100, Math.round((camp.raisedAmount / camp.goalAmount) * 100));
                    const daysLeft = Math.max(0, Math.round((new Date(camp.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
                    return (
                      <div key={camp.id} style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr auto',
                        gap: '12px',
                        alignItems: 'center',
                        padding: '14px',
                        backgroundColor: 'var(--bg-tertiary)',
                        borderRadius: '10px',
                        border: inWatchlist ? '1.5px solid var(--primary)' : '1px solid var(--border-color)'
                      }}>
                        <div>
                          <div style={{ display: 'flex', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                            <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>{camp.type}</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>⏰ {daysLeft} days left</span>
                            {camp.csrMatchingEnabled && <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>2x CSR Match</span>}
                          </div>
                          <div style={{ fontWeight: 200, fontSize: '0.95rem', marginBottom: '6px' }}>{camp.title}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ flex: 1, height: '5px', background: 'var(--bg-secondary)', borderRadius: '99px', overflow: 'hidden' }}>
                              <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, var(--primary), var(--secondary))', borderRadius: '99px' }} />
                            </div>
                            <span style={{ fontSize: '0.78rem', fontWeight: 200, color: 'var(--primary)', whiteSpace: 'nowrap' }}>{progress}% funded</span>
                          </div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', marginTop: '4px' }}>
                            ₹{camp.raisedAmount.toLocaleString()} raised of ₹{camp.goalAmount.toLocaleString()}
                          </div>
                        </div>
                        <button
                          onClick={() => inWatchlist ? removeFromWatchlist(camp.id) : addToWatchlist(camp.id)}
                          className={`btn ${inWatchlist ? 'btn-outline' : 'btn-primary'}`}
                          style={{ padding: '8px 14px', fontSize: '0.82rem', whiteSpace: 'nowrap' }}
                        >
                          {inWatchlist ? '✓ Watching' : '+ Watch'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Watchlist detail */}
              <h3 style={{ marginBottom: '16px' }}>Your Watchlist ({watchlist.length})</h3>
              {watchlist.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
                  <p style={{ color: 'var(--text-tertiary)' }}>No campaigns in your watchlist yet. Browse above to add campaigns.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {watchlist.map(campId => {
                    const camp = campaigns.find(c => c.id === campId);
                    if (!camp) return null;
                    const progress = Math.min(100, Math.round((camp.raisedAmount / camp.goalAmount) * 100));
                    const isExpanded = expandedWatchCamp === campId;
                    return (
                      <div key={campId} className="card" style={{ border: '1.5px solid var(--border-color)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                              <span className="badge badge-info">{camp.type}</span>
                              <span className={`badge ${camp.status === 'active' ? 'badge-success' : 'badge-warning'}`}>{camp.status}</span>
                              {camp.csrMatchingEnabled && <span className="badge badge-success">2x CSR Match</span>}
                            </div>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{camp.title}</h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>{camp.description.substring(0, 120)}...</p>
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px' }}>
                              <span style={{ color: 'var(--text-tertiary)' }}>Funding Progress</span>
                              <strong>{progress}%</strong>
                            </div>
                            <div style={{ height: '8px', background: 'var(--bg-tertiary)', borderRadius: '99px', overflow: 'hidden', marginBottom: '12px' }}>
                              <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, var(--primary), var(--secondary))', borderRadius: '99px' }} />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '12px' }}>
                              <div style={{ textAlign: 'center', padding: '8px', background: 'var(--bg-tertiary)', borderRadius: '8px' }}>
                                <div style={{ fontWeight: 200, color: 'var(--primary)' }}>₹{camp.raisedAmount.toLocaleString()}</div>
                                <div style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)' }}>RAISED</div>
                              </div>
                              <div style={{ textAlign: 'center', padding: '8px', background: 'var(--bg-tertiary)', borderRadius: '8px' }}>
                                <div style={{ fontWeight: 200 }}>₹{camp.goalAmount.toLocaleString()}</div>
                                <div style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)' }}>GOAL</div>
                              </div>
                              <div style={{ textAlign: 'center', padding: '8px', background: 'var(--bg-tertiary)', borderRadius: '8px' }}>
                                <div style={{ fontWeight: 200, color: 'var(--secondary)' }}>{camp.roiEstimate.split(' ')[0]}</div>
                                <div style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)' }}>PROJECTED ROI</div>
                              </div>
                            </div>

                            {isExpanded && (
                              <div style={{ marginTop: '12px', borderTop: '1px solid var(--border-color)', paddingTop: '14px' }}>
                                <h4 style={{ fontSize: '0.88rem', fontWeight: 200, marginBottom: '10px' }}>Milestone Progress</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                  {camp.milestones.map((ms, mi) => (
                                    <div key={mi} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem' }}>
                                      <span style={{ color: ms.completed ? 'var(--success)' : 'var(--text-tertiary)', fontWeight: 200, fontSize: '1rem' }}>
                                        {ms.completed ? '✓' : '○'}
                                      </span>
                                      <span style={{ color: ms.completed ? 'var(--text-primary)' : 'var(--text-tertiary)' }}>{ms.title}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '120px' }}>
                            <Link href={`/campaigns/${camp.id}`} className="btn btn-primary" style={{ padding: '8px 14px', fontSize: '0.82rem', textAlign: 'center' }}>
                              Invest Now
                            </Link>
                            <button onClick={() => setExpandedWatchCamp(isExpanded ? null : campId)} className="btn btn-outline" style={{ padding: '8px 14px', fontSize: '0.82rem' }}>
                              {isExpanded ? 'Less ▲' : 'Details ▼'}
                            </button>
                            <button onClick={() => removeFromWatchlist(campId)} className="btn" style={{ padding: '8px 14px', fontSize: '0.78rem', color: 'var(--danger)', border: '1px solid var(--danger)', background: 'none' }}>
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === "tax" && (
            <div style={{ maxWidth: '750px' }}>
              <div style={{ marginBottom: '30px' }}>
                <h1 style={{ fontSize: '2rem' }}>Tax Benefit Calculator (80G)</h1>
                <p style={{ color: 'var(--text-secondary)', marginTop: '6px' }}>Estimate your income tax deductions for donations to 80G certified campaigns.</p>
              </div>

              {/* 80G Info Banner */}
              <div className="card glass" style={{ marginBottom: '24px', borderLeft: '5px solid var(--success)', border: '1px solid var(--success)' }}>
                <h4 style={{ marginBottom: '8px', color: 'var(--success)' }}>What is Section 80G?</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.7' }}>
                  Under Section 80G of the Income Tax Act, donations to government-approved educational charities are eligible for a 50%–50% tax deduction. Seed Global’s STEM Scholarship Fund is 80G-certified, meaning for every ₹100 donated, you save up to ₹30 in tax.
                </p>
              </div>

              {/* Calculator */}
              <TaxCalculator investments={investments} campaigns={campaigns} />

              {/* 80G Certificate Eligible Campaigns */}
              <div className="card" style={{ border: '1px solid var(--border-color)', marginTop: '24px' }}>
                <h3 style={{ marginBottom: '14px' }}>80G Eligible Campaigns You’ve Backed</h3>
                {investments.filter(inv => {
                  const camp = campaigns.find(c => c.id === inv.campaignId);
                  return camp?.roiEstimate.includes('80G') && inv.status === 'completed';
                }).length === 0 ? (
                  <p style={{ color: 'var(--text-tertiary)', fontStyle: 'italic' }}>You haven’t invested in any 80G-certified campaigns yet. Look for campaigns with the “80G Certified” badge.</p>
                ) : (
                  investments.filter(inv => {
                    const camp = campaigns.find(c => c.id === inv.campaignId);
                    return camp?.roiEstimate.includes('80G') && inv.status === 'completed';
                  }).map(inv => (
                    <div key={inv.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '8px', marginBottom: '8px' }}>
                      <div>
                        <div style={{ fontWeight: 200 }}>{inv.campaignTitle}</div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-tertiary)' }}>Invested: {inv.date}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 200, color: 'var(--primary)' }}>₹{inv.amount.toLocaleString()}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--success)' }}>Tax saving: ₹{Math.round(inv.amount * 0.3).toLocaleString()}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === "impact" && (
            <div>
              <div style={{ marginBottom: '30px' }}>
                <h1 style={{ fontSize: '2rem' }}>My Investment Impact</h1>
                <p style={{ color: 'var(--text-secondary)', marginTop: '6px' }}>See the real-world change your contributions have created in students’ lives.</p>
              </div>

              {/* Total Impact Summary */}
              <div className="stats-grid" style={{ marginBottom: '30px' }}>
                <div className="stat-card">
                  <span className="stat-lbl">Students Impacted</span>
                  <span className="stat-val" style={{ color: 'var(--primary)' }}>620</span>
                </div>
                <div className="stat-card">
                  <span className="stat-lbl">Teachers Trained</span>
                  <span className="stat-val" style={{ color: 'var(--secondary)' }}>32</span>
                </div>
                <div className="stat-card">
                  <span className="stat-lbl">Classrooms Upgraded</span>
                  <span className="stat-val" style={{ color: 'var(--accent)' }}>8</span>
                </div>
                <div className="stat-card">
                  <span className="stat-lbl">Campaigns Supported</span>
                  <span className="stat-val" style={{ color: 'var(--success)' }}>{investments.filter(i => i.status === 'completed').length}</span>
                </div>
              </div>

              {/* Impact Badge */}
              <div className="card" style={{ border: '1.5px solid var(--primary)', marginBottom: '24px', background: 'linear-gradient(135deg, rgba(16,185,129,0.07), var(--bg-secondary))' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ 
                    width: '80px', height: '80px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '2.2rem', flexShrink: 0,
                    boxShadow: '0 0 30px rgba(16,185,129,0.3)'
                  }}>
                    🏅
                  </div>
                  <div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 200, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>Education Impact Badge</div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 200, marginBottom: '4px' }}>Community Champion</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Awarded for supporting 3+ campaigns and impacting 500+ students</p>
                    <button 
                      onClick={() => {
                        const cert = `🎓 SEED GLOBAL IMPACT CERTIFICATE

This certifies that ${username} has contributed to the education of 620+ students across ${investments.filter(i=>i.status==='completed').length} campaigns on Seed Global.

Total Contributed: ₹${investments.filter(i=>i.status==='completed').reduce((s,i)=>s+i.amount,0).toLocaleString()}
Badge: Community Champion
Date: ${new Date().toLocaleDateString()}`;
                        alert(cert);
                      }}
                      className="btn btn-primary"
                      style={{ marginTop: '12px', fontSize: '0.82rem', padding: '8px 16px' }}
                    >
                      🏅 View Certificate
                    </button>
                  </div>
                </div>
              </div>

              {/* Per-campaign impact reports */}
              <h3 style={{ marginBottom: '16px' }}>Campaign Impact Reports</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {impactReports.filter(r => investments.some(inv => inv.campaignId === r.campaignId && inv.status === 'completed')).map(report => (
                  <div key={report.id} className="card" style={{ border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                      <div>
                        <span className="badge badge-success" style={{ marginBottom: '8px' }}>✓ You Supported This</span>
                        <h3 style={{ fontSize: '1.1rem' }}>{report.campaignTitle}</h3>
                        <span style={{ fontSize: '0.82rem', color: 'var(--text-tertiary)' }}>Published {report.reportDate}</span>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '16px' }}>
                      <div style={{ textAlign: 'center', padding: '12px', background: 'var(--bg-tertiary)', borderRadius: '8px' }}>
                        <div style={{ fontSize: '1.6rem', fontWeight: 200, color: 'var(--primary)' }}>{report.studentsImpacted}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 200 }}>STUDENTS</div>
                      </div>
                      <div style={{ textAlign: 'center', padding: '12px', background: 'var(--bg-tertiary)', borderRadius: '8px' }}>
                        <div style={{ fontSize: '1.6rem', fontWeight: 200, color: 'var(--secondary)' }}>{report.teachersTrained}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 200 }}>TEACHERS</div>
                      </div>
                      <div style={{ textAlign: 'center', padding: '12px', background: 'var(--bg-tertiary)', borderRadius: '8px' }}>
                        <div style={{ fontSize: '1.6rem', fontWeight: 200, color: 'var(--accent)' }}>{report.classroomsUpgraded}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 200 }}>CLASSROOMS</div>
                      </div>
                    </div>

                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.6' }}>{report.summary}</p>
                  </div>
                ))}

                {impactReports.filter(r => investments.some(inv => inv.campaignId === r.campaignId && inv.status === 'completed')).length === 0 && (
                  <div className="card" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-tertiary)' }}>
                    No impact reports yet. Schools publish these as campaigns reach milestones.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "profile" && (
            <div style={{ maxWidth: '600px' }}>
              <div style={{ marginBottom: '30px' }}>
                <h1 style={{ fontSize: '2rem' }}>Customize Profile</h1>
                <p style={{ color: 'var(--text-secondary)', marginTop: '6px' }}>Manage and update your personal details and email address.</p>
              </div>

              <div className="card" style={{ border: '1px solid var(--border-color)' }}>
                <h3 style={{ marginBottom: '16px' }}>Profile Information</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '24px' }}>
                  Keep your personal profile up to date. Your username is used for personalized displays, and your email is used for transaction receipts.
                </p>

                <form onSubmit={handleUpdateProfile}>
                  <div className="form-group" style={{ marginBottom: '20px' }}>
                    <label className="label">👤 Username</label>
                    <input 
                      type="text"
                      value={editUsername}
                      onChange={(e) => setEditUsername(e.target.value)}
                      className="input"
                      required
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: '24px' }}>
                    <label className="label">📧 Email Address</label>
                    <input 
                      type="email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="input"
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                    Save Profile Changes
                  </button>
                </form>

                <div style={{ marginTop: '20px', borderTop: '1px dashed var(--border-color)', paddingTop: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 200 }}>Account Security</h4>
                      <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Update your password to secure your account.</p>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setIsPasswordModalOpen(true)} 
                      className="btn btn-outline"
                      style={{ padding: '8px 16px', fontSize: '0.88rem' }}
                    >
                      🔒 Change Password
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isPasswordModalOpen && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(4, 45, 26, 0.6)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000,
              animation: 'fadeIn 0.2s ease-out'
            }}>
              <div className="card" style={{
                width: '100%',
                maxWidth: '450px',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-lg)',
                border: '1.5px solid var(--border-color)',
                boxShadow: 'var(--shadow-lg)',
                padding: '30px',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1.4rem' }}>🔒 Change Password</h3>
                  <button 
                    type="button" 
                    onClick={() => {
                      setIsPasswordModalOpen(false);
                      setPrevPasswordInput("");
                      setNewPasswordInput("");
                      setConfirmPasswordInput("");
                    }} 
                    style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-secondary)' }}
                  >
                    ×
                  </button>
                </div>

                <form onSubmit={handleChangePasswordSubmit}>
                  <div className="form-group" style={{ marginBottom: '16px' }}>
                    <label className="label">Previous Password</label>
                    <input 
                      type="password"
                      value={prevPasswordInput}
                      onChange={(e) => setPrevPasswordInput(e.target.value)}
                      className="input"
                      placeholder="Enter previous password"
                      required
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: '16px' }}>
                    <label className="label">New Password</label>
                    <input 
                      type="password"
                      value={newPasswordInput}
                      onChange={(e) => setNewPasswordInput(e.target.value)}
                      className="input"
                      placeholder="Enter new password"
                      required
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: '20px' }}>
                    <label className="label">Confirm New Password</label>
                    <input 
                      type="password"
                      value={confirmPasswordInput}
                      onChange={(e) => setConfirmPasswordInput(e.target.value)}
                      className="input"
                      placeholder="Confirm new password"
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: '12px' }}>
                    Confirm & Update Password
                  </button>

                  <div style={{ textAlign: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                    <button 
                      type="button" 
                      onClick={handleForgotPasswordRequest} 
                      className="btn btn-outline" 
                      style={{ width: '100%', borderColor: 'var(--text-tertiary)', color: 'var(--text-tertiary)' }}
                    >
                      ❓ Forget Password
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </main>
      </div>

      <Footer />
    </>
  );
}
