"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useApp } from "@/context/AppContext";
import CustomSelect from "@/components/ui/select";

export default function InvestmentProgramsPage() {
  const { investmentPrograms, programInvestments, isLoggedIn, userEmail } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Filter programs
  const filteredPrograms = investmentPrograms.filter(prog => {
    const matchesSearch = prog.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          prog.schoolName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === "All" || 
                          (selectedStatus === "Active" && prog.status === "active") ||
                          (selectedStatus === "Completed" && prog.status === "completed") ||
                          (selectedStatus === "Suspended" && prog.status === "suspended");

    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <Navbar />
      
      <main className="container animate-slide-up" style={{ padding: '80px 24px 120px 24px' }}>
        <section style={{ marginBottom: '60px' }}>
          <h1 style={{ fontSize: '2.8rem', marginBottom: '16px', letterSpacing: '-0.02em', fontWeight: 500 }}>Investment Programs</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.6' }}>
            Participate in modern educational development. Purchase Investment Units in long-term school initiatives, configure your investment size, and unlock progressive transparency tiers.
          </p>
        </section>

        {/* Filter Bar */}
        <section style={{ 
          backgroundColor: 'var(--bg-secondary)', 
          border: '1px solid var(--border-color)', 
          borderRadius: 'var(--radius-lg)', 
          padding: '28px', 
          marginBottom: '50px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '20px',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Search Input */}
          <div style={{ flex: '1', minWidth: '250px' }}>
            <input 
              type="text" 
              placeholder="🔍 Search school name or investment program..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input"
              style={{ padding: '10px 16px', letterSpacing: '0.01em' }}
              id="search-programs"
            />
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            {/* Status Select */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '180px' }}>
              <span className="label" style={{ margin: 0, whiteSpace: 'nowrap' }}>Status:</span>
              <CustomSelect 
                value={selectedStatus} 
                onChange={setSelectedStatus} 
                options={[
                  { label: "All Statuses", value: "All" },
                  { label: "Active", value: "Active" },
                  { label: "Completed", value: "Completed" },
                  { label: "Suspended", value: "Suspended" }
                ]}
                id="select-program-status"
              />
            </div>
          </div>
        </section>

        {/* Programs List */}
        {filteredPrograms.length > 0 ? (
          <div className="grid-2">
            {filteredPrograms.map((prog) => {
              const totalRaised = prog.unitsSold * prog.unitPrice;
              const percent = Math.min(100, Math.round((totalRaised / prog.fundingGoal) * 100));
              const unitsTotal = prog.fundingGoal / prog.unitPrice;
              const unitsRemaining = Math.max(0, unitsTotal - prog.unitsSold);

              // Calculate owned units if logged in
              let ownedUnits = 0;
              if (isLoggedIn && userEmail) {
                ownedUnits = programInvestments
                  .filter(inv => inv.programId === prog.id && inv.investorEmail === userEmail && inv.paymentStatus === 'completed')
                  .reduce((sum, inv) => sum + inv.unitsPurchased, 0);
              }

              return (
                <div className="card" key={prog.id} style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '32px', border: '1px solid var(--border-color)', position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {prog.schoolName}
                    </span>
                    <span className={`badge ${
                      prog.status === 'active' ? 'badge-info' : 
                      prog.status === 'completed' ? 'badge-success' : 'badge-danger'
                    }`} style={{ position: 'static' }}>
                      {prog.status}
                    </span>
                  </div>

                  <h3 className="card-title" style={{ fontSize: '1.4rem', fontWeight: 600, marginBottom: '12px', lineHeight: '1.3' }}>{prog.title}</h3>

                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: '0 0 24px 0', flexGrow: 1, lineHeight: '1.6' }}>
                    {prog.description.substring(0, 140)}...
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px', backgroundColor: 'var(--bg-tertiary)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase' }}>Unit Price</span>
                      <p style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '1rem', marginTop: '2px' }}>₹{prog.unitPrice.toLocaleString()}</p>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase' }}>Units Sold / Total</span>
                      <p style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '1rem', marginTop: '2px' }}>{prog.unitsSold} / {unitsTotal}</p>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase' }}>Units Remaining</span>
                      <p style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '1rem', marginTop: '2px' }}>{unitsRemaining} units</p>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase' }}>Your Owned Units</span>
                      <p style={{ fontWeight: 600, color: ownedUnits > 0 ? 'var(--success)' : 'var(--text-primary)', fontSize: '1rem', marginTop: '2px' }}>
                        {ownedUnits} unit{ownedUnits !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>

                  <div className="progress-container" style={{ margin: 'auto 0 24px 0' }}>
                    <div className="progress-info" style={{ fontSize: '0.85rem', marginBottom: '6px' }}>
                      <span>{percent}% Funded</span>
                      <span style={{ fontWeight: 600 }}>₹{totalRaised.toLocaleString()} / ₹{prog.fundingGoal.toLocaleString()}</span>
                    </div>
                    <div className="progress-track" style={{ height: '6px' }}>
                      <div className="progress-fill" style={{ width: `${percent}%` }}></div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                    <div>
                      <span style={{ fontSize: '0.72rem', display: 'block', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase' }}>Bronze Threshold</span>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.88rem' }}>{prog.tierThresholds.bronze} unit{prog.tierThresholds.bronze !== 1 ? 's' : ''}</span>
                    </div>
                    <Link href={`/investment-programs/${prog.id}`} className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '0.88rem' }}>
                      View Program
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '80px 20px', 
            backgroundColor: 'var(--bg-secondary)', 
            border: '1px solid var(--border-color)', 
            borderRadius: 'var(--radius-lg)' 
          }}>
            <span style={{ fontSize: '3rem' }}>🔍</span>
            <h3 style={{ marginTop: '16px', fontSize: '1.4rem', fontWeight: 500 }}>No Investment Programs Found</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>Try modifying your search query.</p>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
