"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useApp } from "@/context/AppContext";

export default function Home() {
  const { campaigns } = useApp();
  
  // Show active campaigns
  const activeCampaigns = campaigns.filter(c => c.status === 'active').slice(0, 3);
  
  // Calculate total stats
  const totalRaised = campaigns.reduce((acc, c) => acc + c.raisedAmount, 0);
  const totalInvestorsCount = 142; // simulated

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
              Empowering the future of <span style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Seed Global</span>
            </h1>
            <p style={{ 
              fontSize: '1.25rem', 
              color: 'var(--text-secondary)', 
              lineHeight: '1.6', 
              marginBottom: '48px', 
              maxWidth: '620px', 
              margin: '0 auto 48px auto' 
            }}>
              Invest in vetted development projects. Track every single rupee with complete invoice auditing.
            </p>
            
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <Link href="/campaigns" className="btn btn-primary" style={{ padding: '14px 28px', fontSize: '1rem' }}>
                Browse Projects
              </Link>
              <Link href="/investor-benefits" className="btn btn-outline" style={{ padding: '14px 28px', fontSize: '1rem' }}>
                Learn ROI Model
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
                  ₹{(totalRaised / 100000).toFixed(1)}L+
                </span>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 200, textTransform: 'uppercase', marginTop: '6px', letterSpacing: '0.08em' }}>Total Raised</p>
              </div>
              <div style={{ textAlign: 'center', minWidth: '180px' }}>
                <span style={{ color: 'var(--text-primary)', fontSize: '2.5rem', fontWeight: 200, fontFamily: 'var(--font-display)' }}>
                  {campaigns.length}
                </span>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 200, textTransform: 'uppercase', marginTop: '6px', letterSpacing: '0.08em' }}>Active Projects</p>
              </div>
              <div style={{ textAlign: 'center', minWidth: '180px' }}>
                <span style={{ color: 'var(--text-primary)', fontSize: '2.5rem', fontWeight: 200, fontFamily: 'var(--font-display)' }}>
                  {totalInvestorsCount}
                </span>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 200, textTransform: 'uppercase', marginTop: '6px', letterSpacing: '0.08em' }}>Supporters</p>
              </div>
              <div style={{ textAlign: 'center', minWidth: '180px' }}>
                <span style={{ color: 'var(--success)', fontSize: '2.5rem', fontWeight: 200, fontFamily: 'var(--font-display)' }}>
                  100%
                </span>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 200, textTransform: 'uppercase', marginTop: '6px', letterSpacing: '0.08em' }}>Audited Ledger</p>
              </div>
            </div>
          </div>
        </section>

        <hr className="section-divider" />

        {/* Featured Project Showcase (Second Fold) */}
        <section style={{ padding: '160px 0' }}>
          <div className="container animate-scale-up">
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 200, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '8px' }}>SPOTLIGHT</span>
              <h2 style={{ fontSize: '2rem', fontWeight: 200, letterSpacing: '-0.02em' }}>Featured Project</h2>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
              <div style={{
                height: '340px',
                backgroundImage: 'url(/images/seed-global-facade.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-md)'
              }} />
              
              <div style={{ padding: '20px 0' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '16px' }}>
                  <span className="badge badge-success" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>ACTIVE</span>
                  <span style={{ color: 'var(--text-tertiary)', fontSize: '0.88rem' }}>•</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 200, color: 'var(--text-secondary)' }}>DIGITAL EDUCATION</span>
                </div>
                
                <h3 style={{ fontSize: '1.8rem', marginBottom: '16px', fontWeight: 200 }}>Smart Classrooms & VR Labs</h3>
                <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: '1.6' }}>
                  Upgrading Seed Global biology and physics labs with virtual reality learning headsets to enable interactive 3D science simulations.
                </p>
                
                <div className="progress-container" style={{ margin: '24px 0 32px 0' }}>
                  <div className="progress-info" style={{ fontSize: '0.85rem', marginBottom: '8px' }}>
                    <span>80% Funded</span>
                    <span style={{ fontWeight: 200 }}>₹12,00,000 / ₹15,00,000</span>
                  </div>
                  <div className="progress-track" style={{ height: '6px' }}>
                    <div className="progress-fill" style={{ width: '80%' }}></div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', display: 'block', color: 'var(--text-tertiary)', fontWeight: 200 }}>EXPECTED RETURN</span>
                    <span style={{ fontWeight: 200, color: 'var(--text-primary)', fontSize: '1.05rem' }}>8.4% Annually</span>
                  </div>
                  <Link href="/campaigns/c1" className="btn btn-primary" style={{ padding: '12px 28px', fontSize: '0.95rem' }}>
                    Invest in Project
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <hr className="section-divider" />

        {/* Clean Campaign Registry */}
        <section style={{ padding: '160px 0' }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '60px' }}>
              <div>
                <h2 style={{ fontSize: '2rem', fontWeight: 200, letterSpacing: '-0.02em' }}>Open Investments</h2>
                <p style={{ color: 'var(--text-secondary)', marginTop: '8px', fontSize: '0.98rem' }}>Direct funding opportunities verified by the board of trustees.</p>
              </div>
              <Link href="/campaigns" className="btn btn-outline" style={{ padding: '10px 20px', fontSize: '0.9rem' }}>
                View All Projects
              </Link>
            </div>

            <div className="grid-3" style={{ gap: '40px' }}>
              {activeCampaigns.map((camp) => {
                const percent = Math.min(100, Math.round((camp.raisedAmount / camp.goalAmount) * 100));
                return (
                  <div className="card" key={camp.id} style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '36px', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 200, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {camp.type}
                      </span>
                      <span className="badge badge-info" style={{ textTransform: 'capitalize', fontSize: '0.75rem', padding: '3px 8px' }}>
                        {camp.status}
                      </span>
                    </div>

                    <h3 className="card-title" style={{ fontSize: '1.25rem', fontWeight: 200, marginBottom: '24px', minHeight: '44px', lineHeight: '1.3' }}>{camp.title}</h3>

                    <div className="progress-container" style={{ margin: 'auto 0 24px 0' }}>
                      <div className="progress-info" style={{ fontSize: '0.8rem', marginBottom: '8px' }}>
                        <span>{percent}% Funded</span>
                        <span style={{ fontWeight: 200 }}>₹{camp.raisedAmount.toLocaleString()}</span>
                      </div>
                      <div className="progress-track" style={{ height: '4px' }}>
                        <div className="progress-fill" style={{ width: `${percent}%` }}></div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                      <div>
                        <span style={{ fontSize: '0.72rem', display: 'block', color: 'var(--text-tertiary)', fontWeight: 200 }}>ESTIMATED RETURN</span>
                        <span style={{ fontWeight: 200, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{camp.roiEstimate.split(' ')[0]} {camp.roiEstimate.split(' ')[1] || ''}</span>
                      </div>
                      <Link href={`/campaigns/${camp.id}`} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                        Invest
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
