"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Anchor, ChevronRight, ChevronLeft, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PrototypeBanner } from "@/components/layout/prototype-banner";

const TOTAL_STEPS = 2;

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1: Org details
  const [orgName, setOrgName] = useState("");
  const [rcNumber, setRcNumber] = useState("");
  const [address, setAddress] = useState("");
  const [primaryContact, setPrimaryContact] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  // Step 2: User account
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");

  const [error, setError] = useState("");

  const validateStep1 = () => {
    if (!orgName || !rcNumber || !address || !primaryContact) {
      setError("Please fill in all required fields.");
      return false;
    }
    setError("");
    return true;
  };

  const validateStep2 = () => {
    if (!firstName || !lastName || !email || !password || !role) {
      setError("Please fill in all required fields.");
      return false;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return false;
    }
    setError("");
    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setError("");
    setStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <PrototypeBanner />

      {/* Header */}
      <header className="bg-navy text-white py-4 px-6 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <div className="w-9 h-9 bg-teal rounded-lg flex items-center justify-center">
            <Anchor className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-base leading-tight">Liquid Emissions Revenue Collection</p>
            <p className="text-white/60 text-xs">Operated by Blue Wave — Nigerian Port Emission Fee Platform</p>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-lg">
          <Card className="shadow-lg border-0">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl text-navy">Register Organisation</CardTitle>
              <CardDescription>
                Create your operator account to access the emission fee platform
              </CardDescription>

              {/* Progress indicator */}
              <div className="mt-6">
                <div className="flex items-center justify-center gap-0">
                  {[1, 2].map((s) => (
                    <div key={s} className="flex items-center">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all ${
                          s < step
                            ? "bg-teal border-teal text-white"
                            : s === step
                            ? "bg-navy border-navy text-white"
                            : "bg-white border-gray-200 text-gray-400"
                        }`}
                      >
                        {s < step ? <Check className="h-4 w-4" /> : s}
                      </div>
                      {s < TOTAL_STEPS && (
                        <div
                          className={`w-24 h-0.5 transition-all ${
                            s < step ? "bg-teal" : "bg-gray-200"
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-2 px-4">
                  <span className={`text-xs font-medium ${step === 1 ? "text-navy" : "text-gray-400"}`}>
                    Organisation
                  </span>
                  <span className={`text-xs font-medium ${step === 2 ? "text-navy" : "text-gray-400"}`}>
                    User Account
                  </span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-4">
              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md px-3 py-2">
                  {error}
                </div>
              )}

              {step === 1 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="orgName">Organisation Name <span className="text-red-500">*</span></Label>
                    <Input
                      id="orgName"
                      placeholder="e.g. Apex Shipping Ltd"
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rcNumber">RC Number (CAC) <span className="text-red-500">*</span></Label>
                    <Input
                      id="rcNumber"
                      placeholder="e.g. RC-0234561"
                      value={rcNumber}
                      onChange={(e) => setRcNumber(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Registered Address <span className="text-red-500">*</span></Label>
                    <Input
                      id="address"
                      placeholder="Street address, City, State"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="primaryContact">Primary Contact <span className="text-red-500">*</span></Label>
                      <Input
                        id="primaryContact"
                        placeholder="Full name"
                        value={primaryContact}
                        onChange={(e) => setPrimaryContact(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactPhone">Phone</Label>
                      <Input
                        id="contactPhone"
                        placeholder="+234 800 000 0000"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="navy"
                    size="lg"
                    className="w-full mt-2"
                    onClick={handleNext}
                  >
                    Next: User Account
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )}

              {step === 2 && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name <span className="text-red-500">*</span></Label>
                      <Input
                        id="firstName"
                        placeholder="First name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name <span className="text-red-500">*</span></Label>
                      <Input
                        id="lastName"
                        placeholder="Last name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Work Email <span className="text-red-500">*</span></Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@organisation.ng"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role <span className="text-red-500">*</span></Label>
                    <Select onValueChange={setRole} value={role}>
                      <SelectTrigger id="role">
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="OPERATOR">Operator (Pay fees)</SelectItem>
                        <SelectItem value="FINANCE_OFFICER">Finance Officer</SelectItem>
                        <SelectItem value="AUDITOR">Auditor (Read-only)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password <span className="text-red-500">*</span></Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Min. 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password <span className="text-red-500">*</span></Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Repeat password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-3 mt-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      onClick={handleBack}
                      className="flex-1"
                    >
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Back
                    </Button>
                    <Button
                      type="submit"
                      variant="teal"
                      size="lg"
                      className="flex-1"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Creating account…
                        </>
                      ) : (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Complete Registration
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}

              <div className="mt-6 pt-4 border-t text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link href="/login" className="text-teal font-medium hover:underline">
                    Sign in
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
