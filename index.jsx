import { useState } from "react";

const FONT_LINK = "https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap";

const INITIAL_WORKS = [
  { id: "w1", name: "Google Maps Review", link: "https://maps.google.com/example1", prompt: "Write a 5-star review about excellent customer service and fast delivery.", price: 25, totalSlots: 50, assignedTo: [], status: "active" },
  { id: "w2", name: "Trustpilot Review", link: "https://trustpilot.com/example2", prompt: "Leave a detailed review about product quality and packaging.", price: 30, totalSlots: 30, assignedTo: [], status: "active" },
  { id: "w3", name: "Website Feedback", link: "https://example.com/feedback", prompt: "Submit feedback about website usability and design.", price: 20, totalSlots: 20, assignedTo: [], status: "active" },
];

const INITIAL_USERS = [
  { id: "u1", name: "Rahul Sharma", email: "rahul@example.com", password: "pass123", role: "user", upi: "rahul@upi", balance: 75, joinDate: "2024-01-15" },
  { id: "u2", name: "Priya Patel", email: "priya@example.com", password: "pass123", role: "user", upi: "priya@paytm", balance: 120, joinDate: "2024-01-18" },
];

const INITIAL_SUBMISSIONS = [
  { id: "s1", userId: "u1", workId: "w1", reviewText: "Amazing service! Got my order within 2 days. The product quality was top-notch. Will definitely order again!", screenshot: null, status: "approved", submittedAt: "2024-01-20", amount: 25 },
  { id: "s2", userId: "u2", workId: "w2", reviewText: "Great packaging and the product exceeded my expectations. Highly recommend!", screenshot: null, status: "pending", submittedAt: "2024-01-21", amount: 30 },
  { id: "s3", userId: "u1", workId: "w3", reviewText: "Website is very user friendly and loads fast.", screenshot: null, status: "rejected", submittedAt: "2024-01-22", amount: 20 },
];

const INITIAL_PAYMENTS = [
  { id: "p1", userId: "u1", amount: 75, upi: "rahul@upi", status: "paid", date: "2024-01-22" },
  { id: "p2", userId: "u2", amount: 30, upi: "priya@paytm", status: "pending", date: "2024-01-21" },
];

function uid() { return "id_" + Math.random().toString(36).slice(2, 9); }
function today() { return new Date().toISOString().split("T")[0]; }

const Icon = ({ name, size = 18, color = "currentColor" }) => {
  const icons = {
    dashboard: <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
    work: <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>,
    users: <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
    payment: <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
    submit: <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
    logout: <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    plus: <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    star: <svg width={size} height={size} fill={color} viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    settings: <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M12 2v2M12 20v2M2 12h2M20 12h2M19.07 19.07l-1.41-1.41M4.93 19.07l1.41-1.41"/></svg>,
    slots: <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
  };
  return icons[name] || null;
};

function Badge({ status }) {
  const map = {
    pending: { bg: "#fff8e1", color: "#f59e0b", label: "Pending" },
    approved: { bg: "#ecfdf5", color: "#10b981", label: "Approved" },
    rejected: { bg: "#fef2f2", color: "#ef4444", label: "Rejected" },
    paid: { bg: "#ecfdf5", color: "#10b981", label: "Paid" },
    active: { bg: "#eff6ff", color: "#3b82f6", label: "Active" },
    inactive: { bg: "#f3f4f6", color: "#6b7280", label: "Inactive" },
  };
  const s = map[status] || map.pending;
  return <span style={{ background: s.bg, color: s.color, padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{s.label}</span>;
}

// ══════════════════════════════════════════════════════════════════════════
//  MAIN APP
// ══════════════════════════════════════════════════════════════════════════
export default function App() {
  const [page, setPage] = useState("login");
  const [currentUser, setCurrentUser] = useState(null);
  const [works, setWorks] = useState(INITIAL_WORKS);
  const [users, setUsers] = useState(INITIAL_USERS);
  const [submissions, setSubmissions] = useState(INITIAL_SUBMISSIONS);
  const [payments, setPayments] = useState(INITIAL_PAYMENTS);
  const [adminTab, setAdminTab] = useState("dashboard");
  const [userTab, setUserTab] = useState("dashboard");
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Login: auto-detect admin from email, no visible role toggle ──
  const handleLogin = (email, password) => {
    if (email === "admin@reviewpro.com" && password === "admin123") {
      setCurrentUser({ id: "admin", name: "Admin", email, role: "admin" });
      setPage("admin");
      showToast("Welcome back, Admin!");
      return true;
    }
    const u = users.find(u => u.email === email && u.password === password);
    if (u) {
      setCurrentUser(u);
      setPage("user");
      showToast(`Welcome back, ${u.name}!`);
      return true;
    }
    return false;
  };

  const handleSignup = (name, email, password, upi) => {
    if (users.find(u => u.email === email)) return false;
    const newUser = { id: uid(), name, email, password, role: "user", upi, balance: 0, joinDate: today() };
    setUsers(p => [...p, newUser]);
    setCurrentUser(newUser);
    setPage("user");
    showToast("Account created successfully!");
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    setPage("login");
    setAdminTab("dashboard");
    setUserTab("dashboard");
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", minHeight: "100vh", background: "#0f0f13" }}>
      <link rel="stylesheet" href={FONT_LINK} />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes toastIn { from { transform:translateY(20px); opacity:0; } to { transform:translateY(0); opacity:1; } }
        .fade-up { animation: fadeUp 0.4s ease both; }
        .card { background: #1a1a24; border: 1px solid #2a2a3a; border-radius: 16px; }
        .btn-primary { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff; border: none; border-radius: 10px; padding: 11px 24px; font-weight: 600; cursor: pointer; font-family: inherit; font-size: 14px; transition: opacity 0.2s, transform 0.1s; }
        .btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }
        .btn-primary:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
        .btn-ghost { background: transparent; color: #aaa; border: 1px solid #2a2a3a; border-radius: 10px; padding: 9px 18px; font-weight: 500; cursor: pointer; font-family: inherit; font-size: 13px; transition: all 0.2s; }
        .btn-ghost:hover { border-color: #6366f1; color: #6366f1; }
        .input { background: #12121a; border: 1px solid #2a2a3a; border-radius: 10px; padding: 11px 14px; color: #fff; font-family: inherit; font-size: 14px; width: 100%; transition: border 0.2s; }
        .input:focus { outline: none; border-color: #6366f1; }
        .input::placeholder { color: #555; }
        textarea.input { resize: vertical; min-height: 100px; }
        .nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-radius: 10px; cursor: pointer; color: #888; font-size: 14px; font-weight: 500; transition: all 0.2s; }
        .nav-item:hover { background: #1e1e2e; color: #fff; }
        .nav-item.active { background: linear-gradient(135deg, #6366f120, #8b5cf620); color: #a78bfa; border: 1px solid #6366f130; }
        .stat-card { background: #1a1a24; border: 1px solid #2a2a3a; border-radius: 16px; padding: 20px; }
        table { width: 100%; border-collapse: collapse; }
        th { text-align: left; padding: 12px 16px; font-size: 12px; font-weight: 600; color: #666; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #2a2a3a; }
        td { padding: 14px 16px; font-size: 14px; color: #ccc; border-bottom: 1px solid #1e1e2e; }
        tr:last-child td { border-bottom: none; }
        tr:hover td { background: #1e1e28; }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 100; backdrop-filter: blur(4px); }
        .modal { background: #1a1a24; border: 1px solid #2a2a3a; border-radius: 20px; padding: 28px; width: 90%; max-width: 500px; animation: fadeUp 0.3s ease; }
        label { font-size: 13px; font-weight: 500; color: #888; display: block; margin-bottom: 6px; }
        .slot-bar-bg { background: #1e1e2e; border-radius: 4px; height: 6px; width: 100%; margin-top: 6px; }
        .slot-bar-fill { height: 6px; border-radius: 4px; transition: width 0.4s ease; }
      `}</style>

      {toast && (
        <div style={{ position: "fixed", bottom: 24, right: 24, background: toast.type === "error" ? "#ef4444" : "#10b981", color: "#fff", padding: "12px 20px", borderRadius: 12, fontSize: 14, fontWeight: 600, zIndex: 999, animation: "toastIn 0.3s ease", boxShadow: "0 8px 24px rgba(0,0,0,0.3)" }}>
          {toast.msg}
        </div>
      )}

      {page === "login" && <LoginPage onLogin={handleLogin} onGoSignup={() => setPage("signup")} />}
      {page === "signup" && <SignupPage onSignup={handleSignup} onGoLogin={() => setPage("login")} />}
      {page === "admin" && (
        <AdminDashboard
          tab={adminTab} setTab={setAdminTab}
          works={works} setWorks={setWorks}
          users={users}
          submissions={submissions} setSubmissions={setSubmissions}
          payments={payments} setPayments={setPayments}
          logout={logout} showToast={showToast}
        />
      )}
      {page === "user" && (
        <UserDashboard
          user={currentUser}
          tab={userTab} setTab={setUserTab}
          works={works} setWorks={setWorks}        // ← setWorks passed so slots update in real-time
          submissions={submissions} setSubmissions={setSubmissions}
          payments={payments}
          logout={logout} showToast={showToast}
          setUsers={setUsers} users={users}
        />
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
//  LOGIN PAGE  — No admin toggle visible, auto-detected from email
// ══════════════════════════════════════════════════════════════════════════
function LoginPage({ onLogin, onGoSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = () => {
    if (!email || !password) { setError("Please fill all fields"); return; }
    const ok = onLogin(email, password);   // no role param
    if (!ok) setError("Invalid email or password");
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "radial-gradient(ellipse at 50% 0%, #1a0a3a 0%, #0f0f13 60%)", padding: 16 }}>
      <div className="fade-up" style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 60, height: 60, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", borderRadius: 18, marginBottom: 16, boxShadow: "0 0 40px #6366f140" }}>
            <Icon name="star" size={28} color="#fff" />
          </div>
          <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: 28, fontWeight: 800, color: "#fff", letterSpacing: -0.5 }}>ReviewPro</h1>
          <p style={{ color: "#666", fontSize: 14, marginTop: 4 }}>Earn money by writing reviews</p>
        </div>

        <div className="card" style={{ padding: 28 }}>
          <h2 style={{ fontFamily: "Syne,sans-serif", fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 24 }}>Sign In</h2>

          {/* ── Role toggle REMOVED — admin auto-detected from email ── */}

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label>Email Address</label>
              <input className="input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div>
              <label>Password</label>
              <input className="input" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && submit()} />
            </div>
            {error && <p style={{ color: "#ef4444", fontSize: 13 }}>{error}</p>}
            <button className="btn-primary" onClick={submit} style={{ marginTop: 4, width: "100%", padding: 13 }}>Sign In →</button>
          </div>

          <div style={{ marginTop: 20, textAlign: "center", fontSize: 13, color: "#666" }}>
            Don't have an account?{" "}
            <span onClick={onGoSignup} style={{ color: "#a78bfa", cursor: "pointer", fontWeight: 600 }}>Sign up free</span>
          </div>

          {/* ── Only user demo shown — admin credentials hidden ── */}
          <div style={{ marginTop: 16, padding: 12, background: "#12121a", borderRadius: 10, fontSize: 12, color: "#555" }}>
            <strong style={{ color: "#777" }}>Demo credentials:</strong><br />
            rahul@example.com / pass123
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
//  SIGNUP PAGE
// ══════════════════════════════════════════════════════════════════════════
function SignupPage({ onSignup, onGoLogin }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", upi: "" });
  const [error, setError] = useState("");
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const submit = () => {
    if (!form.name || !form.email || !form.password) { setError("Please fill all required fields"); return; }
    const ok = onSignup(form.name, form.email, form.password, form.upi);
    if (!ok) setError("Email already registered");
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "radial-gradient(ellipse at 50% 0%, #0a1a3a 0%, #0f0f13 60%)", padding: 16 }}>
      <div className="fade-up" style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 56, height: 56, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", borderRadius: 16, marginBottom: 14, boxShadow: "0 0 40px #6366f140" }}>
            <Icon name="star" size={26} color="#fff" />
          </div>
          <h1 style={{ fontFamily: "Syne,sans-serif", fontSize: 26, fontWeight: 800, color: "#fff" }}>Join ReviewPro</h1>
          <p style={{ color: "#666", fontSize: 14, marginTop: 4 }}>Start earning from reviews today</p>
        </div>
        <div className="card" style={{ padding: 28 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[["name","Full Name","text","Rahul Sharma"],["email","Email Address","email","you@example.com"],["password","Password","password","••••••••"],["upi","UPI ID (for payments)","text","yourname@upi (optional)"]].map(([k,lbl,type,ph]) => (
              <div key={k}>
                <label>{lbl}</label>
                <input className="input" type={type} placeholder={ph} value={form[k]} onChange={set(k)} />
              </div>
            ))}
            {error && <p style={{ color: "#ef4444", fontSize: 13 }}>{error}</p>}
            <button className="btn-primary" onClick={submit} style={{ marginTop: 4, width: "100%", padding: 13 }}>Create Account →</button>
          </div>
          <div style={{ marginTop: 20, textAlign: "center", fontSize: 13, color: "#666" }}>
            Already have an account?{" "}
            <span onClick={onGoLogin} style={{ color: "#a78bfa", cursor: "pointer", fontWeight: 600 }}>Sign in</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
//  ADMIN DASHBOARD
// ══════════════════════════════════════════════════════════════════════════
function AdminDashboard({ tab, setTab, works, setWorks, users, submissions, setSubmissions, payments, setPayments, logout, showToast }) {
  const [showAddWork, setShowAddWork] = useState(false);
  const [workForm, setWorkForm] = useState({ name: "", link: "", prompt: "", price: "", totalSlots: "" });
  const setWF = k => e => setWorkForm(p => ({ ...p, [k]: e.target.value }));

  const addWork = () => {
    if (!workForm.name || !workForm.link || !workForm.prompt || !workForm.price) {
      showToast("Fill all fields", "error"); return;
    }
    const newWork = {
      id: uid(),
      ...workForm,
      price: Number(workForm.price),
      totalSlots: Number(workForm.totalSlots) || 50,
      assignedTo: [],   // starts empty — users fill slots as they submit
      status: "active",
    };
    setWorks(p => [...p, newWork]);
    setWorkForm({ name: "", link: "", prompt: "", price: "", totalSlots: "" });
    setShowAddWork(false);
    showToast("Work added! It's now live for all users ✓");
  };

  const updateSubmission = (id, status) => {
    setSubmissions(p => p.map(s => s.id === id ? { ...s, status } : s));
    showToast(status === "approved" ? "Submission approved! ✓" : "Submission rejected.");
  };

  const updatePayment = (id, status) => {
    setPayments(p => p.map(pay => pay.id === id ? { ...pay, status } : pay));
    showToast("Payment status updated!");
  };

  const toggleWork = (id) =>
    setWorks(p => p.map(w => w.id === id ? { ...w, status: w.status === "active" ? "inactive" : "active" } : w));

  const stats = [
    { label: "Total Works", value: works.length, icon: "work", color: "#6366f1" },
    { label: "Total Users", value: users.length, icon: "users", color: "#10b981" },
    { label: "Submissions", value: submissions.length, icon: "submit", color: "#f59e0b" },
    { label: "Pending Payments", value: payments.filter(p => p.status === "pending").length, icon: "payment", color: "#ef4444" },
  ];

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "dashboard" },
    { id: "works", label: "Manage Works", icon: "work" },
    { id: "submissions", label: "Submissions", icon: "submit" },
    { id: "users", label: "Users", icon: "users" },
    { id: "payments", label: "Payments", icon: "payment" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <div style={{ width: 230, background: "#12121a", borderRight: "1px solid #1e1e2e", display: "flex", flexDirection: "column", padding: "20px 12px", position: "fixed", height: "100vh", overflowY: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 8px", marginBottom: 28 }}>
          <div style={{ width: 36, height: 36, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="star" size={18} color="#fff" />
          </div>
          <div>
            <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, color: "#fff", fontSize: 15 }}>ReviewPro</div>
            <div style={{ fontSize: 11, color: "#6366f1", fontWeight: 600 }}>ADMIN</div>
          </div>
        </div>
        <nav style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
          {navItems.map(n => (
            <div key={n.id} className={`nav-item ${tab === n.id ? "active" : ""}`} onClick={() => setTab(n.id)}>
              <Icon name={n.icon} size={17} /> {n.label}
            </div>
          ))}
        </nav>
        <div className="nav-item" onClick={logout} style={{ color: "#ef4444", marginTop: 8 }}>
          <Icon name="logout" size={17} color="#ef4444" /> Logout
        </div>
      </div>

      {/* Main */}
      <div style={{ marginLeft: 230, flex: 1, padding: 28, overflowY: "auto" }}>
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontFamily: "Syne,sans-serif", fontSize: 24, fontWeight: 800, color: "#fff" }}>
            {navItems.find(n => n.id === tab)?.label}
          </h2>
          <p style={{ color: "#555", fontSize: 14, marginTop: 2 }}>ReviewPro Admin Panel</p>
        </div>

        {/* DASHBOARD */}
        {tab === "dashboard" && (
          <div className="fade-up">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16, marginBottom: 28 }}>
              {stats.map(s => (
                <div key={s.label} className="stat-card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <p style={{ color: "#666", fontSize: 13, marginBottom: 8 }}>{s.label}</p>
                      <p style={{ fontFamily: "Syne,sans-serif", fontSize: 32, fontWeight: 800, color: "#fff" }}>{s.value}</p>
                    </div>
                    <div style={{ width: 44, height: 44, background: s.color + "20", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon name={s.icon} size={20} color={s.color} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="card" style={{ padding: 0, overflow: "hidden" }}>
              <div style={{ padding: "18px 20px", borderBottom: "1px solid #2a2a3a" }}>
                <h3 style={{ fontFamily: "Syne,sans-serif", color: "#fff", fontWeight: 700 }}>Recent Submissions</h3>
              </div>
              <table>
                <thead><tr><th>User</th><th>Work</th><th>Status</th><th>Amount</th><th>Date</th></tr></thead>
                <tbody>
                  {submissions.slice(-5).reverse().map(s => {
                    const u = users.find(u => u.id === s.userId) || { name: s.userId };
                    const w = works.find(w => w.id === s.workId) || { name: "Work" };
                    return (
                      <tr key={s.id}>
                        <td style={{ color: "#fff" }}>{u.name}</td>
                        <td>{w.name}</td>
                        <td><Badge status={s.status} /></td>
                        <td style={{ color: "#10b981" }}>₹{s.amount}</td>
                        <td>{s.submittedAt}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* WORKS TAB — shows slots filled */}
        {tab === "works" && (
          <div className="fade-up">
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
              <button className="btn-primary" onClick={() => setShowAddWork(true)} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Icon name="plus" size={16} /> Add New Work
              </button>
            </div>
            <div className="card" style={{ padding: 0, overflow: "hidden" }}>
              <table>
                <thead><tr><th>Name</th><th>Price</th><th>Slots Filled</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {works.map(w => {
                    const filled = w.assignedTo.length;
                    const pct = Math.round((filled / w.totalSlots) * 100);
                    return (
                      <tr key={w.id}>
                        <td>
                          <div style={{ color: "#fff", fontWeight: 500 }}>{w.name}</div>
                          <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>{w.link.slice(0, 40)}...</div>
                        </td>
                        <td style={{ color: "#10b981", fontWeight: 600 }}>₹{w.price}</td>
                        <td>
                          <div style={{ fontSize: 13, color: "#ccc", marginBottom: 4 }}>
                            <span style={{ color: filled >= w.totalSlots ? "#ef4444" : "#a78bfa", fontWeight: 700 }}>{filled}</span>
                            <span style={{ color: "#555" }}> / {w.totalSlots}</span>
                          </div>
                          <div className="slot-bar-bg">
                            <div className="slot-bar-fill" style={{ width: `${pct}%`, background: filled >= w.totalSlots ? "#ef4444" : "linear-gradient(90deg,#6366f1,#8b5cf6)" }} />
                          </div>
                        </td>
                        <td>
                          {filled >= w.totalSlots
                            ? <span style={{ background: "#ef444420", color: "#ef4444", padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>Full</span>
                            : <Badge status={w.status} />
                          }
                        </td>
                        <td>
                          <button className="btn-ghost" onClick={() => toggleWork(w.id)} style={{ fontSize: 12, padding: "6px 12px" }}>
                            {w.status === "active" ? "Deactivate" : "Activate"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SUBMISSIONS */}
        {tab === "submissions" && (
          <div className="fade-up">
            <div className="card" style={{ padding: 0, overflow: "hidden" }}>
              <table>
                <thead><tr><th>User</th><th>Work</th><th>Review</th><th>Status</th><th>Amount</th><th>Actions</th></tr></thead>
                <tbody>
                  {submissions.map(s => {
                    const u = users.find(u => u.id === s.userId) || { name: s.userId };
                    const w = works.find(w => w.id === s.workId) || { name: "Work" };
                    return (
                      <tr key={s.id}>
                        <td style={{ color: "#fff" }}>{u.name}</td>
                        <td>{w.name}</td>
                        <td style={{ maxWidth: 200 }}>
                          <div style={{ fontSize: 13, color: "#aaa", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.reviewText}</div>
                        </td>
                        <td><Badge status={s.status} /></td>
                        <td style={{ color: "#10b981" }}>₹{s.amount}</td>
                        <td>
                          {s.status === "pending" && (
                            <div style={{ display: "flex", gap: 6 }}>
                              <button onClick={() => updateSubmission(s.id, "approved")} style={{ background: "#10b98120", border: "1px solid #10b98140", color: "#10b981", borderRadius: 7, padding: "5px 10px", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>✓ Approve</button>
                              <button onClick={() => updateSubmission(s.id, "rejected")} style={{ background: "#ef444420", border: "1px solid #ef444440", color: "#ef4444", borderRadius: 7, padding: "5px 10px", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>✗ Reject</button>
                            </div>
                          )}
                          {s.status !== "pending" && <span style={{ fontSize: 12, color: "#555" }}>Reviewed</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* USERS */}
        {tab === "users" && (
          <div className="fade-up">
            <div className="card" style={{ padding: 0, overflow: "hidden" }}>
              <table>
                <thead><tr><th>Name</th><th>Email</th><th>UPI ID</th><th>Balance</th><th>Joined</th></tr></thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td style={{ color: "#fff", fontWeight: 500 }}>{u.name}</td>
                      <td>{u.email}</td>
                      <td style={{ color: "#a78bfa" }}>{u.upi || "—"}</td>
                      <td style={{ color: "#10b981", fontWeight: 600 }}>₹{u.balance}</td>
                      <td>{u.joinDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PAYMENTS */}
        {tab === "payments" && (
          <div className="fade-up">
            <div className="card" style={{ padding: 0, overflow: "hidden" }}>
              <table>
                <thead><tr><th>User</th><th>UPI ID</th><th>Amount</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
                <tbody>
                  {payments.map(p => {
                    const u = users.find(u => u.id === p.userId) || { name: p.userId };
                    return (
                      <tr key={p.id}>
                        <td style={{ color: "#fff" }}>{u.name}</td>
                        <td style={{ color: "#a78bfa" }}>{p.upi}</td>
                        <td style={{ color: "#10b981", fontWeight: 600 }}>₹{p.amount}</td>
                        <td><Badge status={p.status} /></td>
                        <td>{p.date}</td>
                        <td>
                          {p.status === "pending" && (
                            <button onClick={() => updatePayment(p.id, "paid")} style={{ background: "#10b98120", border: "1px solid #10b98140", color: "#10b981", borderRadius: 7, padding: "5px 12px", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
                              Mark Paid ₹
                            </button>
                          )}
                          {p.status === "paid" && <span style={{ fontSize: 12, color: "#555" }}>Completed</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add Work Modal */}
      {showAddWork && (
        <div className="modal-overlay" onClick={() => setShowAddWork(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontFamily: "Syne,sans-serif", color: "#fff", fontWeight: 700, marginBottom: 20, fontSize: 18 }}>Add New Work</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                ["name","Work Name","text","e.g. Google Maps Review"],
                ["link","Work Link","url","https://..."],
                ["price","Price per Review (₹)","number","25"],
                ["totalSlots","Total Slots (how many users)","number","50"],
              ].map(([k,lbl,type,ph]) => (
                <div key={k}>
                  <label>{lbl}</label>
                  <input className="input" type={type} placeholder={ph} value={workForm[k]} onChange={setWF(k)} />
                </div>
              ))}
              <div>
                <label>Review Prompt / Instructions</label>
                <textarea className="input" placeholder="Write instructions for users..." value={workForm.prompt} onChange={setWF("prompt")} />
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                <button className="btn-primary" onClick={addWork} style={{ flex: 1, padding: 12 }}>Add Work</button>
                <button className="btn-ghost" onClick={() => setShowAddWork(false)} style={{ flex: 1, padding: 12 }}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
//  USER DASHBOARD
// ══════════════════════════════════════════════════════════════════════════
function UserDashboard({ user, tab, setTab, works, setWorks, submissions, setSubmissions, payments, logout, showToast, setUsers, users }) {
  const [submitModal, setSubmitModal] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [upiEdit, setUpiEdit] = useState(false);
  const [upiVal, setUpiVal] = useState(user?.upi || "");

  const mySubmissions = submissions.filter(s => s.userId === user?.id);
  const submittedWorkIds = mySubmissions.map(s => s.workId);

  // ── Available works: active + not submitted + slots remaining ──
  const availableWorks = works.filter(w =>
    w.status === "active" &&
    !submittedWorkIds.includes(w.id) &&
    w.assignedTo.length < w.totalSlots    // ← slot cap check
  );

  const myEarnings = mySubmissions.filter(s => s.status === "approved").reduce((a, s) => a + s.amount, 0);
  const myPayments = payments.filter(p => p.userId === user?.id);

  // ── Submit review + claim slot atomically ──
  const submitReview = () => {
    if (!reviewText.trim()) { showToast("Please write your review", "error"); return; }
    const work = works.find(w => w.id === submitModal);

    // Double-check slots haven't filled while user was writing
    if (!work || work.assignedTo.length >= work.totalSlots) {
      showToast("Sorry, all slots for this work are now filled!", "error");
      setSubmitModal(null); setReviewText(""); return;
    }

    // Add submission record
    setSubmissions(p => [...p, {
      id: uid(), userId: user.id, workId: submitModal,
      reviewText, screenshot: null,
      status: "pending", submittedAt: today(), amount: work?.price || 0,
    }]);

    // ── Claim the slot: add userId to work's assignedTo ──
    setWorks(p => p.map(w =>
      w.id === submitModal
        ? { ...w, assignedTo: [...w.assignedTo, user.id] }
        : w
    ));

    setReviewText("");
    setSubmitModal(null);
    showToast("Review submitted! Waiting for approval. ✓");
  };

  const saveUpi = () => {
    setUsers(p => p.map(u => u.id === user.id ? { ...u, upi: upiVal } : u));
    setUpiEdit(false);
    showToast("UPI ID saved!");
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "dashboard" },
    { id: "works", label: "Available Work", icon: "work" },
    { id: "submissions", label: "My Submissions", icon: "submit" },
    { id: "payments", label: "My Earnings", icon: "payment" },
    { id: "settings", label: "Settings", icon: "settings" },
  ];

  const stats = [
    { label: "Available Work", value: availableWorks.length, color: "#6366f1" },
    { label: "Submitted", value: mySubmissions.length, color: "#f59e0b" },
    { label: "Approved", value: mySubmissions.filter(s => s.status === "approved").length, color: "#10b981" },
    { label: "Total Earned", value: `₹${myEarnings}`, color: "#a78bfa" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <div style={{ width: 220, background: "#12121a", borderRight: "1px solid #1e1e2e", display: "flex", flexDirection: "column", padding: "20px 12px", position: "fixed", height: "100vh" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 8px", marginBottom: 28 }}>
          <div style={{ width: 36, height: 36, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: "#fff", fontWeight: 700 }}>
            {user?.name?.[0] || "U"}
          </div>
          <div>
            <div style={{ fontWeight: 700, color: "#fff", fontSize: 14 }}>{user?.name}</div>
            <div style={{ fontSize: 11, color: "#10b981", fontWeight: 600 }}>₹{myEarnings} earned</div>
          </div>
        </div>
        <nav style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
          {navItems.map(n => (
            <div key={n.id} className={`nav-item ${tab === n.id ? "active" : ""}`} onClick={() => setTab(n.id)}>
              <Icon name={n.icon} size={17} /> {n.label}
            </div>
          ))}
        </nav>
        <div className="nav-item" onClick={logout} style={{ color: "#ef4444" }}>
          <Icon name="logout" size={17} color="#ef4444" /> Logout
        </div>
      </div>

      {/* Main */}
      <div style={{ marginLeft: 220, flex: 1, padding: 28 }}>
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontFamily: "Syne,sans-serif", fontSize: 24, fontWeight: 800, color: "#fff" }}>
            {tab === "dashboard" ? `Hey, ${user?.name?.split(" ")[0]}! 👋` : navItems.find(n => n.id === tab)?.label}
          </h2>
          {tab === "dashboard" && <p style={{ color: "#555", fontSize: 14, marginTop: 2 }}>Here's your earnings overview</p>}
        </div>

        {/* DASHBOARD */}
        {tab === "dashboard" && (
          <div className="fade-up">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))", gap: 14, marginBottom: 24 }}>
              {stats.map(s => (
                <div key={s.label} className="stat-card" style={{ textAlign: "center" }}>
                  <p style={{ color: "#666", fontSize: 12, marginBottom: 8 }}>{s.label}</p>
                  <p style={{ fontFamily: "Syne,sans-serif", fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</p>
                </div>
              ))}
            </div>
            <div className="card" style={{ padding: 20 }}>
              <h3 style={{ fontFamily: "Syne,sans-serif", color: "#fff", fontWeight: 700, marginBottom: 16, fontSize: 16 }}>Recent Activity</h3>
              {mySubmissions.length === 0 ? (
                <p style={{ color: "#555", textAlign: "center", padding: 20 }}>No submissions yet. Start working to earn!</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {mySubmissions.slice(-5).reverse().map(s => {
                    const w = works.find(w => w.id === s.workId) || { name: "Work", price: 0 };
                    return (
                      <div key={s.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #1e1e2e" }}>
                        <div>
                          <div style={{ color: "#fff", fontSize: 14, fontWeight: 500 }}>{w.name}</div>
                          <div style={{ color: "#555", fontSize: 12 }}>{s.submittedAt}</div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <span style={{ color: "#10b981", fontWeight: 600 }}>₹{s.amount}</span>
                          <Badge status={s.status} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* AVAILABLE WORKS — shows remaining slots + progress bar */}
        {tab === "works" && (
          <div className="fade-up">
            {availableWorks.length === 0 ? (
              <div className="card" style={{ padding: 40, textAlign: "center" }}>
                <p style={{ color: "#555" }}>No new work available right now. Check back later!</p>
              </div>
            ) : (
              <div style={{ display: "grid", gap: 16 }}>
                {availableWorks.map(w => {
                  const remaining = w.totalSlots - w.assignedTo.length;
                  const pct = Math.round((w.assignedTo.length / w.totalSlots) * 100);
                  const isFilling = remaining <= Math.ceil(w.totalSlots * 0.2); // last 20% slots
                  return (
                    <div key={w.id} className="card" style={{ padding: 22 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
                            <h3 style={{ color: "#fff", fontWeight: 700, fontSize: 16, fontFamily: "Syne,sans-serif" }}>{w.name}</h3>
                            <Badge status="active" />
                            {isFilling && (
                              <span style={{ background: "#f59e0b20", color: "#f59e0b", padding: "2px 8px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
                                🔥 Filling fast!
                              </span>
                            )}
                          </div>
                          <p style={{ color: "#666", fontSize: 13, marginBottom: 10 }}>{w.prompt}</p>
                          <a href={w.link} target="_blank" rel="noreferrer" style={{ color: "#6366f1", fontSize: 13, textDecoration: "none" }}>🔗 Open Work Link</a>

                          {/* Slot progress bar */}
                          <div style={{ marginTop: 14 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 5 }}>
                              <span style={{ color: "#555" }}>Slots filled</span>
                              <span style={{ color: isFilling ? "#f59e0b" : "#a78bfa", fontWeight: 600 }}>
                                {remaining} slots left
                              </span>
                            </div>
                            <div className="slot-bar-bg">
                              <div className="slot-bar-fill" style={{
                                width: `${pct}%`,
                                background: isFilling
                                  ? "linear-gradient(90deg,#f59e0b,#ef4444)"
                                  : "linear-gradient(90deg,#6366f1,#8b5cf6)"
                              }} />
                            </div>
                          </div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10 }}>
                          <div style={{ fontFamily: "Syne,sans-serif", fontSize: 24, fontWeight: 800, color: "#10b981" }}>₹{w.price}</div>
                          <button className="btn-primary" onClick={() => setSubmitModal(w.id)}>
                            Submit Review
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* MY SUBMISSIONS */}
        {tab === "submissions" && (
          <div className="fade-up">
            <div className="card" style={{ padding: 0, overflow: "hidden" }}>
              {mySubmissions.length === 0 ? (
                <p style={{ color: "#555", textAlign: "center", padding: 40 }}>No submissions yet.</p>
              ) : (
                <table>
                  <thead><tr><th>Work</th><th>Review</th><th>Status</th><th>Amount</th><th>Date</th></tr></thead>
                  <tbody>
                    {mySubmissions.map(s => {
                      const w = works.find(w => w.id === s.workId) || { name: "Work" };
                      return (
                        <tr key={s.id}>
                          <td style={{ color: "#fff", fontWeight: 500 }}>{w.name}</td>
                          <td style={{ maxWidth: 200 }}>
                            <div style={{ fontSize: 13, color: "#aaa", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.reviewText}</div>
                          </td>
                          <td><Badge status={s.status} /></td>
                          <td style={{ color: "#10b981", fontWeight: 600 }}>₹{s.amount}</td>
                          <td>{s.submittedAt}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* EARNINGS */}
        {tab === "payments" && (
          <div className="fade-up">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
              <div className="stat-card">
                <p style={{ color: "#666", fontSize: 13, marginBottom: 8 }}>Total Earned</p>
                <p style={{ fontFamily: "Syne,sans-serif", fontSize: 32, fontWeight: 800, color: "#10b981" }}>₹{myEarnings}</p>
              </div>
              <div className="stat-card">
                <p style={{ color: "#666", fontSize: 13, marginBottom: 8 }}>Pending Approval</p>
                <p style={{ fontFamily: "Syne,sans-serif", fontSize: 32, fontWeight: 800, color: "#f59e0b" }}>
                  ₹{mySubmissions.filter(s => s.status === "pending").reduce((a, s) => a + s.amount, 0)}
                </p>
              </div>
            </div>
            <div className="card" style={{ padding: 0, overflow: "hidden" }}>
              <div style={{ padding: "16px 20px", borderBottom: "1px solid #2a2a3a" }}>
                <h3 style={{ fontFamily: "Syne,sans-serif", color: "#fff", fontWeight: 700 }}>Payment History</h3>
              </div>
              {myPayments.length === 0 ? (
                <p style={{ color: "#555", textAlign: "center", padding: 30 }}>No payment history yet.</p>
              ) : (
                <table>
                  <thead><tr><th>Amount</th><th>UPI</th><th>Status</th><th>Date</th></tr></thead>
                  <tbody>
                    {myPayments.map(p => (
                      <tr key={p.id}>
                        <td style={{ color: "#10b981", fontWeight: 700 }}>₹{p.amount}</td>
                        <td style={{ color: "#a78bfa" }}>{p.upi}</td>
                        <td><Badge status={p.status} /></td>
                        <td>{p.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* SETTINGS */}
        {tab === "settings" && (
          <div className="fade-up">
            <div className="card" style={{ padding: 24, maxWidth: 480 }}>
              <h3 style={{ fontFamily: "Syne,sans-serif", color: "#fff", fontWeight: 700, marginBottom: 20, fontSize: 17 }}>Account Settings</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label>Full Name</label>
                  <input className="input" value={user?.name} disabled style={{ opacity: 0.6 }} />
                </div>
                <div>
                  <label>Email</label>
                  <input className="input" value={user?.email} disabled style={{ opacity: 0.6 }} />
                </div>
                <div>
                  <label>UPI ID for Payments</label>
                  {upiEdit ? (
                    <div style={{ display: "flex", gap: 8 }}>
                      <input className="input" value={upiVal} onChange={e => setUpiVal(e.target.value)} placeholder="yourname@upi" />
                      <button className="btn-primary" onClick={saveUpi} style={{ whiteSpace: "nowrap" }}>Save</button>
                    </div>
                  ) : (
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <input className="input" value={user?.upi || "Not set"} disabled style={{ opacity: 0.6 }} />
                      <button className="btn-ghost" onClick={() => setUpiEdit(true)} style={{ whiteSpace: "nowrap" }}>Edit</button>
                    </div>
                  )}
                  <p style={{ fontSize: 12, color: "#555", marginTop: 6 }}>Your UPI ID is used to send your earnings.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Submit Review Modal */}
      {submitModal && (
        <div className="modal-overlay" onClick={() => { setSubmitModal(null); setReviewText(""); }}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontFamily: "Syne,sans-serif", color: "#fff", fontWeight: 700, marginBottom: 6, fontSize: 18 }}>Submit Your Review</h3>
            {(() => {
              const w = works.find(w => w.id === submitModal);
              const remaining = w ? w.totalSlots - w.assignedTo.length : 0;
              return (
                <>
                  <div style={{ background: "#12121a", borderRadius: 10, padding: 14, marginBottom: 18 }}>
                    <p style={{ color: "#888", fontSize: 12, marginBottom: 4 }}>INSTRUCTIONS</p>
                    <p style={{ color: "#ccc", fontSize: 13, lineHeight: 1.6 }}>{w?.prompt}</p>
                    <a href={w?.link} target="_blank" rel="noreferrer" style={{ color: "#6366f1", fontSize: 12, display: "block", marginTop: 8 }}>🔗 Open work link first</a>
                  </div>
                  {/* Slot warning */}
                  {remaining <= Math.ceil((w?.totalSlots || 0) * 0.2) && (
                    <div style={{ background: "#f59e0b15", border: "1px solid #f59e0b30", borderRadius: 8, padding: "8px 12px", marginBottom: 12, fontSize: 12, color: "#f59e0b" }}>
                      ⚡ Only <strong>{remaining} slots</strong> remaining — submit quickly!
                    </div>
                  )}
                  <div style={{ marginBottom: 16 }}>
                    <label>Your Review Text</label>
                    <textarea className="input" rows={5} placeholder="Write your review here..." value={reviewText} onChange={e => setReviewText(e.target.value)} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <span style={{ color: "#10b981", fontWeight: 700, fontSize: 16 }}>Earn: ₹{w?.price}</span>
                    <span style={{ color: "#555", fontSize: 12 }}>{remaining} slots left</span>
                  </div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button className="btn-primary" onClick={submitReview} style={{ flex: 1, padding: 12 }}>Submit Review</button>
                    <button className="btn-ghost" onClick={() => { setSubmitModal(null); setReviewText(""); }} style={{ flex: 1, padding: 12 }}>Cancel</button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
