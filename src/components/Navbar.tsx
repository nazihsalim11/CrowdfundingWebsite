"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useApp, UserRole } from "@/context/AppContext";
import CustomSelect, { SelectOption } from "@/components/ui/select";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { role, setRole, logout, notifications, markNotificationsAsRead } = useApp();
  const [showNotif, setShowNotif] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value as UserRole;
    setRole(newRole);
    if (newRole === 'visitor') {
      router.push('/');
    } else if (newRole === 'investor') {
      router.push('/investor/dashboard');
    } else if (newRole === 'school') {
      router.push('/school/dashboard');
    } else if (newRole === 'admin') {
      router.push('/admin/dashboard');
    } else if (newRole === 'cashier') {
      router.push('/cashier/dashboard');
    } else if (newRole === 'auditor') {
      router.push('/auditor/dashboard');
    }
  };

  const toggleNotif = () => {
    setShowNotif(!showNotif);
    if (!showNotif) {
      markNotificationsAsRead();
    }
  };

  // Render role-specific navigation links to remove annoyances
  const renderNavLinks = () => {
    if (role === 'visitor') {
      return (
        <>
          <Link href="/" className={`nav-link ${pathname === "/" ? "active" : ""}`}>
            Home
          </Link>
          <Link href="/campaigns" className={`nav-link ${pathname.startsWith("/campaigns") ? "active" : ""}`}>
            Campaigns
          </Link>
          <Link href="/investor-benefits" className={`nav-link ${pathname === "/investor-benefits" ? "active" : ""}`}>
            Investor Benefits
          </Link>
          <Link href="/contact" className={`nav-link ${pathname === "/contact" ? "active" : ""}`}>
            Contact
          </Link>
        </>
      );
    }

    if (role === 'investor') {
      return (
        <>
          <Link href="/campaigns" className={`nav-link ${pathname === "/campaigns" ? "active" : ""}`}>
            🔍 Browse Projects
          </Link>
          <Link href="/investor/dashboard" className={`nav-link ${pathname.includes("/investor/dashboard") ? "active" : ""}`} style={{ fontWeight: 800 }}>
            💼 Investor Dashboard
          </Link>
        </>
      );
    }

    if (role === 'school') {
      return (
        <span style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--primary)' }}>
          🏫 School Administrator Portal
        </span>
      );
    }

    if (role === 'admin') {
      return (
        <span style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--primary)' }}>
          🛡️ Super Admin compliance Portal
        </span>
      );
    }

    if (role === 'cashier') {
      return (
        <span style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--primary)' }}>
          🏦 Central Escrow Cashier Portal
        </span>
      );
    }

    if (role === 'auditor') {
      return (
        <span style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--primary)' }}>
          🧾 Legal Compliance Auditor Portal
        </span>
      );
    }

    return null;
  };

  return (
    <header className="navbar glass">
      <Link href="/" className="logo">
        <span className="logo-icon">🏫</span>
        <span>SCMS</span>
      </Link>

      <nav className="nav-links">
        {renderNavLinks()}
      </nav>

      <div className="nav-actions" style={{ position: 'relative' }}>
        {/* Bell Icon Dropdown (only for logged-in roles) */}
        {role !== 'visitor' && (
          <button 
            onClick={toggleNotif} 
            style={{ 
              background: 'none', 
              border: 'none', 
              fontSize: '1.25rem', 
              cursor: 'pointer', 
              position: 'relative', 
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              color: showNotif ? 'var(--primary)' : 'var(--text-secondary)'
            }}
          >
            🔔
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                backgroundColor: 'var(--danger)',
                color: 'white',
                fontSize: '0.68rem',
                fontWeight: 800,
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 10px rgba(220, 38, 38, 0.4)'
              }}>
                {unreadCount}
              </span>
            )}
          </button>
        )}

        {showNotif && (
          <div className="card glass dropdown-menu" style={{
            position: 'absolute',
            top: '50px',
            right: '0',
            width: '320px',
            maxHeight: '400px',
            overflowY: 'auto',
            zIndex: 110,
            padding: '20px',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--border-color)',
            textAlign: 'left'
          }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
              Activity Notifications
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {notifications.length > 0 ? (
                notifications.map(n => (
                  <div key={n.id} style={{ fontSize: '0.82rem', lineHeight: '1.4', paddingBottom: '8px', borderBottom: '1px solid rgba(22, 163, 74, 0.05)' }}>
                    <p style={{ color: 'var(--text-primary)', fontWeight: n.read ? 400 : 700 }}>{n.message}</p>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', marginTop: '4px', display: 'block' }}>{n.timestamp}</span>
                  </div>
                ))
              ) : (
                <p style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem', textAlign: 'center', padding: '10px' }}>No notifications yet.</p>
              )}
            </div>
          </div>
        )}

        {/* Role Switcher Sandbox Tool */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderRight: '1px solid var(--border-color)', paddingRight: '16px', minWidth: '180px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>Sandbox:</span>
          <CustomSelect 
            value={role} 
            onChange={(val) => {
              handleRoleChange({ target: { value: val } } as any);
            }} 
            options={[
              { label: "Visitor (Public)", value: "visitor" },
              { label: "Investor Role", value: "investor" },
              { label: "School Admin Role", value: "school" },
              { label: "Cashier Role", value: "cashier" },
              { label: "Auditor Role", value: "auditor" },
              { label: "Super Admin Role", value: "admin" }
            ]}
          />
        </div>

        {role !== 'visitor' ? (
          <button onClick={() => { logout(); router.push('/'); }} className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '0.88rem' }}>
            Logout
          </button>
        ) : (
          <Link href="/login" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.88rem' }}>
            Login
          </Link>
        )}
      </div>
    </header>
  );
}
