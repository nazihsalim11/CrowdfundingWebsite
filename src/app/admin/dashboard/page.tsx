"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useApp } from "@/context/AppContext";
import SupportChat from "@/components/SupportChat";

export default function AdminDashboard() {
  const { 
    isLoggedIn, 
    role, 
    campaigns, 
    expenses, 
    kycStatus, 
    schoolVerificationStatus,
    approveCampaign,
    suspendCampaign,
    approveSchool,
    approveKyc,
    approveExpense,
    investments,
    roiRates,
    updateRoiRates,
    passwordResetRequests,
    approvePasswordReset,
    rejectPasswordReset
  } = useApp();

  const [activeTab, setActiveTab] = useState<"overview" | "campaigns" | "expenses" | "schools" | "users" | "messages" | "calculator" | "passwordResets">("overview");

  // Calculator config state
  const [labsRate, setLabsRate] = useState<number>(Math.round(roiRates.labs * 100));
  const [digitalRate, setDigitalRate] = useState<number>(Math.round(roiRates.digital * 100));
  const [busesRate, setBusesRate] = useState<number>(Math.round(roiRates.buses * 100));

  if (!isLoggedIn || role !== "admin") {
    return (
      <>
        <Navbar />
        <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
          <h2>Access Denied</h2>
          <p style={{ margin: '16px 0 24px 0', color: 'var(--text-secondary)' }}>You must be logged in as a **Super Admin** to view this portal.</p>
          <Link href="/login" className="btn btn-primary">Go to Login</Link>
        </div>
        <Footer />
      </>
    );
  }

  const handleSaveCalculatorConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (labsRate < 0 || digitalRate < 0 || busesRate < 0) {
      alert("Rates cannot be negative.");
      return;
    }
    updateRoiRates({
      labs: labsRate / 100,
      digital: digitalRate / 100,
      buses: busesRate / 100
    });
    alert("ROI Calculator configurations updated successfully! All investor metrics are updated in real-time.");
  };

  // Count items
  const pendingCampaigns = campaigns.filter(c => c.status === 'pending');
  const pendingExpenses = expenses.filter(e => e.status === 'pending');
  
  // Total stats
  const totalPlatformRaised = campaigns.reduce((acc, c) => acc + c.raisedAmount, 0);
  const totalSchoolsCount = 1;
  const activeCampaignsCount = campaigns.filter(c => c.status === 'active').length;

  return (
    <>
      <Navbar />

      <div className="dashboard-layout animate-fade-in">
        {/* Sidebar */}
        <aside className="sidebar" style={{ width: '280px' }}>
          <div style={{ padding: '0 16px 20px 16px', borderBottom: '1px solid var(--border-color)', marginBottom: '16px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Super Admin Portal</span>
            <h4 style={{ fontSize: '0.98rem', marginTop: '4px' }}>Compliance & Risk Auditor</h4>
          </div>

          <button onClick={() => setActiveTab("overview")} className={`sidebar-link ${activeTab === "overview" ? "active" : ""}`}>
            📊 Platform Overview
          </button>
          
          <button onClick={() => setActiveTab("campaigns")} className={`sidebar-link ${activeTab === "campaigns" ? "active" : ""}`}>
            📢 Campaign Approvals 
            {pendingCampaigns.length > 0 && (
              <span className="badge badge-warning" style={{ marginLeft: 'auto', fontSize: '0.7rem', padding: '2px 6px' }}>
                {pendingCampaigns.length}
              </span>
            )}
          </button>

          <button onClick={() => setActiveTab("expenses")} className={`sidebar-link ${activeTab === "expenses" ? "active" : ""}`}>
            🧾 Expense Invoice Audits
            {pendingExpenses.length > 0 && (
              <span className="badge badge-warning" style={{ marginLeft: 'auto', fontSize: '0.7rem', padding: '2px 6px' }}>
                {pendingExpenses.length}
              </span>
            )}
          </button>

          <button onClick={() => setActiveTab("schools")} className={`sidebar-link ${activeTab === "schools" ? "active" : ""}`}>
            🏫 School verifications
            {schoolVerificationStatus === 'pending' && (
              <span className="badge badge-warning" style={{ marginLeft: 'auto', fontSize: '0.7rem', padding: '2px 6px' }}>1</span>
            )}
          </button>

          <button onClick={() => setActiveTab("users")} className={`sidebar-link ${activeTab === "users" ? "active" : ""}`}>
            👤 Investor KYC Registry
            {kycStatus === 'pending' && (
              <span className="badge badge-warning" style={{ marginLeft: 'auto', fontSize: '0.7rem', padding: '2px 6px' }}>1</span>
            )}
          </button>

          <button onClick={() => setActiveTab("passwordResets")} className={`sidebar-link ${activeTab === "passwordResets" ? "active" : ""}`}>
            🔑 Password Reset Requests
            {passwordResetRequests.filter(r => r.status === 'pending').length > 0 && (
              <span className="badge badge-warning" style={{ marginLeft: 'auto', fontSize: '0.7rem', padding: '2px 6px' }}>
                {passwordResetRequests.filter(r => r.status === 'pending').length}
              </span>
            )}
          </button>

          <button onClick={() => setActiveTab("calculator")} className={`sidebar-link ${activeTab === "calculator" ? "active" : ""}`}>
            🧮 ROI Calculator Config
          </button>

          <button onClick={() => setActiveTab("messages")} className={`sidebar-link ${activeTab === "messages" ? "active" : ""}`}>
            💬 Investor Chats
          </button>
        </aside>

        {/* Main Content */}
        <main className="dashboard-content">

          {activeTab === "overview" && (
            <div>
              <div style={{ marginBottom: '30px' }}>
                <h1 style={{ fontSize: '2rem' }}>Super Admin Dashboard</h1>
                <p style={{ color: 'var(--text-secondary)', marginTop: '6px' }}>Platform-wide transaction monitoring, compliance analytics, and operational metrics.</p>
              </div>

              {/* Stats Widgets */}
              <div className="stats-grid">
                <div className="stat-card">
                  <span className="stat-lbl">Platform Gross Investments</span>
                  <span className="stat-val" style={{ color: 'var(--primary)' }}>₹{totalPlatformRaised.toLocaleString()}</span>
                </div>
                <div className="stat-card">
                  <span className="stat-lbl">Registered Schools</span>
                  <span className="stat-val" style={{ color: 'var(--secondary)' }}>{totalSchoolsCount}</span>
                </div>
                <div className="stat-card">
                  <span className="stat-lbl">Active Campaigns</span>
                  <span className="stat-val" style={{ color: 'var(--accent)' }}>{activeCampaignsCount}</span>
                </div>
                <div className="stat-card">
                  <span className="stat-lbl">Pending Tasks</span>
                  <span className="stat-val" style={{ color: 'var(--warning)' }}>
                    {pendingCampaigns.length + pendingExpenses.length + (kycStatus === 'pending' ? 1 : 0) + (schoolVerificationStatus === 'pending' ? 1 : 0) + passwordResetRequests.filter(r => r.status === 'pending').length}
                  </span>
                </div>
              </div>

              {/* Sandbox info alert */}
              <div className="card glass" style={{ marginBottom: '30px', borderLeft: '5px solid var(--primary)' }}>
                <h4 style={{ marginBottom: '8px' }}>💡 Interactive Sandbox Guide</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.6' }}>
                  This dashboard responds live to updates across the system! 
                  To test: Log in as a **School** or **Investor** to upload verification details or create campaigns/expenses. 
                  Then, toggle back to **Super Admin** here to audit, approve, or reject those submissions.
                </p>
              </div>

              {/* Live activity monitoring */}
              <div className="card">
                <h3 style={{ marginBottom: '16px' }}>Fraud & Auditing Alerts</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', fontSize: '0.88rem' }}>
                    <span style={{ color: 'var(--success)', fontWeight: 600 }}>✓ Zero suspicious IP logins detected</span>
                    <span style={{ color: 'var(--text-tertiary)' }}>Just now</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', fontSize: '0.88rem' }}>
                    <span style={{ color: 'var(--success)', fontWeight: 600 }}>✓ Razorpay transaction reconciliation status: 100% Matching</span>
                    <span style={{ color: 'var(--text-tertiary)' }}>5 mins ago</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', fontSize: '0.88rem' }}>
                    <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>ℹ️ Automatic data audit snapshot: backup generated successfully</span>
                    <span style={{ color: 'var(--text-tertiary)' }}>1 hour ago</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "campaigns" && (
            <div>
              <div style={{ marginBottom: '30px' }}>
                <h1 style={{ fontSize: '2rem' }}>Approve Campaign Submissions</h1>
                <p style={{ color: 'var(--text-secondary)', marginTop: '6px' }}>Audit proposed target amounts and project specifications before publishing.</p>
              </div>

              {pendingCampaigns.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {pendingCampaigns.map((camp) => (
                    <div className="card" key={camp.id}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                        <div>
                          <span className="badge badge-warning" style={{ marginBottom: '8px' }}>Pending Approval</span>
                          <h3 style={{ fontSize: '1.3rem' }}>{camp.title}</h3>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Proposed by: <strong>{camp.schoolName}</strong> (ID: {camp.schoolId})</span>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', display: 'block' }}>TARGET GOAL</span>
                          <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>₹{camp.goalAmount.toLocaleString()}</span>
                        </div>
                      </div>

                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', margin: '12px 0 20px 0', lineHeight: '1.6' }}>
                        {camp.description}
                      </p>

                      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', display: 'block' }}>ROI SCHEDULING</span>
                          <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{camp.roiEstimate}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button onClick={() => { approveCampaign(camp.id); alert("Campaign approved successfully!"); }} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                            ✓ Approve Campaign
                          </button>
                          <button onClick={() => { suspendCampaign(camp.id); alert("Campaign proposal suspended."); }} className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '0.85rem', color: 'var(--danger)', borderColor: 'var(--danger)' }}>
                            Suspend
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
                  <span style={{ fontSize: '2.5rem' }}>✓</span>
                  <h3 style={{ marginTop: '12px' }}>All Campaigns Audited</h3>
                  <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>There are no campaign proposals pending review.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "expenses" && (
            <div>
              <div style={{ marginBottom: '30px' }}>
                <h1 style={{ fontSize: '2rem' }}>Audit Expense Invoices</h1>
                <p style={{ color: 'var(--text-secondary)', marginTop: '6px' }}>Review billing receipts uploaded by schools to ensure accurate fund distribution.</p>
              </div>

              {pendingExpenses.length > 0 ? (
                <div className="table-container" style={{ marginTop: 0 }}>
                  <table>
                    <thead>
                      <tr>
                        <th>Campaign Title</th>
                        <th>Item Details</th>
                        <th>Amount</th>
                        <th>Receipt Document</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingExpenses.map((exp) => (
                        <tr key={exp.id}>
                          <td>{exp.campaignTitle}</td>
                          <td>
                            <div style={{ fontWeight: 600 }}>{exp.description}</div>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Logged on {exp.date}</span>
                          </td>
                          <td style={{ fontWeight: 800 }}>₹{exp.amount.toLocaleString()}</td>
                          <td>
                            <a href="#" onClick={(e) => { e.preventDefault(); alert(`Reviewing invoice ${exp.invoiceUrl}`); }} style={{ color: 'var(--primary)', fontWeight: 600 }}>
                              📄 Review invoice
                            </a>
                          </td>
                          <td>
                            <button onClick={() => { approveExpense(exp.id); alert("Expense audited and approved successfully!"); }} className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.78rem' }}>
                              Approve
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
                  <span style={{ fontSize: '2.5rem' }}>✓</span>
                  <h3 style={{ marginTop: '12px' }}>Ledgers Reconciled</h3>
                  <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>There are no outstanding invoices pending audit verification.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "schools" && (
            <div>
              <div style={{ marginBottom: '30px' }}>
                <h1 style={{ fontSize: '2rem' }}>Verify School Registrations</h1>
                <p style={{ color: 'var(--text-secondary)', marginTop: '6px' }}>Review government approval licenses, taxation forms, and principal authorizations.</p>
              </div>

              {schoolVerificationStatus === 'pending' ? (
                <div className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <div>
                      <span className="badge badge-warning" style={{ marginBottom: '8px' }}>Verification Required</span>
                      <h3>Seed Global</h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>Registered school admin ID: s1</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px', backgroundColor: 'var(--bg-tertiary)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                      <span>1. Government School registration Certificate</span>
                      <a href="#" onClick={(e) => {e.preventDefault(); alert("Viewing certificate_reg.pdf");}} style={{ color: 'var(--primary)', fontWeight: 600 }}>📄 Open doc</a>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                      <span>2. Tax Exemption Certificate (80G Status)</span>
                      <a href="#" onClick={(e) => {e.preventDefault(); alert("Viewing tax_exempt_80g.pdf");}} style={{ color: 'var(--primary)', fontWeight: 600 }}>📄 Open doc</a>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                      <span>3. Principal Authorization & ID letter</span>
                      <a href="#" onClick={(e) => {e.preventDefault(); alert("Viewing auth_principal.pdf");}} style={{ color: 'var(--primary)', fontWeight: 600 }}>📄 Open doc</a>
                    </div>
                  </div>

                  <button onClick={() => { approveSchool("s1"); alert("School registry status set to: VERIFIED"); }} className="btn btn-primary" style={{ width: '100%' }}>
                    Verify & Activate School Credentials
                  </button>
                </div>
              ) : (
                <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
                  <span style={{ fontSize: '2.5rem' }}>✓</span>
                  <h3 style={{ marginTop: '12px' }}>School Registry Up-to-Date</h3>
                  <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>No new school verification credentials are pending audit.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "users" && (
            <div>
              <div style={{ marginBottom: '30px' }}>
                <h1 style={{ fontSize: '2rem' }}>Investor KYC registry</h1>
                <p style={{ color: 'var(--text-secondary)', marginTop: '6px' }}>Verify investor identities to ensure compliance with money-laundering guidelines.</p>
              </div>

              {kycStatus === 'pending' ? (
                <div className="card" style={{ maxWidth: '500px' }}>
                  <span className="badge badge-warning" style={{ marginBottom: '8px' }}>KYC Pending Review</span>
                  <h3>Investor Compliance Audit</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: '6px 0 20px 0' }}>Simulated Investor registry item.</p>

                  <div style={{ backgroundColor: 'var(--bg-tertiary)', padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: '24px', fontSize: '0.9rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span>Document Type:</span>
                      <strong>Aadhaar Card</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span>Identifier:</span>
                      <strong>8920 1827 3849</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Scan File:</span>
                      <a href="#" onClick={(e) => {e.preventDefault(); alert("Viewing aadhaar_scanned.jpg");}} style={{ color: 'var(--primary)', fontWeight: 600 }}>📄 View file</a>
                    </div>
                  </div>

                  <button onClick={() => { approveKyc("investor"); alert("Investor KYC approved and verified!"); }} className="btn btn-primary" style={{ width: '100%' }}>
                    Approve KYC & Activate Wallet
                  </button>
                </div>
              ) : (
                <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
                  <span style={{ fontSize: '2.5rem' }}>✓</span>
                  <h3 style={{ marginTop: '12px' }}>KYC Register Verified</h3>
                  <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>There are no investor compliance documents pending audit.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "messages" && (
            <div>
              <div style={{ marginBottom: '30px' }}>
                <h1 style={{ fontSize: '2rem' }}>Investor Helpdesk Messaging</h1>
                <p style={{ color: 'var(--text-secondary)', marginTop: '6px' }}>Respond to direct compliance and operational inquiries from registered investors.</p>
              </div>
              <SupportChat mode="admin" />
            </div>
          )}

          {activeTab === "calculator" && (
            <div style={{ maxWidth: '600px' }}>
              <div style={{ marginBottom: '30px' }}>
                <h1 style={{ fontSize: '2rem' }}>ROI Calculator Config</h1>
                <p style={{ color: 'var(--text-secondary)', marginTop: '6px' }}>Configure target returns for the primary investment project classes.</p>
              </div>

              <div className="card" style={{ border: '1px solid var(--border-color)' }}>
                <h3 style={{ marginBottom: '16px' }}>Update Yield Percentages</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '24px' }}>
                  Updating these percentages modifies the return projections shown on the investor-facing dashboard immediately.
                </p>

                <form onSubmit={handleSaveCalculatorConfig}>
                  <div className="form-group" style={{ marginBottom: '20px' }}>
                    <label className="label">🖥️ Computer Labs ROI Rate (%)</label>
                    <input 
                      type="number"
                      value={labsRate}
                      onChange={(e) => setLabsRate(Number(e.target.value))}
                      className="input"
                      min="0"
                      max="100"
                      required
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: '20px' }}>
                    <label className="label">💻 Smart Classrooms ROI Rate (%)</label>
                    <input 
                      type="number"
                      value={digitalRate}
                      onChange={(e) => setDigitalRate(Number(e.target.value))}
                      className="input"
                      min="0"
                      max="100"
                      required
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: '24px' }}>
                    <label className="label">🚌 EV School Buses ROI Rate (%)</label>
                    <input 
                      type="number"
                      value={busesRate}
                      onChange={(e) => setBusesRate(Number(e.target.value))}
                      className="input"
                      min="0"
                      max="100"
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                    Save Calculator Configuration
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === "passwordResets" && (
            <div>
              <div style={{ marginBottom: '30px' }}>
                <h1 style={{ fontSize: '2rem' }}>Password Reset Requests</h1>
                <p style={{ color: 'var(--text-secondary)', marginTop: '6px' }}>Approve or reject password reset requests submitted by users who forgot their passwords.</p>
              </div>

              {passwordResetRequests.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {passwordResetRequests.map((req) => (
                    <div className="card" key={req.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
                          <span className={`badge ${req.status === 'pending' ? 'badge-warning' : req.status === 'approved' ? 'badge-success' : 'badge-danger'}`}>
                            {req.status.toUpperCase()}
                          </span>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Request Date: {req.date}</span>
                        </div>
                        <h3>{req.username}</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Email: <strong>{req.email}</strong></p>
                      </div>
                      
                      {req.status === 'pending' && (
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button 
                            onClick={() => { approvePasswordReset(req.id); alert(`Approved password reset for ${req.username}. Temporary password 'reset123' has been set.`); }} 
                            className="btn btn-primary" 
                            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                          >
                            ✓ Approve
                          </button>
                          <button 
                            onClick={() => { rejectPasswordReset(req.id); alert(`Rejected password reset for ${req.username}.`); }} 
                            className="btn btn-outline" 
                            style={{ padding: '8px 16px', fontSize: '0.85rem', color: 'var(--danger)', borderColor: 'var(--danger)' }}
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
                  <span style={{ fontSize: '2.5rem' }}>✓</span>
                  <h3 style={{ marginTop: '12px' }}>No Pending Requests</h3>
                  <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>There are no password reset requests to display.</p>
                </div>
              )}
            </div>
          )}

        </main>
      </div>

      <Footer />
    </>
  );
}
