"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useApp } from "@/context/AppContext";

export default function Home() {
  const { campaigns, investmentPrograms } = useApp();
  
  // Show active programs
  const activePrograms = investmentPrograms ? investmentPrograms.filter(p => p.status === 'active') : [];
  
  // Show active campaigns
  const activeCampaigns = campaigns.filter(c => c.status === 'active').slice(0, 2);
  
  // Calculate total stats
  const totalInvestedInPrograms = investmentPrograms ? investmentPrograms.reduce((acc, p) => acc + (p.unitsSold * p.unitPrice), 0) : 0;
  const totalRaisedCampaigns = campaigns.reduce((acc, c) => acc + c.raisedAmount, 0);
  const totalInvestorsCount = 284; // simulated

  return (
    <>
      <Navbar />
      
      <main className="animate-fade-in">
        {/* Ultra-Minimal Centered Hero (First Fold) */}
        <section style={{ 
          position: 'relative', 
          padding: '200px 0 180px 0', 
          background: 'radial-gradient(circle at center, rgba(16, 185, 129, 0.04) 0%, transparent 60%)',
          borderBottom: '1px solid var(--border-color)',
          overflow: 'hidden'
        }}>
          {/* Color blobs for dynamic premium visuals */}
          <div className="color-blob-primary" />
          <div className="color-blob-secondary" />
          <div className="color-blob-accent" />
 
          <div className="container animate-slide-up" style={{ maxWidth: '800px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <h1 style={{ 
              fontSize: '4.2rem', 
              marginBottom: '28px', 
              fontWeight: 200, 
              letterSpacing: '-0.03em', 
              lineHeight: '1.1' 
            }}>
              <span style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>School Investing</span> Portal
            </h1>
            <p style={{ 
              fontSize: '1.25rem', 
              color: 'var(--text-secondary)', 
              lineHeight: '1.6', 
              marginBottom: '48px', 
              maxWidth: '620px', 
              margin: '0 auto 48px auto' 
            }}>
              Acquire yield-generating units in verified school infrastructure programs. Access tiered transparency portals and track returns in real-time.
            </p>
            
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <Link href="/investment-programs" className="btn btn-primary" style={{ padding: '14px 28px', fontSize: '1rem' }}>
                Explore Investment Programs
              </Link>
              <Link href="/campaigns" className="btn btn-outline" style={{ padding: '14px 28px', fontSize: '1rem' }}>
                Campaign Donations
              </Link>
            </div>
          </div>
        </section>

        <hr className="section-divider" />

        {/* Spacious Stats Grid */}
        <section style={{ padding: '80px 0', backgroundColor: 'var(--bg-secondary)' }}>
          <div className="container animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '40px' }}>
              <div style={{ textAlign: 'center', minWidth: '180px' }}>
                <span style={{ color: 'var(--primary)', fontSize: '2.5rem', fontWeight: 200, fontFamily: 'var(--font-display)' }}>
                  ₹{(totalInvestedInPrograms / 100000).toFixed(1)}L+
                </span>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 200, textTransform: 'uppercase', marginTop: '6px', letterSpacing: '0.08em' }}>Capital Invested</p>
              </div>
              <div style={{ textAlign: 'center', minWidth: '180px' }}>
                <span style={{ color: 'var(--text-primary)', fontSize: '2.5rem', fontWeight: 200, fontFamily: 'var(--font-display)' }}>
                  {investmentPrograms ? investmentPrograms.length : 0}
                </span>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 200, textTransform: 'uppercase', marginTop: '6px', letterSpacing: '0.08em' }}>Active Programs</p>
              </div>
              <div style={{ textAlign: 'center', minWidth: '180px' }}>
                <span style={{ color: 'var(--text-primary)', fontSize: '2.5rem', fontWeight: 200, fontFamily: 'var(--font-display)' }}>
                  ₹{(totalRaisedCampaigns / 100000).toFixed(1)}L
                </span>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 200, textTransform: 'uppercase', marginTop: '6px', letterSpacing: '0.08em' }}>Campaign Donations</p>
              </div>
              <div style={{ textAlign: 'center', minWidth: '180px' }}>
                <span style={{ color: 'var(--success)', fontSize: '2.5rem', fontWeight: 200, fontFamily: 'var(--font-display)' }}>
                  {totalInvestorsCount}
                </span>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 200, textTransform: 'uppercase', marginTop: '6px', letterSpacing: '0.08em' }}>Supporters</p>
              </div>
            </div>
          </div>
        </section>

        <hr className="section-divider" />

        {/* Featured Program Showcase (Second Fold) */}
        <section style={{ padding: '160px 0' }}>
          <div className="container animate-scale-up">
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 200, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '8px' }}>PRIMARY SPOTLIGHT</span>
              <h2 style={{ fontSize: '2rem', fontWeight: 200, letterSpacing: '-0.02em' }}>Featured Investment Program</h2>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
              <div style={{
                height: '340px',
                backgroundImage: 'url(/images/School_photo.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-md)'
              }} />
              
              <div style={{ padding: '20px 0' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '16px' }}>
                  <span className="badge badge-success" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>ACTIVE</span>
                  <span style={{ color: 'var(--text-tertiary)', fontSize: '0.88rem' }}>•</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 200, color: 'var(--text-secondary)' }}>CAMPUS EXPANSION</span>
                </div>
                
                <h3 style={{ fontSize: '1.8rem', marginBottom: '16px', fontWeight: 200 }}>Seed Global Campus Expansion</h3>
                <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: '1.6' }}>
                  Purchase fractional investment units in the physical building and expansion of our secondary wing. Backers earn long-term rental yield and dividends from adult training facilities.
                </p>
                
                <div className="progress-container" style={{ margin: '24px 0 32px 0' }}>
                  <div className="progress-info" style={{ fontSize: '0.85rem', marginBottom: '8px' }}>
                    <span>40% Funded</span>
                    <span style={{ fontWeight: 200 }}>₹20,00,000 / ₹50,00,000</span>
                  </div>
                  <div className="progress-track" style={{ height: '6px' }}>
                    <div className="progress-fill" style={{ width: '40%' }}></div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', display: 'block', color: 'var(--text-tertiary)', fontWeight: 200 }}>UNIT PRICE</span>
                    <span style={{ fontWeight: 200, color: 'var(--text-primary)', fontSize: '1.05rem' }}>₹1,000 / Unit</span>
                  </div>
                  <Link href="/investment-programs/p1" className="btn btn-primary" style={{ padding: '12px 28px', fontSize: '0.95rem' }}>
                    Acquire Units
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <hr className="section-divider" />

        {/* Primary Investment Programs Registry */}
        <section style={{ padding: '160px 0' }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '60px' }}>
              <div>
                <h2 style={{ fontSize: '2rem', fontWeight: 200, letterSpacing: '-0.02em' }}>Primary Investment Programs</h2>
                <p style={{ color: 'var(--text-secondary)', marginTop: '8px', fontSize: '0.98rem' }}>Acquire fractional units in high-yield institutional education programs.</p>
              </div>
              <Link href="/investment-programs" className="btn btn-outline" style={{ padding: '10px 20px', fontSize: '0.9rem' }}>
                View All Programs
              </Link>
            </div>

            <div className="grid-3" style={{ gap: '40px', marginBottom: '80px' }}>
              {activePrograms.slice(0, 3).map((prog) => {
                const totalRaised = prog.unitsSold * prog.unitPrice;
                const percent = Math.min(100, Math.round((totalRaised / prog.fundingGoal) * 100));
                return (
                  <div className="card" key={prog.id} style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '36px', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 200, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {prog.schoolName}
                      </span>
                      <span className="badge badge-success" style={{ textTransform: 'uppercase', fontSize: '0.75rem', padding: '3px 8px' }}>
                        {prog.status}
                      </span>
                    </div>

                    <h3 className="card-title" style={{ fontSize: '1.25rem', fontWeight: 200, marginBottom: '24px', minHeight: '44px', lineHeight: '1.3' }}>{prog.title}</h3>

                    <div className="progress-container" style={{ margin: 'auto 0 24px 0' }}>
                      <div className="progress-info" style={{ fontSize: '0.8rem', marginBottom: '8px' }}>
                        <span>{percent}% Funded</span>
                        <span style={{ fontWeight: 200 }}>₹{totalRaised.toLocaleString()}</span>
                      </div>
                      <div className="progress-track" style={{ height: '4px' }}>
                        <div className="progress-fill" style={{ width: `${percent}%` }}></div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                      <div>
                        <span style={{ fontSize: '0.72rem', display: 'block', color: 'var(--text-tertiary)', fontWeight: 200 }}>UNIT PRICE</span>
                        <span style={{ fontWeight: 200, color: 'var(--text-primary)', fontSize: '0.9rem' }}>₹{prog.unitPrice.toLocaleString()}</span>
                      </div>
                      <Link href={`/investment-programs/${prog.id}`} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                        Invest
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            <hr className="section-divider" style={{ margin: '40px 0' }} />

            {/* Secondary Campaigns section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '60px', marginBottom: '40px' }}>
              <div>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 200, letterSpacing: '-0.01em' }}>Secondary Donation Campaigns</h3>
                <p style={{ color: 'var(--text-secondary)', marginTop: '8px', fontSize: '0.9rem' }}>Support auxiliary community projects and facilities through donation campaigns.</p>
              </div>
              <Link href="/campaigns" className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                All Donations
              </Link>
            </div>

            <div className="grid-2" style={{ gap: '30px' }}>
              {activeCampaigns.map((camp) => {
                const percent = Math.min(100, Math.round((camp.raisedAmount / camp.goalAmount) * 100));
                return (
                  <div className="card" key={camp.id} style={{ display: 'flex', flexDirection: 'column', padding: '28px', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 200, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                        {camp.type}
                      </span>
                      <span className="badge badge-info" style={{ fontSize: '0.72rem', padding: '2px 6px' }}>
                        {camp.status}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '1.15rem', fontWeight: 200, marginBottom: '16px' }}>{camp.title}</h4>

                    <div className="progress-container" style={{ marginBottom: '20px' }}>
                      <div className="progress-info" style={{ fontSize: '0.78rem', marginBottom: '6px' }}>
                        <span>{percent}% raised</span>
                        <span>Goal: ₹{camp.goalAmount.toLocaleString()}</span>
                      </div>
                      <div className="progress-track" style={{ height: '4px' }}>
                        <div className="progress-fill" style={{ width: `${percent}%` }}></div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Yield Estimate: <strong>{camp.roiEstimate}</strong></span>
                      <Link href={`/campaigns/${camp.id}`} className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                        Support Project
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <hr className="section-divider" />

        {/* Minimalist Transparency Feature */}
        <section style={{ padding: '160px 0', backgroundColor: 'var(--bg-secondary)' }}>
          <div className="container" style={{ maxWidth: '900px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 200, marginBottom: '60px', letterSpacing: '-0.02em' }}>Designed for Accountability</h2>
            
            <div className="grid-3" style={{ gap: '50px' }}>
              <div style={{ textAlign: 'left' }}>
                <span style={{ fontSize: '1.8rem', display: 'block', marginBottom: '16px' }}>🔍</span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 200, marginBottom: '12px' }}>Audited Ledger</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                  Every transaction is audited. School administrators log receipts and invoices instantly.
                </p>
              </div>

              <div style={{ textAlign: 'left' }}>
                <span style={{ fontSize: '1.8rem', display: 'block', marginBottom: '16px' }}>📈</span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 200, marginBottom: '12px' }}>Revenue Distribution</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                  Earnings from weekend programs or energy saving initiatives are paid out directly to supporters.
                </p>
              </div>

              <div style={{ textAlign: 'left' }}>
                <span style={{ fontSize: '1.8rem', display: 'block', marginBottom: '16px' }}>🛡️</span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 200, marginBottom: '12px' }}>Verified Credentials</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                  Compliance protocols check taxation, registry documentation, and administrator identity.
                </p>
              </div>
            </div>
          </div>
        </section>

        <hr className="section-divider" />

        {/* Minimalist CTA Section */}
        <section style={{ padding: '160px 0', textAlign: 'center' }}>
          <div className="container" style={{ maxWidth: '600px' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 200, marginBottom: '20px', letterSpacing: '-0.02em' }}>Explore Sandbox Portals</h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '40px', fontSize: '0.98rem' }}>
              Toggle the sandbox dropdown in the navigation bar to preview dashboards for Investors, School Admins, and Super Admins.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
              <Link href="/register" className="btn btn-primary" style={{ padding: '14px 28px' }}>
                Create Account
              </Link>
              <Link href="/faq" className="btn btn-outline" style={{ padding: '14px 28px' }}>
                Read FAQ
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
}
