import React, { useState } from 'react'
import { ChevronLeft, Mail, Lock, Phone } from 'lucide-react'
import { motion } from 'framer-motion'

const CitizenLogin = ({ t, onLogin, onBack, onToggle }) => {
    const [loginMethod, setLoginMethod] = useState('otp')

    return (
        <div className="flex-center" style={{ minHeight: '100vh', padding: '2rem' }}>
            <button
                onClick={onBack}
                style={{
                    position: 'absolute',
                    top: '2rem',
                    left: '2rem',
                    background: 'none',
                    border: 'none',
                    color: 'var(--muted-foreground)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    cursor: 'pointer',
                    fontWeight: '600'
                }}
            >
                <ChevronLeft size={20} /> {t('common.back')}
            </button>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card"
                style={{ maxWidth: '400px', width: '100%', padding: '2.5rem', borderRadius: '1.5rem' }}
            >
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.5rem' }}>{t('loginSelection.citizen')} {t('common.login')}</h2>
                    <p style={{ color: 'var(--muted-foreground)' }}>Welcome back to Nivaan</p>
                </div>

                <div style={{
                    display: 'flex',
                    background: 'var(--muted)',
                    padding: '0.25rem',
                    borderRadius: '0.75rem',
                    marginBottom: '2rem'
                }}>
                    <button
                        onClick={() => setLoginMethod('otp')}
                        style={{
                            flex: 1,
                            padding: '0.5rem',
                            borderRadius: '0.5rem',
                            border: 'none',
                            fontWeight: '600',
                            cursor: 'pointer',
                            background: loginMethod === 'otp' ? 'white' : 'transparent',
                            boxShadow: loginMethod === 'otp' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                            color: loginMethod === 'otp' ? 'var(--primary)' : 'var(--muted-foreground)',
                            transition: 'var(--transition)'
                        }}
                    >
                        OTP
                    </button>
                    <button
                        onClick={() => setLoginMethod('password')}
                        style={{
                            flex: 1,
                            padding: '0.5rem',
                            borderRadius: '0.5rem',
                            border: 'none',
                            fontWeight: '600',
                            cursor: 'pointer',
                            background: loginMethod === 'password' ? 'white' : 'transparent',
                            boxShadow: loginMethod === 'password' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                            color: loginMethod === 'password' ? 'var(--primary)' : 'var(--muted-foreground)',
                            transition: 'var(--transition)'
                        }}
                    >
                        Password
                    </button>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); onLogin(); }} style={{ display: 'grid', gap: '1.25rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>
                            {loginMethod === 'otp' ? 'Mobile Number' : 'Email / Mobile'}
                        </label>
                        <div style={{ position: 'relative' }}>
                            <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)' }}>
                                {loginMethod === 'otp' ? <Phone size={18} /> : <Mail size={18} />}
                            </span>
                            <input
                                type="text"
                                className="form-input"
                                placeholder={loginMethod === 'otp' ? 'Enter 10 digit mobile' : 'Enter email or mobile'}
                                style={{ paddingLeft: '3rem' }}
                                required
                            />
                        </div>
                    </div>

                    {loginMethod === 'password' && (
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: '600' }}>Password</label>
                                <a href="#" style={{ fontSize: '0.875rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: '600' }}>Forgot?</a>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)' }}>
                                    <Lock size={18} />
                                </span>
                                <input
                                    type="password"
                                    className="form-input"
                                    placeholder="••••••••"
                                    style={{ paddingLeft: '3rem' }}
                                    required
                                />
                            </div>
                        </div>
                    )}

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', marginTop: '0.5rem' }}>
                        {loginMethod === 'otp' ? 'Get OTP' : t('common.login')}
                    </button>

                    <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--muted-foreground)', marginTop: '1rem' }}>
                        New to Nivaan? <button type="button" onClick={() => onToggle('citizen-register')} style={{ background: 'none', border: 'none', color: 'var(--primary)', textDecoration: 'none', fontWeight: '700', cursor: 'pointer' }}>Register Now</button>
                    </p>
                </form>
            </motion.div>
        </div>
    )
}

export default CitizenLogin
