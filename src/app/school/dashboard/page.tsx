"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useApp } from "@/context/AppContext";
import CustomSelect from "@/components/ui/select";

export default function SchoolDashboard() {
  const { 
    isLoggedIn, 
    role, 
    campaigns, 
    expenses, 
    schoolVerificationStatus,
    createCampaign,
    addExpense,
    submitSchoolVerification
  } = useApp();

  const [activeTab, setActiveTab] = useState<"overview" | "create" | "expenses" | "verify">("overview");

  // Campaign Form State
  const [campTitle, setCampTitle] = useState("");
  const [campDesc, setCampDesc] = useState("");
  const [campType, setCampType] = useState("Digital education");
  const [campGoal, setCampGoal] = useState<number>(10000);
  const [campDeadline, setCampDeadline] = useState("");
  const [campRoi, setCampRoi] = useState("8% Annually");
  const [milestones, setMilestones] = useState<string>("Infrastructure Setup, Hardware Delivery, Installation");

  // Expense Form State
  const [expCampaign, setExpCampaign] = useState("");
  const [expDesc, setExpDesc] = useState("");
  const [expAmount, setExpAmount] = useState<number>(100);
  const [expInvoice, setExpInvoice] = useState("");

  // Verification Form State
  const [regCert, setRegCert] = useState("");
  const [govAppr, setGovAppr] = useState("");
  const [principalLetter, setPrincipalLetter] = useState("");

  if (!isLoggedIn || role !== "school") {
    return (
      <>
        <Navbar />
        <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
          <h2>Access Denied</h2>
          <p style={{ margin: '16px 0 24px 0', color: 'var(--text-secondary)' }}>You must be logged in as a **School Admin** to view this portal.</p>
          <Link href="/login" className="btn btn-primary">Go to Login</Link>
        </div>
        <Footer />
      </>
    );
  }

  // Filter school campaigns (simulate s1 school admin)
  const schoolCampaigns = campaigns.filter(c => c.schoolId === "s1" || c.schoolName.includes("Seed Global") || c.id.startsWith("c_new"));

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campTitle || !campDesc || !campDeadline) {
      alert("Please fill in campaign title, description, and deadline.");
      return;
    }

    const mList = milestones.split(',').map(m => ({ title: m.trim(), completed: false }));

    createCampaign({
      title: campTitle,
      description: campDesc,
      schoolName: "Seed Global",
      schoolId: "s1",
      type: campType,
      goalAmount: campGoal,
      deadline: campDeadline,
      mediaUrl: "/images/custom.jpg",
      roiEstimate: campRoi,
      milestones: mList
    });

    alert("Campaign proposal created! Your campaign is now awaiting Super Admin verification.");
    setCampTitle("");
    setCampDesc("");
    setCampGoal(10000);
    setCampDeadline("");
    setActiveTab("overview");
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expCampaign || !expDesc || expAmount <= 0) {
      alert("Please select campaign and enter expense descriptions/amounts.");
      return;
    }

    const selectedCamp = campaigns.find(c => c.id === expCampaign);
    if (!selectedCamp) return;

    addExpense({
      campaignId: expCampaign,
      campaignTitle: selectedCamp.title,
      description: expDesc,
      amount: expAmount,
      date: new Date().toISOString().split('T')[0],
      invoiceUrl: expInvoice || "/docs/custom_invoice.pdf"
    });

    alert("Expense uploaded and added to ledger. Pending Super Admin audit approval.");
    setExpDesc("");
    setExpAmount(100);
    setExpInvoice("");
    setActiveTab("expenses");
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regCert || !principalLetter) {
      alert("Please upload School Registration Certificate and Principal Authorization Letter.");
      return;
    }
    submitSchoolVerification({ regCert, govAppr, principalLetter });
    alert("School verification documents uploaded. Admin will review within 24 hours.");
  };

  // Calculate statistics
  const totalRaised = schoolCampaigns.reduce((acc, c) => acc + c.raisedAmount, 0);
  const activeCampaignsCount = schoolCampaigns.filter(c => c.status === 'active').length;
  
  // Calculate spent (approved expenses)
  const schoolCampaignIds = schoolCampaigns.map(c => c.id);
  const schoolExpenses = expenses.filter(e => schoolCampaignIds.includes(e.campaignId));
  const totalSpentApproved = schoolExpenses.reduce((acc, e) => acc + (e.status === 'approved' ? e.amount : 0), 0);
  const remainingUnspent = totalRaised - totalSpentApproved;

  return (
    <>
      <Navbar />

      <div className="dashboard-layout animate-fade-in">
        {/* Sidebar */}
        <aside className="sidebar">
          <div style={{ padding: '0 16px 20px 16px', borderBottom: '1px solid var(--border-color)', marginBottom: '16px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>School Portal</span>
            <h4 style={{ fontSize: '0.98rem', marginTop: '4px' }}>Seed Global</h4>
          </div>

          <button onClick={() => setActiveTab("overview")} className={`sidebar-link ${activeTab === "overview" ? "active" : ""}`}>
            🏫 Campaigns Overview
          </button>
          
          <button onClick={() => setActiveTab("create")} className={`sidebar-link ${activeTab === "create" ? "active" : ""}`}>
            📢 Launch Campaign
          </button>

          <button onClick={() => setActiveTab("expenses")} className={`sidebar-link ${activeTab === "expenses" ? "active" : ""}`}>
            🧾 Log Expense/Receipts
          </button>

          <button onClick={() => setActiveTab("verify")} className={`sidebar-link ${activeTab === "verify" ? "active" : ""}`}>
            🛡️ School Verification
          </button>
        </aside>

        {/* Main Content */}
        <main className="dashboard-content">

          {activeTab === "overview" && (
            <div>
              <div style={{ marginBottom: '30px' }}>
                <h1 style={{ fontSize: '2rem' }}>School Dashboard</h1>
                <p style={{ color: 'var(--text-secondary)', marginTop: '6px' }}>Monitor fundraising campaigns, raised capital, and audit-proof ledger expenditures.</p>
              </div>

              {/* Stats Widgets */}
              <div className="stats-grid">
                <div className="stat-card">
                  <span className="stat-lbl">Total Funds Raised</span>
                  <span className="stat-val" style={{ color: 'var(--primary)' }}>₹{totalRaised.toLocaleString()}</span>
                </div>
                <div className="stat-card">
                  <span className="stat-lbl">Active Campaigns</span>
                  <span className="stat-val" style={{ color: 'var(--secondary)' }}>{activeCampaignsCount}</span>
                </div>
                <div className="stat-card">
                  <span className="stat-lbl">Spent (Approved Bills)</span>
                  <span className="stat-val" style={{ color: 'var(--danger)' }}>₹{totalSpentApproved.toLocaleString()}</span>
                </div>
                <div className="stat-card">
                  <span className="stat-lbl">Remaining Balance</span>
                  <span className="stat-val" style={{ color: 'var(--success)' }}>₹{remainingUnspent.toLocaleString()}</span>
                </div>
              </div>

              {/* Campaigns table */}
              <div className="card" style={{ marginBottom: '30px' }}>
                <h3 style={{ marginBottom: '16px' }}>Our Campaigns</h3>
                <div className="table-container" style={{ marginTop: 0 }}>
                  <table>
                    <thead>
                      <tr>
                        <th>Campaign Title</th>
                        <th>Goal Amount</th>
                        <th>Raised Amount</th>
                        <th>Deadline</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {schoolCampaigns.map((camp) => (
                        <tr key={camp.id}>
                          <td style={{ fontWeight: 600 }}>{camp.title}</td>
                          <td style={{ fontWeight: 700 }}>₹{camp.goalAmount.toLocaleString()}</td>
                          <td style={{ color: 'var(--primary)', fontWeight: 700 }}>₹{camp.raisedAmount.toLocaleString()}</td>
                          <td>{camp.deadline}</td>
                          <td>
                            <span className={`badge ${
                              camp.status === 'active' ? 'badge-info' : 
                              camp.status === 'completed' ? 'badge-success' : 
                              camp.status === 'suspended' ? 'badge-danger' : 'badge-warning'
                            }`}>
                              {camp.status}
                            </span>
                          </td>
                          <td>
                            <Link href={`/campaigns/${camp.id}`} style={{ color: 'var(--primary)', fontWeight: 600 }}>
                              View
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "create" && (
            <div className="card" style={{ maxWidth: '650px' }}>
              <h3 style={{ marginBottom: '16px' }}>Propose Crowdfunding Campaign</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '24px' }}>
                Create a project proposal. A Super Admin will audit the goal, milestone items, and ROI sharing schedule before approving it for the public active registry.
              </p>

              <form onSubmit={handleCreateCampaign}>
                <div className="form-group">
                  <label className="label">Campaign Title</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Modern Library Books & Study Cubicles"
                    value={campTitle}
                    onChange={(e) => setCampTitle(e.target.value)}
                    className="input"
                    required
                    id="camp-title"
                  />
                </div>

                 <div className="form-group">
                   <label className="label">Project Categories</label>
                   <CustomSelect 
                     value={campType} 
                     onChange={setCampType} 
                     options={[
                       { label: "Digital learning resources", value: "Digital education" },
                       { label: "Computer / Coding Workstations", value: "Computer labs" },
                       { label: "School bus / Transportation services", value: "School buses" },
                       { label: "Scholarships / Underprivileged Student aid", value: "Scholarships" }
                     ]}
                     id="camp-category"
                   />
                 </div>

                <div className="form-group">
                  <label className="label">Expected Target Fund (₹)</label>
                  <input 
                    type="number" 
                    value={campGoal}
                    onChange={(e) => setCampGoal(Number(e.target.value))}
                    className="input"
                    min="1000"
                    required
                    id="camp-goal"
                  />
                </div>

                <div className="form-group">
                  <label className="label">Target Date Deadline</label>
                  <input 
                    type="date" 
                    value={campDeadline}
                    onChange={(e) => setCampDeadline(e.target.value)}
                    className="input"
                    required
                    id="camp-deadline"
                  />
                </div>

                <div className="form-group">
                  <label className="label">Simulated ROI / Sharing Plan</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 7% return (via library rentals)"
                    value={campRoi}
                    onChange={(e) => setCampRoi(e.target.value)}
                    className="input"
                    id="camp-roi"
                  />
                </div>

                <div className="form-group">
                  <label className="label">Milestones (Comma Separated)</label>
                  <textarea 
                    value={milestones}
                    onChange={(e) => setMilestones(e.target.value)}
                    className="input"
                    rows={3}
                    id="camp-milestones"
                  />
                </div>

                <div className="form-group">
                  <label className="label">Project Scope & Description</label>
                  <textarea 
                    placeholder="Provide full breakdown of what this project funds..."
                    value={campDesc}
                    onChange={(e) => setCampDesc(e.target.value)}
                    className="input"
                    rows={4}
                    required
                    id="camp-desc"
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%' }} id="camp-submit-btn">
                  Publish Campaign Proposal
                </button>
              </form>
            </div>
          )}

          {activeTab === "expenses" && (
            <div style={{ display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: '30px' }}>
              {/* Form to log expense */}
              <div className="card">
                <h3 style={{ marginBottom: '16px' }}>Upload Invoice & Receipt</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '20px' }}>
                  Log expenditures to maintain total financial transparency. All bills require a Super Admin compliance audit.
                </p>

                <form onSubmit={handleAddExpense}>
                  <div className="form-group">
                    <label className="label">Choose Campaign</label>
                    <CustomSelect 
                      value={expCampaign} 
                      onChange={setExpCampaign} 
                      placeholder="-- Choose Campaign --"
                      options={schoolCampaigns.map(c => ({
                        label: c.title,
                        value: c.id
                      }))}
                      id="expense-campaign-select"
                    />
                  </div>

                  <div className="form-group">
                    <label className="label">Expense Amount (₹)</label>
                    <input 
                      type="number"
                      value={expAmount}
                      onChange={(e) => setExpAmount(Number(e.target.value))}
                      className="input"
                      min="1"
                      required
                      id="expense-amount-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="label">Invoice Receipt Upload</label>
                    <input 
                      type="file"
                      onChange={(e) => setExpInvoice(e.target.value)}
                      className="input"
                      required
                      id="expense-file-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="label">Expense Item Breakdown</label>
                    <textarea 
                      placeholder="e.g. Procurement of 20 coding desks from vendor."
                      value={expDesc}
                      onChange={(e) => setExpDesc(e.target.value)}
                      className="input"
                      rows={3}
                      required
                      id="expense-desc-input"
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: '100%' }} id="expense-submit-btn">
                    Log Bill to Ledger
                  </button>
                </form>
              </div>

              {/* Expense history */}
              <div className="card">
                <h3 style={{ marginBottom: '16px' }}>Logged Expense Ledgers</h3>
                {schoolExpenses.length > 0 ? (
                  <div className="table-container" style={{ marginTop: 0 }}>
                    <table>
                      <thead>
                        <tr>
                          <th>Description</th>
                          <th>Amount</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {schoolExpenses.map(exp => (
                          <tr key={exp.id}>
                            <td>
                              <div style={{ fontWeight: 600 }}>{exp.description}</div>
                              <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
                                Campaign ID: {exp.campaignId} ({exp.date})
                              </span>
                            </td>
                            <td style={{ fontWeight: 700 }}>₹{exp.amount.toLocaleString()}</td>
                            <td>
                              <span className={`badge ${
                                exp.status === 'approved' ? 'badge-success' : 
                                exp.status === 'pending' ? 'badge-warning' : 'badge-danger'
                              }`}>
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
                    No expenses logged yet.
                  </p>
                )}
              </div>
            </div>
          )}

          {activeTab === "verify" && (
            <div className="card" style={{ maxWidth: '600px' }}>
              <h3 style={{ marginBottom: '16px' }}>School Identity Verification</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '24px' }}>
                Upload official credentials to verify the legitimacy of your school. This is required before campaigns can go public.
              </p>

              {schoolVerificationStatus === 'verified' ? (
                <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.12)', border: '1px solid #10b981', color: '#10b981', padding: '20px', borderRadius: 'var(--radius-md)' }}>
                  <h4>✓ Seed Global is fully verified</h4>
                  <p style={{ fontSize: '0.88rem', marginTop: '6px', color: 'var(--text-secondary)' }}>
                    Your school registration documents, Tax IDs, and principal approval letters have been audited and verified. All platform features are active.
                  </p>
                </div>
              ) : schoolVerificationStatus === 'pending' ? (
                <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.12)', border: '1px solid #f59e0b', color: '#f59e0b', padding: '20px', borderRadius: 'var(--radius-md)' }}>
                  <h4>⌛ Verification Pending</h4>
                  <p style={{ fontSize: '0.88rem', marginTop: '6px', color: 'var(--text-secondary)' }}>
                    Our compliance auditors are reviewing your uploaded certificates.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleVerifySubmit}>
                  <div className="form-group">
                    <label className="label">Government School Registration Certificate</label>
                    <input 
                      type="file"
                      onChange={(e) => setRegCert(e.target.value)}
                      className="input"
                      required
                      id="school-cert"
                    />
                  </div>

                  <div className="form-group">
                    <label className="label">Tax Exemption Certificate (e.g. 80G/12A)</label>
                    <input 
                      type="file"
                      onChange={(e) => setGovAppr(e.target.value)}
                      className="input"
                      id="school-tax"
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: '24px' }}>
                    <label className="label">Principal Authorization & Authority Letter</label>
                    <input 
                      type="file"
                      onChange={(e) => setPrincipalLetter(e.target.value)}
                      className="input"
                      required
                      id="school-principal"
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: '100%' }} id="school-verify-btn">
                    Submit School Verification Documents
                  </button>
                </form>
              )}
            </div>
          )}

        </main>
      </div>

      <Footer />
    </>
  );
}
