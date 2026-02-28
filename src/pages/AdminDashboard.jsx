import React, { useState } from 'react'
import {
    Building2,
    Users,
    FileText,
    AlertCircle,
    Search,
    Filter,
    MoreVertical,
    ChevronRight,
    LogOut,
    Bell,
    LayoutDashboard,
    Clock,
    CheckCircle,
    BarChart3
} from 'lucide-react'
import { motion } from 'framer-motion'

const AdminDashboard = ({ t, onLogout, onViewEscalations }) => {
    const [activeTab, setActiveTab] = useState('new')

    const stats = [
        { label: 'New', count: 12, color: 'var(--primary)' },
        { label: 'In Progress', count: 28, color: '#f59e0b' },
        { label: 'Resolved', count: 145, color: '#10b981' },
        { label: 'Re-opened', count: 3, color: '#ef4444' }
    ]

    const complaints = [
        { id: 'NV-2026-089', citizen: 'John Doe', area: 'Sector 45', date: '2h ago', status: 'In Progress', priority: 'High' },
        { id: 'NV-2026-090', citizen: 'Sarah Smith', area: 'Main Market', date: '4h ago', status: 'New', priority: 'Medium' },
        { id: 'NV-2026-091', citizen: 'Mike Wilson', area: 'Valley Rd', date: 'Yesterday', status: 'New', priority: 'Critical' }
    ]

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--muted)' }}>
            {/* Sidebar */}
            <aside style={{
                width: '280px',
                background: 'white',
                borderRight: '1px solid var(--border)',
                padding: '2rem 1.5rem',
                display: 'flex',
                flexDirection: 'column',
                position: 'sticky',
                top: 0,
                height: '100vh'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem' }}>
                    <div style={{ width: '32px', height: '32px', background: 'var(--secondary)', borderRadius: '8px' }}></div>
                    <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--secondary)' }}>NIVAAN <span style={{ fontSize: '0.7rem', opacity: 0.6 }}>ADMIN</span></span>
                </div>

                <nav style={{ display: 'grid', gap: '0.5rem', flex: 1 }}>
                    <button className="btn" style={{ justifyContent: 'flex-start', background: 'var(--primary-glow)', color: 'var(--primary)', border: 'none' }}>
                        <LayoutDashboard size={20} /> Dashboard
                    </button>
                    <button className="btn" style={{ justifyContent: 'flex-start', color: 'var(--muted-foreground)', border: 'none' }}>
                        <FileText size={20} /> Complaints
                    </button>
                    <button
                        onClick={onViewEscalations}
                        className="btn"
                        style={{ justifyContent: 'flex-start', color: 'var(--muted-foreground)', border: 'none' }}
                    >
                        <AlertCircle size={20} /> Escalations
                    </button>
                    <button className="btn" style={{ justifyContent: 'flex-start', color: 'var(--muted-foreground)', border: 'none' }}>
                        <BarChart3 size={20} /> Analytics
                    </button>
                </nav>

                <button
                    onClick={onLogout}
                    className="btn"
                    style={{ justifyContent: 'flex-start', color: '#ef4444', border: 'none', borderTop: '1px solid var(--border)', pt: '1.5rem', borderRadius: 0 }}
                >
                    <LogOut size={20} /> {t('common.logout')}
                </button>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, padding: '2rem 3rem' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                    <div>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.25rem' }}>Electricity Department</h1>
                        <p style={{ color: 'var(--muted-foreground)' }}>Area: North Zone District</p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ position: 'relative' }}>
                            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)' }} />
                            <input type="text" className="form-input" placeholder="Search ID..." style={{ paddingLeft: '2.75rem', width: '250px' }} />
                        </div>
                        <button style={{ width: '45px', height: '45px', borderRadius: '12px', border: '1px solid var(--border)', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Bell size={20} />
                        </button>
                    </div>
                </header>

                {/* Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
                    {stats.map((stat, i) => (
                        <div key={i} className="glass-card" style={{ padding: '1.5rem', borderRadius: '1.25rem' }}>
                            <div style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>{stat.label}</div>
                            <div style={{ fontSize: '1.75rem', fontWeight: '800', color: stat.color }}>{stat.count}</div>
                        </div>
                    ))}
                </div>

                {/* Content Section */}
                <section className="glass-card" style={{ borderRadius: '1.5rem', overflow: 'hidden' }}>
                    <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '2rem' }}>
                            <button onClick={() => setActiveTab('new')} style={{ background: 'none', border: 'none', fontWeight: '700', paddingBottom: '0.5rem', borderBottom: activeTab === 'new' ? '2px solid var(--primary)' : 'none', color: activeTab === 'new' ? 'var(--foreground)' : 'var(--muted-foreground)', cursor: 'pointer' }}>New Tickets (12)</button>
                            <button onClick={() => setActiveTab('active')} style={{ background: 'none', border: 'none', fontWeight: '700', paddingBottom: '0.5rem', borderBottom: activeTab === 'active' ? '2px solid var(--primary)' : 'none', color: activeTab === 'active' ? 'var(--foreground)' : 'var(--muted-foreground)', cursor: 'pointer' }}>Active Tasks (28)</button>
                        </div>
                        <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}><Filter size={16} /> Filter</button>
                    </div>

                    <div style={{ padding: '0' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ background: 'var(--muted)', color: 'var(--muted-foreground)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    <th style={{ padding: '1rem 2rem' }}>Ticket ID</th>
                                    <th style={{ padding: '1rem' }}>Citizen</th>
                                    <th style={{ padding: '1rem' }}>Area</th>
                                    <th style={{ padding: '1rem' }}>Priority</th>
                                    <th style={{ padding: '1rem' }}>Status</th>
                                    <th style={{ padding: '1rem 2rem' }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {complaints.map((comp, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={{ padding: '1.25rem 2rem', fontWeight: '700' }}>{comp.id}</td>
                                        <td style={{ padding: '1.25rem' }}>{comp.citizen}</td>
                                        <td style={{ padding: '1.25rem' }}>{comp.area}</td>
                                        <td style={{ padding: '1.25rem' }}>
                                            <span style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '0.4rem',
                                                color: comp.priority === 'Critical' ? '#ef4444' : comp.priority === 'High' ? '#f59e0b' : '#3b82f6',
                                                fontWeight: '700',
                                                fontSize: '0.8rem'
                                            }}>
                                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor' }}></div>
                                                {comp.priority}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1.25rem' }}>
                                            <span style={{
                                                padding: '0.3rem 0.6rem',
                                                borderRadius: '0.5rem',
                                                fontSize: '0.75rem',
                                                fontWeight: '700',
                                                background: comp.status === 'New' ? 'var(--primary-glow)' : 'var(--muted)',
                                                color: comp.status === 'New' ? 'var(--primary)' : 'var(--muted-foreground)'
                                            }}>{comp.status}</span>
                                        </td>
                                        <td style={{ padding: '1.25rem 2rem', textAlign: 'right' }}>
                                            <button style={{ background: 'none', border: 'none', color: 'var(--muted-foreground)', cursor: 'pointer' }}><MoreVertical size={18} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div style={{ padding: '1.5rem 2rem', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
                        <button style={{ color: 'var(--primary)', fontWeight: '700', background: 'none', border: 'none', cursor: 'pointer' }}>View All Tickets</button>
                    </div>
                </section>
            </main>
        </div>
    )
}

export default AdminDashboard
