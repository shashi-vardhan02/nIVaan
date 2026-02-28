import React, { useState } from 'react'
import {
    User,
    Phone,
    Mail,
    Lock,
    ChevronLeft,
    ShieldCheck,
    ArrowRight,
    RefreshCw
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const CitizenRegister = ({ t = (path) => path, onToggle, onRegisterSuccess }) => {
    const [step, setStep] = useState(1) // 1: Registration, 2: OTP
    const [formData, setFormData] = useState({
        fullName: '',
        mobile: '',
        email: '',
        password: '',
        confirmPassword: ''
    })
    const [otp, setOtp] = useState(['', '', '', '', '', ''])

    const handleRegister = (e) => {
        e.preventDefault()
        setStep(2)
    }

    const handleOtpChange = (index, value) => {
        if (value.length <= 1) {
            const newOtp = [...otp]
            newOtp[index] = value
            setOtp(newOtp)
            // Auto focus next
            if (value && index < 5) {
                document.getElementById(`otp-${index + 1}`).focus()
            }
        }
    }

    return (
        <div className="flex-center" style={{ minHeight: '100vh', background: 'var(--muted)', padding: '2rem' }}>
            <header style={{ position: 'fixed', top: '2rem', left: '2rem' }}>
                <button
                    onClick={onToggle}
                    style={{
                        background: 'white',
                        border: '1px solid var(--border)',
                        padding: '0.75rem 1.25rem',
                        borderRadius: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        boxShadow: 'var(--shadow-sm)'
                    }}
                >
                    <ChevronLeft size={20} /> {t('common.back')}
                </button>
            </header>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card"
                style={{ maxWidth: '500px', width: '100%', padding: '3rem', borderRadius: '2.5rem' }}
            >
                <AnimatePresence mode="wait">
                    {step === 1 ? (
                        <motion.div
                            key="register-form"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                                <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.75rem' }}>{t('register.title')}</h1>
                                <p style={{ color: 'var(--muted-foreground)' }}>{t('register.subtitle')}</p>
                            </div>

                            <form onSubmit={handleRegister} style={{ display: 'grid', gap: '1.25rem' }}>
                                <div style={{ position: 'relative' }}>
                                    <User size={18} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)' }} />
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder={t('register.fullName')}
                                        required
                                        style={{ paddingLeft: '3.25rem' }}
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    />
                                </div>

                                <div style={{ position: 'relative' }}>
                                    <Phone size={18} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)' }} />
                                    <input
                                        type="tel"
                                        className="form-input"
                                        placeholder={t('register.mobile')}
                                        required
                                        style={{ paddingLeft: '3.25rem' }}
                                        value={formData.mobile}
                                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                    />
                                    <div style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: '600', marginTop: '0.4rem', marginLeft: '0.5rem' }}>{t('register.otpMsg')}</div>
                                </div>

                                <div style={{ position: 'relative' }}>
                                    <Mail size={18} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)' }} />
                                    <input
                                        type="email"
                                        className="form-input"
                                        placeholder={t('register.email')}
                                        style={{ paddingLeft: '3.25rem' }}
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                    <div style={{ fontSize: '0.7rem', color: 'var(--muted-foreground)', marginTop: '0.4rem', marginLeft: '0.5rem' }}>{t('register.emailHint')}</div>
                                </div>

                                <div style={{ position: 'relative' }}>
                                    <Lock size={18} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)' }} />
                                    <input
                                        type="password"
                                        className="form-input"
                                        placeholder={t('register.password')}
                                        required
                                        style={{ paddingLeft: '3.25rem' }}
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>

                                <div style={{ position: 'relative' }}>
                                    <Lock size={18} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)' }} />
                                    <input
                                        type="password"
                                        className="form-input"
                                        placeholder={t('register.confirmPassword')}
                                        required
                                        style={{ paddingLeft: '3.25rem' }}
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    />
                                </div>

                                <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '1rem' }}>
                                    {t('register.submit')} <ArrowRight size={20} />
                                </button>
                            </form>

                            <div style={{ marginTop: '2.5rem', textAlign: 'center', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                                <p style={{ color: 'var(--muted-foreground)', fontSize: '0.9rem' }}>
                                    {t('register.alreadyHaveAccount')} <button onClick={onToggle} style={{ color: 'var(--primary)', fontWeight: '700', background: 'none', border: 'none', cursor: 'pointer' }}>{t('register.loginNow')}</button>
                                </p>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="otp-step"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            style={{ textAlign: 'center' }}
                        >
                            <div style={{
                                width: '70px',
                                height: '70px',
                                background: 'var(--primary-glow)',
                                color: 'var(--primary)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 2rem auto'
                            }}>
                                <ShieldCheck size={40} />
                            </div>
                            <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.75rem' }}>Verify Mobile</h2>
                            <p style={{ color: 'var(--muted-foreground)', marginBottom: '2.5rem' }}>Enter the 6-digit code sent to<br /><strong>+91 {formData.mobile}</strong></p>

                            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginBottom: '2.5rem' }}>
                                {otp.map((digit, i) => (
                                    <input
                                        key={i}
                                        id={`otp-${i}`}
                                        type="text"
                                        maxLength="1"
                                        className="form-input"
                                        style={{ width: '50px', height: '60px', textAlign: 'center', fontSize: '1.5rem', fontWeight: '800', padding: 0 }}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(i, e.target.value)}
                                    />
                                ))}
                            </div>

                            <button
                                className="btn btn-primary"
                                style={{ width: '100%', padding: '1rem', marginBottom: '1.5rem' }}
                                onClick={() => onRegisterSuccess()}
                            >
                                Verify & Register
                            </button>

                            <button style={{ background: 'none', border: 'none', color: 'var(--muted-foreground)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 auto', cursor: 'pointer' }}>
                                <RefreshCw size={16} /> Resend OTP in 24s
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    )
}

export default CitizenRegister
