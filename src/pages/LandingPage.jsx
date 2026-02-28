import React from 'react'
import {
    Zap,
    Droplets,
    Flame,
    Building2,
    ArrowRight,
    CheckCircle2,
    Search,
    LogIn,
    Shield
} from 'lucide-react'
import { motion } from 'framer-motion'

const LandingPage = ({ t, language, setLanguage, onLogin }) => {
    const departments = [
        { name: 'Electricity', icon: <Zap size={28} />, color: 'var(--primary)' },
        { name: 'Water', icon: <Droplets size={28} />, color: 'var(--secondary)' },
        { name: 'Gas', icon: <Flame size={28} />, color: 'var(--accent)' },
        { name: 'Municipality', icon: <Building2 size={28} />, color: '#f59e0b' }
    ]

    const steps = [
        { title: 'Detect Location', desc: 'Auto-detects your nearest department office.' },
        { title: 'Raise Request', desc: 'Describe your issue with photo/video proof.' }
    ]

    return (
        <div style={{ background: 'var(--background)' }}>
            {/* Navigation */}
            <nav style={{
                padding: '1.5rem 2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'sticky',
                top: 0,
                zIndex: 100,
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                borderBottom: '1px solid var(--border)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        background: 'var(--grad-primary)',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white'
                    }}>
                        <Shield size={24} />
                    </div>
                    <span style={{ fontSize: '1.5rem', fontWeight: '800', tracking: '-0.02em', color: 'var(--primary)' }}>NIVAAN</span>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ display: 'flex', background: 'var(--muted)', padding: '0.25rem', borderRadius: '0.75rem', border: '1px solid var(--border)' }}>
                        <button
                            onClick={() => setLanguage('en')}
                            style={{
                                padding: '0.4rem 0.8rem',
                                borderRadius: '0.5rem',
                                border: 'none',
                                background: language === 'en' ? 'white' : 'transparent',
                                boxShadow: language === 'en' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                                cursor: 'pointer',
                                fontWeight: '600',
                                fontSize: '0.8rem',
                                color: language === 'en' ? 'var(--primary)' : 'var(--muted-foreground)'
                            }}
                        >EN</button>
                        <button
                            onClick={() => setLanguage('hi')}
                            style={{
                                padding: '0.4rem 0.8rem',
                                borderRadius: '0.5rem',
                                border: 'none',
                                background: language === 'hi' ? 'white' : 'transparent',
                                boxShadow: language === 'hi' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                                cursor: 'pointer',
                                fontWeight: '600',
                                fontSize: '0.8rem',
                                color: language === 'hi' ? 'var(--primary)' : 'var(--muted-foreground)'
                            }}
                        >हिंदी</button>
                        <button
                            onClick={() => setLanguage('te')}
                            style={{
                                padding: '0.4rem 0.8rem',
                                borderRadius: '0.5rem',
                                border: 'none',
                                background: language === 'te' ? 'white' : 'transparent',
                                boxShadow: language === 'te' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                                cursor: 'pointer',
                                fontWeight: '600',
                                fontSize: '0.8rem',
                                color: language === 'te' ? 'var(--primary)' : 'var(--muted-foreground)'
                            }}
                        >తెలుగు</button>
                    </div>
                    <button className="btn btn-primary" onClick={onLogin}><LogIn size={18} /> {t('landing.navLogin')}</button>
                </div>
            </nav>

            {/* Hero Section */}
            <section style={{ padding: '6rem 2rem', textAlign: 'center', maxWidth: '900px', margin: '0 auto' }}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <span style={{
                        background: 'var(--primary-glow)',
                        color: 'var(--primary)',
                        padding: '0.5rem 1rem',
                        borderRadius: '2rem',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        marginBottom: '1.5rem',
                        display: 'inline-block'
                    }}>
                        {t('landing.badge')}
                    </span>
                    <h1 style={{ fontSize: '4rem', fontWeight: '800', lineHeight: '1.1', marginBottom: '1.5rem', color: 'var(--foreground)' }}>
                        {t('landing.title1')} <br />
                        <span style={{ background: 'var(--grad-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            {t('landing.title2')}
                        </span>
                    </h1>
                    <p style={{ fontSize: '1.25rem', color: 'var(--muted-foreground)', marginBottom: '3rem', lineHeight: '1.6' }}>
                        {t('landing.heroDesc')}
                    </p>
                    <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
                        <button className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }} onClick={onLogin}>
                            {t('landing.getStarted')} <ArrowRight size={20} />
                        </button>
                    </div>
                </motion.div>
            </section>

            {/* Departments */}
            <section className="container" style={{ paddingBottom: '6rem' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '2rem' }}>{t('landing.deptTitle')}</h2>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '1.5rem'
                }}>
                    {departments.map((dept, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -10 }}
                            className="glass-card dept-card"
                            style={{ padding: '2.5rem', textAlign: 'center', borderRadius: '1.5rem' }}
                        >
                            <div className="dept-icon" style={{ margin: '0 auto 1.5rem auto', color: dept.color }}>
                                {dept.icon}
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>{dept.name}</h3>
                            <p style={{ color: 'var(--muted-foreground)', fontSize: '0.9rem' }}>Efficiency and transparency in solving local {dept.name.toLowerCase()} issues.</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* How it Works */}
            <section style={{ padding: '6rem 2rem', background: 'var(--muted)' }}>
                <div className="container">
                    <h2 style={{ textAlign: 'center', marginBottom: '4rem', fontSize: '2rem' }}>{t('landing.howItWorks')}</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
                        {steps.map((step, i) => (
                            <div key={i} style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                                <div style={{
                                    flexShrink: 0,
                                    width: '48px',
                                    height: '48px',
                                    background: 'var(--grad-primary)',
                                    color: 'white',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: '700',
                                    fontSize: '1.25rem'
                                }}>
                                    {i + 1}
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>{step.title}</h3>
                                    <p style={{ color: 'var(--muted-foreground)', lineHeight: '1.5' }}>{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer style={{ padding: '4rem 2rem', textAlign: 'center', borderTop: '1px solid var(--border)' }}>
                <p style={{ color: 'var(--muted-foreground)' }}>© 2026 Nivaan Platform. All rights reserved.</p>
            </footer>
        </div>
    )
}

export default LandingPage
