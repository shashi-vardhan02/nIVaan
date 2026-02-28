import React, { useState } from 'react'
import { ChevronLeft, Mail, Lock, Phone, User, Globe } from 'lucide-react'
import { motion } from 'framer-motion'

const CitizenLogin = ({ t, language, setLanguage, onLogin, onBack, onToggle }) => {
    const [loginMethod, setLoginMethod] = useState('signIn') // 'signIn' or 'register'
    const [formData, setFormData] = useState({
        fullName: '',
        mobile: '',
        email: '',
        password: '',
        confirmPassword: ''
    })

    return (
        <div className="flex-center" style={{ minHeight: '100vh', padding: '2rem' }}>
            <div style={{ position: 'absolute', top: '2rem', left: '2rem', right: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                        fontWeight: '600'
                    }}
                >
                    <ChevronLeft size={20} /> {t('common.back')}
                </button>
                <div style={{ display: 'flex', background: 'var(--muted)', padding: '0.2rem', borderRadius: '0.5rem' }}>
                    <button onClick={() => setLanguage('en')} style={{ border: 'none', background: language === 'en' ? 'white' : 'transparent', padding: '0.2rem 0.6rem', borderRadius: '0.3rem', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '700' }}>EN</button>
                    <button onClick={() => setLanguage('hi')} style={{ border: 'none', background: language === 'hi' ? 'white' : 'transparent', padding: '0.2rem 0.6rem', borderRadius: '0.3rem', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '700' }}>HI</button>
                    <button onClick={() => setLanguage('te')} style={{ border: 'none', background: language === 'te' ? 'white' : 'transparent', padding: '0.2rem 0.6rem', borderRadius: '0.3rem', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '700' }}>TE</button>
                </div>
            </div>

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
                        onClick={() => setLoginMethod('signIn')}
                        style={{
                            flex: 1,
                            padding: '0.5rem',
                            borderRadius: '0.5rem',
                            border: 'none',
                            fontWeight: '600',
                            cursor: 'pointer',
                            background: loginMethod === 'signIn' ? 'white' : 'transparent',
                            boxShadow: loginMethod === 'signIn' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                            color: loginMethod === 'signIn' ? 'var(--primary)' : 'var(--muted-foreground)',
                            transition: 'var(--transition)'
                        }}
                    >
                        Sign In
                    </button>
                    <button
                        onClick={() => setLoginMethod('register')}
                        style={{
                            flex: 1,
                            padding: '0.5rem',
                            borderRadius: '0.5rem',
                            border: 'none',
                            fontWeight: '600',
                            cursor: 'pointer',
                            background: loginMethod === 'register' ? 'white' : 'transparent',
                            boxShadow: loginMethod === 'register' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                            color: loginMethod === 'register' ? 'var(--primary)' : 'var(--muted-foreground)',
                            transition: 'var(--transition)'
                        }}
                    >
                        Register
                    </button>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); onLogin(); }} style={{ display: 'grid', gap: '1.25rem' }}>
                    {loginMethod === 'signIn' ? (
                        <>
                            <button type="button" className="btn" style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.75rem',
                                background: 'white',
                                border: '1px solid var(--border)',
                                color: 'var(--foreground)',
                                padding: '0.75rem'
                            }}>
                                <Globe size={20} /> Sign in with Google
                            </button>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '0.5rem 0' }}>
                                <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
                                <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', fontWeight: '600' }}>OR</span>
                                <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>Email / Mobile</label>
                                <div style={{ position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)' }}>
                                        <Mail size={18} />
                                    </span>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="Enter email or mobile"
                                        style={{ paddingLeft: '3rem' }}
                                        required
                                    />
                                </div>
                            </div>

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
                        </>
                    ) : (
                        <>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>Full Name</label>
                                <div style={{ position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)' }}>
                                        <User size={18} />
                                    </span>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="Enter your full name"
                                        style={{ paddingLeft: '3rem' }}
                                        required
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>Mobile Number</label>
                                <div style={{ position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)' }}>
                                        <Phone size={18} />
                                    </span>
                                    <input
                                        type="tel"
                                        className="form-input"
                                        placeholder="Enter 10 digit mobile"
                                        style={{ paddingLeft: '3rem' }}
                                        required
                                        value={formData.mobile}
                                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>Email ID</label>
                                <div style={{ position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)' }}>
                                        <Mail size={18} />
                                    </span>
                                    <input
                                        type="email"
                                        className="form-input"
                                        placeholder="Enter your email"
                                        style={{ paddingLeft: '3rem' }}
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>Password</label>
                                <div style={{ position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)' }}>
                                        <Lock size={18} />
                                    </span>
                                    <input
                                        type="password"
                                        className="form-input"
                                        placeholder="Create password"
                                        style={{ paddingLeft: '3rem' }}
                                        required
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', marginTop: '0.5rem' }}>
                        {loginMethod === 'signIn' ? t('common.login') : 'Register Now'}
                    </button>
                </form>
            </motion.div>
        </div>
    )
}

export default CitizenLogin
