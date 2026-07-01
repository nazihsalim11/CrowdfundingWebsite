"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useApp } from "@/context/AppContext";
import CustomSelect from "@/components/ui/select";

export default function CampaignDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { campaigns, expenses, investInCampaign, walletBalance, role } = useApp();

  const campaign = campaigns.find(c => c.id === id);
  const campaignExpenses = expenses.filter(e => e.campaignId === id);

  const [activeTab, setActiveTab] = useState<"about" | "transparency" | "updates">("about");
  const [investAmount, setInvestAmount] = useState<number>(500);
  const [paymentMethod, setPaymentMethod] = useState<string>("UPI (Razorpay)");
  const [offlineProof, setOfflineProof] = useState<string>("");
  const [utrNumber, setUtrNumber] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  if (!campaign) {
    return (
      <>
        <Navbar />
        <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
          <h2>Campaign Not Found</h2>
          <p style={{ margin: '16px 0 24px 0', color: 'var(--text-secondary)' }}>The requested campaign does not exist or has been removed.</p>
          <button onClick={() => router.push('/campaigns')} className="btn btn-primary">Go to Campaigns</button>
        </div>
        <Footer />
      </>
    );
  }

  const percent = Math.min(100, Math.round((campaign.raisedAmount / campaign.goalAmount) * 100));

  const handleInvest = (e: React.FormEvent) => {
    e.preventDefault();
    if (investAmount <= 0) {
      alert("Please enter a valid investment amount.");
      return;
    }
    
    if (paymentMethod === "UPI (Razorpay)" && investAmount > walletBalance) {
      alert("Insufficient balance in your simulated bank wallet.");
      return;
    }

    if (paymentMethod !== "UPI (Razorpay)" && (!utrNumber || !offlineProof)) {
      alert("For offline payments, please enter UTR Number and upload payment proof.");
      return;
    }

    investInCampaign(campaign.id, investAmount, paymentMethod, { utr: utrNumber, file: offlineProof });
    
    setIsSuccess(true);
    if (paymentMethod === "UPI (Razorpay)") {
      setSuccessMsg(`Successfully invested ₹${investAmount.toLocaleString()} via Razorpay! The progress bar is updated instantly.`);
    } else {
      setSuccessMsg(`Offline payment proof (₹${investAmount.toLocaleString()}) submitted successfully! A Super Admin will verify your receipt shortly.`);
    }
  };

  return (
    <>
      <Navbar />

      <main className="container animate-slide-up" style={{ padding: '80px 24px 120px 24px' }}>
        {/* Campaign Header */}
        <section style={{ marginBottom: '48px' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '12px' }}>
            <span className="badge badge-info">{campaign.type}</span>
          </div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '8px', fontWeight: 800 }}>{campaign.title}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Verified Project by Seed Global Board of Trustees</p>
        </section>

        {/* Content Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.8fr', gap: '40px', alignItems: 'start' }}>
          
          {/* Left Column: Details & Tabs */}
          <div>
            {/* Tabs Bar */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', gap: '20px', marginBottom: '24px' }}>
              <button 
                onClick={() => setActiveTab("about")}
                style={{ 
                  padding: '12px 8px', 
                  fontSize: '1rem', 
                  fontWeight: 700, 
                  border: 'none', 
                  background: 'none',
                  borderBottom: activeTab === "about" ? "3px solid var(--primary)" : "3px solid transparent",
                  color: activeTab === "about" ? "var(--primary)" : "var(--text-secondary)",
                  cursor: 'pointer'
                }}
              >
                About Campaign
              </button>
              <button 
                onClick={() => setActiveTab("transparency")}
                style={{ 
                  padding: '12px 8px', 
                  fontSize: '1rem', 
                  fontWeight: 700, 
                  border: 'none', 
                  background: 'none',
                  borderBottom: activeTab === "transparency" ? "3px solid var(--primary)" : "3px solid transparent",
                  color: activeTab === "transparency" ? "var(--primary)" : "var(--text-secondary)",
                  cursor: 'pointer'
                }}
              >
                Transparency & Expenses ({campaignExpenses.length})
              </button>
              <button 
                onClick={() => setActiveTab("updates")}
                style={{ 
                  padding: '12px 8px', 
                  fontSize: '1rem', 
                  fontWeight: 700, 
                  border: 'none', 
                  background: 'none',
                  borderBottom: activeTab === "updates" ? "3px solid var(--primary)" : "3px solid transparent",
                  color: activeTab === "updates" ? "var(--primary)" : "var(--text-secondary)",
                  cursor: 'pointer'
                }}
              >
                Updates ({campaign.updates.length})
              </button>
            </div>

            {/* Tab Contents */}
            {activeTab === "about" && (
              <div>
                <div className="card" style={{ marginBottom: '30px' }}>
                  <h3 style={{ marginBottom: '16px' }}>Project Summary</h3>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '24px' }}>{campaign.description}</p>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)' }}>EXPECTED INVESTMENT ROI</span>
                      <p style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>{campaign.roiEstimate}</p>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)' }}>CAMPAIGN COMPLIANCE</span>
                      <p style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--success)', marginTop: '4px' }}>✓ Approved by Super Admin</p>
                    </div>
                  </div>
                </div>

                <div className="card" style={{ padding: '36px' }}>
                  <h3 style={{ marginBottom: '24px', fontWeight: 800 }}>Project Milestone Development Timeline</h3>
                  <div style={{ position: 'relative', paddingLeft: '32px', borderLeft: '2px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '32px', marginLeft: '12px', marginTop: '10px' }}>
                    {campaign.milestones.map((m, idx) => (
                      <div key={idx} style={{ position: 'relative' }}>
                        {/* Circle Indicator */}
                        <div style={{
                          position: 'absolute',
                          left: '-42px',
                          top: '2px',
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          backgroundColor: m.completed ? 'var(--success)' : 'var(--bg-secondary)',
                          border: `3px solid ${m.completed ? 'var(--success)' : 'var(--border-color)'}`,
                          boxShadow: m.completed ? '0 0 10px rgba(22, 163, 74, 0.3)' : 'none',
                          transition: 'var(--transition)'
                        }} />
                        <h4 style={{ fontSize: '1rem', fontWeight: 700, color: m.completed ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                          {m.title}
                        </h4>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', fontWeight: 600, display: 'block', marginTop: '4px' }}>
                          {m.completed ? "✓ Reconciled & Audited Completed" : "⏳ Planned Development Stage"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "transparency" && (
              <div>
                <div className="card" style={{ marginBottom: '30px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                      <h3 style={{ fontWeight: 800 }}>Expense Ledger</h3>
                      <p style={{ color: 'var(--text-tertiary)', fontSize: '0.82rem', marginTop: '4px', fontWeight: 600 }}>Audited Ledger</p>
                    </div>
                    <button 
                      onClick={() => window.print()} 
                      className="btn btn-outline" 
                      style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                    >
                      🖨️ Export PDF Ledger Audit
                    </button>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '20px' }}>
                    To maintain strict transparency, school admins upload billing details and invoices for every dollar spent.
                  </p>

                  {campaignExpenses.length > 0 ? (
                    <div className="table-container" style={{ marginTop: 0 }}>
                      <table>
                        <thead>
                          <tr>
                            <th>Description</th>
                            <th>Amount</th>
                            <th>Date</th>
                            <th>Proof</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {campaignExpenses.map((exp) => (
                            <tr key={exp.id}>
                              <td>{exp.description}</td>
                              <td style={{ fontWeight: 700 }}>₹{exp.amount.toLocaleString()}</td>
                              <td>{exp.date}</td>
                              <td>
                                <a href="#" onClick={(e) => {e.preventDefault(); alert(`Downloading invoice ${exp.invoiceUrl}`);}} style={{ color: 'var(--primary)', fontWeight: 600 }}>
                                  📄 Invoice
                                </a>
                              </td>
                              <td>
                                <span className={`badge ${exp.status === 'approved' ? 'badge-success' : 'badge-warning'}`}>
                                  {exp.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p style={{ fontStyle: 'italic', color: 'var(--text-tertiary)', textAlign: 'center', padding: '20px' }}>
                      No expenses logged yet. Expenses are recorded after funds are raised and utilized.
                    </p>
                  )}
                </div>
              </div>
            )}

            {activeTab === "updates" && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {campaign.updates.length > 0 ? (
                  campaign.updates.map((upd, idx) => (
                    <div className="card" key={idx}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-tertiary)' }}>{upd.date}</span>
                      <h4 style={{ fontSize: '1.15rem', marginTop: '6px', marginBottom: '12px' }}>{upd.title}</h4>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>{upd.content}</p>
                    </div>
                  ))
                ) : (
                  <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
                    <p style={{ color: 'var(--text-tertiary)', fontStyle: 'italic' }}>No campaign progress updates published yet.</p>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Right Column: Investment Box */}
          <div>
            <div className="card glass" style={{ border: '1.5px solid var(--primary-light)', position: 'sticky', top: '100px' }}>
              <div className="card-header" style={{ padding: 0 }}>
                <span className={`badge ${campaign.status === 'active' ? 'badge-info' : 'badge-success'}`} style={{ position: 'static' }}>
                  {campaign.status}
                </span>
                <h3 className="card-title" style={{ fontSize: '1.4rem', marginTop: '12px' }}>Fund Status</h3>
              </div>

              <div className="progress-container" style={{ margin: '20px 0' }}>
                <div className="progress-info">
                  <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>{percent}%</span>
                  <span>₹{campaign.raisedAmount.toLocaleString()} Raised</span>
                </div>
                <div className="progress-track" style={{ height: '10px' }}>
                  <div className="progress-fill" style={{ width: `${percent}%` }}></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
                  <span>Goal: ₹{campaign.goalAmount.toLocaleString()}</span>
                  <span>Deadline: {campaign.deadline}</span>
                </div>
              </div>

              {isSuccess ? (
                <div style={{ 
                  backgroundColor: 'rgba(16, 185, 129, 0.15)', 
                  border: '1.5px solid #10b981', 
                  borderRadius: 'var(--radius-md)', 
                  padding: '16px', 
                  color: '#10b981',
                  fontSize: '0.92rem',
                  lineHeight: '1.5'
                }}>
                  <strong style={{ display: 'block', marginBottom: '4px' }}>✨ Investment Submitted!</strong>
                  {successMsg}
                  <button onClick={() => setIsSuccess(false)} className="btn btn-outline" style={{ width: '100%', marginTop: '12px', padding: '6px' }}>
                    Invest Again
                  </button>
                </div>
              ) : (
                <form onSubmit={handleInvest}>
                  {role === 'visitor' ? (
                    <div style={{ textAlign: 'center', padding: '10px 0' }}>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '16px' }}>
                        You must be logged in as an **Investor** to fund campaigns.
                      </p>
                      <button type="button" onClick={() => router.push('/login')} className="btn btn-primary" style={{ width: '100%' }}>
                        Login to Invest
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="form-group">
                        <label className="label">Investment Amount (₹)</label>
                        <input 
                          type="number" 
                          value={investAmount}
                          onChange={(e) => setInvestAmount(Number(e.target.value))}
                          className="input"
                          min="100"
                          id="invest-amount-input"
                        />
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
                          Available Balance: ₹{walletBalance.toLocaleString()} (Simulated)
                        </span>
                      </div>

                      <div className="form-group">
                        <label className="label">Payment Channel</label>
                        <CustomSelect 
                          value={paymentMethod}
                          onChange={setPaymentMethod}
                          options={[
                            { label: "Instant Razorpay UPI", value: "UPI (Razorpay)" },
                            { label: "Instant Debit/Credit Card", value: "Card (Razorpay)" },
                            { label: "Offline Bank Transfer (NEFT/RTGS)", value: "Bank Transfer" },
                            { label: "Offline Cheque Payment", value: "Cheque" }
                          ]}
                          id="payment-method-select"
                        />
                      </div>

                      {paymentMethod !== "UPI (Razorpay)" && paymentMethod !== "Card (Razorpay)" && (
                        <div className="animate-fade-in" style={{ backgroundColor: 'var(--bg-tertiary)', padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: '16px' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
                            OFFLINE TRANSACTION LOGS
                          </span>
                          
                          <div className="form-group" style={{ marginBottom: '12px' }}>
                            <label className="label" style={{ fontSize: '0.75rem' }}>UTR / Reference Number</label>
                            <input 
                              type="text" 
                              placeholder="e.g. UTR123456789"
                              value={utrNumber}
                              onChange={(e) => setUtrNumber(e.target.value)}
                              className="input"
                              style={{ padding: '8px 12px' }}
                              id="utr-number"
                            />
                          </div>

                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="label" style={{ fontSize: '0.75rem' }}>Payment Slip Screenshot</label>
                            <input 
                              type="file" 
                              onChange={(e) => setOfflineProof(e.target.value)}
                              className="input"
                              style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                              id="offline-proof-file"
                            />
                          </div>
                        </div>
                      )}

                      <button type="submit" className="btn btn-primary" style={{ width: '100%' }} id="invest-submit-btn">
                        Proceed to Payment
                      </button>
                    </>
                  )}
                </form>
              )}

              {/* School Verification Details Badge */}
              <div style={{ marginTop: '24px', borderTop: '1px solid var(--border-color)', paddingTop: '16px', fontSize: '0.82rem' }}>
                <div style={{ display: 'flex', gap: '6px', color: 'var(--success)', fontWeight: 600 }}>
                  <span>🛡️</span>
                  <span>School credentials audited & verified</span>
                </div>
                <p style={{ color: 'var(--text-tertiary)', marginTop: '4px' }}>
                  KYC registry, bank statements, and principal letters verified.
                </p>
              </div>

            </div>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
