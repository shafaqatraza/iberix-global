import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, Loader2, Lock, Mail, ArrowLeft,
  Building2, MapPin, Calendar, RefreshCw, LogOut, Search, ShieldCheck
} from "lucide-react";
import { base44 } from "@/api/base44Client";
import Logo from "@/components/iberix/Logo";

const STATUS_STYLES = {
  new: "bg-brand/10 text-brand-deep border-brand/20",
  contacted: "bg-blue-50 text-blue-700 border-blue-200",
  qualified: "bg-amber-50 text-amber-700 border-amber-200",
  partnered: "bg-brand/20 text-brand-deep border-brand/30",
};

const STATUSES = ["new", "contacted", "qualified", "partnered"];

export default function OpsConsole() {
  const [step, setStep] = useState("login");
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [sessionId, setSessionId] = useState("");
  const [otp, setOtp] = useState("");
  const [sessionToken, setSessionToken] = useState("");
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const getError = (err) =>
    err?.data?.error || err?.response?.data?.error || err?.message || "Request failed";

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await base44.functions.invoke("AdminConsole", {
        action: "login",
        username: credentials.username,
        password: credentials.password,
      });
      setSessionId(res.data.sessionId);
      setStep("otp");
    } catch (err) {
      setError(getError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await base44.functions.invoke("AdminConsole", {
        action: "verify",
        sessionId,
        otp,
      });
      setSessionToken(res.data.sessionToken);
      setStep("dashboard");
      fetchLeads(res.data.sessionToken);
    } catch (err) {
      setError(getError(err));
    } finally {
      setLoading(false);
    }
  };

  const fetchLeads = async (token) => {
    setLoading(true);
    setError("");
    try {
      const res = await base44.functions.invoke("AdminConsole", {
        action: "leads",
        sessionToken: token || sessionToken,
      });
      setLeads(res.data.leads || []);
    } catch (err) {
      setError(getError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await base44.functions.invoke("AdminConsole", {
        action: "logout",
        sessionToken,
      });
    } catch (_) {}
    setStep("login");
    setSessionToken("");
    setSessionId("");
    setOtp("");
    setCredentials({ username: "", password: "" });
    setLeads([]);
    setError("");
  };

  const filteredLeads = leads.filter((l) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      l.company?.toLowerCase().includes(q) ||
      l.contact_name?.toLowerCase().includes(q) ||
      l.email?.toLowerCase().includes(q);
    const matchesStatus = statusFilter === "all" || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const counts = STATUSES.reduce((acc, s) => {
    acc[s] = leads.filter((l) => l.status === s).length;
    return acc;
  }, {});

  // --- LOGIN STEP ---
  if (step === "login") {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center mb-10">
            <Link to="/"><Logo variant="light" className="text-2xl" /></Link>
          </div>
          <div className="bg-paper rounded-lg p-8 md:p-10 shadow-soft-lg">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-10 w-10 rounded-full bg-ink flex items-center justify-center">
                <Lock className="h-4 w-4 text-brand-light" />
              </div>
              <div>
                <h1 className="font-heading text-xl font-medium text-ink tracking-tight-display">Ops Console</h1>
                <p className="text-subtle text-sm">Restricted access</p>
              </div>
            </div>
            <form onSubmit={handleLogin} className="flex flex-col gap-5">
              <label className="flex flex-col gap-2">
                <span className="eyebrow text-subtle">Username</span>
                <input
                  required
                  value={credentials.username}
                  onChange={(e) => setCredentials((c) => ({ ...c, username: e.target.value }))}
                  placeholder="Enter username"
                  className="iberix-input"
                  autoComplete="off"
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="eyebrow text-subtle">Password</span>
                <input
                  required
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials((c) => ({ ...c, password: e.target.value }))}
                  placeholder="Enter password"
                  className="iberix-input"
                  autoComplete="off"
                />
              </label>
              {error && <p className="text-sm text-brand-deep font-medium">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="group inline-flex items-center justify-center gap-3 bg-brand text-paper rounded-full px-6 py-3.5 eyebrow font-semibold hover:shadow-[0_10px_36px_-10px_rgba(29,158,117,0.6)] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Authenticating</>
                ) : (
                  <>Continue <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></>
                )}
              </button>
            </form>
          </div>
          <Link to="/" className="mt-6 inline-flex items-center gap-2 text-subtle hover:text-brand-light transition-colors text-sm mx-auto" style={{ display: "flex", justifyContent: "center" }}>
            <ArrowLeft className="h-3.5 w-3.5" /> Return to site
          </Link>
        </div>
      </div>
    );
  }

  // --- OTP STEP ---
  if (step === "otp") {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center mb-10">
            <Link to="/"><Logo variant="light" className="text-2xl" /></Link>
          </div>
          <div className="bg-paper rounded-lg p-8 md:p-10 shadow-soft-lg">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-10 w-10 rounded-full bg-ink flex items-center justify-center">
                <Mail className="h-4 w-4 text-brand-light" />
              </div>
              <div>
                <h1 className="font-heading text-xl font-medium text-ink tracking-tight-display">Verify Access</h1>
                <p className="text-subtle text-sm">Enter the code sent to your email</p>
              </div>
            </div>
            <form onSubmit={handleVerifyOtp} className="flex flex-col gap-5">
              <label className="flex flex-col gap-2">
                <span className="eyebrow text-subtle">One-Time Code</span>
                <input
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="6-digit code"
                  className="iberix-input tracking-[0.5em] text-lg font-mono"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                />
              </label>
              {error && <p className="text-sm text-brand-deep font-medium">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="group inline-flex items-center justify-center gap-3 bg-brand text-paper rounded-full px-6 py-3.5 eyebrow font-semibold hover:shadow-[0_10px_36px_-10px_rgba(29,158,117,0.6)] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Verifying</>
                ) : (
                  <>Access Console <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></>
                )}
              </button>
            </form>
            <button
              onClick={() => { setStep("login"); setOtp(""); setError(""); }}
              className="mt-5 text-sm text-subtle hover:text-ink transition-colors inline-flex items-center gap-2"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- DASHBOARD STEP ---
  return (
    <div className="min-h-screen bg-offwhite">
      <header className="bg-ink sticky top-0 z-20">
        <div className="px-6 md:px-12 py-4 flex items-center justify-between max-w-[1600px] mx-auto">
          <div className="flex items-center gap-4">
            <Link to="/"><Logo variant="light" className="text-lg" /></Link>
            <span className="h-5 w-px bg-white/15" />
            <span className="eyebrow text-brand-light">Ops Console</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchLeads()}
              disabled={loading}
              className="inline-flex items-center gap-2 text-subtle hover:text-paper transition-colors text-sm disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              <span className="hidden md:inline">Refresh</span>
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 text-subtle hover:text-paper rounded-full px-4 py-2 transition-colors text-sm"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden md:inline">Sign out</span>
            </button>
          </div>
        </div>
        <div className="h-px w-full bg-white/10" />
      </header>

      <div className="px-6 md:px-12 py-10 max-w-[1600px] mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <StatCard label="Total Leads" value={leads.length} highlight />
          {STATUSES.map((s) => (
            <StatCard key={s} label={s.charAt(0).toUpperCase() + s.slice(1)} value={counts[s] || 0} />
          ))}
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-subtle" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search company, contact, or email..."
              className="w-full bg-paper border border-line rounded-full pl-11 pr-4 py-2.5 text-sm outline-none focus:border-brand transition-colors"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {["all", ...STATUSES].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors whitespace-nowrap ${
                  statusFilter === s
                    ? "bg-ink text-paper"
                    : "bg-paper text-subtle border border-line hover:border-ink/30"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Leads list */}
        {loading && leads.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-subtle" />
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="bg-paper rounded-lg p-12 text-center">
            <p className="text-subtle text-lg">No leads found.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredLeads.map((lead) => (
              <div key={lead.id} className="bg-paper rounded-lg p-6 shadow-soft hover:shadow-soft-lg transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="font-heading text-lg font-medium text-ink">{lead.company}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${STATUS_STYLES[lead.status] || STATUS_STYLES.new}`}>
                        {lead.status}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm text-body">
                      <span>{lead.contact_name}</span>
                      <a href={`mailto:${lead.email}`} className="text-brand-deep hover:underline">{lead.email}</a>
                    </div>
                    {lead.scope && (
                      <p className="mt-3 text-sm text-body leading-relaxed line-clamp-2">{lead.scope}</p>
                    )}
                    <div className="mt-3 flex flex-wrap gap-4 text-xs text-subtle">
                      {lead.region && (
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5" /> {lead.region}
                        </span>
                      )}
                      {lead.service && (
                        <span className="inline-flex items-center gap-1.5">
                          <Building2 className="h-3.5 w-3.5" /> {lead.service}
                        </span>
                      )}
                      {lead.created_date && (
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" /> {new Date(lead.created_date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, highlight }) {
  return (
    <div className={`rounded-lg p-5 ${highlight ? "bg-ink text-paper" : "bg-paper shadow-soft"}`}>
      <div className={`eyebrow ${highlight ? "text-brand-light" : "text-subtle"}`}>{label}</div>
      <div className="mt-2 font-heading text-3xl font-medium tracking-tight-display">{value}</div>
    </div>
  );
}