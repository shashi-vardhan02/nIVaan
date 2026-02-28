import React, { useState } from 'react'
import { ChevronLeft, Building2, UserCircle, Lock, ShieldCheck } from 'lucide-react'
import { motion } from 'framer-motion'

const AdminLogin = ({ t, language, setLanguage, onLogin, onBack }) => {
    const departments = ['Electricity', 'Gas', 'Water', 'Municipality']
    const [selectedDept, setSelectedDept] = useState('')

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
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card"
                style={{ maxWidth: '450px', width: '100%', padding: '2.5rem', borderRadius: '1.5rem' }}
            >
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{
                        width: '64px',
                        height: '64px',
                        background: 'var(--secondary)',
                        color: 'white',
                        borderRadius: '1.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.5rem auto'
                    }}>
                        <ShieldCheck size={32} />
                    </div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.5rem' }}>{t('loginSelection.admin')} Portal</h2>
                    <p style={{ color: 'var(--muted-foreground)' }}>Official Department Login</p>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); onLogin(); }} style={{ display: 'grid', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>
                            Select Department
                        </label>
                        <div style={{ position: 'relative' }}>
                            <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)' }}>
                                <Building2 size={18} />
                            </span>
                            <select
                                className="form-input"
                                style={{ paddingLeft: '3rem', appearance: 'none' }}
                                value={selectedDept}
                                onChange={(e) => setSelectedDept(e.target.value)}
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
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>
                            Admin ID / Official Email
                        </label>
                        <div style={{ position: 'relative' }}>
                            <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)' }}>
                                <UserCircle size={18} />
                            </span>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Ex: ADMIN-12345"
                                style={{ paddingLeft: '3rem' }}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>
                            Password
                        </label>
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

                    <button type="submit" className="btn" style={{
                        width: '100%',
                        padding: '1rem',
                        marginTop: '0.5rem',
                        background: 'var(--secondary)',
                        color: 'white'
                    }}>
                        {t('common.login')}
                    </button>
                </form>

                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                        <Lock size={12} /> This is a secured government administrative portal.
                    </p>
                </div>
            </motion.div>
        </div>
    )
}

export default AdminLogin
