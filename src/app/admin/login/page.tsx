"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { adminLoginAction } from "@/actions/admin-auth.action";
import { Lock, Mail, Loader2, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await adminLoginAction({ email, password });
      if (res.success) {
        router.push("/admin");
        router.refresh();
      } else {
        setErrorMsg(res.error || "লগইন ব্যর্থ হয়েছে।");
      }
    } catch {
      setErrorMsg("সার্ভারে সমস্যা হয়েছে। পুনরায় চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#03271D] flex items-center justify-center p-4 font-bengali relative overflow-hidden">
      {/* Islamic Background Pattern */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#D4A43B 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      />

      <div className="max-w-md w-full bg-white rounded-3xl border-2 border-gold/70 shadow-2xl p-6 md:p-8 space-y-6 relative z-10">
        {/* Logo & Header */}
        <div className="text-center space-y-2">
          <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-gold shadow-md mx-auto">
            <Image
              src="/logo/logo.jpg"
              alt="সা'দ সুহাইব সুন্নাহ শপ"
              fill
              sizes="80px"
              className="object-cover"
              priority
            />
          </div>
          <h1 className="text-xl md:text-2xl font-black text-primary">
            অ্যাডমিন প্যানেল লগইন
          </h1>
          <p className="text-xs text-text-secondary">
            সাদ সুহাইব সুন্নাহ শপ ম্যানেজমেন্ট সিস্টেম
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-primary">ইমেইল এড্রেস</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-[#FBF7EC]/60 border border-[#E5D9BD] rounded-xl pl-9 pr-3.5 py-2.5 text-xs md:text-sm text-text-primary focus:outline-none focus:border-primary font-sans"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-primary">পাসওয়ার্ড</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#FBF7EC]/60 border border-[#E5D9BD] rounded-xl pl-9 pr-3.5 py-2.5 text-xs md:text-sm text-text-primary focus:outline-none focus:border-primary font-sans"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl btn-emerald font-bold text-sm shadow-md transition-all disabled:bg-gray-300"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-gold" />
                <span>যাচাই করা হচ্ছে...</span>
              </>
            ) : (
              <span>লগইন করুন</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
