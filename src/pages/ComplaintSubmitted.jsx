import React from 'react'
import { CheckCircle2, Copy, Share2, ArrowRight, Home } from 'lucide-react'
import { motion } from 'framer-motion'

const ComplaintSubmitted = ({ t, data, onTrack, onHome }) => {
    const complaintId = "NV-2026-092" // Simulated ID

    return (
        <div className="flex-center" style={{ minHeight: '100vh', padding: '2rem' }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card"
                style={{ maxWidth: '500px', width: '100%', padding: '4rem 2rem', textAlign: 'center', borderRadius: '2.5rem' }}
            >
                <div style={{ display: 'inline-flex', marginBottom: '2rem' }}>
                    <div style={{
                        width: '100px',
                        height: '100px',
                        background: 'var(--primary-glow)',
                        color: 'var(--primary)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <CheckCircle2 size={60} />
                    </div>
                </div>

                <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '1rem' }}>Complaint Submitted!</h1>
                <p style={{ color: 'var(--muted-foreground)', fontSize: '1.1rem', marginBottom: '3rem' }}>
                    Your request has been successfully registered. Our team will start investigating shortly.
                </p>

                <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '1.25rem', background: 'var(--muted)', marginBottom: '3rem' }}>
                    <div style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', marginBottom: '0.5rem', fontWeight: '600' }}>YOUR COMPLAINT ID</div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                        <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)', letterSpacing: '0.05em' }}>{complaintId}</span>
                        <button style={{ background: 'white', border: '1px solid var(--border)', padding: '0.4rem', borderRadius: '0.5rem', cursor: 'pointer' }}><Copy size={16} /></button>
                    </div>
                </div>

                <div style={{ display: 'grid', gap: '1rem' }}>
                    <button
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '1.25rem', fontSize: '1.1rem' }}
                        onClick={onTrack}
                    >
                        Track Progress <ArrowRight size={20} />
                    </button>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            className="btn btn-secondary"
                            style={{ flex: 1, padding: '1rem' }}
                            onClick={onHome}
                        >
                            <Home size={18} /> Go Home
                        </button>
                        <button
                            className="btn btn-secondary"
                            style={{ flex: 1, padding: '1rem' }}
                        >
                            <Share2 size={18} /> Share
                        </button>
                    </div>
                </div>

                <p style={{ marginTop: '2.5rem', fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
                    You will receive updates via SMS on +91 ••••••4321
                </p>
            </motion.div>
        </div>
    )
}

export default ComplaintSubmitted
