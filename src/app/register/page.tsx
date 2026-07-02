"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useApp, UserRole } from "@/context/AppContext";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useApp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("investor");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      alert("Please fill in all inputs.");
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
        background: 'radial-gradient(circle at 90% 10%, rgba(16, 185, 129, 0.04) 0%, rgba(5, 150, 105, 0.04) 90%)'
      }}>
        <div className="card glass animate-fade-in" style={{ width: '100%', maxWidth: '440px', padding: '36px' }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <span style={{ fontSize: '2.5rem' }}>🌱</span>
            <h2 style={{ fontSize: '1.8rem', marginTop: '12px' }}>Create Account</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '6px' }}>
              Join SCMS crowdfunding & transparency network.
            </p>
          </div>

          <form onSubmit={handleSubmit}>


            <div className="form-group">
              <label className="label">Full Name</label>
              <input 
                type="text" 
                placeholder="e.g. John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input"
                required
                id="register-name"
              />
            </div>

            <div className="form-group">
              <label className="label">Email Address</label>
              <input 
                type="email" 
                placeholder="e.g. john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                required
                id="register-email"
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
                id="register-password"
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }} id="register-submit">
              Register (Sandbox Launch)
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>
              Sign In
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
