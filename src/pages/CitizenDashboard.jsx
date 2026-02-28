import React from 'react'
import {
    PlusCircle,
    Search,
    Clock,
    CheckCircle2,
    AlertCircle,
    Bell,
    User,
    LogOut,
    ChevronRight
} from 'lucide-react'
import { motion } from 'framer-motion'

const CitizenDashboard = ({ t, language, setLanguage, onRaiseComplaint, onLogout }) => {
    const stats = [
        { label: 'Total', count: 4, color: 'var(--primary)', icon: <PlusCircle size={20} /> }
    ]



    return (
        <div style={{ minHeight: '100vh', background: 'var(--muted)' }}>
            {/* Header */}
            <nav style={{
                background: 'white',
                padding: '1rem 2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid var(--border)',
                position: 'sticky',
                top: 0,
                zIndex: 50
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--primary)' }}>NIVAAN</span>
                </div>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <div style={{ display: 'flex', background: 'var(--muted)', padding: '0.2rem', borderRadius: '0.5rem' }}>
                        <button onClick={() => setLanguage('en')} style={{ border: 'none', background: language === 'en' ? 'white' : 'transparent', padding: '0.2rem 0.5rem', borderRadius: '0.3rem', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '700' }}>EN</button>
                        <button onClick={() => setLanguage('hi')} style={{ border: 'none', background: language === 'hi' ? 'white' : 'transparent', padding: '0.2rem 0.5rem', borderRadius: '0.3rem', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '700' }}>HI</button>
                        <button onClick={() => setLanguage('te')} style={{ border: 'none', background: language === 'te' ? 'white' : 'transparent', padding: '0.2rem 0.5rem', borderRadius: '0.3rem', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '700' }}>TE</button>
                    </div>
                    <button style={{ background: 'none', border: 'none', color: 'var(--muted-foreground)', cursor: 'pointer' }}><Bell size={20} /></button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 1rem', background: 'var(--muted)', borderRadius: '2rem' }}>
                        <div style={{ width: '32px', height: '32px', background: 'var(--primary)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <User size={18} />
                        </div>
                        <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>Citizen User</span>
                        <button
                            onClick={onLogout}
                            style={{ background: 'none', border: 'none', padding: 0, marginLeft: '0.5rem', cursor: 'pointer', color: '#ef4444', display: 'flex', alignItems: 'center' }}
                        >
                            <LogOut size={16} />
                        </button>
                    </div>
                </div>
            </nav>

            <main className="container" style={{ padding: '2rem' }}>
                <header style={{ marginBottom: '2.5rem' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>Welcome, Nivaan Citizen</h1>
                    <p style={{ color: 'var(--muted-foreground)' }}>Monitor your public service requests and take action.</p>
                </header>

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -5 }}
                            className="glass-card"
                            style={{ padding: '1.5rem', borderRadius: '1.25rem', borderLeft: `4px solid ${stat.color}` }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <div style={{ color: stat.color }}>{stat.icon}</div>
                                <span style={{ fontSize: '1.5rem', fontWeight: '800' }}>{stat.count}</span>
                            </div>
                            <div style={{ color: 'var(--muted-foreground)', fontWeight: '600', fontSize: '0.875rem' }}>{stat.label}</div>
                        </motion.div>
                    ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    {/* Empty left side for balance or future features */}
                    <div></div>

                    {/* Quick Actions */}
                    <section>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem' }}>Quick Actions</h2>
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            <button
                                className="btn btn-primary"
                                style={{ width: '100%', padding: '1.25rem', borderRadius: '1rem', justifyContent: 'flex-start', gap: '1rem' }}
                                onClick={onRaiseComplaint}
                            >
                                <PlusCircle size={24} /> Raise New Complaint
                            </button>
                            <div
                                className="glass-card"
                                style={{ padding: '1.5rem', borderRadius: '1rem', background: 'var(--primary-glow)', border: '1px dashed var(--primary)' }}
                            >
                                <h4 style={{ color: 'var(--primary)', fontWeight: '700', marginBottom: '0.5rem' }}>Emergency Contact?</h4>
                                <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', marginBottom: '1rem' }}>If there is an immediate threat to life or property, call 112.</p>
                                <a href="tel:112" style={{ color: 'var(--primary)', fontWeight: '800', textDecoration: 'none' }}>Call Helpdesk</a>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    )
}

export default CitizenDashboard
