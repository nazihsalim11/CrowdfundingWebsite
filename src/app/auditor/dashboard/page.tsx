"use client";

import { useApp } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useState } from "react";

export default function AuditorDashboard() {
  const { 
    role, 
    expenses, 
    auditExpense,
    campaigns
  } = useApp();

  const [activeTab, setActiveTab] = useState<"expenses" | "contracts" | "schools">("expenses");
  const [auditNotesInput, setAuditNotesInput] = useState<{ [key: string]: string }>({});

  const pendingExpenses = expenses.filter(e => e.status === 'pending');
  const auditedExpenses = expenses.filter(e => e.status === 'approved' || e.status === 'rejected' || e.status === 'disbursed');

  const handleAuditSubmit = (expenseId: string, decision: 'approved' | 'rejected') => {
    const note = auditNotesInput[expenseId] || "Verified and reconciled with invoices.";
    auditExpense(expenseId, decision, note, "Auditor Smith");
    alert(`Expense audited and marked as ${decision}.`);
  };

  const handleNoteChange = (expenseId: string, val: string) => {
    setAuditNotesInput(prev => ({ ...prev, [expenseId]: val }));
  };

  if (role !== 'auditor') {
    return (
      <>
        <Navbar />
        <div style={{ padding: '80px 20px', textAlign: 'center' }}>
          <span style={{ fontSize: '3rem' }}>🔒</span>
          <h2 style={{ fontSize: '1.8rem', marginTop: '16px' }}>Access Restricted</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px', marginBottom: '24px' }}>Please switch to the Auditor Role in the Sandbox dropdown to view this portal.</p>
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
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Auditor Portal</span>
            <h4 style={{ fontSize: '0.98rem', marginTop: '4px' }}>Seed Global Auditor</h4>
          </div>

          <button onClick={() => setActiveTab("expenses")} className={`sidebar-link ${activeTab === "expenses" ? "active" : ""}`}>
            🧾 Audit Invoices ({pendingExpenses.length})
          </button>
          
          <button onClick={() => setActiveTab("contracts")} className={`sidebar-link ${activeTab === "contracts" ? "active" : ""}`}>
            📄 Audit Contracts
          </button>

          <button onClick={() => setActiveTab("schools")} className={`sidebar-link ${activeTab === "schools" ? "active" : ""}`}>
            🛡️ School Compliance
          </button>
        </aside>

        {/* Content */}
        <main className="dashboard-content">
          {activeTab === "expenses" && (
            <div>
              <div style={{ marginBottom: '30px' }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Audit School Expenditures</h1>
                <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Verify official merchant invoices uploaded by Seed Global administrators before disburse approvals.</p>
              </div>

              <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', fontWeight: 700 }}>Pending Review</h3>
              {pendingExpenses.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px' }}>
                  {pendingExpenses.map((exp) => (
                    <div className="card" key={exp.id} style={{ border: '1px solid var(--border-color)', padding: '24px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <div>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{exp.campaignTitle}</span>
                          <h4 style={{ fontSize: '1.15rem', marginTop: '4px' }}>{exp.description}</h4>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', display: 'block' }}>EXPENDITURE AMOUNT</span>
                          <strong style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>₹{exp.amount.toLocaleString()}</strong>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '30px', alignItems: 'center', backgroundColor: 'var(--bg-tertiary)', padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: '20px' }}>
                        <span style={{ fontSize: '0.85rem' }}>Merchant Bill File: <strong>{exp.invoiceUrl}</strong></span>
                        <a href="#" onClick={(e) => {e.preventDefault(); alert(`Reconciling invoice ${exp.invoiceUrl}`);}} style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.88rem', textAlign: 'right' }}>
                          🔍 Inspect PDF Document
                        </a>
                      </div>

                      <div className="form-group" style={{ marginBottom: '16px' }}>
                        <label className="label">Auditor Audit Comments</label>
                        <input 
                          type="text" 
                          placeholder="Provide invoice matching notes..."
                          value={auditNotesInput[exp.id] || ""} 
                          onChange={(e) => handleNoteChange(exp.id, e.target.value)}
                          className="input" 
                        />
                      </div>

                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button 
                          onClick={() => handleAuditSubmit(exp.id, 'approved')} 
                          className="btn btn-primary"
                          style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                        >
                          Verify & Approve (Passed)
                        </button>
                        <button 
                          onClick={() => handleAuditSubmit(exp.id, 'rejected')} 
                          className="btn btn-outline"
                          style={{ padding: '8px 16px', fontSize: '0.85rem', color: 'var(--danger)', borderColor: 'var(--danger)' }}
                        >
                          Flag & Reject (Failed)
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="card" style={{ padding: '30px', textAlign: 'center', border: '1px solid var(--border-color)', marginBottom: '40px' }}>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>No pending invoices to audit.</p>
                </div>
              )}

              <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', fontWeight: 700 }}>Recently Audited</h3>
              <div className="table-container" style={{ marginTop: 0 }}>
                <table>
                  <thead>
                    <tr>
                      <th>Expenditure Item</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditedExpenses.map((exp) => (
                      <tr key={exp.id}>
                        <td>
                          <div style={{ fontWeight: 600 }}>{exp.description}</div>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{exp.campaignTitle}</span>
                        </td>
                        <td style={{ fontWeight: 700 }}>₹{exp.amount.toLocaleString()}</td>
                        <td>
                          <span className={`badge ${
                            exp.status === 'disbursed' ? 'badge-success' :
                            exp.status === 'approved' ? 'badge-info' : 'badge-danger'
                          }`}>
                            {exp.status}
                          </span>
                        </td>
                        <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                          {exp.auditNotes}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "contracts" && (
            <div>
              <div style={{ marginBottom: '30px' }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Audit Investment Agreements</h1>
                <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Review digitally-signed legally binding investment contracts for active campaigns.</p>
              </div>

              <div className="table-container" style={{ marginTop: 0 }}>
                <table>
                  <thead>
                    <tr>
                      <th>Contract ID</th>
                      <th>Campaign Title</th>
                      <th>Exempt Status</th>
                      <th>Legal Execution</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ fontWeight: 600 }}>AGR-2026-0091</td>
                      <td>Smart Digital Classrooms for Excellence</td>
                      <td><span className="badge badge-success">80G Deductible</span></td>
                      <td>
                        <a href="#" onClick={(e) => {e.preventDefault(); alert("Opening Digitally Signed Contract...");}} style={{ color: 'var(--primary)', fontWeight: 600 }}>
                          📄 View PDF Contract
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 600 }}>AGR-2026-0042</td>
                      <td>Modern Computer Lab & Coding Center</td>
                      <td><span className="badge badge-success">80G Deductible</span></td>
                      <td>
                        <a href="#" onClick={(e) => {e.preventDefault(); alert("Opening Digitally Signed Contract...");}} style={{ color: 'var(--primary)', fontWeight: 600 }}>
                          📄 View PDF Contract
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "schools" && (
            <div>
              <div style={{ marginBottom: '30px' }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>School Compliance Auditing</h1>
                <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Review the compliance status of Seed Global Trust registry certificates.</p>
              </div>

              <div className="card" style={{ border: '1px solid var(--border-color)', padding: '30px' }}>
                <h4 style={{ marginBottom: '12px' }}>Seed Global Trust compliance details:</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.92rem', marginBottom: '24px' }}>
                  <div>• <strong>Aadhaar/PAN Registry:</strong> Verified Principal approval files.</div>
                  <div>• <strong>80G Registration No:</strong> AAATS4451PSD2901</div>
                  <div>• <strong>Status:</strong> Active & Audited.</div>
                </div>
                <button onClick={() => alert("All compliance items checked. Valid.")} className="btn btn-primary">
                  Verify Registry File
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </>
  );
}
