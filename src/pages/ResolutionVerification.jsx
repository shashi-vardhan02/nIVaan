import React from 'react'
import { CheckCircle2, XCircle, AlertCircle, ChevronLeft, ThumbsUp, ThumbsDown } from 'lucide-react'
import { motion } from 'framer-motion'

const ResolutionVerification = ({ t, onResolved, onNotResolved }) => {
    return (
        <div className="flex-center" style={{ minHeight: '100vh', padding: '2rem' }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card"
                style={{ maxWidth: '500px', width: '100%', padding: '3.5rem 2rem', textAlign: 'center', borderRadius: '2rem' }}
            >
                <div style={{ marginBottom: '2.5rem' }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        background: '#dcfce7',
                        color: '#10b981',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.5rem auto'
                    }}>
                        <CheckCircle2 size={48} />
                    </div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.75rem' }}>Is your problem resolved?</h1>
                    <p style={{ color: 'var(--muted-foreground)', lineHeight: '1.6' }}>
                        Officer Rajesh Kumar has marked the complaint <strong>NV-2026-092</strong> as resolved. Please verify the work.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <button
                        className="btn"
                        onClick={onResolved}
                        style={{
                            flexDirection: 'column',
                            padding: '2rem 1.5rem',
                            gap: '1rem',
                            background: 'white',
                            border: '2px solid #10b981',
                            color: '#10b981',
                            borderRadius: '1.5rem'
                        }}
                    >
                        <ThumbsUp size={32} />
                        <span style={{ fontWeight: '700' }}>Yes, Resolved</span>
                    </button>

                    <button
                        className="btn"
                        onClick={onNotResolved}
                        style={{
                            flexDirection: 'column',
                            padding: '2rem 1.5rem',
                            gap: '1rem',
                            background: 'white',
                            border: '2px solid #ef4444',
                            color: '#ef4444',
                            borderRadius: '1.5rem'
                        }}
                    >
                        <ThumbsDown size={32} />
                        <span style={{ fontWeight: '700' }}>No, Still Issues</span>
                    </button>
                </div>

                <div style={{ marginTop: '2.5rem', padding: '1.25rem', background: 'var(--muted)', borderRadius: '1rem', display: 'flex', gap: '1rem', alignItems: 'center', textAlign: 'left' }}>
                    <AlertCircle size={20} color="var(--muted-foreground)" />
                    <p style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)', margin: 0 }}>
                        If you don't respond within 48 hours, the complaint will be automatically closed as resolved.
                    </p>
                </div>
            </motion.div>
        </div>
    )
}

export default ResolutionVerification
