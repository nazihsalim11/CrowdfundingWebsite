"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useApp } from "@/context/AppContext";
import CustomSelect from "@/components/ui/select";

export default function CampaignsPage() {
  const { campaigns } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Get categories
  const categories = ["All", "Digital education", "Computer labs", "School buses", "Scholarships"];

  // Filter campaigns
  const filteredCampaigns = campaigns.filter(camp => {
    const matchesSearch = camp.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          camp.schoolName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "All" || camp.type === selectedCategory;
    
    const matchesStatus = selectedStatus === "All" || 
                          (selectedStatus === "Active" && camp.status === "active") ||
                          (selectedStatus === "Completed" && camp.status === "completed") ||
                          (selectedStatus === "Suspended" && camp.status === "suspended");

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <>
      <Navbar />
      
      <main className="container animate-slide-up" style={{ padding: '80px 24px 120px 24px' }}>
        <section style={{ marginBottom: '60px' }}>
          <h1 style={{ fontSize: '2.8rem', marginBottom: '16px', letterSpacing: '-0.02em' }}>School Campaigns</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>Explore investment opportunities in schools seeking development, resources, and growth support.</p>
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
              placeholder="🔍 Search school name or campaign..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input"
              style={{ padding: '10px 16px' }}
              id="search-campaigns"
            />
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            {/* Category Select */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '220px' }}>
              <span className="label" style={{ margin: 0, whiteSpace: 'nowrap' }}>Category:</span>
              <CustomSelect 
                value={selectedCategory} 
                onChange={setSelectedCategory} 
                options={categories.map(cat => ({ label: cat, value: cat }))}
                id="select-category"
              />
            </div>

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
                id="select-status"
              />
            </div>
          </div>
        </section>

        {/* Campaign List */}
        {filteredCampaigns.length > 0 ? (
          <div className="grid-3">
            {filteredCampaigns.map((camp) => {
              const percent = Math.min(100, Math.round((camp.raisedAmount / camp.goalAmount) * 100));
              return (
                <div className="card" key={camp.id} style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '24px', border: '1px solid var(--border-color)', position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 200, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                      {camp.type}
                    </span>
                    <span className={`badge ${
                      camp.status === 'active' ? 'badge-info' : 
                      camp.status === 'completed' ? 'badge-success' : 
                      camp.status === 'suspended' ? 'badge-danger' : 'badge-warning'
                    }`} style={{ position: 'static' }}>
                      {camp.status}
                    </span>
                  </div>

                  <h3 className="card-title" style={{ fontSize: '1.25rem', fontWeight: 200, marginBottom: '12px', lineHeight: '1.3' }}>{camp.title}</h3>

                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: '0 0 24px 0', flexGrow: 1, lineHeight: '1.5' }}>
                    {camp.description.substring(0, 105)}...
                  </p>

                  <div className="progress-container" style={{ margin: 'auto 0 20px 0' }}>
                    <div className="progress-info" style={{ fontSize: '0.8rem', marginBottom: '6px' }}>
                      <span>{percent}% Funded</span>
                      <span style={{ fontWeight: 200 }}>₹{camp.raisedAmount.toLocaleString()} / ₹{camp.goalAmount.toLocaleString()}</span>
                    </div>
                    <div className="progress-track" style={{ height: '4px' }}>
                      <div className="progress-fill" style={{ width: `${percent}%` }}></div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                    <div>
                      <span style={{ fontSize: '0.72rem', display: 'block', color: 'var(--text-tertiary)', fontWeight: 200 }}>EXPECTED RETURN</span>
                      <span style={{ fontWeight: 200, color: 'var(--text-primary)', fontSize: '0.85rem' }}>{camp.roiEstimate.split(' ')[0]} {camp.roiEstimate.split(' ')[1] || ''}</span>
                    </div>
                    <Link href={`/campaigns/${camp.id}`} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                      View Details
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
            <h3 style={{ marginTop: '16px', fontSize: '1.4rem' }}>No Campaigns Found</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>Try modifying your search or select a different category filter.</p>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
