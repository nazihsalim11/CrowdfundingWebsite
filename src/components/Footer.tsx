"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" className="logo">
              <span className="logo-icon">🏫</span>
              <span>SCMS</span>
            </Link>
            <p className="footer-brand-desc">
              School Crowdfunding Management System is a transparent, secure platform connecting donors and investors with Seed Global to fund development, technology, and learning.
            </p>
          </div>
          
          <div>
            <h4 className="footer-col-title">Platform</h4>
            <ul className="footer-list">
              <li><Link href="/" className="footer-list-link">Home</Link></li>
              <li><Link href="/campaigns" className="footer-list-link">Campaigns</Link></li>
              <li><Link href="/investor-benefits" className="footer-list-link">Investor Benefits</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="footer-col-title">Campaigns</h4>
            <ul className="footer-list">
              <li><Link href="/campaigns?cat=digital" className="footer-list-link">Digital Education</Link></li>
              <li><Link href="/campaigns?cat=infrastructure" className="footer-list-link">Infrastructure</Link></li>
              <li><Link href="/campaigns?cat=scholarships" className="footer-list-link">Scholarships</Link></li>
              <li><Link href="/campaigns?cat=transport" className="footer-list-link">Transportation</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="footer-col-title">Legal & Security</h4>
            <ul className="footer-list">
              <li><Link href="/terms" className="footer-list-link">Terms & Conditions</Link></li>
              <li><Link href="/privacy" className="footer-list-link">Privacy Policy</Link></li>
              <li><Link href="/compliance" className="footer-list-link">KYC Compliance</Link></li>
              <li><Link href="/faq" className="footer-list-link">FAQ & Support</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} School Crowdfunding Management System (SCMS). All rights reserved.</p>
          <div style={{ display: "flex", gap: "20px" }}>
            <span>🔒 Secure 256-Bit SSL Encryption</span>
            <span>💳 Razorpay Verified</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
