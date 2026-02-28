import React from 'react'
import {
    ChevronLeft,
    AlertTriangle,
    Clock,
    User,
    ShieldAlert,
    ArrowRight,
    MessageSquare,
    FileWarning,
    History
} from 'lucide-react'
import { motion } from 'framer-motion'

const EscalationView = ({ t, onBack }) => {
    const escalations = [
        {
            id: 'NV-2026-092',
            citizen: 'Nivaan Citizen',
            reason: 'Resolution Rejected',
            timer: '58:24',
            priority: 'Urgent',
            desc: 'Citizen marked the issue as unresolved. Claims street light is still flickering.'
        },
        {
            id: 'NV-2026-045',
            citizen: 'Amit Shah',
            reason: 'SLA Breach',
            timer: 'EXPIRED',
            priority: 'Critical',
            desc: 'Complaint not assigned for 48 hours. Primary department ignored triggers.'
        }
    ]

    return (
        <div style={{ minHeight: '100vh', background: '#fef2f2', padding: '2rem' }}>
            <main style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button
                            onClick={onBack}
                            style={{ padding: '0.5rem', borderRadius: '50%', background: 'white', border: '1px solid #fee2e2', cursor: 'pointer', color: 'var(--muted-foreground)' }}
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <div>
                            <h1 style={{ fontSize: '1.75rem', fontWeight: '800', margin: 0, color: '#991b1b', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <ShieldAlert size={32} /> Escalation Control Center
                            </h1>
                            <p style={{ color: '#b91c1c', fontSize: '0.9rem', fontWeight: '600', margin: 0, opacity: 0.7 }}>Senior Admin View • High Priority Queue</p>
                        </div>
                    </div>
                    <div style={{ padding: '0.75rem 1.5rem', background: 'white', borderRadius: '1rem', border: '1px solid #fee2e2', textAlign: 'right' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', fontWeight: '700', textTransform: 'uppercase' }}>Active Escalations</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#ef4444' }}>02</div>
                    </div>
                </div>

                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    {escalations.map((esc, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-card"
                            style={{ padding: '2rem', borderRadius: '1.5rem', border: '1px solid #fee2e2', background: 'rgba(255, 255, 255, 0.8)' }}
                        >
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2rem', marginBottom: '1.5rem' }}>
                                <div>
                                    <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--muted-foreground)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Complaint ID</div>
                                    <div style={{ fontSize: '1.25rem', fontWeight: '800' }}>{esc.id}</div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>{esc.citizen}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--muted-foreground)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Escalation Reason</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', fontWeight: '700' }}>
                                        <AlertTriangle size={18} /> {esc.reason}
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--muted-foreground)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Time Since Breach</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-end', color: '#991b1b', fontWeight: '800', fontSize: '1.25rem' }}>
                                        <Clock size={20} /> {esc.timer}
                                    </div>
                                </div>
                            </div>

                            <div style={{ padding: '1.25rem', background: '#fff1f2', borderRadius: '1rem', marginBottom: '1.5rem', border: '1px solid #ffe4e6' }}>
                                <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.5', color: '#9f1239' }}>
                                    <strong>ADMIN NOTE:</strong> {esc.desc}
                                </p>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button className="btn" style={{ padding: '0.6rem 1rem', background: 'white', border: '1px solid var(--border)', fontSize: '0.875rem' }}><History size={18} /> View History</button>
                                    <button className="btn" style={{ padding: '0.6rem 1rem', background: 'white', border: '1px solid var(--border)', fontSize: '0.875rem' }}><MessageSquare size={18} /> Contact Citizen</button>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button className="btn btn-secondary" style={{ padding: '0.75rem 1.5rem' }}>Dismiss</button>
                                    <button className="btn btn-primary" style={{ padding: '0.75rem 2rem', background: '#ef4444', border: 'none' }}>Take Action <ArrowRight size={18} /></button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div style={{ marginTop: '3rem', textAlign: 'center', padding: '2rem', border: '2px dashed #fee2e2', borderRadius: '2rem' }}>
                    <FileWarning size={40} color="#ef4444" style={{ marginBottom: '1rem', opacity: 0.5 }} />
                    <h3 style={{ margin: 0, color: '#991b1b' }}>Strict Performance Monitoring</h3>
                    <p style={{ fontSize: '0.875rem', color: '#b91c1c', opacity: 0.7, maxWidth: '500px', margin: '0.5rem auto 0' }}>
                        Escalations are automatically logged in the department performance report. Ensure swift action to maintain service standards.
                    </p>
                </div>
            </main>
        </div>
    )
}

export default EscalationView
