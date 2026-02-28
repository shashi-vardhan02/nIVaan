import React from 'react'
import {
    ChevronLeft,
    MapPin,
    Clock,
    User,
    CheckCircle2,
    Circle,
    Phone,
    MessageSquare,
    AlertTriangle
} from 'lucide-react'
import { motion } from 'framer-motion'

const TrackingTimeline = ({ t, onBack, onVerify }) => {
    const steps = [
        { title: 'Complaint Submitted', date: 'Feb 27, 2026 • 10:30 AM', status: 'completed', desc: 'Your complaint has been successfully registered and assigned ID NV-2026-092.' },
        { title: 'Officer Assigned', date: 'Feb 27, 2026 • 11:45 AM', status: 'completed', desc: 'Junior Engineer Rajesh Kumar from North Zone has been assigned to your case.' },
        { title: 'In Progress', date: 'Feb 27, 2026 • 02:15 PM', status: 'current', desc: 'The technical team is on-site investigating the power fluctuation in Sector 45.' },
        { title: 'Resolved', date: 'Waiting...', status: 'upcoming', desc: 'Officer will mark as resolved once the work is completed.' }
    ]

    return (
        <div style={{ minHeight: '100vh', background: 'var(--muted)', padding: '2rem' }}>
            <main style={{ maxWidth: '800px', margin: '0 auto' }}>
                <button
                    onClick={onBack}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--muted-foreground)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        cursor: 'pointer',
                        fontWeight: '600',
                        marginBottom: '2rem'
                    }}
                >
                    <ChevronLeft size={20} /> {t('common.back')}
                </button>

                <header className="glass-card" style={{ padding: '2rem', borderRadius: '1.5rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                            <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)' }}>NV-2026-092</span>
                            <span style={{ padding: '0.3rem 0.6rem', background: 'var(--primary-glow)', color: 'var(--primary)', borderRadius: '2rem', fontSize: '0.75rem', fontWeight: '700' }}>IN PROGRESS</span>
                        </div>
                        <p style={{ color: 'var(--muted-foreground)', fontWeight: '600' }}>Electricity • Street Light Not Working</p>
                    </div>
                    <button className="btn btn-secondary" style={{ gap: '0.5rem' }}><AlertTriangle size={18} /> Report Delay</button>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                    {/* Timeline */}
                    <section className="glass-card" style={{ padding: '2.5rem', borderRadius: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '2.5rem' }}>Status Timeline</h2>
                        <div style={{ display: 'grid', gap: '0' }}>
                            {steps.map((step, i) => (
                                <div key={i} style={{ display: 'flex', gap: '1.5rem', position: 'relative', paddingBottom: i === steps.length - 1 ? 0 : '2.5rem' }}>
                                    {i !== steps.length - 1 && (
                                        <div style={{
                                            position: 'absolute',
                                            left: '11px',
                                            top: '24px',
                                            bottom: 0,
                                            width: '2px',
                                            background: step.status === 'completed' ? 'var(--primary)' : 'var(--border)',
                                            zIndex: 0
                                        }}></div>
                                    )}
                                    <div style={{
                                        width: '24px',
                                        height: '24px',
                                        borderRadius: '50%',
                                        background: step.status === 'completed' ? 'var(--primary)' : step.status === 'current' ? 'white' : 'white',
                                        border: step.status === 'current' ? '6px solid var(--primary)' : '2px solid var(--border)',
                                        zIndex: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        flexShrink: 0
                                    }}>
                                        {step.status === 'completed' && <CheckCircle2 size={14} />}
                                    </div>
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                                            <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: step.status === 'upcoming' ? 'var(--muted-foreground)' : 'var(--foreground)' }}>{step.title}</h3>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>{step.date}</span>
                                        </div>
                                        <p style={{ fontSize: '0.9rem', color: 'var(--muted-foreground)', lineHeight: '1.5', margin: 0 }}>{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{ marginTop: '3rem', pt: '2rem', borderTop: '1px solid var(--border)' }}>
                            <button
                                className="btn btn-primary"
                                style={{ width: '100%', padding: '1rem' }}
                                onClick={onVerify}
                            >
                                Final Resolution Verification
                            </button>
                        </div>
                    </section>

                    {/* Officer Sidebar */}
                    <aside>
                        <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '1.5rem', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '1.25rem', color: 'var(--muted-foreground)', textTransform: 'uppercase' }}>Assigned Officer</h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div style={{ width: '50px', height: '50px', background: 'var(--muted)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                                    <User size={28} />
                                </div>
                                <div>
                                    <div style={{ fontWeight: '700' }}>Rajesh Kumar</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>Junior Engineer</div>
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                <button className="btn btn-secondary" style={{ padding: '0.6rem' }}><Phone size={18} /></button>
                                <button className="btn btn-secondary" style={{ padding: '0.6rem' }}><MessageSquare size={18} /></button>
                            </div>
                        </div>

                        <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '1.5rem' }}>
                            <h3 style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--muted-foreground)', textTransform: 'uppercase' }}>Location</h3>
                            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                                <MapPin size={18} color="var(--primary)" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
                                <p style={{ fontSize: '0.875rem', margin: 0, lineHeight: '1.4' }}>Sector 45, Near Metro Pillar 124, North Zone District</p>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    )
}

export default TrackingTimeline
