"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useApp } from "@/context/AppContext";

export default function Contact() {
  const { tickets, createTicket, isLoggedIn, role } = useApp();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !desc) {
      alert("Please fill in the ticket title and description.");
      return;
    }

    createTicket(title, desc);
    setIsSubmitted(true);
    setTitle("");
    setDesc("");

    setTimeout(() => {
      setIsSubmitted(false);
    }, 4000);
  };

  return (
    <>
      <Navbar />

      <main className="container animate-fade-in" style={{ padding: '60px 24px' }}>
        <section style={{ textAlign: 'center', marginBottom: '60px', maxWidth: '800px', margin: '0 auto 60px auto' }}>
          <span className="badge badge-info" style={{ marginBottom: '16px', padding: '6px 12px' }}>SUPPORT CENTER</span>
          <h1 style={{ fontSize: '2.8rem', marginBottom: '20px' }}>Contact & Helpdesk</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', lineHeight: '1.6' }}>
            Have questions about Razorpay transfers, offline checks, school audits, or KYC registration? Submit a support ticket.
          </p>
        </section>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'start' }}>
          {/* Submit ticket Form */}
          <div className="card">
            <h3 style={{ marginBottom: '16px' }}>Submit Support Request</h3>
            
            {isSubmitted && (
              <div style={{ 
                backgroundColor: 'rgba(16, 185, 129, 0.12)', 
                border: '1px solid #10b981', 
                color: '#10b981', 
                padding: '16px', 
                borderRadius: 'var(--radius-md)',
                marginBottom: '20px'
              }}>
                <strong>✨ Ticket Submitted Successfully!</strong>
                <p style={{ fontSize: '0.88rem', marginTop: '4px', color: 'var(--text-secondary)' }}>
                  Our Super Admin compliance desk will review and post a response shortly. Check your ticket history.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="label">Ticket Subject / Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. UPI transfer completed in bank but pending in SCMS"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input"
                  required
                  id="ticket-title"
                />
              </div>

              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label className="label">Detailed Complaint Description</label>
                <textarea 
                  placeholder="Describe your issue with transaction IDs, dates, or school credentials if applicable..."
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="input"
                  rows={5}
                  required
                  id="ticket-desc"
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }} id="ticket-submit-btn">
                File Support Ticket
              </button>
            </form>
          </div>

          {/* Ticket History */}
          <div className="card">
            <h3 style={{ marginBottom: '16px' }}>My Support Tickets</h3>
            
            {!isLoggedIn ? (
              <p style={{ fontStyle: 'italic', color: 'var(--text-tertiary)' }}>
                Please log in (as Investor, School, or Admin) to view your support history logs.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {tickets.length > 0 ? (
                  tickets.map(t => (
                    <div key={t.id} style={{ 
                      backgroundColor: 'var(--bg-tertiary)', 
                      padding: '16px', 
                      borderRadius: 'var(--radius-md)',
                      borderLeft: t.status === 'open' ? '4px solid var(--warning)' : '4px solid var(--success)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontWeight: 200, fontSize: '0.95rem' }}>{t.title}</span>
                        <span className={`badge ${t.status === 'resolved' ? 'badge-success' : 'badge-warning'}`}>
                          {t.status}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>{t.description}</p>
                      
                      {t.response && (
                        <div style={{ 
                          marginTop: '12px', 
                          paddingTop: '12px', 
                          borderTop: '1px solid var(--border-color)',
                          fontSize: '0.88rem',
                          color: 'var(--text-primary)'
                        }}>
                          <strong>💬 Admin Response:</strong>
                          <p style={{ marginTop: '4px', color: 'var(--text-secondary)' }}>{t.response}</p>
                        </div>
                      )}
                      
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '8px', textAlign: 'right' }}>
                        Filed on {t.date}
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ fontStyle: 'italic', color: 'var(--text-tertiary)' }}>
                    No support requests filed yet.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
