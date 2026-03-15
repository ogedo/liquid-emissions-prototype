"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Anchor, Eye, EyeOff, Loader2, Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("c.obi@apexshipping.ng");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel — navy branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-navy flex-col justify-between p-12">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-teal rounded-xl flex items-center justify-center">
            <Anchor className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-lg leading-tight">Liquid Emissions</p>
            <p className="text-white/50 text-xs tracking-wide">Revenue Collection</p>
          </div>
        </div>

        {/* Main content */}
        <div>
          <h1 className="text-4xl font-bold text-white leading-tight mb-6">
            Automating Maritime<br />
            Emission Fee Collection<br />
            at Nigerian Ports
          </h1>
          <p className="text-white/60 text-base leading-relaxed mb-8">
            A purpose-built platform for shipping operators to pay MARPOL Annex VI emission fees seamlessly — operated by Blue Wave, regulated by NIMASA.
          </p>

          {/* Quote */}
          <div className="border-l-4 border-teal pl-5 py-1">
            <p className="text-white/80 text-sm italic leading-relaxed">
              "Transparent, automated, and compliant — Nigeria's first maritime emission fee collection platform trusted by over 40 shipping operators."
            </p>
            <p className="text-teal text-xs font-semibold mt-2 uppercase tracking-wider">Blue Wave Operations Team</p>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-6">
          <div>
            <p className="text-2xl font-bold text-white">$840M</p>
            <p className="text-white/40 text-xs mt-0.5">Projected Annual Revenue</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">47</p>
            <p className="text-white/40 text-xs mt-0.5">Registered Operators</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">5</p>
            <p className="text-white/40 text-xs mt-0.5">Nigerian Ports</p>
          </div>
        </div>
      </div>

      {/* Right panel — white login form */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-20 bg-white">
        {/* Mobile logo */}
        <div className="flex items-center gap-3 mb-10 lg:hidden">
          <div className="w-9 h-9 bg-navy rounded-xl flex items-center justify-center">
            <Anchor className="h-4 w-4 text-teal" />
          </div>
          <p className="font-bold text-navy text-base">Liquid Emissions</p>
        </div>

        <div className="max-w-sm w-full mx-auto">
          <h2 className="text-2xl font-bold text-navy mb-1">Sign In</h2>
          <p className="text-gray-500 text-sm mb-8">Access your emission fee portal</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@organisation.ng"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="h-11"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <a href="#" className="text-xs text-teal hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="h-11 pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-teal hover:bg-teal-600 text-white font-semibold"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-teal font-medium hover:underline">
              Register
            </Link>
          </p>

          {/* Demo access section */}
          <div className="mt-8 p-5 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="h-4 w-4 text-navy" />
              <p className="text-xs font-bold text-navy uppercase tracking-wider">Demo Access</p>
            </div>
            <p className="text-xs text-gray-500 mb-3">Click to enter a portal directly (no auth required)</p>
            <div className="grid grid-cols-1 gap-2">
              <Link href="/dashboard">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-xs border-navy/20 hover:bg-navy hover:text-white transition-colors"
                >
                  <Anchor className="h-3.5 w-3.5 mr-2 text-teal" />
                  Login as Operator
                  <span className="ml-auto text-gray-400">→ /dashboard</span>
                </Button>
              </Link>
              <Link href="/admin/dashboard">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-xs border-navy/20 hover:bg-navy hover:text-white transition-colors"
                >
                  <Shield className="h-3.5 w-3.5 mr-2 text-teal" />
                  Login as Admin
                  <span className="ml-auto text-gray-400">→ /admin</span>
                </Button>
              </Link>
              <Link href="/finance/wallet">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-xs border-navy/20 hover:bg-navy hover:text-white transition-colors"
                >
                  <div className="h-3.5 w-3.5 mr-2 text-teal font-bold text-xs flex items-center">₦</div>
                  Login as Finance
                  <span className="ml-auto text-gray-400">→ /finance</span>
                </Button>
              </Link>
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            Regulated by NIMASA · MARPOL Annex VI Compliant
          </p>
        </div>
      </div>
    </div>
  );
}
