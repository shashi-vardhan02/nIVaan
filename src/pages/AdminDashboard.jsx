import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    LayoutDashboard, FileText, BarChart3, Map, Clock, Brain,
    Droplets, Flame, Building2, Zap, ChevronLeft, ChevronRight,
    Settings, LogOut, AlertTriangle, CheckCircle, FileWarning,
    TrendingUp, ShieldAlert, Lightbulb
} from 'lucide-react'

// ─── Data Helpers ────────────────────────────────────────────────────────────
const DEPT_COLORS = { water: '#2196F3', gas: '#F59E0B', municipality: '#10B981', electricity: '#8B5CF6' }
const DEPT_LABELS = { water: 'Water', gas: 'Gas', municipality: 'Municipality', electricity: 'Electricity' }
const DEPT_ICONS = { water: Droplets, gas: Flame, municipality: Building2, electricity: Zap }
const getDeptColor = d => DEPT_COLORS[d]

const generateKPI = () => ({
    totalComplaints: Math.floor(Math.random() * 500) + 800,
    pending: Math.floor(Math.random() * 100) + 50,
    resolved: Math.floor(Math.random() * 400) + 500,
    emergency: Math.floor(Math.random() * 30) + 10,
})
const CATEGORIES = {
    water: ['Pipe Leak', 'Low Pressure', 'Contamination', 'Billing', 'Meter Issue'],
    gas: ['Gas Leak', 'Low Pressure', 'Billing', 'Connection', 'Safety'],
    municipality: ['Road Damage', 'Waste', 'Lighting', 'Drainage', 'Parks'],
    electricity: ['Power Outage', 'Voltage', 'Billing', 'Meter', 'Transformer'],
}
const genComplaints = d => {
    const statuses = ['Open', 'In Progress', 'Resolved', 'Escalated']
    const priorities = ['Low', 'Medium', 'High', 'Critical']
    const areas = ['Zone A', 'Zone B', 'Zone C', 'Zone D', 'Zone E']
    const names = ['Rahul Kumar', 'Priya Sharma', 'Amit Singh', 'Sneha Reddy', 'Vikram Patel', 'Anjali Gupta']
    return Array.from({ length: 12 }, (_, i) => ({
        id: `${d.substring(0, 3).toUpperCase()}-${String(1000 + i).padStart(4, '0')}`,
        name: names[Math.floor(Math.random() * names.length)],
        area: areas[Math.floor(Math.random() * areas.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        priority: priorities[Math.floor(Math.random() * priorities.length)],
        date: new Date(2026, 1, Math.floor(Math.random() * 28) + 1).toLocaleDateString(),
        assignee: ['Officer A', 'Officer B', 'Officer C'][Math.floor(Math.random() * 3)],
    }))
}
const genSLA = () => [
    { metric: 'Response Time', target: '2h', actual: `${(Math.random() * 2 + 0.5).toFixed(1)}h`, compliance: Math.floor(Math.random() * 15) + 85 },
    { metric: 'Resolution Time', target: '24h', actual: `${Math.floor(Math.random() * 12 + 12)}h`, compliance: Math.floor(Math.random() * 20) + 75 },
    { metric: 'Escalation Rate', target: '<5%', actual: `${(Math.random() * 5 + 1).toFixed(1)}%`, compliance: Math.floor(Math.random() * 10) + 88 },
    { metric: 'Customer Satisfaction', target: '>4.0', actual: `${(Math.random() * 1 + 3.5).toFixed(1)}`, compliance: Math.floor(Math.random() * 15) + 82 },
]
const genInsights = d => [
    { type: 'prediction', icon: TrendingUp, color: '#6366f1', title: 'Complaint Spike Predicted', desc: `AI predicts a ${Math.floor(Math.random() * 30) + 20}% increase in ${DEPT_LABELS[d]} complaints next week.`, confidence: Math.floor(Math.random() * 15) + 85 },
    { type: 'anomaly', icon: ShieldAlert, color: '#f59e0b', title: 'Unusual Pattern Detected', desc: `Zone C showing ${Math.floor(Math.random() * 50) + 30}% higher complaint rate than historical average.`, confidence: Math.floor(Math.random() * 10) + 90 },
    { type: 'optimization', icon: Lightbulb, color: '#10b981', title: 'Resource Optimization', desc: `Redistributing field officers could reduce resolution time by ${Math.floor(Math.random() * 20) + 15}%.`, confidence: Math.floor(Math.random() * 10) + 80 },
]
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const genMonthly = () => MONTHS.map(m => ({ m, c: Math.floor(Math.random() * 150) + 50 }))
const genHeatmap = () => ['Zone A', 'Zone B', 'Zone C', 'Zone D', 'Zone E'].map(area => ({ area, complaints: Math.floor(Math.random() * 100) + 10, severity: Math.floor(Math.random() * 5) + 1 }))

const statusStyle = {
    Open: { bg: '#EFF6FF', color: '#2563EB', border: '#BFDBFE' },
    'In Progress': { bg: '#FFFBEB', color: '#D97706', border: '#FDE68A' },
    Resolved: { bg: '#F0FDF4', color: '#16A34A', border: '#BBF7D0' },
    Escalated: { bg: '#FEF2F2', color: '#DC2626', border: '#FECACA' },
}
const priorityColor = { Low: '#64748b', Medium: '#2196F3', High: '#F59E0B', Critical: '#DC2626' }
const NAV = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'complaints', icon: FileText, label: 'Complaints' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics' },
    { id: 'heatmap', icon: Map, label: 'Area Heatmap' },
    { id: 'sla', icon: Clock, label: 'SLA Tracking' },
    { id: 'ai', icon: Brain, label: 'AI Insights' },
]

const AdminDashboard = ({ onLogout, initialDept = 'electricity' }) => {
    const [section, setSection] = useState('dashboard')
    const [dept, setDept] = useState(initialDept)
    const [collapsed, setCollapsed] = useState(false)

    const color = getDeptColor(dept)
    const kpi = useMemo(generateKPI, [dept])
    const [complaintList, setComplaintList] = useState([])
    const [loadingComplaints, setLoadingComplaints] = useState(true)

    React.useEffect(() => {
        const fetchComplaints = async () => {
            setLoadingComplaints(true)
            try {
                const token = localStorage.getItem('token')
                const res = await fetch('http://localhost:8080/api/complaints', {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                if (res.ok) {
                    const data = await res.json()
                    const formatted = data.map(c => ({
                        id: c.id,
                        name: c.citizen ? c.citizen.name : 'Citizen User',
                        area: c.location_address ? c.location_address.split(',')[0] : 'Unknown Zone',
                        priority: c.priority || 'Medium',
                        status: c.status || 'Submitted',
                        date: new Date(c.created_at).toLocaleDateString(),
                        assignee: c.assignee || 'Not Assigned'
                    }))
                    setComplaintList(formatted)
                }
            } catch (err) {
                console.error('Error fetching complaints:', err)
            } finally {
                setLoadingComplaints(false)
            }
        }
        fetchComplaints()
    }, [dept])

    const handleComplete = async (id) => {
        try {
            const token = localStorage.getItem('token')
            const res = await fetch(`http://localhost:8080/api/complaints/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: 'Resolved' })
            })
            if (res.ok) {
                setComplaintList(prev => prev.map(c => c.id === id ? { ...c, status: 'Resolved' } : c))
            } else {
                alert('Failed to update status.')
            }
        } catch (err) {
            console.error('Update failed:', err)
        }
    }
    const sla = useMemo(genSLA, [dept])
    const insights = useMemo(() => genInsights(dept), [dept])
    const monthly = useMemo(genMonthly, [dept])
    const heatmap = useMemo(genHeatmap, [dept])
    const cats = CATEGORIES[dept]
    const maxBar = Math.max(...monthly.map(m => m.c))
    const DeptIcon = DEPT_ICONS[dept]

    const card = (style) => ({ background: 'white', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e2e8f0', ...style })
    const label = (s) => ({ fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', ...s })

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9', fontFamily: 'Inter,system-ui,sans-serif' }}>

            {/* SIDEBAR */}
            <motion.aside animate={{ width: collapsed ? 72 : 260 }} transition={{ duration: 0.3 }}
                style={{ background: '#111827', display: 'flex', flexDirection: 'column', borderRight: '1px solid #1f2937', position: 'sticky', top: 0, height: '100vh', flexShrink: 0, overflow: 'hidden', zIndex: 30 }}>

                {/* Logo */}
                <div style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid #1f2937', minHeight: '64px' }}>
                    <div style={{ width: '36px', height: '36px', background: `${color}22`, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <DeptIcon size={20} color={color} />
                    </div>
                    <AnimatePresence>
                        {!collapsed && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
                                <p style={{ fontSize: '0.85rem', fontWeight: '800', color: 'white', margin: 0 }}>SmartUtility</p>
                                <p style={{ fontSize: '0.7rem', color: '#6b7280', margin: 0 }}>Gov Admin</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Dept Selector */}
                {!collapsed && (
                    <div style={{ padding: '0.75rem' }}>
                        <p style={label({ color: '#4b5563', marginBottom: '0.5rem', paddingLeft: '0.5rem' })}>Department</p>
                        <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem 0.75rem', borderRadius: '8px', background: `${color}22`, color: color, fontWeight: '700', fontSize: '0.85rem' }}>
                            <DeptIcon size={16} /> <span>{DEPT_LABELS[dept]}</span>
                        </div>
                    </div>
                )}

                {/* Nav */}
                <nav style={{ flex: 1, padding: '0.75rem' }}>
                    <p style={label({ color: '#4b5563', marginBottom: '0.5rem', paddingLeft: collapsed ? 0 : '0.5rem', textAlign: collapsed ? 'center' : 'left' })}>
                        {collapsed ? '···' : 'Navigation'}
                    </p>
                    {NAV.map(item => {
                        const active = section === item.id
                        return (
                            <button key={item.id} onClick={() => setSection(item.id)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.6rem', padding: collapsed ? '0.6rem 0' : '0.6rem 0.75rem', justifyContent: collapsed ? 'center' : 'flex-start', borderRadius: '8px', border: 'none', cursor: 'pointer', background: active ? color : 'transparent', color: active ? 'white' : '#6b7280', fontWeight: active ? '700' : '400', fontSize: '0.85rem', marginBottom: '2px', transition: 'all 0.15s' }}>
                                <item.icon size={16} /> {!collapsed && <span>{item.label}</span>}
                            </button>
                        )
                    })}
                </nav>

                {/* Logout */}
                <div style={{ borderTop: '1px solid #1f2937', padding: '0.75rem' }}>
                    <button onClick={onLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.6rem', padding: collapsed ? '0.5rem 0' : '0.5rem 0.75rem', justifyContent: collapsed ? 'center' : 'flex-start', borderRadius: '8px', border: 'none', background: 'transparent', color: '#ef4444', cursor: 'pointer', fontSize: '0.85rem' }}>
                        <LogOut size={16} /> {!collapsed && <span>Logout</span>}
                    </button>
                </div>

                {/* Toggle */}
                <button onClick={() => setCollapsed(!collapsed)} style={{ position: 'absolute', right: '-12px', top: '80px', width: '24px', height: '24px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', zIndex: 10 }}>
                    {collapsed ? <ChevronRight size={12} color="#64748b" /> : <ChevronLeft size={12} color="#64748b" />}
                </button>
            </motion.aside>

            {/* MAIN */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

                {/* Topbar */}
                <div style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px', position: 'sticky', top: 0, zIndex: 20 }}>
                    <div>
                        <h1 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>{NAV.find(n => n.id === section)?.label}</h1>
                        <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>{DEPT_LABELS[dept]} Department</p>
                    </div>
                    <div style={{ padding: '0.4rem 1rem', background: `${color}18`, borderRadius: '20px', color, fontSize: '0.8rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <div style={{ width: '7px', height: '7px', background: color, borderRadius: '50%' }} />
                        {DEPT_LABELS[dept]}
                    </div>
                </div>

                <main style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', overflow: 'auto' }}>

                    {/* KPI CARDS */}
                    {(section === 'dashboard' || section === 'analytics') && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem' }}>
                            {[
                                { label: 'Total Complaints', value: kpi.totalComplaints, icon: FileWarning, change: '+12%', up: true },
                                { label: 'Pending', value: kpi.pending, icon: Clock, change: '-5%', up: false },
                                { label: 'Resolved', value: kpi.resolved, icon: CheckCircle, change: '+18%', up: true },
                                { label: 'Emergency', value: kpi.emergency, icon: AlertTriangle, change: '+3%', up: true },
                            ].map((c, i) => (
                                <motion.div key={c.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} style={card()}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                        <div style={{ width: '40px', height: '40px', background: `${color}18`, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <c.icon size={20} color={color} />
                                        </div>
                                        <span style={{ fontSize: '0.7rem', fontWeight: '700', padding: '0.2rem 0.6rem', borderRadius: '20px', background: c.up ? '#dcfce7' : '#eff6ff', color: c.up ? '#16a34a' : '#2563eb' }}>{c.change}</span>
                                    </div>
                                    <p style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>{c.value.toLocaleString()}</p>
                                    <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0.25rem 0 0' }}>{c.label}</p>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {/* CHARTS */}
                    {(section === 'dashboard' || section === 'analytics') && (
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                            <div style={card()}>
                                <h3 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.25rem' }}>Monthly Complaints</h3>
                                <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '1.5rem' }}>Total complaints registered per month</p>
                                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '140px' }}>
                                    {monthly.map((m, i) => (
                                        <div key={m.m} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                                            <motion.div initial={{ height: 0 }} animate={{ height: `${(m.c / maxBar) * 120}px` }} transition={{ delay: i * 0.03, duration: 0.4 }}
                                                style={{ width: '100%', background: color, borderRadius: '4px 4px 0 0', opacity: 0.85 }} />
                                            <span style={{ fontSize: '0.6rem', color: '#94a3b8' }}>{m.m}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div style={card()}>
                                <h3 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.25rem' }}>By Category</h3>
                                <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '1rem' }}>Issue type distribution</p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                    {cats.map((cat, i) => {
                                        const pct = Math.floor(Math.random() * 60) + 20
                                        return (
                                            <div key={cat}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                                                    <span style={{ fontSize: '0.75rem', color: '#475569' }}>{cat}</span>
                                                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#0f172a' }}>{pct}%</span>
                                                </div>
                                                <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                                                    <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ delay: i * 0.1, duration: 0.5 }}
                                                        style={{ height: '100%', background: color, borderRadius: '3px' }} />
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* COMPLAINT TABLE */}
                    {(section === 'dashboard' || section === 'complaints') && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9' }}>
                                <h3 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>Recent Complaints</h3>
                                <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>Manage and track all department complaints</p>
                            </div>
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                                            {['Name', 'Area', 'Priority', 'Status', 'Date', 'Action'].map(h => (
                                                <th key={h} style={{ textAlign: 'left', fontSize: '0.72rem', fontWeight: '700', color: '#64748b', padding: '0.75rem 1.25rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loadingComplaints ? (
                                            <tr>
                                                <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                                                    Loading complaints from database...
                                                </td>
                                            </tr>
                                        ) : complaintList.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                                                    No complaints found for this department.
                                                </td>
                                            </tr>
                                        ) : complaintList.map(c => {
                                            let normalizedStatus = c.status
                                            if (!statusStyle[normalizedStatus]) {
                                                normalizedStatus = 'Open' // Default fallback for styles
                                            }
                                            const ss = statusStyle[normalizedStatus] || statusStyle['Open']
                                            return (
                                                <tr key={c.id} style={{ borderBottom: '1px solid #f8fafc', transition: 'background 0.1s' }}
                                                    onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                                                    onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                                                    <td style={{ padding: '0.75rem 1.25rem', fontSize: '0.85rem', fontWeight: '700', color: '#0f172a' }}>{c.name}</td>
                                                    <td style={{ padding: '0.75rem 1.25rem', fontSize: '0.85rem', color: '#374151' }}>{c.area}</td>
                                                    <td style={{ padding: '0.75rem 1.25rem' }}>
                                                        <span style={{ fontSize: '0.72rem', padding: '0.15rem 0.6rem', borderRadius: '6px', background: `${priorityColor[c.priority]}18`, color: priorityColor[c.priority], fontWeight: '700' }}>{c.priority}</span>
                                                    </td>
                                                    <td style={{ padding: '0.75rem 1.25rem' }}>
                                                        <span style={{ fontSize: '0.72rem', padding: '0.2rem 0.7rem', borderRadius: '20px', border: `1px solid ${ss.border}`, background: ss.bg, color: ss.color, fontWeight: '700' }}>{c.status}</span>
                                                    </td>
                                                    <td style={{ padding: '0.75rem 1.25rem', fontSize: '0.8rem', color: '#64748b' }}>{c.date}</td>
                                                    <td style={{ padding: '0.75rem 1.25rem' }}>
                                                        {c.status !== 'Resolved' ? (
                                                            <button
                                                                onClick={() => handleComplete(c.id)}
                                                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', fontWeight: '700', color: 'white', background: '#10b981', border: 'none', borderRadius: '6px', cursor: 'pointer', transition: 'background 0.2s' }}
                                                                onMouseEnter={e => e.currentTarget.style.background = '#059669'}
                                                                onMouseLeave={e => e.currentTarget.style.background = '#10b981'}
                                                            >
                                                                Mark Completed
                                                            </button>
                                                        ) : (
                                                            <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle size={14} /> Done</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    )}

                    {/* HEATMAP + SLA */}
                    {(section === 'dashboard' || section === 'heatmap' || section === 'sla') && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            {(section === 'dashboard' || section === 'heatmap') && (
                                <div style={card()}>
                                    <h3 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f172a', marginBottom: '1rem' }}>Area Heatmap</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        {heatmap.map(z => (
                                            <div key={z.area} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <span style={{ fontSize: '0.8rem', color: '#475569', width: '60px', flexShrink: 0 }}>{z.area}</span>
                                                <div style={{ flex: 1, height: '28px', borderRadius: '6px', background: '#f1f5f9', overflow: 'hidden' }}>
                                                    <motion.div initial={{ width: 0 }} animate={{ width: `${(z.complaints / 110) * 100}%` }} transition={{ duration: 0.6 }}
                                                        style={{ height: '100%', background: color, opacity: 0.4 + (z.severity / 5) * 0.6, borderRadius: '6px' }} />
                                                </div>
                                                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#0f172a', width: '32px', textAlign: 'right' }}>{z.complaints}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div style={card()}>
                                <h3 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f172a', marginBottom: '1rem' }}>SLA Overview</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {sla.map(s => (
                                        <div key={s.metric} style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                                                <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#374151' }}>{s.metric}</span>
                                                <span style={{ fontSize: '0.75rem', fontWeight: '800', color: s.compliance >= 90 ? '#16a34a' : s.compliance >= 80 ? '#d97706' : '#dc2626' }}>{s.compliance}%</span>
                                            </div>
                                            <div style={{ height: '5px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                                                <motion.div initial={{ width: 0 }} animate={{ width: `${s.compliance}%` }} transition={{ duration: 0.6 }}
                                                    style={{ height: '100%', background: s.compliance >= 90 ? '#16a34a' : s.compliance >= 80 ? '#d97706' : '#dc2626', borderRadius: '3px' }} />
                                            </div>
                                            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.3rem' }}>
                                                <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Target: {s.target}</span>
                                                <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '600' }}>Actual: {s.actual}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* AI INSIGHTS */}
                    {(section === 'dashboard' || section === 'ai') && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem' }}>
                            {insights.map((ins, i) => (
                                <motion.div key={ins.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} style={card()}>
                                    <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem' }}>
                                        <div style={{ width: '36px', height: '36px', background: `${ins.color}18`, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <ins.icon size={18} color={ins.color} />
                                        </div>
                                        <div>
                                            <p style={{ fontSize: '0.85rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>{ins.title}</p>
                                            <p style={{ fontSize: '0.7rem', color: ins.color, margin: 0, fontWeight: '600' }}>{ins.type.toUpperCase()}</p>
                                        </div>
                                    </div>
                                    <p style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.5 }}>{ins.desc}</p>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem' }}>
                                        <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Confidence</span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <div style={{ width: '60px', height: '4px', background: '#f1f5f9', borderRadius: '2px', overflow: 'hidden' }}>
                                                <div style={{ width: `${ins.confidence}%`, height: '100%', background: ins.color, borderRadius: '2px' }} />
                                            </div>
                                            <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#0f172a' }}>{ins.confidence}%</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}

                </main>
            </div>
        </div>
    )
}

export default AdminDashboard
