import React, { useState } from 'react'
import { ChevronLeft, AlertTriangle, MessageSquare, Camera, Upload, Send } from 'lucide-react'
import { motion } from 'framer-motion'

const ReComplaintPage = ({ t, onSubmit, onBack }) => {
    const [description, setDescription] = useState('')

    return (
        <div style={{ minHeight: '100vh', background: 'var(--muted)', padding: '2rem' }}>
            <main style={{ maxWidth: '700px', margin: '0 auto' }}>
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

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card"
                    style={{ padding: '3rem', borderRadius: '2rem' }}
                >
                    <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', marginBottom: '2.5rem' }}>
                        <div style={{ width: '56px', height: '56px', background: '#fee2e2', color: '#ef4444', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <AlertTriangle size={32} />
                        </div>
                        <div>
                            <h1 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.25rem' }}>Re-Open Complaint</h1>
                            <p style={{ color: 'var(--muted-foreground)', fontSize: '0.95rem' }}>Reference: <strong>NV-2026-092</strong></p>
                        </div>
                    </div>

                    <div style={{ padding: '1.5rem', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '1rem', marginBottom: '2.5rem' }}>
                        <p style={{ color: '#92400e', fontSize: '0.875rem', fontWeight: '600', margin: 0, lineHeight: '1.5' }}>
                            RE-COMPLAINT RULE: This will immediately escalate the issue to a Senior Administrative Officer. Please provide specific reasons why the previous resolution was unsatisfactory.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gap: '2rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '700' }}>Reason for Re-opening</label>
                            <textarea
                                className="form-input"
                                placeholder="Ex: The street light was fixed but it stopped working again after 2 hours..."
                                style={{ minHeight: '150px', padding: '1rem' }}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            ></textarea>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '700' }}>New Evidence (Optional)</label>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div style={{
                                    flex: 1,
                                    padding: '1.5rem',
                                    border: '2px dashed var(--border)',
                                    borderRadius: '1rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    cursor: 'pointer',
                                    color: 'var(--muted-foreground)'
                                }}>
                                    <Camera size={24} />
                                    <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>Take Photo</span>
                                </div>
                                <div style={{
                                    flex: 1,
                                    padding: '1.5rem',
                                    border: '2px dashed var(--border)',
                                    borderRadius: '1rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    cursor: 'pointer',
                                    color: 'var(--muted-foreground)'
                                }}>
                                    <Upload size={24} />
                                    <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>Upload Proof</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: '3rem' }}>
                        <button
                            className="btn btn-primary"
                            disabled={!description}
                            onClick={onSubmit}
                            style={{ width: '100%', padding: '1.25rem', fontSize: '1.1rem', background: '#ef4444', border: 'none' }}
                        >
                            Escalate to Senior Admin <Send size={20} />
                        </button>
                    </div>
                </motion.div>
            </main>
        </div>
    )
}

export default ReComplaintPage
