"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function About() {
  const successStories = [
    {
      title: "Vibrant Coding & Computing Center",
      school: "Seed Global",
      raised: "₹20,00,000",
      investors: 42,
      roi: "10% ROI Distributed",
      desc: "Fully equipped computer lab with 30 coding workstations and high-speed fiber internet. The school hosts adult Python workshops during weekends to pay back investors.",
      emoji: "💻"
    },
    {
      title: "Solar Electrification Grid",
      school: "Seed Global",
      raised: "₹15,00,000",
      investors: 29,
      roi: "6.5% Annual Savings Shared",
      desc: "Installed 40 solar panels to reduce high power grid reliance. The energy cost savings are audited monthly and shared back to investors as returns.",
      emoji: "☀️"
    },
    {
      title: "Advanced STEM Robotics Lab",
      school: "Seed Global",
      raised: "₹25,00,000",
      investors: 58,
      roi: "9.2% ROI distributed",
      desc: "Built a state-of-the-art robotics workshop for regional tournaments. Revenue from workshop tickets and summer tech camps is returned to the project's funders.",
      emoji: "🤖"
    }
  ];

  return (
    <>
      <Navbar />
      
      <main className="container animate-fade-in" style={{ padding: '80px 24px' }}>
        <section style={{ textAlign: 'center', marginBottom: '80px', maxWidth: '800px', margin: '0 auto 80px auto' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '24px', fontWeight: 200, letterSpacing: '-0.02em' }}>Success Stories</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', lineHeight: '1.6' }}>
            Vetted projects successfully completed, delivering academic improvements and direct financial returns to our community.
          </p>
        </section>

        <section className="grid-3" style={{ marginBottom: '80px', gap: '30px' }}>
          {successStories.map((story, index) => (
            <div className="card" key={index} style={{ display: 'flex', flexDirection: 'column', padding: '30px', border: '1px solid var(--border-color)' }}>
              <div style={{ 
                width: '50px', 
                height: '50px', 
                borderRadius: 'var(--radius-md)', 
                backgroundColor: 'var(--bg-tertiary)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: '1.8rem',
                marginBottom: '20px'
              }}>
                {story.emoji}
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 200, marginBottom: '12px', lineHeight: '1.3' }}>{story.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: '1.5', flexGrow: 1, marginBottom: '24px' }}>
                {story.desc}
              </p>

              <div style={{ 
                borderTop: '1px solid var(--border-color)', 
                paddingTop: '16px',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px',
                fontSize: '0.82rem'
              }}>
                <div>
                  <span style={{ color: 'var(--text-tertiary)', display: 'block', fontSize: '0.72rem', fontWeight: 200 }}>CAPITAL RAISED</span>
                  <strong style={{ color: 'var(--text-primary)' }}>{story.raised}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-tertiary)', display: 'block', fontSize: '0.72rem', fontWeight: 200 }}>RETURNS PAID</span>
                  <strong style={{ color: 'var(--success)' }}>{story.roi}</strong>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Vision details */}
        <section style={{ 
          backgroundColor: 'var(--bg-secondary)', 
          border: '1px solid var(--border-color)', 
          borderRadius: 'var(--radius-lg)', 
          padding: '40px',
          textAlign: 'center',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 200, marginBottom: '16px', letterSpacing: '-0.01em' }}>Our Mission</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
            We bridge the gap in digital and physical education. By funding tangible school assets and tracking expenses transparently in a public ledger, we create sustainable growth models for our students and community.
          </p>
        </section>
      </main>

      <Footer />
    </>
  );
}
