import React, { useState } from 'react'
import { ChevronLeft, Building2, UserCircle, Lock, ShieldCheck, ArrowRight, Languages } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const AdminLogin = ({ t, language, setLanguage, onLogin, onBack }) => {
    const departments = ['Electricity', 'Gas', 'Water', 'Municipality']
    const [selectedDept, setSelectedDept] = useState('')
    const [isFocused, setIsFocused] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const [loading, setLoading] = useState(false)

    const handleLogin = async (e) => {
        e.preventDefault()
        if (!selectedDept) {
            setErrorMsg('Please select a department')
            return
        }
        setLoading(true)
        setErrorMsg('')

        try {
            const formData = new URLSearchParams()
            formData.append('username', 'admin.elec@nivaan.gov') // Mocking exact email mapping for now based on dept if needed or we could just use a generic admin for this demo

            // Map selected dept to actual backend email mapping for demo purposes
            let email = `admin.${selectedDept.toLowerCase().substring(0, 4)}@nivaan.gov`
            if (selectedDept.toLowerCase() === 'electricity') email = 'admin.elec@nivaan.gov'
            if (selectedDept.toLowerCase() === 'water') email = 'admin.water@nivaan.gov'
            if (selectedDept.toLowerCase() === 'municipality') email = 'admin.muni@nivaan.gov'

            formData.append('username', email)
            formData.append('password', 'password') // Default password from seed

            const res = await fetch('http://localhost:8080/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formData
            })

            if (res.ok) {
                const data = await res.json()
                localStorage.setItem('token', data.access_token)
                onLogin(selectedDept)
            } else {
                setErrorMsg('Invalid Credentials. Please try again.')
            }
        } catch (err) {
            console.error('Login error', err)
            setErrorMsg('Unable to connect to server.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'radial-gradient(circle at top right, #f8fafc, #f1f5f9)',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Decorations */}
            <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.05) 0%, transparent 70%)', borderRadius: '50%' }} />
            <div style={{ position: 'absolute', bottom: '-10%', left: '-10%', width: '30%', height: '30%', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.05) 0%, transparent 70%)', borderRadius: '50%' }} />

            {/* Header Navigation */}
            <div style={{
                padding: '2rem 4rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                zIndex: 10
            }}>
                <motion.button
                    whileHover={{ x: -4 }}
                    onClick={onBack}
                    style={{
                        background: 'white',
                        border: '1px solid #e2e8f0',
                        color: '#64748b',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        padding: '0.6rem 1.2rem',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        fontWeight: '700',
                        fontSize: '0.9rem',
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
                    }}
                >
                    <ChevronLeft size={18} /> {t('common.back')}
                </motion.button>

                <div style={{ display: 'flex', background: 'white', padding: '0.3rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ padding: '0 0.5rem', borderRight: '1px solid #f1f5f9' }}>
                        <Languages size={16} color="#94a3b8" />
                    </div>
                    {['en', 'hi', 'te'].map((lang) => (
                        <button
                            key={lang}
                            onClick={() => setLanguage(lang)}
                            style={{
                                border: 'none',
                                background: language === lang ? 'var(--primary)' : 'transparent',
                                color: language === lang ? 'white' : '#64748b',
                                padding: '0.4rem 0.8rem',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '0.75rem',
                                fontWeight: '800',
                                transition: 'all 0.2s ease',
                                textTransform: 'uppercase'
                            }}
                        >
                            {lang}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', zIndex: 1 }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        maxWidth: '480px',
                        width: '100%',
                        background: 'white',
                        padding: '3.5rem',
                        borderRadius: '2.5rem',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.08)',
                        border: '1px solid #f1f5f9',
                        position: 'relative'
                    }}
                >
                    {/* Top Accent Bar */}
                    <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '40%', height: '4px', background: 'linear-gradient(90deg, #6366f1, #8b5cf6)', borderRadius: '0 0 10px 10px' }} />

                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', damping: 12 }}
                            style={{
                                width: '72px',
                                height: '72px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 1.5rem auto'
                            }}
                        >
                            <img src="/logo.png" alt="NIVaan Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        </motion.div>
                        <h2 style={{ fontSize: '2.25rem', fontWeight: '900', color: '#0f172a', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>Admin Portal</h2>
                        <p style={{ color: '#64748b', fontSize: '1rem', fontWeight: '500' }}>Official Department Login</p>
                    </div>

                    <form onSubmit={handleLogin} style={{ display: 'grid', gap: '1.75rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.9rem', fontWeight: '800', color: '#334155' }}>
                                Select Department
                            </label>
                            <div style={{
                                position: 'relative',
                                borderRadius: '14px',
                                border: `2px solid ${isFocused === 'dept' ? '#6366f1' : '#f1f5f9'}`,
                                background: isFocused === 'dept' ? 'white' : '#f8fafc',
                                transition: 'all 0.2s ease',
                                padding: '0.2rem'
                            }}>
                                <span style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: isFocused === 'dept' ? '#6366f1' : '#94a3b8', zIndex: 1 }}>
                                    <Building2 size={20} />
                                </span>
                                <select
                                    className="form-input"
                                    style={{
                                        paddingLeft: '3.5rem',
                                        appearance: 'none',
                                        border: 'none',
                                        background: 'transparent',
                                        height: '52px',
                                        width: '100%',
                                        fontSize: '1rem',
                                        fontWeight: '600',
                                        color: '#0f172a',
                                        outline: 'none',
                                        cursor: 'pointer'
                                    }}
                                    value={selectedDept}
                                    onChange={(e) => setSelectedDept(e.target.value)}
                                    onFocus={() => setIsFocused('dept')}
                                    onBlur={() => setIsFocused('')}
                                    required
                                >
                                    <option value="" disabled>Choose your department</option>
                                    {departments.map(dept => (
                                        <option key={dept} value={dept}>{dept}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.9rem', fontWeight: '800', color: '#334155' }}>
                                Admin ID / Official Email
                            </label>
                            <div style={{
                                position: 'relative',
                                borderRadius: '14px',
                                border: `2px solid ${isFocused === 'id' ? '#6366f1' : '#f1f5f9'}`,
                                background: isFocused === 'id' ? 'white' : '#f8fafc',
                                transition: 'all 0.2s ease',
                                padding: '0.2rem'
                            }}>
                                <span style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: isFocused === 'id' ? '#6366f1' : '#94a3b8' }}>
                                    <UserCircle size={20} />
                                </span>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Ex: ADMIN-12345"
                                    style={{
                                        paddingLeft: '3.5rem',
                                        border: 'none',
                                        background: 'transparent',
                                        height: '52px',
                                        width: '100%',
                                        fontSize: '1rem',
                                        fontWeight: '600',
                                        outline: 'none'
                                    }}
                                    onFocus={() => setIsFocused('id')}
                                    onBlur={() => setIsFocused('')}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.9rem', fontWeight: '800', color: '#334155' }}>
                                Password
                            </label>
                            <div style={{
                                position: 'relative',
                                borderRadius: '14px',
                                border: `2px solid ${isFocused === 'pass' ? '#6366f1' : '#f1f5f9'}`,
                                background: isFocused === 'pass' ? 'white' : '#f8fafc',
                                transition: 'all 0.2s ease',
                                padding: '0.2rem'
                            }}>
                                <span style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: isFocused === 'pass' ? '#6366f1' : '#94a3b8' }}>
                                    <Lock size={20} />
                                </span>
                                <input
                                    type="password"
                                    className="form-input"
                                    placeholder="••••••••"
                                    style={{
                                        paddingLeft: '3.5rem',
                                        border: 'none',
                                        background: 'transparent',
                                        height: '52px',
                                        width: '100%',
                                        fontSize: '1rem',
                                        fontWeight: '600',
                                        outline: 'none'
                                    }}
                                    onFocus={() => setIsFocused('pass')}
                                    onBlur={() => setIsFocused('')}
                                    required
                                />
                            </div>
                        </div>

                        {errorMsg && (
                            <div style={{ color: '#dc2626', fontSize: '0.85rem', fontWeight: 'bold', textAlign: 'center', marginTop: '-0.5rem' }}>
                                {errorMsg}
                            </div>
                        )}

                        <motion.button
                            type="submit"
                            whileHover={loading ? {} : { scale: 1.02 }}
                            whileTap={loading ? {} : { scale: 0.98 }}
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '1.2rem',
                                marginTop: '1rem',
                                background: loading ? 'linear-gradient(90deg, #818cf8, #a78bfa)' : 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '16px',
                                fontWeight: '800',
                                fontSize: '1.1rem',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.3)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.75rem',
                                transition: 'background 0.3s ease'
                            }}
                        >
                            {loading ? (
                                <>
                                    <svg width="20" height="20" viewBox="0 0 24 24" style={{ animation: 'spin 0.8s linear infinite' }}>
                                        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
                                        <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" fill="none" strokeDasharray="40" strokeDashoffset="10" strokeLinecap="round" />
                                    </svg>
                                    Opening Dashboard…
                                </>
                            ) : (
                                <>Login to Dashboard <ArrowRight size={20} /></>
                            )}
                        </motion.button>
                    </form>

                    <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.6rem',
                            padding: '0.6rem 1.2rem',
                            background: '#f8fafc',
                            borderRadius: '12px',
                            border: '1px solid #f1f5f9'
                        }}>
                            <Lock size={14} color="#64748b" />
                            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '700' }}>Securely authenticated portal</span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Footer */}
            <div style={{ padding: '2rem', textAlign: 'center' }}>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: '500' }}>
                    © 2024 nIVaan Public Service Support Assistant. All rights reserved.
                </p>
            </div>
        </div>
    )
}

export default AdminLogin
