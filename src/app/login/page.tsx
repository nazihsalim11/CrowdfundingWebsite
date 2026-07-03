"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useApp, UserRole } from "@/context/AppContext";
import CustomSelect from "@/components/ui/select";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("investor");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Please fill in all credentials.");
      return;
    }

    login(email, selectedRole);

    // Redirect to the correct portal
    if (selectedRole === "investor") {
      router.push("/investor/dashboard");
    } else if (selectedRole === "school") {
      router.push("/school/dashboard");
    } else if (selectedRole === "admin") {
      router.push("/admin/dashboard");
    }
  };

  return (
    <>
      <Navbar />

      <main style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '80px 24px',
        background: 'radial-gradient(circle at 10% 20%, rgba(16, 185, 129, 0.04) 0%, rgba(5, 150, 105, 0.04) 90%)'
      }}>
        <div className="card glass animate-fade-in" style={{ width: '100%', maxWidth: '420px', padding: '36px' }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <span style={{ fontSize: '2.5rem' }}>🔐</span>
            <h2 style={{ fontSize: '1.8rem', marginTop: '12px' }}>Access Portal</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '6px' }}>
              Sign in to manage your SCMS account.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="label">Simulate User Role</label>
              <CustomSelect 
                value={selectedRole} 
                onChange={(val) => setSelectedRole(val as UserRole)}
                options={[
                  { label: "Investor (KYC Registry Access)", value: "investor" },
                  { label: "School Administrator (Create Campaigns)", value: "school" },
                  { label: "Super Administrator (Compliance Auditor)", value: "admin" }
                ]}
                id="login-role"
              />
            </div>

            <div className="form-group">
              <label className="label">Email Address</label>
              <input 
                type="email" 
                placeholder="e.g. test@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                required
                id="login-email"
              />
            </div>

            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label className="label">Password</label>
              <input 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                required
                id="login-password"
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }} id="login-submit">
              Sign In (Sandbox)
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            Don&apos;t have an account?{" "}
            <Link href="/register" style={{ color: 'var(--primary)', fontWeight: 200 }}>
              Create Account
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
