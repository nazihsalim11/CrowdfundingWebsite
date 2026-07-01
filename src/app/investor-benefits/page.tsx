"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useApp } from "@/context/AppContext";

function CalculatorWidget() {
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

export default function InvestorBenefits() {
  return (
    <>
      <Navbar />
      
      <main className="container animate-slide-up" style={{ padding: '120px 24px 140px 24px' }}>
        <section style={{ textAlign: 'center', marginBottom: '100px', maxWidth: '800px', margin: '0 auto 100px auto' }}>
          <h1 style={{ fontSize: '3.2rem', marginBottom: '24px', fontWeight: 800, letterSpacing: '-0.02em' }}>Returns & ROI Model</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', lineHeight: '1.7' }}>
            Supporting projects at Seed Global creates micro-investments that yield real financial returns.
          </p>
        </section>

        {/* Benefits Grid */}
        <section className="grid-3" style={{ marginBottom: '120px', gap: '40px' }}>
          <div className="card" style={{ padding: '30px', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '2rem', display: 'block', marginBottom: '16px' }}>💰</span>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '12px' }}>Micro-Revenue Sharing</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: '1.5' }}>
              We generate income from coding bootcamps, EV school bus fares, and weekend lab rentals, sharing profits directly back with supporters.
            </p>
          </div>

          <div className="card" style={{ padding: '30px', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '2rem', display: 'block', marginBottom: '16px' }}>📝</span>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '12px' }}>Legally Binding Contracts</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: '1.5' }}>
              Every contribution triggers an automated, digitally-signed investment agreement between the school board and the investor.
            </p>
          </div>

          <div className="card" style={{ padding: '30px', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '2rem', display: 'block', marginBottom: '16px' }}>🎫</span>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '12px' }}>Tax Exemption (80G Status)</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: '1.5' }}>
              Our trust is government-certified, allowing contributors to claim direct tax exemptions on funding disbursements.
            </p>
          </div>
        </section>

        {/* Dynamic ROI Calculator Widget */}
        <section className="card" style={{ marginBottom: '80px', padding: '40px', border: '1px solid var(--border-color)' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>CALCULATOR</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '8px', letterSpacing: '-0.02em' }}>Projected Return Estimator</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '6px' }}>Select investment details to estimate your projected returns.</p>
          </div>

          <CalculatorWidget />
        </section>

        {/* Audit Details */}
        <section style={{ 
          backgroundColor: 'var(--bg-secondary)', 
          border: '1px solid var(--border-color)', 
          borderRadius: 'var(--radius-lg)', 
          padding: '40px',
          display: 'grid',
          gridTemplateColumns: '1.2fr 0.8fr',
          gap: '40px',
          alignItems: 'center',
          marginBottom: '60px'
        }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '16px' }}>Strict Accountability Protocols</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.6', marginBottom: '20px' }}>
              Unlike standard donations, school administrators cannot withdraw raised capital directly to external accounts. All funds are secured in a designated platform Escrow Wallet. The school must upload audited merchant invoices for Super Admin verification to disburse capital.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', gap: '8px', fontWeight: 600 }}>
                <span style={{ color: 'var(--success)' }}>✓</span>
                <span>Audit-proof ledger tracking visible to all investors</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', fontWeight: 600 }}>
                <span style={{ color: 'var(--success)' }}>✓</span>
                <span>Aadhaar/PAN verified school administrator credentials</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', fontWeight: 600 }}>
                <span style={{ color: 'var(--success)' }}>✓</span>
                <span>Immediate alerts upon expense log uploads</span>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', padding: '20px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
            <span style={{ fontSize: '4rem' }}>🛡️</span>
            <h4 style={{ fontSize: '1.2rem', marginTop: '12px' }}>100% Insured Registry</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '8px' }}>
              Fraud protection layers block unauthorized withdrawals and suspicious accounts.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '12px' }}>Ready to Start?</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Explore active opportunities and begin supporting our school with as little as ₹10,000.</p>
          <Link href="/campaigns" className="btn btn-primary" style={{ padding: '12px 28px' }}>
            Browse Campaigns
          </Link>
        </section>
      </main>

      <Footer />
    </>
  );
}
