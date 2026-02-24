"use client"
import { useState, useEffect, useRef, useCallback, createContext, useContext } from "react";
import { Phone, Mail, MapPin, ChevronDown, Menu, X, Star, Upload, Check, FileText, Users, BarChart3, Calendar, CreditCard, Settings, Home, ArrowRight, Clock, Shield, Truck, Award, MessageCircle, Send, Download, Eye, Edit, Trash2, Search, TrendingUp, DollarSign, Target, Plus, Minus, ExternalLink, Copy, AlertCircle, CheckCircle, XCircle, RefreshCw, Layers, Package, Grid, List, Image, BookOpen, Globe, Zap, Building2, Wrench, Database, Wifi, WifiOff, Loader2, Info, Save, LayoutDashboard } from "lucide-react";

// ═══════════════════════════════════════════════════
// SUPABASE CLIENT
// ═══════════════════════════════════════════════════
function mkSupa(url, key) {
  if (!url || !key) return null;
  const h = { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", Prefer: "return=representation" };
  const b = url.replace(/\/$/, "");
  return {
    async q(t, o = {}) { let qs = `select=${encodeURIComponent(o.select || "*")}`; for (const [k, v] of Object.entries(o.eq || {})) qs += `&${k}=eq.${encodeURIComponent(v)}`; if (o.order) qs += `&order=${encodeURIComponent(o.order)}`; if (o.limit) qs += `&limit=${o.limit}`; const r = await fetch(`${b}/rest/v1/${t}?${qs}`, { headers: h }); if (!r.ok) throw new Error((await r.json().catch(() => ({}))).message || r.statusText); return r.json(); },
    async ins(t, d) { const r = await fetch(`${b}/rest/v1/${t}`, { method: "POST", headers: h, body: JSON.stringify(d) }); if (!r.ok) throw new Error((await r.json().catch(() => ({}))).message || r.statusText); return r.json(); },
    async upd(t, m, d) { let qs = ""; for (const [k, v] of Object.entries(m)) qs += `${qs ? "&" : ""}${k}=eq.${encodeURIComponent(v)}`; const r = await fetch(`${b}/rest/v1/${t}?${qs}`, { method: "PATCH", headers: h, body: JSON.stringify(d) }); if (!r.ok) throw new Error((await r.json().catch(() => ({}))).message || r.statusText); return r.json(); },
    async del(t, m) { let qs = ""; for (const [k, v] of Object.entries(m)) qs += `${qs ? "&" : ""}${k}=eq.${encodeURIComponent(v)}`; await fetch(`${b}/rest/v1/${t}?${qs}`, { method: "DELETE", headers: h }); },
    url: b,
  };
}

// ═══════════════════════════════════════════════════
// RAZORPAY
// ═══════════════════════════════════════════════════
function loadRzp() { return new Promise(r => { if (window.Razorpay) return r(true); const s = document.createElement("script"); s.src = "https://checkout.razorpay.com/v1/checkout.js"; s.onload = () => r(true); s.onerror = () => r(false); document.body.appendChild(s); }); }
async function openRzp({ keyId, amount, desc, notes, prefill, onOk, onFail }) {
  if (!(await loadRzp())) { alert("Razorpay failed to load"); return; }
  new window.Razorpay({ key: keyId, amount: Math.round(amount * 100), currency: "INR", name: "HomeFit Solutions", description: desc || "Payment", notes: notes || {}, prefill: prefill || {}, theme: { color: "#1E88E5" }, handler: r => onOk?.({ pid: r.razorpay_payment_id, oid: r.razorpay_order_id, sig: r.razorpay_signature }), modal: { ondismiss: () => onFail?.("dismissed") } }).open();
}

// ═══════════════════════════════════════════════════
// CONFIG
// ═══════════════════════════════════════════════════
const gC = (k, d) => { try { const r = sessionStorage.getItem(k); return r ? { ...d, ...JSON.parse(r) } : d; } catch { return d; } };
const sC = (k, v) => { try { sessionStorage.setItem(k, JSON.stringify(v)); } catch {} };

// ═══════════════════════════════════════════════════
// CONSTANTS & DATA FROM HANDWRITTEN SHEET
// ═══════════════════════════════════════════════════
const CL = { navy: "#0B1F3A", blue: "#1E88E5", gray: "#F3F5F7", lime: "#A3E635" };
const BUDGETS = ["< ₹2L", "₹2–5L", "₹5–10L", "> ₹10L"];
const PIPE = ["New", "Qualified", "Site Visit", "Quote Sent", "Negotiation", "Closed-Won", "Closed-Lost", "On-Hold"];
const PIPE_C = { New: "#6366F1", Qualified: "#1E88E5", "Site Visit": "#F59E0B", "Quote Sent": "#8B5CF6", Negotiation: "#EC4899", "Closed-Won": "#10B981", "Closed-Lost": "#EF4444", "On-Hold": "#6B7280" };
const PAY_TERMS = [
  { pct: 10, label: "10% on Order Booking", desc: "Payable now to confirm your order" },
  { pct: 50, label: "50% within first 30 days", desc: "Due within 30 days of order confirmation" },
  { pct: 40, label: "40% before Finishing", desc: "Final payment before installation completion" },
];

// ── ITEMS FROM THE HANDWRITTEN SHEET ──
// Each item: { id, name, cat(category), price, defaultQty per tier, note }
const ALL_ITEMS = [
  { id: "modular-kitchen-basic", name: "Modular Kitchen (Below Platform)", cat: "Kitchen", price: 40000, note: "Basic below-counter platform" },
  { id: "modular-kitchen-premium", name: "Modular Kitchen + Crockery Unit", cat: "Kitchen", price: 60000, note: "Below platform + crockery unit" },
  { id: "modular-kitchen-luxury", name: "Modular Kitchen Full (Platform + Crockery + Chimney + Storage + Top Floor Box)", cat: "Kitchen", price: 115000, note: "Complete kitchen with chimney, storage, top floor" },
  { id: "double-bed", name: "Double Bed", cat: "Bedroom", price: 30000, note: "" },
  { id: "mattress", name: "Mattress", cat: "Bedroom", price: 10000, note: "" },
  { id: "side-table", name: "Side Table", cat: "Bedroom", price: 7000, note: "" },
  { id: "wardrobe-open", name: "Wardrobe (Open)", cat: "Bedroom", price: 60000, note: "Open-type wardrobe" },
  { id: "wardrobe-sliding", name: "Wardrobe (Sliding)", cat: "Bedroom", price: 75000, note: "Premium sliding wardrobe" },
  { id: "study-unit", name: "Study Unit", cat: "Bedroom", price: 20000, note: "Study desk + shelving" },
  { id: "safety-doors", name: "Safety Doors (CNC Cutting)", cat: "Doors & Structure", price: 25000, note: "CNC designed main door" },
  { id: "partition", name: "Partition", cat: "Doors & Structure", price: 20000, note: "Room partition / divider" },
  { id: "tv-unit", name: "TV Unit", cat: "Living Room", price: 30000, note: "" },
  { id: "sofa-lshape", name: "Sofa L-Shape", cat: "Living Room", price: 30000, note: "L-shaped sofa set" },
  { id: "center-table", name: "Center Table", cat: "Living Room", price: 3000, note: "" },
  { id: "shoe-rack", name: "Shoe Rack", cat: "Living Room", price: 5000, note: "" },
  { id: "dining-4seat", name: "Dining Table (4-Seater)", cat: "Dining", price: 25000, note: "" },
  { id: "dining-6seat", name: "Dining Table (6-Seater)", cat: "Dining", price: 30000, note: "" },
  { id: "false-ceiling", name: "False Ceiling", cat: "Finishing", price: 25000, note: "POP / gypsum false ceiling" },
  { id: "painting", name: "Painting", cat: "Finishing", price: 60000, note: "Full interior painting" },
  { id: "electrical-work-basic", name: "Electrical Work", cat: "Finishing", price: 35000, note: "Basic wiring & fixtures" },
  { id: "electrical-work-lux", name: "Electrical Work (Premium)", cat: "Finishing", price: 25000, note: "Premium fixtures & fittings" },
  { id: "curtains", name: "Curtains", cat: "Finishing", price: 25000, note: "All rooms" },
  { id: "palmlet", name: "Pelmets", cat: "Finishing", price: 10000, note: "Pelmet boards for curtains" },
  { id: "wall-design", name: "One Wall Designing", cat: "Finishing", price: 10000, note: "Accent wall / feature wall" },
];

// ── TIER PRESETS (default items & quantities from the sheet) ──
const TIER_PRESETS = {
  "Basic — 1BHK": {
    label: "Basic — 1BHK", price: "₹1,77,000", total: 177000, color: "#6366F1", desc: "Essential fitout for 1BHK apartments",
    items: [
      { id: "modular-kitchen-basic", qty: 1 },
      { id: "double-bed", qty: 1 },
      { id: "mattress", qty: 1 },
      { id: "side-table", qty: 1 },
      { id: "safety-doors", qty: 1 },
      { id: "tv-unit", qty: 1 },
      { id: "electrical-work-basic", qty: 1 },
    ]
  },
  "Premium — 2BHK": {
    label: "Premium — 2BHK", price: "₹4,65,000", total: 465000, color: "#1E88E5", desc: "Complete fitout for 2BHK apartments",
    items: [
      { id: "modular-kitchen-premium", qty: 1 },
      { id: "double-bed", qty: 2 },
      { id: "mattress", qty: 2 },
      { id: "side-table", qty: 1 },
      { id: "safety-doors", qty: 1 },
      { id: "tv-unit", qty: 1 },
      { id: "electrical-work-basic", qty: 1 },
      { id: "wardrobe-open", qty: 2 },
      { id: "sofa-lshape", qty: 1 },
      { id: "center-table", qty: 1 },
      { id: "false-ceiling", qty: 1 },
      { id: "shoe-rack", qty: 1 },
      { id: "dining-4seat", qty: 1 },
      { id: "partition", qty: 1 },
    ]
  },
  "Luxury — 3BHK": {
    label: "Luxury — 3BHK", price: "₹7,05,000", total: 705000, color: CL.lime, desc: "Premium fitout for 3BHK with finishing",
    items: [
      { id: "modular-kitchen-luxury", qty: 1 },
      { id: "double-bed", qty: 2 },
      { id: "mattress", qty: 2 },
      { id: "side-table", qty: 1 },
      { id: "safety-doors", qty: 1 },
      { id: "tv-unit", qty: 1 },
      { id: "electrical-work-lux", qty: 1 },
      { id: "wardrobe-sliding", qty: 2 },
      { id: "sofa-lshape", qty: 1 },
      { id: "center-table", qty: 1 },
      { id: "false-ceiling", qty: 1 },
      { id: "shoe-rack", qty: 1 },
      { id: "dining-6seat", qty: 1 },
      { id: "partition", qty: 1 },
      { id: "painting", qty: 1 },
      { id: "study-unit", qty: 1 },
      { id: "curtains", qty: 1 },
      { id: "palmlet", qty: 1 },
      { id: "wall-design", qty: 1 },
    ]
  }
};
const TIER_KEYS = Object.keys(TIER_PRESETS);

const rup = n => "₹" + n.toLocaleString("en-IN");
const Ctx = createContext(null);

// ═══════════════════════════════════════════════════
// UI PRIMITIVES
// ═══════════════════════════════════════════════════
const Badge = ({ children, color = CL.blue }) => <span style={{ display: "inline-flex", alignItems: "center", padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, letterSpacing: .5, background: color + "18", color, textTransform: "uppercase", whiteSpace: "nowrap" }}>{children}</span>;
const Btn = ({ children, v = "primary", sz = "md", onClick, style = {}, disabled, icon, loading, type }) => {
  const base = { display: "inline-flex", alignItems: "center", gap: 8, border: "none", cursor: disabled || loading ? "not-allowed" : "pointer", fontWeight: 600, fontFamily: "'Poppins',sans-serif", borderRadius: 10, transition: "all .2s", opacity: disabled || loading ? .55 : 1 };
  const sizes = { sm: { padding: "8px 16px", fontSize: 13 }, md: { padding: "12px 24px", fontSize: 14 }, lg: { padding: "16px 32px", fontSize: 16 } };
  const vars = { primary: { background: `linear-gradient(135deg,${CL.blue},#1565C0)`, color: "#fff", boxShadow: "0 4px 15px #1E88E540" }, lime: { background: `linear-gradient(135deg,${CL.lime},#84CC16)`, color: CL.navy, boxShadow: "0 4px 15px #A3E63540" }, outline: { background: "transparent", color: CL.blue, border: `2px solid ${CL.blue}` }, ghost: { background: "transparent", color: CL.navy }, navy: { background: CL.navy, color: "#fff" }, danger: { background: "#EF4444", color: "#fff" }, success: { background: "#10B981", color: "#fff" }, white: { background: "#fff", color: CL.navy, boxShadow: "0 2px 8px rgba(0,0,0,.08)" } };
  return <button type={type} onClick={onClick} disabled={disabled || loading} style={{ ...base, ...sizes[sz], ...vars[v], ...style }}>{loading ? <Loader2 size={16} className="spin" /> : icon}{children}</button>;
};
const Card = ({ children, style = {}, onClick }) => <div onClick={onClick} style={{ background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,.06),0 4px 20px rgba(0,0,0,.04)", transition: "all .3s", cursor: onClick ? "pointer" : "default", ...style }}>{children}</div>;
const Inp = ({ label, type = "text", value, onChange, placeholder, required, style = {}, disabled, multiline, rows = 3 }) => <div style={{ marginBottom: 16, ...style }}>{label && <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600, color: CL.navy, fontFamily: "'Poppins',sans-serif" }}>{label}{required && <span style={{ color: "#EF4444" }}> *</span>}</label>}{multiline ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows} style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: "1.5px solid #E2E8F0", fontSize: 14, fontFamily: "'Lato',sans-serif", outline: "none", boxSizing: "border-box", background: "#FAFBFC", resize: "vertical" }} /> : <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} required={required} disabled={disabled} style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: "1.5px solid #E2E8F0", fontSize: 14, fontFamily: "'Lato',sans-serif", outline: "none", boxSizing: "border-box", background: disabled ? "#F1F5F9" : "#FAFBFC" }} onFocus={e => e.target.style.borderColor = CL.blue} onBlur={e => e.target.style.borderColor = "#E2E8F0"} />}</div>;
const Sel = ({ label, value, onChange, options, required, style = {} }) => <div style={{ marginBottom: 16, ...style }}>{label && <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600, color: CL.navy, fontFamily: "'Poppins',sans-serif" }}>{label}{required && <span style={{ color: "#EF4444" }}> *</span>}</label>}<select value={value} onChange={e => onChange(e.target.value)} style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: "1.5px solid #E2E8F0", fontSize: 14, fontFamily: "'Lato',sans-serif", outline: "none", background: "#FAFBFC", cursor: "pointer" }}><option value="">Select...</option>{options.map(o => <option key={typeof o === "string" ? o : o.value} value={typeof o === "string" ? o : o.value}>{typeof o === "string" ? o : o.label}</option>)}</select></div>;
const StatCard = ({ label, value, icon, color = CL.blue }) => <Card style={{ display: "flex", alignItems: "center", gap: 16 }}><div style={{ width: 48, height: 48, borderRadius: 12, background: color + "15", display: "flex", alignItems: "center", justifyContent: "center", color, flexShrink: 0 }}>{icon}</div><div><div style={{ fontSize: 24, fontWeight: 700, color: CL.navy, fontFamily: "'Poppins',sans-serif" }}>{value}</div><div style={{ fontSize: 12, color: "#64748B" }}>{label}</div></div></Card>;
const Bar = ({ value, max = 100, color = CL.blue, h = 6 }) => <div style={{ background: "#E2E8F0", borderRadius: h, height: h, overflow: "hidden", flex: 1 }}><div style={{ width: `${Math.min((value / Math.max(max, 1)) * 100, 100)}%`, height: "100%", background: color, borderRadius: h, transition: "width .5s" }} /></div>;
const Tabs = ({ tabs, active, onChange }) => <div style={{ display: "flex", gap: 4, background: "#F1F5F9", borderRadius: 12, padding: 4, marginBottom: 20, overflowX: "auto" }}>{tabs.map(t => <button key={t} onClick={() => onChange(t)} style={{ padding: "10px 18px", borderRadius: 10, border: "none", background: active === t ? "#fff" : "transparent", color: active === t ? CL.navy : "#64748B", fontWeight: active === t ? 700 : 500, fontSize: 13, cursor: "pointer", fontFamily: "'Poppins',sans-serif", boxShadow: active === t ? "0 1px 3px rgba(0,0,0,.1)" : "none", whiteSpace: "nowrap" }}>{t}</button>)}</div>;
const Modal = ({ show, onClose, title, children, wide }) => { if (!show) return null; return <div style={{ position: "fixed", inset: 0, zIndex: 10000, background: "rgba(0,0,0,.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }} onClick={onClose}><div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 20, padding: 32, maxWidth: wide ? 800 : 560, width: "100%", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 25px 60px rgba(0,0,0,.3)" }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}><h2 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, color: CL.navy, margin: 0, fontSize: 20 }}>{title}</h2><button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={22} color="#94A3B8" /></button></div>{children}</div></div>; };
const Toast = ({ message, type = "success", onClose }) => { useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t); }, []); return <div style={{ position: "fixed", bottom: 80, right: 24, zIndex: 9999, background: type === "success" ? "#10B981" : type === "error" ? "#EF4444" : CL.blue, color: "#fff", padding: "12px 20px", borderRadius: 12, fontSize: 14, fontWeight: 600, boxShadow: "0 8px 30px rgba(0,0,0,.2)", display: "flex", alignItems: "center", gap: 10, animation: "slideUp .3s ease", maxWidth: 420 }}>{type === "success" ? <CheckCircle size={18} /> : type === "error" ? <XCircle size={18} /> : <Info size={18} />}{message}<button onClick={onClose} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", marginLeft: 8 }}><X size={14} /></button></div>; };
const Logo = ({ sz = 32 }) => <div style={{ display: "flex", alignItems: "center", gap: 10 }}><svg width={sz} height={sz} viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="10" fill={CL.navy} /><path d="M10 22L20 14L30 22" stroke={CL.blue} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /><rect x="14" y="22" width="12" height="8" rx="1" stroke={CL.lime} strokeWidth="2" /><circle cx="20" cy="26" r="1.5" fill={CL.blue} /></svg><div style={{ lineHeight: 1.1 }}><span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: sz * .5, color: CL.navy, letterSpacing: -.5 }}>HomeFit</span><span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 400, fontSize: sz * .5, color: CL.blue }}> Solutions</span></div></div>;
const SH = ({ badge, title, sub }) => <div style={{ textAlign: "center", marginBottom: 48 }}>{badge && <Badge color={CL.blue}>{badge}</Badge>}<h2 style={{ fontFamily: "'Poppins',sans-serif", fontSize: "clamp(26px,4vw,36px)", fontWeight: 800, color: CL.navy, margin: "12px 0 8px" }}>{title}</h2>{sub && <p style={{ color: "#64748B", maxWidth: 560, margin: "0 auto", lineHeight: 1.6 }}>{sub}</p>}</div>;
const Empty = ({ icon, title, desc }) => <Card style={{ textAlign: "center", padding: 48 }}><div style={{ color: "#CBD5E1", marginBottom: 12 }}>{icon}</div><h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, color: CL.navy, margin: "0 0 8px" }}>{title}</h3><p style={{ color: "#94A3B8", fontSize: 14 }}>{desc}</p></Card>;

// ═══════════════════════════════════════════════════
// QTY STEPPER
// ═══════════════════════════════════════════════════
const QtyStepper = ({ qty, onChange, min = 0, max = 10 }) => <div style={{ display: "flex", alignItems: "center", gap: 2, background: "#F1F5F9", borderRadius: 8, padding: 2 }}>
  <button onClick={() => onChange(Math.max(min, qty - 1))} style={{ width: 28, height: 28, borderRadius: 6, border: "none", background: qty <= min ? "#E2E8F0" : CL.blue, color: qty <= min ? "#94A3B8" : "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700 }}>−</button>
  <span style={{ width: 32, textAlign: "center", fontSize: 14, fontWeight: 700, color: CL.navy }}>{qty}</span>
  <button onClick={() => onChange(Math.min(max, qty + 1))} style={{ width: 28, height: 28, borderRadius: 6, border: "none", background: CL.blue, color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700 }}>+</button>
</div>;

// ═══════════════════════════════════════════════════
// SETUP MODAL + CONNECTION BAR
// ═══════════════════════════════════════════════════
const ConnBar = ({ db, rk, onCfg }) => <div style={{ background: db ? "#10B98110" : "#FEF3C7", padding: "6px 24px", display: "flex", alignItems: "center", justifyContent: "center", gap: 16, fontSize: 12, fontWeight: 600, flexWrap: "wrap" }}><span style={{ display: "flex", alignItems: "center", gap: 4, color: db ? "#10B981" : "#92400E" }}>{db ? <Wifi size={14} /> : <WifiOff size={14} />}Supabase: {db ? "Live" : "Demo"}</span><span style={{ color: "#CBD5E1" }}>|</span><span style={{ display: "flex", alignItems: "center", gap: 4, color: rk ? "#10B981" : "#92400E" }}><CreditCard size={14} />Razorpay: {rk ? "Ready" : "Not set"}</span><button onClick={onCfg} style={{ background: CL.navy, color: "#fff", border: "none", padding: "4px 12px", borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>⚙ Configure</button></div>;

const SetupModal = ({ show, onClose, sc, setSc, rc, setRc, onSave }) => {
  const [testing, setTesting] = useState(false); const [res, setRes] = useState(null);
  const test = async () => { setTesting(true); setRes(null); try { const c = mkSupa(sc.url, sc.anonKey); if (!c) throw new Error("URL & Key required"); await c.q("cms_faqs", { limit: 1 }); setRes({ ok: true }); } catch (e) { setRes({ ok: false, m: e.message }); } setTesting(false); };
  return <Modal show={show} onClose={onClose} title="🔌 Connect Services">
    <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 12, padding: 16, marginBottom: 24, fontSize: 13, color: "#166534", lineHeight: 1.7 }}><strong>Setup:</strong><br />1. Create project at <strong>supabase.com</strong><br />2. Run <code>supabase-schema.sql</code> in SQL Editor<br />3. Copy Project URL + anon key from Settings → API<br />4. Get Razorpay Key ID from dashboard.razorpay.com</div>
    <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, color: CL.navy, margin: "0 0 12px", fontSize: 15 }}><Database size={16} style={{ verticalAlign: "middle" }} /> Supabase</h3>
    <Inp label="Project URL" value={sc.url} onChange={v => setSc(p => ({ ...p, url: v }))} placeholder="https://xxxxx.supabase.co" />
    <Inp label="Anon Key" value={sc.anonKey} onChange={v => setSc(p => ({ ...p, anonKey: v }))} placeholder="eyJhbGci..." />
    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 20 }}><Btn v="outline" sz="sm" onClick={test} loading={testing} icon={<RefreshCw size={14} />}>Test</Btn>{res && <span style={{ fontSize: 12, color: res.ok ? "#10B981" : "#EF4444", fontWeight: 600 }}>{res.ok ? "✓ Connected!" : res.m}</span>}</div>
    <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, color: CL.navy, margin: "0 0 12px", fontSize: 15 }}><CreditCard size={16} style={{ verticalAlign: "middle" }} /> Razorpay</h3>
    <Inp label="Key ID" value={rc.keyId} onChange={v => setRc(p => ({ ...p, keyId: v }))} placeholder="rzp_test_xxxxxxxxxxxx" />
    <div style={{ display: "flex", gap: 12, marginTop: 20 }}><Btn v="ghost" onClick={onClose}>Cancel</Btn><Btn v="lime" onClick={onSave} style={{ flex: 1, justifyContent: "center" }} icon={<Zap size={16} />}>Save & Connect</Btn></div>
  </Modal>;
};

// ═══════════════════════════════════════════════════
// HEADER
// ═══════════════════════════════════════════════════
const Header = () => {
  const { page, go, isAdmin, setAdmin } = useContext(Ctx);
  const [mob, setMob] = useState(false);
  return <header style={{ position: "sticky", top: 0, zIndex: 1000, background: "rgba(255,255,255,.96)", backdropFilter: "blur(20px)", borderBottom: "1px solid #E2E8F020", padding: "0 24px" }}>
    <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
      <div onClick={() => { go("home"); setAdmin(false); }} style={{ cursor: "pointer" }}><Logo sz={28} /></div>
      <nav style={{ display: "flex", alignItems: "center", gap: 8 }} className="dn">
        {[["Packages", "packages"], ["Gallery", "gallery"], ["Resources", "resources"], ["Contact", "contact"]].map(([l, k]) => <button key={k} onClick={() => go(k)} style={{ padding: "8px 14px", background: "none", border: "none", color: page === k ? CL.blue : CL.navy, fontWeight: 600, fontSize: 14, cursor: "pointer", fontFamily: "'Poppins',sans-serif" }}>{l}</button>)}
        <button onClick={() => setAdmin(!isAdmin)} style={{ padding: "6px 12px", background: "none", border: "1px solid #E2E8F0", borderRadius: 8, color: "#64748B", fontSize: 12, cursor: "pointer" }}>{isAdmin ? "← Site" : "Admin"}</button>
        <Btn v="lime" sz="sm" onClick={() => go("builder")}>Get Quotation</Btn>
      </nav>
      <button onClick={() => setMob(!mob)} className="mb" style={{ display: "none", background: "none", border: "none", cursor: "pointer", color: CL.navy }}>{mob ? <X size={24} /> : <Menu size={24} />}</button>
    </div>
    {mob && <div style={{ position: "fixed", inset: 0, top: 64, background: "#fff", zIndex: 999, padding: 24, display: "flex", flexDirection: "column", gap: 4 }}>{[["Home", "home"], ["Packages", "packages"], ["Gallery", "gallery"], ["Resources", "resources"], ["Contact", "contact"], ["Get Quotation", "builder"], [isAdmin ? "← Site" : "Admin", "_admin"]].map(([l, k]) => <button key={k} onClick={() => { if (k === "_admin") setAdmin(!isAdmin); else go(k); setMob(false); }} style={{ padding: 16, background: "none", border: "none", borderBottom: "1px solid #F1F5F9", textAlign: "left", fontSize: 16, fontWeight: 600, color: CL.navy, cursor: "pointer" }}>{l}</button>)}</div>}
    <style>{`@media(max-width:768px){.dn{display:none!important}.mb{display:block!important}}`}</style>
  </header>;
};

// ═══════════════════════════════════════════════════
// HERO
// ═══════════════════════════════════════════════════
const Hero = () => { const { go } = useContext(Ctx); return <section style={{ position: "relative", overflow: "hidden", background: `linear-gradient(165deg,${CL.navy} 0%,#0D2847 50%,#132F55 100%)`, padding: "80px 24px 100px", minHeight: 480 }}><div style={{ position: "absolute", inset: 0, opacity: .06 }}>{[...Array(10)].map((_, i) => <div key={i} style={{ position: "absolute", width: 200 + i * 40, height: 200 + i * 40, borderRadius: "50%", border: "1px solid #fff", left: `${(i * 37) % 100}%`, top: `${(i * 53) % 100}%`, transform: "translate(-50%,-50%)" }} />)}</div><div style={{ position: "absolute", top: -120, right: -120, width: 500, height: 500, borderRadius: "50%", background: CL.blue, opacity: .06, filter: "blur(100px)" }} /><div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}><Badge color={CL.lime}>Trusted by 50+ Builders Across India</Badge><h1 style={{ fontFamily: "'Poppins',sans-serif", fontSize: "clamp(32px,5vw,60px)", fontWeight: 800, color: "#fff", lineHeight: 1.08, margin: "20px 0 16px", maxWidth: 700 }}>From Shell to <span style={{ background: `linear-gradient(135deg,${CL.lime},#84CC16)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Sell‑Ready</span></h1><p style={{ fontSize: 18, color: "#94A3B8", maxWidth: 560, lineHeight: 1.7, margin: "0 0 32px" }}>Complete home fitout packages — furniture, kitchen, electrical & finishing. Pick exactly what you need, see your price instantly.</p><div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}><Btn v="lime" sz="lg" onClick={() => go("builder")} icon={<Zap size={18} />}>Build Your Package</Btn><Btn v="outline" sz="lg" onClick={() => go("contact")} style={{ color: "#fff", borderColor: "#ffffff40" }} icon={<Phone size={18} />}>Contact Us</Btn></div><div style={{ display: "flex", gap: 32, marginTop: 48, flexWrap: "wrap" }}>{[{ n: "500+", l: "Units Delivered" }, { n: "15d", l: "Avg. Turnaround" }, { n: "₹25Cr+", l: "Project Value" }, { n: "98%", l: "On-Time" }].map(s => <div key={s.l}><div style={{ fontSize: 28, fontWeight: 800, color: CL.lime, fontFamily: "'Poppins',sans-serif" }}>{s.n}</div><div style={{ fontSize: 13, color: "#94A3B8" }}>{s.l}</div></div>)}</div></div></section>; };

const USPs = () => <section style={{ padding: "80px 24px", background: CL.gray }}><div style={{ maxWidth: 1200, margin: "0 auto" }}><SH badge="Why HomeFit" title="Built for Builders" /><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: 24 }}>{[{ icon: <Truck size={24} />, t: "End-to-End Delivery", d: "One vendor, one invoice — from kitchen to curtains." }, { icon: <Clock size={24} />, t: "15-Day Turnaround", d: "Order to move-in ready in 15 days." }, { icon: <Shield size={24} />, t: "Consolidated Warranty", d: "One warranty pack for all items." }, { icon: <Award size={24} />, t: "3 Tiers: 1/2/3 BHK", d: "Basic, Premium, Luxury presets." }, { icon: <Target size={24} />, t: "Pick Your Items", d: "Select exactly what you need per unit." }, { icon: <Zap size={24} />, t: "Instant Pricing", d: "Real-time auto-calculated quotations." }].map(u => <Card key={u.t} style={{ textAlign: "center", padding: 32 }}><div style={{ width: 56, height: 56, borderRadius: 14, background: CL.blue + "12", display: "inline-flex", alignItems: "center", justifyContent: "center", color: CL.blue, marginBottom: 16 }}>{u.icon}</div><h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, color: CL.navy, margin: "0 0 8px", fontSize: 16 }}>{u.t}</h3><p style={{ color: "#64748B", fontSize: 14, lineHeight: 1.6, margin: 0 }}>{u.d}</p></Card>)}</div></div></section>;

// ═══════════════════════════════════════════════════
// PACKAGES SECTION — shows 3 tiers from the sheet
// ═══════════════════════════════════════════════════
const PkgSection = () => { const { go } = useContext(Ctx); return <section style={{ padding: "80px 24px", background: CL.gray }}><div style={{ maxWidth: 1200, margin: "0 auto" }}><SH badge="Packages" title="Home Fitout Packages" sub="Start with a preset tier, then customise every item." /><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 24 }}>{TIER_KEYS.map((tk, i) => { const t = TIER_PRESETS[tk]; return <Card key={tk} style={{ position: "relative", border: i === 1 ? `2px solid ${CL.blue}` : "1px solid #E2E8F0", overflow: "hidden" }}>{i === 1 && <div style={{ position: "absolute", top: 16, right: -30, background: CL.blue, color: "#fff", padding: "4px 40px", fontSize: 11, fontWeight: 700, transform: "rotate(45deg)", letterSpacing: 1 }}>POPULAR</div>}<div style={{ textAlign: "center", marginBottom: 20 }}><div style={{ fontSize: 12, fontWeight: 700, color: t.color, textTransform: "uppercase", letterSpacing: 2, marginBottom: 4 }}>{tk}</div><div style={{ fontSize: 28, fontWeight: 800, color: CL.navy, fontFamily: "'Poppins',sans-serif" }}>{t.price}</div><div style={{ fontSize: 12, color: "#94A3B8" }}>{t.desc}</div></div><div style={{ borderTop: "1px solid #F1F5F9", paddingTop: 16, marginBottom: 20 }}>{t.items.map(({ id, qty }) => { const item = ALL_ITEMS.find(a => a.id === id); return item ? <div key={id} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", fontSize: 13, color: "#334155" }}><div style={{ display: "flex", gap: 6 }}><Check size={14} style={{ color: CL.lime, marginTop: 2, flexShrink: 0 }} />{item.name}{qty > 1 && <Badge color="#64748B">×{qty}</Badge>}</div><span style={{ color: "#94A3B8", fontSize: 12 }}>{rup(item.price * qty)}</span></div> : null; })}</div><Btn v={i === 1 ? "primary" : "outline"} sz="md" onClick={() => go("builder")} style={{ width: "100%", justifyContent: "center" }}>Customise & Order</Btn></Card>; })}</div></div></section>; };

// ═══════════════════════════════════════════════════
// PAYMENT TERMS SECTION
// ═══════════════════════════════════════════════════
const PayTerms = () => <section style={{ padding: "60px 24px" }}><div style={{ maxWidth: 800, margin: "0 auto" }}><SH title="Payment Terms" sub="Simple milestone-based payment structure." /><div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>{PAY_TERMS.map((p, i) => <Card key={i} style={{ flex: "1 1 200px", textAlign: "center", border: i === 0 ? `2px solid ${CL.lime}` : "1px solid #E2E8F0" }}><div style={{ fontSize: 36, fontWeight: 800, color: CL.blue, fontFamily: "'Poppins',sans-serif" }}>{p.pct}%</div><div style={{ fontWeight: 700, color: CL.navy, fontSize: 14, marginTop: 4 }}>{p.label}</div><div style={{ fontSize: 12, color: "#94A3B8", marginTop: 4 }}>{p.desc}</div></Card>)}</div></div></section>;

// ═══════════════════════════════════════════════════
// LEAD FORM
// ═══════════════════════════════════════════════════
const LeadForm = () => {
  const { db, toast } = useContext(Ctx);
  const [step, setStep] = useState(1); const [done, setDone] = useState(false); const [loading, setLoading] = useState(false);
  const [f, setF] = useState({ name: "", phone: "", email: "", city: "", budget: "", units: "", area: "", notes: "", consent: false, company: "" });
  const u = (k, v) => setF(p => ({ ...p, [k]: v }));
  const submit = async () => { setLoading(true); try { const data = { name: f.name, phone: f.phone, email: f.email, company: f.company, module_type: "home", project_city: f.city, budget_range: f.budget, unit_count: f.units ? parseInt(f.units) : null, area_sqft: f.area ? parseInt(f.area) : null, notes: f.notes, source: "website" }; if (db) { const [lead] = await db.ins("leads", data); await db.ins("activities", { lead_id: lead.id, type: "lead_created", content: `Lead from website — ${f.city}, ${f.budget}`, by_user: "system" }); toast(`Lead saved! Score: ${lead.score}`, "success"); } else toast("Lead captured (demo)", "info"); setDone(true); } catch (e) { toast(e.message, "error"); } setLoading(false); };

  if (done) return <section style={{ padding: "80px 24px", background: CL.gray }}><div style={{ maxWidth: 500, margin: "0 auto", textAlign: "center" }}><div style={{ width: 80, height: 80, borderRadius: "50%", background: "#10B98120", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}><CheckCircle size={40} color="#10B981" /></div><h2 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, color: CL.navy }}>Thank You, {f.name}!</h2><p style={{ color: "#64748B", lineHeight: 1.7 }}>Our specialist will call within 2 hours.</p></div></section>;

  return <section style={{ padding: "80px 24px", background: CL.gray }}><div style={{ maxWidth: 580, margin: "0 auto" }}>
    <SH badge="Get Started" title="Request a Quotation" />
    <Card>
      {step === 1 && <><Inp label="Name" value={f.name} onChange={v => u("name", v)} required placeholder="Rajesh Patel" /><Inp label="Phone" type="tel" value={f.phone} onChange={v => u("phone", v)} required placeholder="+91 98765 43210" /><Inp label="Email" type="email" value={f.email} onChange={v => u("email", v)} required placeholder="you@company.com" /><Inp label="Company" value={f.company} onChange={v => u("company", v)} placeholder="BuildCorp Developers" /><Btn v="primary" onClick={() => setStep(2)} disabled={!f.name || !f.phone} style={{ width: "100%", justifyContent: "center" }}>Next — Project Details</Btn></>}
      {step === 2 && <><Inp label="Project City" value={f.city} onChange={v => u("city", v)} required placeholder="Ahmedabad, Mumbai..." /><Sel label="Budget Range" value={f.budget} onChange={v => u("budget", v)} options={BUDGETS} /><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}><Inp label="Units" type="number" value={f.units} onChange={v => u("units", v)} placeholder="48" /><Inp label="Area (sqft)" type="number" value={f.area} onChange={v => u("area", v)} placeholder="52000" /></div><Inp label="Notes" value={f.notes} onChange={v => u("notes", v)} multiline placeholder="Specific requirements, timeline..." /><label style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 16, cursor: "pointer" }}><input type="checkbox" checked={f.consent} onChange={e => u("consent", e.target.checked)} style={{ marginTop: 3 }} /><span style={{ fontSize: 12, color: "#64748B" }}>I agree to receive communications via WhatsApp and email.</span></label><div style={{ display: "flex", gap: 8 }}><Btn v="ghost" onClick={() => setStep(1)}>← Back</Btn><Btn v="lime" onClick={submit} disabled={!f.city || !f.consent} loading={loading} style={{ flex: 1, justifyContent: "center" }} icon={<Send size={16} />}>Submit</Btn></div></>}
    </Card>
  </div></section>;
};

// ═══════════════════════════════════════════════════
// 🔥 PACKAGE BUILDER — ITEM PICKER + AUTO-CALC
// ═══════════════════════════════════════════════════
const Builder = () => {
  const { db, rk, toast, go } = useContext(Ctx);
  const [step, setStep] = useState(1);
  const [tier, setTier] = useState("");
  const [items, setItems] = useState({}); // { itemId: qty }
  const [quot, setQuot] = useState(null);
  const [saving, setSaving] = useState(false);
  const [paying, setPaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [units, setUnits] = useState(1);

  // Load preset when tier selected
  const loadTier = (tk) => {
    setTier(tk);
    const preset = TIER_PRESETS[tk];
    if (!preset) return;
    const map = {};
    preset.items.forEach(({ id, qty }) => { map[id] = qty; });
    setItems(map);
    setStep(2);
  };

  const toggleItem = (id) => { setItems(p => { const n = { ...p }; if (n[id]) delete n[id]; else n[id] = 1; return n; }); };
  const setQty = (id, q) => { setItems(p => { const n = { ...p }; if (q <= 0) delete n[id]; else n[id] = q; return n; }); };

  // Calculations
  const selectedItems = Object.entries(items).map(([id, qty]) => ({ ...ALL_ITEMS.find(a => a.id === id), qty })).filter(i => i.id);
  const perUnit = selectedItems.reduce((s, i) => s + i.price * i.qty, 0);
  const totalAll = perUnit * units;
  const booking = Math.round(totalAll * 0.10);
  const mid = Math.round(totalAll * 0.50);
  const final_ = totalAll - booking - mid;

  const categories = [...new Set(ALL_ITEMS.map(i => i.cat))];

  const generate = async () => {
    setSaving(true);
    try {
      const data = { module_type: "home", package_tier: tier || "Custom", items_json: JSON.stringify(selectedItems.map(i => ({ name: i.name, qty: i.qty, price: i.price }))), addons_json: "[]", subtotal: totalAll, gst_rate: 0, gst: 0, total: totalAll, advance_pct: 10, status: "draft" };
      if (db) {
        const [q] = await db.ins("quotations", data);
        setQuot(q);
        await db.ins("activities", { type: "quotation_created", content: `Quotation: ${tier || "Custom"} × ${units} units = ${rup(totalAll)}`, by_user: "website" });
        toast(`Quotation saved! Token: ${q.public_token?.slice(0, 12)}`, "success");
      } else { setQuot({ id: "demo-" + Date.now(), public_token: "demo_" + Date.now(), ...data }); toast("Quotation generated (demo)", "info"); }
    } catch (e) { toast(e.message, "error"); }
    setSaving(false);
  };

  const pay = async () => {
    if (!rk) { toast("Configure Razorpay first!", "error"); return; }
    setPaying(true);
    openRzp({
      keyId: rk, amount: booking, desc: `10% Booking — ${tier || "Custom"} × ${units} units`,
      notes: { quotation_id: quot?.id || "", tier, units },
      onOk: async (r) => {
        toast(`Payment successful! ${r.pid}`, "success");
        if (db && quot?.id && !quot.id.startsWith("demo")) {
          try {
            await db.ins("payments", { quotation_id: quot.id, razorpay_payment_id: r.pid, razorpay_order_id: r.oid, razorpay_signature: r.sig, amount: booking, status: "paid", paid_at: new Date().toISOString() });
            await db.upd("quotations", { id: quot.id }, { status: "booking_paid" });
            await db.ins("activities", { type: "payment_received", content: `Booking payment ${rup(booking)} received — ${r.pid}`, by_user: "system" });
            toast("Payment recorded!", "success");
          } catch (e) { toast("DB error: " + e.message, "error"); }
        }
        setPaying(false);
      },
      onFail: (e) => { toast(e === "dismissed" ? "Cancelled" : "Payment failed", "error"); setPaying(false); },
    });
  };

  // ── QUOTATION RESULT ──
  if (quot) return <section style={{ padding: "80px 24px", minHeight: "80vh" }}><div style={{ maxWidth: 740, margin: "0 auto" }}><Card style={{ padding: 40 }}>
    <div style={{ textAlign: "center" }}><div style={{ width: 80, height: 80, borderRadius: "50%", background: "#10B98120", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}><CheckCircle size={40} color="#10B981" /></div><h2 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, color: CL.navy, margin: "0 0 4px" }}>Quotation Ready!</h2>{db && <p style={{ color: "#94A3B8", fontSize: 12 }}>Token: <code style={{ background: "#F1F5F9", padding: "2px 8px", borderRadius: 4 }}>{quot.public_token}</code></p>}</div>

    <div style={{ background: CL.gray, borderRadius: 12, padding: 24, margin: "24px 0" }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: "#64748B", marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 }}>Itemized Breakdown (per unit)</div>
      {selectedItems.map(i => <div key={i.id} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 14, borderBottom: "1px solid #E2E8F0" }}><span style={{ color: "#334155" }}>{i.name}{i.qty > 1 ? ` × ${i.qty}` : ""}</span><span style={{ fontWeight: 600, color: CL.navy }}>{rup(i.price * i.qty)}</span></div>)}
      <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", fontSize: 15, borderTop: "2px solid #CBD5E1", marginTop: 8, fontWeight: 700 }}><span>Per Unit Total</span><span style={{ color: CL.blue }}>{rup(perUnit)}</span></div>
      {units > 1 && <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 14, color: "#64748B" }}><span>× {units} units</span><span style={{ fontWeight: 600 }}>{rup(totalAll)}</span></div>}
      <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 16, marginTop: 12, borderTop: "2px solid #1E293B", fontSize: 22 }}><span style={{ fontWeight: 800, color: CL.navy }}>Grand Total</span><span style={{ fontWeight: 800, color: CL.blue }}>{rup(totalAll)}</span></div>
    </div>

    <div style={{ background: "#EFF6FF", borderRadius: 12, padding: 20, marginBottom: 24 }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: CL.navy, marginBottom: 12 }}>Payment Schedule</div>
      {[{ l: "10% — Order Booking (pay now)", a: booking, active: true }, { l: "50% — Within 30 days", a: mid }, { l: "40% — Before Finishing", a: final_ }].map((p, i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: i < 2 ? "1px solid #BFDBFE" : "none", fontSize: 14 }}><span style={{ color: p.active ? CL.blue : "#64748B", fontWeight: p.active ? 700 : 400 }}>{p.l}</span><span style={{ fontWeight: 700, color: p.active ? CL.blue : CL.navy }}>{rup(p.a)}</span></div>)}
    </div>

    <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
      <Btn v="lime" sz="lg" onClick={pay} loading={paying} icon={<CreditCard size={18} />}>Pay Booking {rup(booking)}</Btn>
      <Btn v="outline" onClick={() => { navigator.clipboard?.writeText(`${window.location.origin}/q/${quot.public_token}`); setCopied(true); setTimeout(() => setCopied(false), 2000); }} icon={copied ? <Check size={16} /> : <Copy size={16} />}>{copied ? "Copied!" : "Copy Link"}</Btn>
      <Btn v="ghost" onClick={() => { setQuot(null); setStep(1); setTier(""); setItems({}); setUnits(1); }}>New Quote</Btn>
    </div>
    {!rk && <p style={{ color: "#F59E0B", fontSize: 12, textAlign: "center", marginTop: 12 }}>⚠ Configure Razorpay to enable payments</p>}
  </Card></div></section>;

  // ── BUILDER STEPS ──
  return <section style={{ padding: "60px 24px", minHeight: "80vh", background: CL.gray }}><div style={{ maxWidth: 900, margin: "0 auto" }}>
    <SH title="Package Builder" sub="Choose a preset or build custom. Toggle items on/off, adjust quantities." />

    {/* Step indicators */}
    <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 32 }}>{["Select Tier", "Customise Items", "Review & Order"].map((s, i) => <div key={s} style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 28, height: 28, borderRadius: "50%", background: step > i ? CL.blue : step === i + 1 ? CL.navy : "#E2E8F0", color: step >= i + 1 ? "#fff" : "#94A3B8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>{step > i ? "✓" : i + 1}</div><span style={{ fontSize: 12, color: step === i + 1 ? CL.navy : "#94A3B8", fontWeight: step === i + 1 ? 600 : 400 }}>{s}</span>{i < 2 && <div style={{ width: 16, height: 1.5, background: step > i + 1 ? CL.blue : "#E2E8F0" }} />}</div>)}</div>

    {/* STEP 1: Tier Selection */}
    {step === 1 && <div>
      {TIER_KEYS.map((tk, i) => { const t = TIER_PRESETS[tk]; return <Card key={tk} onClick={() => loadTier(tk)} style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 12, cursor: "pointer", border: tier === tk ? `2px solid ${CL.blue}` : "2px solid #E2E8F0" }}>
        <div style={{ width: 64, height: 64, borderRadius: 14, background: t.color + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0 }}>{["🏠", "🏢", "🏰"][i]}</div>
        <div style={{ flex: 1 }}><div style={{ fontWeight: 700, color: CL.navy, fontSize: 16 }}>{tk}</div><div style={{ fontSize: 13, color: "#64748B" }}>{t.desc} — {t.items.length} items included</div></div>
        <div style={{ textAlign: "right" }}><div style={{ fontSize: 20, fontWeight: 800, color: CL.blue, fontFamily: "'Poppins',sans-serif" }}>{t.price}</div><div style={{ fontSize: 12, color: "#94A3B8" }}>per unit</div></div>
      </Card>; })}
      <div style={{ textAlign: "center", margin: "20px 0" }}><div style={{ color: "#94A3B8", fontSize: 13, marginBottom: 12 }}>— or —</div><Btn v="outline" onClick={() => { setTier("Custom"); setItems({}); setStep(2); }} icon={<Wrench size={16} />}>Start From Scratch</Btn></div>
    </div>}

    {/* STEP 2: Item Picker */}
    {step === 2 && <div>
      {/* Live price bar */}
      <div style={{ position: "sticky", top: 64, zIndex: 100, background: CL.navy, borderRadius: 12, padding: "16px 24px", marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div><div style={{ fontSize: 12, color: "#94A3B8" }}>Selected: {Object.keys(items).length} items</div><div style={{ fontSize: 22, fontWeight: 800, color: "#fff", fontFamily: "'Poppins',sans-serif" }}>{rup(perUnit)} <span style={{ fontSize: 13, fontWeight: 400, color: "#94A3B8" }}>/ unit</span></div></div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ color: "#94A3B8", fontSize: 13 }}>Units:</div>
          <QtyStepper qty={units} onChange={setUnits} min={1} max={500} />
          <div style={{ borderLeft: "1px solid #334155", paddingLeft: 12, marginLeft: 4 }}><div style={{ fontSize: 12, color: "#94A3B8" }}>Total</div><div style={{ fontSize: 16, fontWeight: 700, color: CL.lime }}>{rup(totalAll)}</div></div>
        </div>
      </div>

      {/* Items by category */}
      {categories.map(cat => <div key={cat} style={{ marginBottom: 24 }}>
        <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, color: CL.navy, margin: "0 0 12px", fontSize: 15, display: "flex", alignItems: "center", gap: 8 }}><div style={{ width: 4, height: 20, borderRadius: 2, background: CL.blue }} />{cat}</h3>
        <div style={{ display: "grid", gap: 8 }}>
          {ALL_ITEMS.filter(i => i.cat === cat).map(item => {
            const active = items[item.id] > 0;
            const qty = items[item.id] || 0;
            return <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", borderRadius: 12, background: active ? "#fff" : "#FAFBFC", border: active ? `2px solid ${CL.blue}` : "1.5px solid #E2E8F0", cursor: "pointer", transition: "all .2s" }} onClick={() => { if (!active) toggleItem(item.id); }}>
              <input type="checkbox" checked={active} onChange={() => toggleItem(item.id)} onClick={e => e.stopPropagation()} style={{ width: 18, height: 18, accentColor: CL.blue, cursor: "pointer" }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: active ? CL.navy : "#64748B", fontSize: 14 }}>{item.name}</div>
                {item.note && <div style={{ fontSize: 12, color: "#94A3B8" }}>{item.note}</div>}
              </div>
              <div style={{ fontWeight: 700, color: active ? CL.blue : "#94A3B8", fontSize: 14, marginRight: 8 }}>{rup(item.price)}</div>
              {active && <div onClick={e => e.stopPropagation()}><QtyStepper qty={qty} onChange={q => setQty(item.id, q)} min={0} max={10} /></div>}
              {active && qty > 1 && <div style={{ fontSize: 12, fontWeight: 700, color: CL.navy, minWidth: 70, textAlign: "right" }}>{rup(item.price * qty)}</div>}
            </div>;
          })}
        </div>
      </div>)}

      <div style={{ display: "flex", gap: 8, marginTop: 24 }}><Btn v="ghost" onClick={() => { setStep(1); }}>← Back</Btn><Btn v="primary" onClick={() => setStep(3)} disabled={Object.keys(items).length === 0} style={{ flex: 1, justifyContent: "center" }}>Review Summary →</Btn></div>
    </div>}

    {/* STEP 3: Summary */}
    {step === 3 && <Card style={{ padding: 32 }}>
      <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, color: CL.navy, margin: "0 0 20px" }}>Order Summary</h3>
      <div style={{ background: CL.gray, borderRadius: 12, padding: 20, marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}><span style={{ fontSize: 13, fontWeight: 600, color: "#64748B" }}>Tier</span><Badge color={TIER_PRESETS[tier]?.color || CL.blue}>{tier || "Custom"}</Badge></div>
        {selectedItems.map(i => <div key={i.id} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 14, borderBottom: "1px solid #E2E8F0" }}><span style={{ color: "#334155" }}>{i.name}{i.qty > 1 && ` × ${i.qty}`}</span><span style={{ fontWeight: 600, color: CL.navy }}>{rup(i.price * i.qty)}</span></div>)}
        <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 12, marginTop: 8, fontSize: 15, fontWeight: 700, borderTop: "2px solid #CBD5E1" }}><span>Per Unit</span><span style={{ color: CL.blue }}>{rup(perUnit)}</span></div>
        {units > 1 && <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 14, color: "#64748B" }}><span>× {units} units</span><span>{rup(totalAll)}</span></div>}
        <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 12, marginTop: 8, borderTop: "2px solid #1E293B", fontSize: 22 }}><span style={{ fontWeight: 800, color: CL.navy }}>Grand Total</span><span style={{ fontWeight: 800, color: CL.blue }}>{rup(totalAll)}</span></div>
      </div>

      <div style={{ background: "#EFF6FF", borderRadius: 10, padding: 16, marginBottom: 20 }}>
        <div style={{ fontWeight: 700, color: CL.navy, fontSize: 14, marginBottom: 8 }}>Payment Schedule</div>
        {[["10% — Order Booking", booking], ["50% — Within 30 days", mid], ["40% — Before Finishing", final_]].map(([l, a], i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 13, borderBottom: i < 2 ? "1px solid #BFDBFE" : "none" }}><span style={{ color: "#334155" }}>{l}</span><span style={{ fontWeight: 700 }}>{rup(a)}</span></div>)}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <Btn v="ghost" onClick={() => setStep(2)}>← Edit Items</Btn>
        <Btn v="lime" onClick={generate} loading={saving} style={{ flex: 1, justifyContent: "center" }} icon={<FileText size={16} />}>{db ? "Save & Generate Quotation" : "Generate (Demo)"}</Btn>
      </div>
    </Card>}
  </div></section>;
};

// ═══════════════════════════════════════════════════
// PUBLIC: Gallery, Resources, Contact, FAQ
// ═══════════════════════════════════════════════════
const Gallery = () => { const items = [{ c: "2BHK Premium — Ahmedabad", e: "🛋️", t: "After" }, { c: "3BHK Luxury — Mumbai", e: "🏡", t: "After" }, { c: "1BHK Basic — Pune", e: "🪑", t: "Before" }, { c: "2BHK Modular Kitchen", e: "👨‍🍳", t: "After" }, { c: "False Ceiling + Painting", e: "🎨", t: "After" }, { c: "Sliding Wardrobe Install", e: "🚪", t: "After" }]; return <section style={{ padding: "80px 24px", minHeight: "80vh" }}><div style={{ maxWidth: 1200, margin: "0 auto" }}><SH title="Project Gallery" /><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 20 }}>{items.map((g, i) => <div key={i} style={{ borderRadius: 16, overflow: "hidden", background: CL.gray, border: "1px solid #E2E8F0" }}><div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 64, position: "relative" }}>{g.e}<div style={{ position: "absolute", top: 12, left: 12 }}><Badge color={g.t === "Before" ? "#F59E0B" : "#10B981"}>{g.t}</Badge></div></div><div style={{ padding: 16, fontSize: 14, fontWeight: 600, color: CL.navy }}>{g.c}</div></div>)}</div></div></section>; };

const Resources = () => { const { toast } = useContext(Ctx); return <section style={{ padding: "80px 24px", minHeight: "80vh" }}><div style={{ maxWidth: 900, margin: "0 auto" }}><SH title="Resources & Downloads" />{[{ t: "HomeFit Buyer's Guide", d: "Complete guide for builders.", tp: "PDF" }, { t: "ROI Calculator", d: "See how fitouts improve margins.", tp: "Excel" }, { t: "Sample Quotation — 2BHK", d: "Full itemized pricing example.", tp: "PDF" }].map((r, i) => <Card key={i} style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12, cursor: "pointer" }} onClick={() => toast("Download (connect storage)", "info")}><div style={{ width: 48, height: 48, borderRadius: 12, background: CL.blue + "12", display: "flex", alignItems: "center", justifyContent: "center", color: CL.blue, flexShrink: 0 }}><BookOpen size={20} /></div><div style={{ flex: 1 }}><div style={{ fontWeight: 700, color: CL.navy }}>{r.t}</div><div style={{ fontSize: 13, color: "#64748B" }}>{r.d}</div></div><Badge>{r.tp}</Badge></Card>)}</div></section>; };

const Contact = () => { const { db, toast } = useContext(Ctx); const [f, setF] = useState({ name: "", email: "", phone: "", msg: "" }); const [sent, setSent] = useState(false); const u = (k, v) => setF(p => ({ ...p, [k]: v })); const submit = async () => { if (db) try { await db.ins("activities", { type: "contact", content: `From ${f.name}: ${f.msg}`, by_user: f.email }); } catch {} toast("Message sent!", "success"); setSent(true); }; return <section style={{ padding: "80px 24px", minHeight: "80vh" }}><div style={{ maxWidth: 900, margin: "0 auto" }}><SH title="Contact Us" /><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 32 }}><Card>{[{ i: <Phone size={20} color={CL.blue} />, t: "Phone", v: "+91 98765 43210" }, { i: <Mail size={20} color={CL.blue} />, t: "Email", v: "hello@homefitsolutions.in" }, { i: <MapPin size={20} color={CL.blue} />, t: "Office", v: "WeWork, BKC, Mumbai" }].map((c, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: i < 2 ? "1px solid #F1F5F9" : "none" }}>{c.i}<div><div style={{ fontWeight: 600, color: CL.navy, fontSize: 14 }}>{c.t}</div><div style={{ fontSize: 14, color: "#64748B" }}>{c.v}</div></div></div>)}<Btn v="lime" sz="lg" style={{ width: "100%", justifyContent: "center", marginTop: 16 }} icon={<MessageCircle size={18} />} onClick={() => window.open("https://wa.me/919876543210")}>Chat on WhatsApp</Btn></Card><Card>{sent ? <div style={{ textAlign: "center", padding: 20 }}><CheckCircle size={40} color="#10B981" /><h3 style={{ color: CL.navy, marginTop: 12 }}>Message Sent!</h3></div> : <><Inp label="Name" value={f.name} onChange={v => u("name", v)} required /><Inp label="Email" type="email" value={f.email} onChange={v => u("email", v)} required /><Inp label="Message" value={f.msg} onChange={v => u("msg", v)} multiline required /><Btn v="primary" onClick={submit} disabled={!f.name || !f.email || !f.msg} style={{ width: "100%", justifyContent: "center" }} icon={<Send size={16} />}>Send</Btn></>}</Card></div></div></section>; };

const FAQs = () => { const data = [{ q: "What areas do you serve?", a: "Major cities across India — Mumbai, Pune, Ahmedabad, Bangalore, Hyderabad, Delhi NCR, Chennai." }, { q: "How long does delivery take?", a: "15-30 days from booking confirmation. Bulk orders follow phased schedules." }, { q: "Can I customise items?", a: "Yes! Use our Package Builder to add/remove any item and see prices in real-time." }, { q: "What are the payment terms?", a: "10% on order booking, 50% within first 30 days, 40% before finishing/installation." }, { q: "Do you handle warranty?", a: "All products carry manufacturer warranty (1-5 years). We provide a single warranty pack." }, { q: "Can I modify after ordering?", a: "Changes accepted up to 48 hours before dispatch. Contact your specialist or reply REVISE on WhatsApp." }]; const [open, setOpen] = useState(null); return <section style={{ padding: "80px 24px" }}><div style={{ maxWidth: 800, margin: "0 auto" }}><SH badge="FAQs" title="Frequently Asked Questions" />{data.map((f, i) => <div key={i} style={{ borderBottom: "1px solid #F1F5F9", padding: "20px 0" }}><button onClick={() => setOpen(open === i ? null : i)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", background: "none", border: "none", cursor: "pointer", textAlign: "left", gap: 12 }}><span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 15, color: CL.navy }}>{f.q}</span><ChevronDown size={18} style={{ transform: open === i ? "rotate(180deg)" : "none", transition: ".2s", color: CL.blue, flexShrink: 0 }} /></button>{open === i && <p style={{ color: "#64748B", fontSize: 14, lineHeight: 1.7, margin: "12px 0 0" }}>{f.a}</p>}</div>)}</div></section>; };

// ═══════════════════════════════════════════════════
// ADMIN PANEL (trimmed — dashboard, leads, quotations, payments, settings)
// ═══════════════════════════════════════════════════
const AdminPanel = ({ leads, quots, payments, refresh }) => {
  const { db, toast, setAdmin } = useContext(Ctx);
  const [sec, setSec] = useState("dashboard");

  const updStatus = async (id, s) => { if (!db) return; try { await db.upd("leads", { id }, { status: s }); toast(`→ ${s}`, "success"); refresh(); } catch (e) { toast(e.message, "error"); } };

  const rev = payments.filter(p => p.status === "paid").reduce((s, p) => s + parseFloat(p.amount || 0), 0);
  const won = leads.filter(l => l.status === "Closed-Won").length;
  const conv = leads.length > 0 ? Math.round((won / leads.length) * 100) : 0;

  const nav = [{ k: "dashboard", l: "Dashboard", i: <LayoutDashboard size={18} /> }, { k: "leads", l: "Leads", i: <Users size={18} /> }, { k: "quotations", l: "Quotations", i: <FileText size={18} /> }, { k: "payments", l: "Payments", i: <CreditCard size={18} /> }, { k: "settings", l: "Settings", i: <Settings size={18} /> }];

  return <div style={{ display: "flex", minHeight: "calc(100vh - 96px)" }}>
    <aside style={{ width: 200, background: CL.navy, padding: "24px 12px", flexShrink: 0, display: "flex", flexDirection: "column", gap: 2 }} className="as">
      <div style={{ padding: "0 8px 16px", borderBottom: "1px solid #1E293B", marginBottom: 8 }}><div style={{ fontSize: 11, color: "#64748B", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>Admin</div><div style={{ fontSize: 13, color: "#fff", fontWeight: 600 }}>HomeFit Solutions</div><div style={{ fontSize: 11, color: db ? "#10B981" : "#F59E0B", marginTop: 4 }}>{db ? "● Live" : "○ Demo"}</div></div>
      {nav.map(n => <button key={n.k} onClick={() => setSec(n.k)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8, background: sec === n.k ? CL.blue + "20" : "transparent", color: sec === n.k ? CL.blue : "#94A3B8", border: "none", cursor: "pointer", fontSize: 13, fontWeight: sec === n.k ? 600 : 400, fontFamily: "'Poppins',sans-serif", width: "100%", textAlign: "left" }}>{n.i}{n.l}</button>)}
      <div style={{ marginTop: "auto", padding: "12px 8px", borderTop: "1px solid #1E293B" }}><button onClick={() => setAdmin(false)} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", color: "#64748B", cursor: "pointer", fontSize: 13 }}><Globe size={16} />View Site</button></div>
    </aside>
    <main style={{ flex: 1, padding: 24, background: CL.gray, overflowY: "auto" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}><h1 style={{ fontFamily: "'Poppins',sans-serif", fontSize: 24, fontWeight: 800, color: CL.navy, margin: 0 }}>{nav.find(n => n.k === sec)?.l}</h1><Btn v="ghost" sz="sm" onClick={refresh} icon={<RefreshCw size={14} />}>Refresh</Btn></div>

        {sec === "dashboard" && <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16, marginBottom: 24 }}><StatCard label="Total Leads" value={leads.length} icon={<Users size={22} />} color={CL.blue} /><StatCard label="Quotations" value={quots.length} icon={<FileText size={22} />} color="#8B5CF6" /><StatCard label="Revenue" value={`₹${(rev / 100000).toFixed(1)}L`} icon={<DollarSign size={22} />} color="#10B981" /><StatCard label="Conversion" value={`${conv}%`} icon={<TrendingUp size={22} />} color="#F59E0B" /></div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(340px,1fr))", gap: 24 }}>
            <Card><h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, color: CL.navy, margin: "0 0 16px", fontSize: 16 }}>Pipeline</h3>{PIPE.slice(0, 7).map(st => { const c = leads.filter(l => l.status === st).length; return <div key={st} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}><div style={{ width: 90, fontSize: 12, fontWeight: 600, color: "#64748B", textAlign: "right" }}>{st}</div><div style={{ flex: 1 }}><div style={{ width: `${leads.length > 0 ? Math.max((c / leads.length) * 100, 4) : 4}%`, height: 24, background: (PIPE_C[st] || "#94A3B8") + "50", borderRadius: 6, display: "flex", alignItems: "center", paddingLeft: 8, fontSize: 12, fontWeight: 700, color: PIPE_C[st] }}>{c}</div></div></div>; })}</Card>
            <Card><h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, color: CL.navy, margin: "0 0 16px", fontSize: 16 }}>Recent Payments</h3>{payments.length === 0 ? <p style={{ color: "#94A3B8", fontSize: 14 }}>No payments yet.</p> : payments.slice(0, 5).map((p, i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #F1F5F9" }}><div><div style={{ fontWeight: 600, color: CL.navy, fontSize: 14 }}>{rup(parseFloat(p.amount))}</div><div style={{ fontSize: 11, color: "#94A3B8" }}>{p.razorpay_payment_id?.slice(0, 20)}</div></div><Badge color={p.status === "paid" ? "#10B981" : "#F59E0B"}>{p.status}</Badge></div>)}</Card>
          </div>
        </div>}

        {sec === "leads" && (leads.length === 0 ? <Empty icon={<Users size={40} />} title="No Leads" desc="Submit one via the public form." /> : <Card style={{ overflow: "auto", padding: 0 }}><table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}><thead><tr style={{ background: "#F8FAFC" }}>{["Name", "City", "Budget", "Score", "Status", "Change Status"].map(h => <th key={h} style={{ textAlign: "left", padding: "12px 16px", fontSize: 12, fontWeight: 700, color: "#64748B", borderBottom: "1px solid #E2E8F0", whiteSpace: "nowrap" }}>{h}</th>)}</tr></thead><tbody>{leads.map(l => <tr key={l.id} style={{ borderBottom: "1px solid #F1F5F9" }}><td style={{ padding: "12px 16px" }}><div style={{ fontWeight: 600, color: CL.navy }}>{l.name}</div><div style={{ fontSize: 12, color: "#64748B" }}>{l.company || l.email}</div></td><td style={{ padding: "12px 16px" }}>{l.project_city}</td><td style={{ padding: "12px 16px" }}>{l.budget_range}</td><td style={{ padding: "12px 16px" }}><div style={{ display: "flex", alignItems: "center", gap: 8 }}><Bar value={l.score || 0} color={l.score >= 60 ? "#10B981" : "#F59E0B"} h={4} /><span style={{ fontSize: 12, fontWeight: 600 }}>{l.score}</span></div></td><td style={{ padding: "12px 16px" }}><Badge color={PIPE_C[l.status]}>{l.status}</Badge></td><td style={{ padding: "12px 16px" }}><select onChange={e => updStatus(l.id, e.target.value)} value={l.status || "New"} style={{ fontSize: 12, padding: "4px 8px", borderRadius: 6, border: "1px solid #E2E8F0" }}>{PIPE.map(s => <option key={s} value={s}>{s}</option>)}</select></td></tr>)}</tbody></table></Card>)}

        {sec === "quotations" && (quots.length === 0 ? <Empty icon={<FileText size={40} />} title="No Quotations" desc="Use the Package Builder." /> : <Card style={{ overflow: "auto", padding: 0 }}><table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}><thead><tr style={{ background: "#F8FAFC" }}>{["ID", "Tier", "Items", "Total", "Status", "Token"].map(h => <th key={h} style={{ textAlign: "left", padding: "12px 16px", fontSize: 12, fontWeight: 700, color: "#64748B", borderBottom: "1px solid #E2E8F0" }}>{h}</th>)}</tr></thead><tbody>{quots.map(q => { let itemCount = 0; try { itemCount = JSON.parse(q.items_json || "[]").length; } catch {} return <tr key={q.id} style={{ borderBottom: "1px solid #F1F5F9" }}><td style={{ padding: "12px 16px", fontFamily: "monospace", fontSize: 12, color: CL.blue }}>{q.id.slice(0, 8)}</td><td style={{ padding: "12px 16px", fontWeight: 600 }}>{q.package_tier}</td><td style={{ padding: "12px 16px" }}>{itemCount} items</td><td style={{ padding: "12px 16px", fontWeight: 700, color: CL.navy }}>{rup(parseFloat(q.total))}</td><td style={{ padding: "12px 16px" }}><Badge color={q.status === "booking_paid" ? "#10B981" : q.status === "draft" ? "#6366F1" : CL.blue}>{q.status}</Badge></td><td style={{ padding: "12px 16px", fontSize: 11, color: "#94A3B8", fontFamily: "monospace" }}>{q.public_token?.slice(0, 12)}</td></tr>; })}</tbody></table></Card>)}

        {sec === "payments" && (payments.length === 0 ? <Empty icon={<CreditCard size={40} />} title="No Payments" desc="Complete a Razorpay checkout." /> : <Card style={{ overflow: "auto", padding: 0 }}><table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}><thead><tr style={{ background: "#F8FAFC" }}>{["Payment ID", "Amount", "Status", "Paid At"].map(h => <th key={h} style={{ textAlign: "left", padding: "12px 16px", fontSize: 12, fontWeight: 700, color: "#64748B", borderBottom: "1px solid #E2E8F0" }}>{h}</th>)}</tr></thead><tbody>{payments.map(p => <tr key={p.id} style={{ borderBottom: "1px solid #F1F5F9" }}><td style={{ padding: "12px 16px", fontFamily: "monospace", fontSize: 12, color: CL.blue }}>{p.razorpay_payment_id || "—"}</td><td style={{ padding: "12px 16px", fontWeight: 700, color: CL.navy }}>{rup(parseFloat(p.amount))}</td><td style={{ padding: "12px 16px" }}><Badge color={p.status === "paid" ? "#10B981" : "#F59E0B"}>{p.status}</Badge></td><td style={{ padding: "12px 16px", fontSize: 12, color: "#64748B" }}>{p.paid_at ? new Date(p.paid_at).toLocaleString() : "—"}</td></tr>)}</tbody></table></Card>)}

        {sec === "settings" && <div style={{ display: "grid", gap: 16 }}>
          <Card><h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, color: CL.navy, margin: "0 0 16px" }}>Payment Terms</h3><div style={{ display: "grid", gap: 8 }}>{PAY_TERMS.map((p, i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "12px 16px", background: CL.gray, borderRadius: 10 }}><span style={{ fontWeight: 600, color: CL.navy }}>{p.label}</span><span style={{ fontWeight: 700, color: CL.blue }}>{p.pct}%</span></div>)}</div></Card>
          <Card><h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, color: CL.navy, margin: "0 0 16px" }}>Item Pricing (from your rate card)</h3><table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}><thead><tr style={{ background: CL.gray }}><th style={{ textAlign: "left", padding: 10 }}>Item</th><th style={{ textAlign: "left", padding: 10 }}>Category</th><th style={{ textAlign: "right", padding: 10 }}>Price</th></tr></thead><tbody>{ALL_ITEMS.map(i => <tr key={i.id} style={{ borderBottom: "1px solid #F1F5F9" }}><td style={{ padding: 10, fontWeight: 600, color: CL.navy }}>{i.name}</td><td style={{ padding: 10, color: "#64748B" }}>{i.cat}</td><td style={{ padding: 10, textAlign: "right", fontWeight: 700, color: CL.blue }}>{rup(i.price)}</td></tr>)}</tbody></table></Card>
        </div>}
      </div>
    </main>
    <style>{`@media(max-width:768px){.as{display:none}}`}</style>
  </div>;
};

// ═══════════════════════════════════════════════════
// FOOTER
// ═══════════════════════════════════════════════════
const Footer = () => { const { go } = useContext(Ctx); return <footer style={{ background: CL.navy, padding: "60px 24px 32px", color: "#94A3B8" }}><div style={{ maxWidth: 1200, margin: "0 auto" }}><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 32, marginBottom: 40 }}><div><Logo sz={24} /><p style={{ fontSize: 14, lineHeight: 1.7, marginTop: 12, color: "#64748B" }}>Complete home fitout packages. Furniture, kitchen, electrical & finishing.</p></div><div><div style={{ fontWeight: 700, color: "#fff", marginBottom: 12, fontFamily: "'Poppins',sans-serif", fontSize: 14 }}>Quick Links</div>{[["Packages", "packages"], ["Gallery", "gallery"], ["Resources", "resources"], ["Contact", "contact"], ["Build Package", "builder"]].map(([l, k]) => <div key={k} onClick={() => go(k)} style={{ padding: "4px 0", fontSize: 14, cursor: "pointer" }}>{l}</div>)}</div><div><div style={{ fontWeight: 700, color: "#fff", marginBottom: 12, fontFamily: "'Poppins',sans-serif", fontSize: 14 }}>Contact</div><div style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0", fontSize: 14 }}><Phone size={14} />+91 98765 43210</div><div style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0", fontSize: 14 }}><Mail size={14} />hello@homefitsolutions.in</div></div></div><div style={{ borderTop: "1px solid #1E293B", paddingTop: 24, textAlign: "center", fontSize: 13 }}>© 2026 HomeFit Solutions</div></div></footer>; };
const WAFloat = () => <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" style={{ position: "fixed", bottom: 24, right: 24, width: 56, height: 56, borderRadius: "50%", background: "#25D366", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 20px rgba(37,211,102,.4)", zIndex: 999 }}><MessageCircle size={28} color="#fff" fill="#fff" /></a>;

// ═══════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════
export default function App() {
  const [page, setPage] = useState("home"); const [isAdmin, setAdmin] = useState(false); const [showSetup, setShowSetup] = useState(false); const [toasts, setToasts] = useState([]);
  const [sc, setSc] = useState(() => gC("hf_s", { url: "", anonKey: "" })); const [rc, setRc] = useState(() => gC("hf_r", { keyId: "" }));
  const [db, setDb] = useState(() => mkSupa(sc.url, sc.anonKey));
  const [leads, setLeads] = useState([]); const [quots, setQuots] = useState([]); const [payments, setPayments] = useState([]);

  const toast = useCallback((m, t = "success") => setToasts(p => [...p, { id: Date.now(), message: m, type: t }]), []);
  const go = useCallback(p => { setPage(p); setAdmin(false); }, []);

  const fetchAll = useCallback(async () => { if (!db) return; try { const [l, q, p] = await Promise.all([db.q("leads", { order: "created_at.desc", limit: 200 }), db.q("quotations", { order: "created_at.desc", limit: 200 }), db.q("payments", { order: "created_at.desc", limit: 200 })]); setLeads(l || []); setQuots(q || []); setPayments(p || []); } catch (e) { console.error(e); } }, [db]);
  useEffect(() => { fetchAll(); }, [fetchAll]);
  useEffect(() => { window.scrollTo(0, 0); }, [page, isAdmin]);

  const connect = () => { sC("hf_s", sc); sC("hf_r", rc); const c = mkSupa(sc.url, sc.anonKey); setDb(c); setShowSetup(false); if (c) { toast("Supabase connected!", "success"); setTimeout(fetchAll, 300); } if (rc.keyId) toast("Razorpay ready!", "success"); };

  return <Ctx.Provider value={{ page, go, isAdmin, setAdmin, db, rk: rc.keyId, toast }}>
    <div style={{ fontFamily: "'Lato','Helvetica Neue',sans-serif", color: CL.navy, background: "#fff", minHeight: "100vh" }}>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&family=Lato:wght@400;700&display=swap" rel="stylesheet" />
      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}.spin{animation:spin 1s linear infinite}@keyframes slideUp{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}*{box-sizing:border-box}body{margin:0}`}</style>

      <ConnBar db={db} rk={rc.keyId} onCfg={() => setShowSetup(true)} />
      <Header />
      <SetupModal show={showSetup} onClose={() => setShowSetup(false)} sc={sc} setSc={setSc} rc={rc} setRc={setRc} onSave={connect} />

      {isAdmin ? <AdminPanel leads={leads} quots={quots} payments={payments} refresh={fetchAll} /> : <>
        {page === "home" && <><Hero /><USPs /><PkgSection /><PayTerms /><LeadForm /><FAQs /></>}
        {page === "packages" && <><PkgSection /><PayTerms /></>}
        {page === "gallery" && <Gallery />}
        {page === "resources" && <Resources />}
        {page === "contact" && <Contact />}
        {page === "builder" && <Builder />}
        <Footer /><WAFloat />
      </>}

      {toasts.map(t => <Toast key={t.id} message={t.message} type={t.type} onClose={() => setToasts(p => p.filter(x => x.id !== t.id))} />)}
    </div>
  </Ctx.Provider>;
}
