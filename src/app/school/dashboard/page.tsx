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
    submitSchoolVerification,
    announcements,
    createAnnouncement
  } = useApp();

  const [activeTab, setActiveTab] = useState<"overview" | "create" | "expenses" | "verify" | "announcements">("overview");

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

  // Announcement Form State
  const [annTitle, setAnnTitle] = useState("");
  const [annContent, setAnnContent] = useState("");
  const [annCampaignId, setAnnCampaignId] = useState("");
  const [annType, setAnnType] = useState<"success" | "launch" | "important">("important");
  const [annBroadcastEmail, setAnnBroadcastEmail] = useState(false);

  // Email Broadcast Simulation State
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastProgress, setBroadcastProgress] = useState(0);
  const [broadcastLog, setBroadcastLog] = useState<string[]>([]);

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

  const startEmailBroadcast = (campaignId: string, title: string, content: string) => {
    setIsBroadcasting(true);
    setBroadcastProgress(0);
    setBroadcastLog(["Initializing SMTP Secure Connection..."]);

    let baseInvestors = 0;
    if (campaignId === 'c1') baseInvestors = 24;
    else if (campaignId === 'c2') baseInvestors = 48;
    else if (campaignId === 'c3') baseInvestors = 15;
    else if (campaignId === 'c4') baseInvestors = 8;
    else {
      const camp = campaigns.find(c => c.id === campaignId);
      baseInvestors = Math.max(1, Math.floor((camp?.raisedAmount || 0) / 50000));
    }

    const totalSteps = 4 + baseInvestors;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const pct = Math.round((currentStep / totalSteps) * 100);
      setBroadcastProgress(pct);

      if (currentStep === 1) {
        setBroadcastLog(prev => [...prev, "SMTP connection established over TLS 1.3 on port 465."]);
      } else if (currentStep === 2) {
        setBroadcastLog(prev => [...prev, "Drafting HTML mail templates with digital signatures..."]);
      } else if (currentStep === 3) {
        setBroadcastLog(prev => [...prev, `Found ${baseInvestors} active campaign backer(s). Generating mailing list...`]);
      } else if (currentStep > 3 && currentStep <= 3 + baseInvestors) {
        const investorIndex = currentStep - 4;
        let email = `investor${investorIndex + 1}@seedglobal.com`;
        if (investorIndex === 0) email = "investor@seedglobal.com";
        else if (investorIndex === 1) email = "john@example.com";
        setBroadcastLog(prev => [...prev, `Sending email broadcast to ${email}... [SUCCESS]`]);
      } else {
        setBroadcastLog(prev => [...prev, "✓ Broadcast Completed! All emails successfully sent and confirmed."]);
        clearInterval(interval);
      }
    }, 400);
  };

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annCampaignId || !annTitle || !annContent) {
      alert("Please fill in all announcement fields.");
      return;
    }

    createAnnouncement({
      campaignId: annCampaignId,
      title: annTitle,
      content: annContent,
      broadcastEmail: annBroadcastEmail
    });

    if (annBroadcastEmail) {
      startEmailBroadcast(annCampaignId, annTitle, annContent);
    } else {
      alert("Announcement published successfully!");
      resetAnnouncementForm();
    }
  };

  const handleTypeChange = (type: "success" | "launch" | "important", selectedCampId: string) => {
    setAnnType(type);
    const camp = campaigns.find(c => c.id === selectedCampId);
    const campName = camp ? camp.title : "[Select Campaign]";
    
    if (type === "success") {
      setAnnTitle(`Campaign Success: ${campName} has successfully raised its goal!`);
      setAnnContent(`We are incredibly proud to announce that the fundraising goal for "${campName}" has been successfully met! A total of ₹${camp ? camp.goalAmount.toLocaleString() : "0"} has been raised. Development and execution will begin immediately. Thank you to all our generous backers!`);
    } else if (type === "launch") {
      setAnnTitle(`New Project Live: Launching ${campName}`);
      setAnnContent(`We have officially launched our newest crowdfunding campaign: "${campName}"! This project aims to improve our school facilities. We invite you to check it out, view the projected ROIs, and help us reach our target.`);
    } else {
      setAnnTitle("Important Project Update");
      setAnnContent("");
    }
  };

  const resetAnnouncementForm = () => {
    setAnnTitle("");
    setAnnContent("");
    setAnnCampaignId("");
    setAnnType("important");
    setAnnBroadcastEmail(false);
    setIsBroadcasting(false);
    setBroadcastProgress(0);
    setBroadcastLog([]);
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

          <button onClick={() => setActiveTab("announcements")} className={`sidebar-link ${activeTab === "announcements" ? "active" : ""}`}>
            📣 Announcements & Broadcasts
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

          {activeTab === "announcements" && (
            <div>
              <div style={{ marginBottom: '30px' }}>
                <h1 style={{ fontSize: '2rem' }}>Announcements & Email Broadcasting</h1>
                <p style={{ color: 'var(--text-secondary)', marginTop: '6px' }}>Notify investors about campaign success, launch new projects, or post important updates.</p>
              </div>

              {/* Email Broadcast Simulation overlay */}
              {isBroadcasting && (
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
                  animation: 'fadeIn 0.25s ease-out'
                }}>
                  <div className="card" style={{
                    width: '550px',
                    backgroundColor: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1.5px solid var(--border-color)',
                    boxShadow: 'var(--shadow-lg)',
                    padding: '30px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px'
                  }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      📧 Broadcasting Email Notification...
                    </h3>
                    
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: 600, marginBottom: '8px' }}>
                        <span>Progress</span>
                        <span>{broadcastProgress}%</span>
                      </div>
                      <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                        <div style={{ width: `${broadcastProgress}%`, height: '100%', backgroundColor: 'var(--primary)', transition: 'width 0.2s ease-out' }}></div>
                      </div>
                    </div>

                    <div style={{
                      backgroundColor: 'var(--bg-primary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      padding: '16px',
                      height: '180px',
                      overflowY: 'auto',
                      fontFamily: 'monospace',
                      fontSize: '0.8rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                      color: 'var(--text-primary)'
                    }}>
                      {broadcastLog.map((log, idx) => (
                        <div key={idx}>{log}</div>
                      ))}
                    </div>

                    {broadcastProgress === 100 && (
                      <button 
                        onClick={resetAnnouncementForm}
                        className="btn btn-primary" 
                        style={{ width: '100%', marginTop: '10px' }}
                      >
                        Close & Finish
                      </button>
                    )}
                  </div>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                {/* Form to create announcement */}
                <div className="card" style={{ border: '1px solid var(--border-color)' }}>
                  <h3 style={{ marginBottom: '16px' }}>Draft Announcement</h3>
                  
                  <form onSubmit={handleCreateAnnouncement}>
                    <div className="form-group">
                      <label className="label">Select Target Campaign</label>
                      <CustomSelect 
                        value={annCampaignId} 
                        onChange={(val) => {
                          setAnnCampaignId(val);
                          handleTypeChange(annType, val);
                        }} 
                        placeholder="-- Choose Campaign --"
                        options={schoolCampaigns.map(c => ({
                          label: c.title,
                          value: c.id
                        }))}
                        id="ann-campaign-select"
                      />
                    </div>

                    {annCampaignId && (
                      <div className="card" style={{
                        backgroundColor: 'var(--primary-light)',
                        border: '1.5px solid var(--border-color)',
                        padding: '16px',
                        marginBottom: '20px',
                        borderRadius: 'var(--radius-md)'
                      }}>
                        <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                          Campaign Investor Statistics
                        </h4>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
                          <div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', display: 'block' }}>TOTAL INVESTORS</span>
                            <strong style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>
                              {(() => {
                                if (annCampaignId === 'c1') return 24;
                                if (annCampaignId === 'c2') return 48;
                                if (annCampaignId === 'c3') return 15;
                                if (annCampaignId === 'c4') return 8;
                                const camp = campaigns.find(c => c.id === annCampaignId);
                                return Math.max(1, Math.floor((camp?.raisedAmount || 0) / 50000));
                              })()} backer(s)
                            </strong>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', display: 'block' }}>TOTAL CONTRIBUTIONS</span>
                            <strong style={{ fontSize: '1.2rem', color: 'var(--success)' }}>
                              ₹{(campaigns.find(c => c.id === annCampaignId)?.raisedAmount || 0).toLocaleString()}
                            </strong>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="form-group">
                      <label className="label">Announcement Type / Template</label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {(["success", "launch", "important"] as const).map(t => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => handleTypeChange(t, annCampaignId)}
                            className="btn"
                            style={{
                              flex: 1,
                              fontSize: '0.8rem',
                              padding: '8px',
                              backgroundColor: annType === t ? 'var(--primary)' : 'var(--bg-tertiary)',
                              color: annType === t ? 'white' : 'var(--text-secondary)',
                              border: 'none'
                            }}
                          >
                            {t === 'success' ? '🏆 Success' : t === 'launch' ? '🚀 New Launch' : 'ℹ️ General'}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="label">Announcement Title</label>
                      <input 
                        type="text" 
                        placeholder="Enter announcement subject"
                        value={annTitle}
                        onChange={(e) => setAnnTitle(e.target.value)}
                        className="input"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="label">Announcement Details</label>
                      <textarea 
                        placeholder="Write the announcement body here..."
                        value={annContent}
                        onChange={(e) => setAnnContent(e.target.value)}
                        className="input"
                        rows={5}
                        required
                      />
                    </div>

                    <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                      <input 
                        type="checkbox" 
                        id="broadcast-email"
                        checked={annBroadcastEmail}
                        onChange={(e) => setAnnBroadcastEmail(e.target.checked)}
                        style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--primary)' }}
                      />
                      <label htmlFor="broadcast-email" style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', cursor: 'pointer', fontWeight: 600 }}>
                        📢 Broadcast via Email to all backer investors
                      </label>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                      {annBroadcastEmail ? "Publish & Broadcast via Email" : "Publish Announcement"}
                    </button>
                  </form>
                </div>

                {/* History of announcements */}
                <div className="card" style={{ border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', height: 'fit-content' }}>
                  <h3 style={{ marginBottom: '16px' }}>Published Announcements</h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {announcements.length > 0 ? (
                      announcements.map((ann) => (
                        <div key={ann.id} style={{
                          padding: '16px',
                          border: '1px solid var(--border-color)',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: 'var(--bg-primary)'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                            <span className="badge badge-info" style={{ fontSize: '0.72rem' }}>{ann.campaignTitle}</span>
                            <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>{ann.date}</span>
                          </div>
                          
                          <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '6px' }}>{ann.title}</h4>
                          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.4', marginBottom: '12px' }}>
                            {ann.content}
                          </p>

                          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '10px', fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                            <span>Backers: <strong>{ann.investorsCount}</strong> (Raised: ₹{ann.totalContributions.toLocaleString()})</span>
                            {ann.broadcastEmail ? (
                              <span style={{ color: 'var(--primary)', fontWeight: 600 }}>📧 Email Broadcasted</span>
                            ) : (
                              <span>Dashboard Only</span>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p style={{ fontStyle: 'italic', color: 'var(--text-tertiary)', textAlign: 'center', padding: '20px' }}>
                        No announcements posted yet.
                      </p>
                    )}
                  </div>
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
