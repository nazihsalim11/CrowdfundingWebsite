"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useApp } from "@/context/AppContext";
import CustomSelect from "@/components/ui/select";

export default function InvestmentProgramDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { 
    investmentPrograms, 
    programInvestments, 
    investInProgram, 
    walletBalance, 
    role, 
    isLoggedIn, 
    userEmail,
    username
  } = useApp();

  const program = investmentPrograms.find(p => p.id === id);

  const [activeTab, setActiveTab] = useState<"about" | "tiers" | "transparency">("about");
  const [unitsToPurchase, setUnitsToPurchase] = useState<number>(1);
  const [paymentMethod, setPaymentMethod] = useState<string>("UPI (Razorpay)");
  const [offlineProof, setOfflineProof] = useState<string>("");
  const [utrNumber, setUtrNumber] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  if (!program) {
    return (
      <>
        <Navbar />
        <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
          <h2 style={{ fontWeight: 200 }}>Investment Program Not Found</h2>
          <p style={{ margin: '16px 0 24px 0', color: 'var(--text-secondary)' }}>The requested investment program does not exist or has been removed.</p>
          <button onClick={() => router.push('/investment-programs')} className="btn btn-primary">Go to Programs</button>
        </div>
        <Footer />
      </>
    );
  }

  const totalRaised = program.unitsSold * program.unitPrice;
  const percent = Math.min(100, Math.round((totalRaised / program.fundingGoal) * 100));
  const unitsTotal = program.fundingGoal / program.unitPrice;
  const unitsRemaining = Math.max(0, unitsTotal - program.unitsSold);

  // Calculate owned units
  let ownedUnits = 0;
  let pendingUnits = 0;
  if (isLoggedIn && userEmail) {
    ownedUnits = programInvestments
      .filter(inv => inv.programId === program.id && inv.investorEmail === userEmail && inv.paymentStatus === 'completed')
      .reduce((sum, inv) => sum + inv.unitsPurchased, 0);

    pendingUnits = programInvestments
      .filter(inv => inv.programId === program.id && inv.investorEmail === userEmail && inv.paymentStatus === 'pending')
      .reduce((sum, inv) => sum + inv.unitsPurchased, 0);
  }

  // Calculate current tier
  const getTier = (units: number) => {
    if (units >= program.tierThresholds.platinum) return "Platinum";
    if (units >= program.tierThresholds.gold) return "Gold";
    if (units >= program.tierThresholds.silver) return "Silver";
    if (units >= program.tierThresholds.bronze) return "Bronze";
    return "None";
  };

  const currentTier = getTier(ownedUnits);

  // Check what is unlocked
  const hasBronze = ownedUnits >= program.tierThresholds.bronze;
  const hasSilver = ownedUnits >= program.tierThresholds.silver;
  const hasGold = ownedUnits >= program.tierThresholds.gold;
  const hasPlatinum = ownedUnits >= program.tierThresholds.platinum;

  const handlePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (unitsToPurchase <= 0) {
      alert("Please enter a valid number of units.");
      return;
    }

    if (unitsToPurchase > unitsRemaining) {
      alert(`Only ${unitsRemaining} units are available for purchase.`);
      return;
    }

    const totalCost = unitsToPurchase * program.unitPrice;
    
    if (paymentMethod === "UPI (Razorpay)" && totalCost > walletBalance) {
      alert("Insufficient balance in your simulated bank wallet.");
      return;
    }

    if (paymentMethod !== "UPI (Razorpay)" && (!utrNumber || !offlineProof)) {
      alert("For offline bank wire payments, please enter UTR Number and upload payment proof.");
      return;
    }

    investInProgram(program.id, unitsToPurchase, paymentMethod, { utr: utrNumber, file: offlineProof });
    
    setIsSuccess(true);
    if (paymentMethod === "UPI (Razorpay)") {
      setSuccessMsg(`Successfully purchased ${unitsToPurchase} Investment Unit${unitsToPurchase !== 1 ? 's' : ''} (₹${totalCost.toLocaleString()}) via Razorpay! Your owned units and tier have been updated.`);
    } else {
      setSuccessMsg(`Offline unit purchase request (${unitsToPurchase} units, ₹${totalCost.toLocaleString()}) submitted! A cashier will verify your receipt shortly.`);
    }
  };

  return (
    <>
      <Navbar />

      <main className="container animate-slide-up" style={{ padding: '80px 24px 120px 24px' }}>
        {/* Header */}
        <section style={{ marginBottom: '48px' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '12px' }}>
            <span className="badge badge-info">{program.schoolName} Investment Program</span>
            {currentTier !== "None" && (
              <span className="badge badge-success" style={{ fontWeight: 200 }}>
                👑 Your Current Tier: {currentTier}
              </span>
            )}
          </div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '8px', fontWeight: 200 }}>{program.title}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.6' }}>
            Official School Investment Program • Protected by Central Escrow Vault Systems
          </p>
        </section>

        {/* Success Modal/Banner */}
        {isSuccess && (
          <div className="card glass animate-scale-up" style={{ marginBottom: '40px', border: '1.5px solid var(--success)', padding: '24px', position: 'relative' }}>
            <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '8px' }}>🎉 Success!</span>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-primary)', lineHeight: '1.6' }}>{successMsg}</p>
            <button 
              onClick={() => { setIsSuccess(false); setUnitsToPurchase(1); setUtrNumber(""); setOfflineProof(""); }} 
              className="btn btn-primary" 
              style={{ marginTop: '16px', padding: '8px 16px', fontSize: '0.85rem' }}
            >
              Close notification
            </button>
          </div>
        )}

        {/* Content Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.8fr', gap: '40px', alignItems: 'start' }}>
          
          {/* Left Column: Details & Tabs */}
          <div>
            {/* Tabs Bar */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', gap: '24px', marginBottom: '24px' }}>
              <button 
                onClick={() => setActiveTab("about")}
                style={{ 
                  padding: '12px 8px', 
                  fontSize: '1rem', 
                  fontWeight: 200, 
                  border: 'none', 
                  background: 'none',
                  borderBottom: activeTab === "about" ? "3px solid var(--primary)" : "3px solid transparent",
                  color: activeTab === "about" ? "var(--primary)" : "var(--text-secondary)",
                  cursor: 'pointer',
                  letterSpacing: '0.01em'
                }}
              >
                About Program
              </button>
              <button 
                onClick={() => setActiveTab("tiers")}
                style={{ 
                  padding: '12px 8px', 
                  fontSize: '1rem', 
                  fontWeight: 200, 
                  border: 'none', 
                  background: 'none',
                  borderBottom: activeTab === "tiers" ? "3px solid var(--primary)" : "3px solid transparent",
                  color: activeTab === "tiers" ? "var(--primary)" : "var(--text-secondary)",
                  cursor: 'pointer',
                  letterSpacing: '0.01em'
                }}
              >
                Investor Tiers Thresholds
              </button>
              <button 
                onClick={() => setActiveTab("transparency")}
                style={{ 
                  padding: '12px 8px', 
                  fontSize: '1rem', 
                  fontWeight: 200, 
                  border: 'none', 
                  background: 'none',
                  borderBottom: activeTab === "transparency" ? "3px solid var(--primary)" : "3px solid transparent",
                  color: activeTab === "transparency" ? "var(--primary)" : "var(--text-secondary)",
                  cursor: 'pointer',
                  letterSpacing: '0.01em'
                }}
              >
                🔓 Transparency Portal
              </button>
            </div>

            {/* Tab Contents */}
            {activeTab === "about" && (
              <div>
                <div className="card" style={{ marginBottom: '30px', padding: '32px' }}>
                  <h3 style={{ marginBottom: '16px', fontWeight: 200 }}>Program Summary</h3>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '24px', fontSize: '0.95rem' }}>
                    {program.description}
                  </p>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                    <div>
                      <span style={{ fontSize: '0.72rem', fontWeight: 200, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Price Per Unit</span>
                      <p style={{ fontSize: '1.1rem', fontWeight: 200, color: 'var(--text-primary)', marginTop: '4px' }}>₹{program.unitPrice.toLocaleString()}</p>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.72rem', fontWeight: 200, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Funding Goal</span>
                      <p style={{ fontSize: '1.1rem', fontWeight: 200, color: 'var(--text-primary)', marginTop: '4px' }}>₹{program.fundingGoal.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="card" style={{ padding: '32px' }}>
                  <h3 style={{ marginBottom: '16px', fontWeight: 200 }}>Investment Security & Escrow</h3>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.9rem', marginBottom: '16px' }}>
                    This investment program operates strictly under the school board's financial compliance bylaws. All funds raised are initially held in a centralized escrow trust vault. School management cannot release funds without publishing itemized expenditure invoices, which must be verified by certified compliance auditors.
                  </p>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.9rem' }}>
                    By holding units in this program, you gain progressive audit visibility rights. Tiers automatically unlock and sync in real-time as your holdings increase.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "tiers" && (
              <div>
                <div className="card" style={{ padding: '32px' }}>
                  <h3 style={{ marginBottom: '8px', fontWeight: 200 }}>Investor Benefits & Tiers</h3>
                  <p style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem', marginBottom: '24px' }}>Tiers are determined automatically by the sum of completed purchased units.</p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* Bronze */}
                    <div style={{ 
                      padding: '20px', 
                      borderRadius: 'var(--radius-md)', 
                      border: '1.5px solid var(--border-color)',
                      backgroundColor: currentTier === "Bronze" ? "var(--primary-light)" : "var(--bg-secondary)",
                      borderLeft: currentTier === "Bronze" ? "5px solid #b45309" : "1.5px solid var(--border-color)"
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <span style={{ fontWeight: 200, color: '#b45309', fontSize: '1.05rem' }}>🟫 Bronze Supporter</span>
                        <span style={{ fontSize: '0.82rem', fontWeight: 200, color: 'var(--text-tertiary)' }}>Threshold: {program.tierThresholds.bronze} Unit{program.tierThresholds.bronze !== 1 ? 's' : ''}</span>
                      </div>
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                        Unlocks fundamental transparency features: <strong>Investment Summary</strong> and <strong>School Progress Updates</strong>. Keep track of construction phases, deliveries, and basic project status.
                      </p>
                    </div>

                    {/* Silver */}
                    <div style={{ 
                      padding: '20px', 
                      borderRadius: 'var(--radius-md)', 
                      border: '1.5px solid var(--border-color)',
                      backgroundColor: currentTier === "Silver" ? "var(--primary-light)" : "var(--bg-secondary)",
                      borderLeft: currentTier === "Silver" ? "5px solid #64748b" : "1.5px solid var(--border-color)"
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <span style={{ fontWeight: 200, color: '#64748b', fontSize: '1.05rem' }}>⬜ Silver Partner</span>
                        <span style={{ fontSize: '0.82rem', fontWeight: 200, color: 'var(--text-tertiary)' }}>Threshold: {program.tierThresholds.silver} Units</span>
                      </div>
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                        Unlocks standard visibility features: <strong>Financial Summaries</strong> and <strong>Project Milestones</strong>. See overall program performance reports and timeline reviews.
                      </p>
                    </div>

                    {/* Gold */}
                    <div style={{ 
                      padding: '20px', 
                      borderRadius: 'var(--radius-md)', 
                      border: '1.5px solid var(--border-color)',
                      backgroundColor: currentTier === "Gold" ? "var(--primary-light)" : "var(--bg-secondary)",
                      borderLeft: currentTier === "Gold" ? "5px solid #d97706" : "1.5px solid var(--border-color)"
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <span style={{ fontWeight: 200, color: '#d97706', fontSize: '1.05rem' }}>🟨 Gold Trustee</span>
                        <span style={{ fontSize: '0.82rem', fontWeight: 200, color: 'var(--text-tertiary)' }}>Threshold: {program.tierThresholds.gold} Units</span>
                      </div>
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                        Unlocks detailed visibility: <strong>Budget Breakdowns</strong> and <strong>Fund Allocation Reports</strong>. Reconcile detailed accounts and trace capital deployments.
                      </p>
                    </div>

                    {/* Platinum */}
                    <div style={{ 
                      padding: '20px', 
                      borderRadius: 'var(--radius-md)', 
                      border: '1.5px solid var(--border-color)',
                      backgroundColor: currentTier === "Platinum" ? "var(--primary-light)" : "var(--bg-secondary)",
                      borderLeft: currentTier === "Platinum" ? "5px solid #0d9488" : "1.5px solid var(--border-color)"
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <span style={{ fontWeight: 200, color: '#0d9488', fontSize: '1.05rem' }}>💎 Platinum Executive</span>
                        <span style={{ fontSize: '0.82rem', fontWeight: 200, color: 'var(--text-tertiary)' }}>Threshold: {program.tierThresholds.platinum} Units</span>
                      </div>
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                        Unlocks maximum visibility: <strong>Detailed Expenditure Invoices</strong>, <strong>Quarterly Financial Reports</strong>, and <strong>Executive Board Updates</strong>. Full governance monitoring rights.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "transparency" && (
              <div>
                <div className="card" style={{ padding: '32px' }}>
                  <h3 style={{ marginBottom: '16px', fontWeight: 200 }}>Unlocked Transparency Documents</h3>

                  {currentTier === "None" ? (
                    <div style={{ textAlign: 'center', padding: '40px 20px', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-color)' }}>
                      <span style={{ fontSize: '2.5rem' }}>🔒</span>
                      <h4 style={{ marginTop: '12px', fontWeight: 200 }}>All Transparency Documents Locked</h4>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '6px', marginBottom: '16px' }}>
                        Purchase at least <strong>{program.tierThresholds.bronze} unit</strong> to unlock Bronze-level transparency.
                      </p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      {/* Bronze Content */}
                      {hasBronze && (
                        <div style={{ padding: '20px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                          <span style={{ fontWeight: 200, color: '#b45309', fontSize: '0.82rem', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>🟫 Unlocked Bronze Content</span>
                          <h4 style={{ marginBottom: '8px', fontSize: '1.1rem', fontWeight: 200 }}>Investment Summary & Progress Updates</h4>
                          <p style={{ color: 'var(--text-primary)', fontSize: '0.9rem', lineHeight: '1.6', backgroundColor: 'var(--bg-primary)', padding: '12px', borderRadius: '6px' }}>
                            {program.transparencyContent.bronze}
                          </p>
                        </div>
                      )}

                      {/* Silver Content */}
                      {hasSilver ? (
                        <div style={{ padding: '20px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                          <span style={{ fontWeight: 200, color: '#64748b', fontSize: '0.82rem', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>⬜ Unlocked Silver Content</span>
                          <h4 style={{ marginBottom: '8px', fontSize: '1.1rem', fontWeight: 200 }}>Financial Summaries & Project Milestones</h4>
                          <p style={{ color: 'var(--text-primary)', fontSize: '0.9rem', lineHeight: '1.6', backgroundColor: 'var(--bg-primary)', padding: '12px', borderRadius: '6px' }}>
                            {program.transparencyContent.silver}
                          </p>
                        </div>
                      ) : (
                        <div style={{ padding: '20px', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-md)', opacity: 0.6 }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 200, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>⬜ Silver Content Locked</span>
                          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                            Requires <strong>{program.tierThresholds.silver} total units</strong>. Purchase {program.tierThresholds.silver - ownedUnits} more unit{program.tierThresholds.silver - ownedUnits !== 1 ? 's' : ''} to unlock.
                          </p>
                        </div>
                      )}

                      {/* Gold Content */}
                      {hasGold ? (
                        <div style={{ padding: '20px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                          <span style={{ fontWeight: 200, color: '#d97706', fontSize: '0.82rem', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>🟨 Unlocked Gold Content</span>
                          <h4 style={{ marginBottom: '8px', fontSize: '1.1rem', fontWeight: 200 }}>Budget Breakdowns & Fund Allocation Reports</h4>
                          <p style={{ color: 'var(--text-primary)', fontSize: '0.9rem', lineHeight: '1.6', backgroundColor: 'var(--bg-primary)', padding: '12px', borderRadius: '6px' }}>
                            {program.transparencyContent.gold}
                          </p>
                        </div>
                      ) : (
                        <div style={{ padding: '20px', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-md)', opacity: 0.6 }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 200, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>🟨 Gold Content Locked</span>
                          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                            Requires <strong>{program.tierThresholds.gold} total units</strong>. Purchase {program.tierThresholds.gold - ownedUnits} more unit{program.tierThresholds.gold - ownedUnits !== 1 ? 's' : ''} to unlock.
                          </p>
                        </div>
                      )}

                      {/* Platinum Content */}
                      {hasPlatinum ? (
                        <div style={{ padding: '20px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                          <span style={{ fontWeight: 200, color: '#0d9488', fontSize: '0.82rem', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>💎 Unlocked Platinum Content</span>
                          <h4 style={{ marginBottom: '8px', fontSize: '1.1rem', fontWeight: 200 }}>Detailed Expenditure Reports & Executive Updates</h4>
                          <p style={{ color: 'var(--text-primary)', fontSize: '0.9rem', lineHeight: '1.6', backgroundColor: 'var(--bg-primary)', padding: '12px', borderRadius: '6px' }}>
                            {program.transparencyContent.platinum}
                          </p>
                        </div>
                      ) : (
                        <div style={{ padding: '20px', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-md)', opacity: 0.6 }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 200, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>💎 Platinum Content Locked</span>
                          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                            Requires <strong>{program.tierThresholds.platinum} total units</strong>. Purchase {program.tierThresholds.platinum - ownedUnits} more unit{program.tierThresholds.platinum - ownedUnits !== 1 ? 's' : ''} to unlock.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Funding Progress & Unit Purchase Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            
            {/* Progress Card */}
            <div className="card" style={{ padding: '28px', border: '1px solid var(--border-color)' }}>
              <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>Program Progress</h4>
              
              <div className="progress-container" style={{ margin: '0 0 20px 0' }}>
                <div className="progress-info" style={{ fontSize: '0.8rem', marginBottom: '6px' }}>
                  <span>{percent}% Funded</span>
                  <span style={{ fontWeight: 200 }}>₹{totalRaised.toLocaleString()}</span>
                </div>
                <div className="progress-track" style={{ height: '6px' }}>
                  <div className="progress-fill" style={{ width: `${percent}%` }}></div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.88rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-tertiary)' }}>Funding Goal:</span>
                  <strong style={{ color: 'var(--text-primary)' }}>₹{program.fundingGoal.toLocaleString()}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-tertiary)' }}>Units Sold:</span>
                  <strong style={{ color: 'var(--text-primary)' }}>{program.unitsSold} units</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-tertiary)' }}>Units Available:</span>
                  <strong style={{ color: 'var(--text-primary)' }}>{unitsRemaining} units</strong>
                </div>
                {isLoggedIn && (
                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-secondary)', fontWeight: 200 }}>Your Owned Units:</span>
                      <strong style={{ color: 'var(--success)' }}>{ownedUnits} unit{ownedUnits !== 1 ? 's' : ''}</strong>
                    </div>
                    {pendingUnits > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-tertiary)' }}>Pending Approval:</span>
                        <strong style={{ color: 'var(--warning)' }}>{pendingUnits} unit{pendingUnits !== 1 ? 's' : ''}</strong>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Purchase Form */}
            {program.status === 'active' && isLoggedIn && role === 'investor' && (
              <div className="card" style={{ padding: '28px', border: '1px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '16px', fontWeight: 200 }}>Purchase Units</h3>
                
                <form onSubmit={handlePurchase}>
                  <div className="form-group" style={{ marginBottom: '16px' }}>
                    <label className="label">Number of Units</label>
                    <input 
                      type="number" 
                      min="1" 
                      max={unitsRemaining}
                      value={unitsToPurchase}
                      onChange={(e) => setUnitsToPurchase(Math.max(1, Number(e.target.value)))}
                      className="input"
                      required
                    />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                      Total Investment: <strong>₹{(unitsToPurchase * program.unitPrice).toLocaleString()}</strong>
                    </span>
                  </div>

                  <div className="form-group" style={{ marginBottom: '20px' }}>
                    <label className="label">Payment Channel</label>
                    <CustomSelect
                      value={paymentMethod}
                      onChange={setPaymentMethod}
                      options={[
                        { label: "UPI (Razorpay Gateway)", value: "UPI (Razorpay)" },
                        { label: "Card (Razorpay Gateway)", value: "Card (Razorpay)" },
                        { label: "Offline Payout / Wire Transfer", value: "Offline Payout / Wire" }
                      ]}
                      id="select-payment-method"
                    />
                  </div>

                  {paymentMethod === "Offline Payout / Wire" && (
                    <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
                      <div className="form-group" style={{ marginBottom: '12px' }}>
                        <label className="label">Bank UTR Transaction ID</label>
                        <input 
                          type="text" 
                          placeholder="e.g. UTR12938401928"
                          value={utrNumber}
                          onChange={(e) => setUtrNumber(e.target.value)}
                          className="input"
                          required
                        />
                      </div>
                      <div className="form-group" style={{ marginBottom: '20px' }}>
                        <label className="label">Upload Payment Proof File</label>
                        <input 
                          type="text" 
                          placeholder="e.g. receipt_screenshot.png"
                          value={offlineProof}
                          onChange={(e) => setOfflineProof(e.target.value)}
                          className="input"
                          required
                        />
                      </div>
                    </div>
                  )}

                  <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
                    Confirm Purchase
                  </button>
                </form>
              </div>
            )}

            {!isLoggedIn && (
              <div className="card" style={{ padding: '24px', textAlign: 'center', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)' }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  Please login as an <strong>Investor</strong> to purchase investment units.
                </p>
                <Link href="/login" className="btn btn-primary" style={{ width: '100%' }}>Login to Invest</Link>
              </div>
            )}

            {isLoggedIn && role !== 'investor' && (
              <div className="card" style={{ padding: '24px', textAlign: 'center', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)' }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  You are logged in as <strong>{role}</strong>. Please switch to the **Investor Role** using the Sandbox selector in the Navbar to test unit purchases.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
