"use client";

import { useApp } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useState } from "react";

export default function CashierDashboard() {
  const { 
    role, 
    investments, 
    verifyOfflineInvestment,
    withdrawals,
    approveWithdrawal,
    rejectWithdrawal,
    expenses,
    disburseExpense
  } = useApp();

  const [activeTab, setActiveTab] = useState<"deposits" | "withdrawals" | "payouts" | "reserve">("deposits");

  // Filter cashier tasks
  const pendingDeposits = investments.filter(inv => inv.status === 'pending');
  const pendingWithdrawals = withdrawals.filter(w => w.status === 'pending');
  const pendingDisbursements = expenses.filter(exp => exp.status === 'approved'); // approved by admin/auditor but not yet disbursed (paid out to vendor)

  // Cash calculations
  const totalEscrowBalance = investments
    .filter(inv => inv.status === 'completed')
    .reduce((sum, inv) => sum + inv.amount, 0) - 
    expenses.filter(e => e.status === 'disbursed').reduce((sum, e) => sum + e.amount, 0);

  if (role !== 'cashier') {
    return (
      <>
        <Navbar />
        <div style={{ padding: '80px 20px', textAlign: 'center' }}>
          <span style={{ fontSize: '3rem' }}>🔒</span>
          <h2 style={{ fontSize: '1.8rem', marginTop: '16px' }}>Access Restricted</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px', marginBottom: '24px' }}>Please switch to the Cashier Role in the Sandbox dropdown to view this portal.</p>
          <Link href="/login" className="btn btn-primary">Go to Login</Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="dashboard-layout animate-fade-in">
        {/* Sidebar */}
        <aside className="sidebar">
          <div style={{ padding: '0 16px 20px 16px', borderBottom: '1px solid var(--border-color)', marginBottom: '16px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Cashier Portal</span>
            <h4 style={{ fontSize: '0.98rem', marginTop: '4px' }}>Seed Global Cashier</h4>
          </div>

          <button onClick={() => setActiveTab("deposits")} className={`sidebar-link ${activeTab === "deposits" ? "active" : ""}`}>
            📥 Verify Deposits ({pendingDeposits.length})
          </button>
          
          <button onClick={() => setActiveTab("withdrawals")} className={`sidebar-link ${activeTab === "withdrawals" ? "active" : ""}`}>
            📤 Payout Payouts ({pendingWithdrawals.length})
          </button>

          <button onClick={() => setActiveTab("payouts")} className={`sidebar-link ${activeTab === "payouts" ? "active" : ""}`}>
            🧾 Vendor Disburse ({pendingDisbursements.length})
          </button>

          <button onClick={() => setActiveTab("reserve")} className={`sidebar-link ${activeTab === "reserve" ? "active" : ""}`}>
            🏦 Escrow Vault
          </button>
        </aside>

        {/* Content */}
        <main className="dashboard-content">
          {activeTab === "deposits" && (
            <div>
              <div style={{ marginBottom: '30px' }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Verify Pending Deposits</h1>
                <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Verify investor bank deposits and wire receipts to credit project campaigns.</p>
              </div>

              {pendingDeposits.length > 0 ? (
                <div className="table-container" style={{ marginTop: 0 }}>
                  <table>
                    <thead>
                      <tr>
                        <th>Campaign / Supporter</th>
                        <th>Deposit Amount</th>
                        <th>Payment Method</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingDeposits.map((inv) => (
                        <tr key={inv.id}>
                          <td>
                            <div style={{ fontWeight: 600 }}>{inv.campaignTitle}</div>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>ID: {inv.id} on {inv.date}</span>
                          </td>
                          <td style={{ fontWeight: 700 }}>₹{inv.amount.toLocaleString()}</td>
                          <td>
                            <span className="badge badge-info" style={{ fontSize: '0.78rem' }}>{inv.paymentMethod}</span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '10px' }}>
                              <button 
                                onClick={() => verifyOfflineInvestment(inv.id)} 
                                className="btn btn-primary"
                                style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                              >
                                Confirm Receipt
                              </button>
                              <button 
                                onClick={() => alert("Marked transaction as failed. Notifying investor.")} 
                                className="btn btn-outline"
                                style={{ padding: '6px 12px', fontSize: '0.8rem', borderColor: 'var(--danger)', color: 'var(--danger)' }}
                              >
                                Flag Error
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="card" style={{ padding: '40px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '2rem' }}>✓</span>
                  <h4 style={{ marginTop: '12px' }}>No Pending Deposits</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '6px' }}>All investor deposit transactions are completed and reconciled.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "withdrawals" && (
            <div>
              <div style={{ marginBottom: '30px' }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Investor ROI Withdrawals</h1>
                <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Approve and execute bank transfers for profit withdrawals requested by supporters.</p>
              </div>

              {pendingWithdrawals.length > 0 ? (
                <div className="table-container" style={{ marginTop: 0 }}>
                  <table>
                    <thead>
                      <tr>
                        <th>Supporter Email</th>
                        <th>Requested Amount</th>
                        <th>Request Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingWithdrawals.map((wd) => (
                        <tr key={wd.id}>
                          <td>
                            <div style={{ fontWeight: 600 }}>{wd.investorEmail}</div>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Reference ID: {wd.id}</span>
                          </td>
                          <td style={{ fontWeight: 700 }}>₹{wd.amount.toLocaleString()}</td>
                          <td>{wd.date}</td>
                          <td>
                            <div style={{ display: 'flex', gap: '10px' }}>
                              <button 
                                onClick={() => approveWithdrawal(wd.id)} 
                                className="btn btn-primary"
                                style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                              >
                                Approve Transfer
                              </button>
                              <button 
                                onClick={() => rejectWithdrawal(wd.id)} 
                                className="btn btn-outline"
                                style={{ padding: '6px 12px', fontSize: '0.8rem', borderColor: 'var(--danger)', color: 'var(--danger)' }}
                              >
                                Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="card" style={{ padding: '40px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '2rem' }}>✓</span>
                  <h4 style={{ marginTop: '12px' }}>No Pending Payout Requests</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '6px' }}>All investor withdrawal requests have been verified and paid out.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "payouts" && (
            <div>
              <div style={{ marginBottom: '30px' }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Disburse Escrow to Vendors</h1>
                <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Disburse payment files directly to hardware/service merchants for audited invoices.</p>
              </div>

              {pendingDisbursements.length > 0 ? (
                <div className="table-container" style={{ marginTop: 0 }}>
                  <table>
                    <thead>
                      <tr>
                        <th>Project / Merchant Detail</th>
                        <th>Invoice Amount</th>
                        <th>Auditor Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingDisbursements.map((exp) => (
                        <tr key={exp.id}>
                          <td>
                            <div style={{ fontWeight: 600 }}>{exp.campaignTitle}</div>
                            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Invoice: {exp.description}</span>
                            <span style={{ fontSize: '0.78rem', display: 'block', color: 'var(--text-tertiary)', fontStyle: 'italic' }}>Notes: {exp.auditNotes}</span>
                          </td>
                          <td style={{ fontWeight: 700 }}>₹{exp.amount.toLocaleString()}</td>
                          <td>
                            <span className="badge badge-success" style={{ fontSize: '0.78rem' }}>Approved by {exp.auditedBy || 'Board'}</span>
                          </td>
                          <td>
                            <button 
                              onClick={() => disburseExpense(exp.id)} 
                              className="btn btn-primary"
                              style={{ padding: '8px 16px', fontSize: '0.8rem' }}
                            >
                              Disburse Funds (₹)
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="card" style={{ padding: '40px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '2rem' }}>✓</span>
                  <h4 style={{ marginTop: '12px' }}>No Pending Vendor Disbursals</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '6px' }}>All approved school expenditures have been dispatched from the escrow.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "reserve" && (
            <div>
              <div style={{ marginBottom: '30px' }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Escrow Trust Reserve</h1>
                <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Real-time audit tracking of the centralized Seed Global Escrow Wallet.</p>
              </div>

              <div className="stats-grid">
                <div className="stat-card">
                  <span className="stat-lbl">Central Vault Balance</span>
                  <span className="stat-val" style={{ color: 'var(--primary)', fontSize: '2.2rem', fontWeight: 800 }}>₹{totalEscrowBalance.toLocaleString()}</span>
                </div>
                <div className="stat-card">
                  <span className="stat-lbl">Gross Receipts Inflow</span>
                  <span className="stat-val" style={{ color: 'var(--text-primary)', fontSize: '2.2rem', fontWeight: 800 }}>
                    ₹{investments.filter(i => i.status === 'completed').reduce((s, i) => s + i.amount, 0).toLocaleString()}
                  </span>
                </div>
                <div className="stat-card">
                  <span className="stat-lbl">Gross Disbursements Outflow</span>
                  <span className="stat-val" style={{ color: 'var(--danger)', fontSize: '2.2rem', fontWeight: 800 }}>
                    ₹{expenses.filter(e => e.status === 'disbursed').reduce((s, e) => s + e.amount, 0).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="card" style={{ border: '1px solid var(--border-color)' }}>
                <h3 style={{ marginBottom: '16px' }}>Verified Settlement Logs</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '24px' }}>
                  All bank settlements on this platform are processed via the Sandbox bank simulation. In a live production configuration, this would reconcile deposits automatically through direct integrations with ICICI Bank and Razorpay Escrow accounts.
                </p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => alert("Printing Bank Ledger settlement statement...")} className="btn btn-outline">
                    🖨️ Export Settlement Ledger
                  </button>
                  <button onClick={() => alert("Re-syncing with simulated Razorpay webhooks...")} className="btn btn-outline">
                    🔄 Sync Virtual Accounts
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </>
  );
}
