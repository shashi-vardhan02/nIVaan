import React, { useState } from 'react'
import { ChevronLeft, Mail, Lock, Phone, User, Globe } from 'lucide-react'
import { motion } from 'framer-motion'

const CitizenLogin = ({ t, language, setLanguage, onLogin, onBack, onToggle }) => {
    const [loginMethod, setLoginMethod] = useState('signIn') // 'signIn' or 'register'
    const [formData, setFormData] = useState({
        fullName: '',
        identifier: '', // Email or Mobile
        mobile: '',
        email: '',
        password: '',
        confirmPassword: ''
    })
    const [loading, setLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setErrorMsg('')

        try {
            if (loginMethod === 'register') {
                const res = await fetch('http://localhost:8080/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: formData.fullName,
                        email: formData.email,
                        password: formData.password,
                        role: 'citizen'
                    })
                })

                if (res.ok) {
                    // Registration successful, proceed to login programmatically
                    await performLogin(formData.email, formData.password)
                } else {
                    const errorData = await res.json()
                    setErrorMsg(errorData.detail || 'Registration failed')
                }
            } else {
                await performLogin(formData.identifier, formData.password)
            }
        } catch (err) {
            console.error('Login/Register error:', err)
            setErrorMsg(err.message || 'Unable to connect to server.')
        } finally {
            setLoading(false)
        }
    }

    const performLogin = async (username, password) => {
        const urlParams = new URLSearchParams()
        // Provide a fallback if they enter a mobile number (since we only support email in backend right now for demo)
        urlParams.append('username', username.includes('@') ? username : 'citizen@nivaan.gov')
        urlParams.append('password', password || 'password')

        const res = await fetch('http://localhost:8080/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: urlParams
        })

        if (res.ok) {
            const data = await res.json()
            localStorage.setItem('token', data.access_token)

            // Extract name from token (simulated for simplicity, we pass full name from form for now)
            const finalName = loginMethod === 'register' ? formData.fullName : (formData.identifier || 'Alex Johnson')
            onLogin(finalName)
        } else {
            throw new Error('Invalid email or password.')
        }
    }

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
                    <img src="/logo.png" alt="NIVaan Logo" style={{ height: '70px', margin: '0 auto 1rem auto', display: 'block' }} />
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

                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.25rem' }}>
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
                                        value={formData.identifier}
                                        onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
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

                    {errorMsg && (
                        <div style={{ color: '#dc2626', fontSize: '0.85rem', fontWeight: 'bold', textAlign: 'center', marginTop: '-0.5rem' }}>
                            {errorMsg}
                        </div>
                    )}

                    <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '1rem', marginTop: '0.5rem', opacity: loading ? 0.7 : 1 }}>
                        {loading ? 'Processing...' : (loginMethod === 'signIn' ? t('common.login') : 'Register Now')}
                    </button>
                </form>
            </motion.div>
        </div>
    )
}

export default CitizenLogin
