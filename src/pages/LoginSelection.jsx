import React from 'react'
import { User, ShieldCheck, ChevronLeft, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

const LoginSelection = ({ t, onSelectRole, onBack }) => {
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
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ maxWidth: '600px', width: '100%', textAlign: 'center' }}
            >
                <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem' }}>{t('loginSelection.title')}</h1>
                <p style={{ color: 'var(--muted-foreground)', marginBottom: '3rem', fontSize: '1.1rem' }}>
                    {t('loginSelection.desc')}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                    {/* Citizen Role */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        onClick={() => onSelectRole('citizen')}
                        className="glass-card"
                        style={{
                            padding: '2.5rem',
                            borderRadius: '2rem',
                            cursor: 'pointer',
                            border: '2px solid transparent',
                        }}
                    >
                        <div style={{
                            width: '64px',
                            height: '64px',
                            background: 'var(--primary-glow)',
                            color: 'var(--primary)',
                            borderRadius: '1.25rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1.5rem auto'
                        }}>
                            <User size={32} />
                        </div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>{t('loginSelection.citizen')}</h2>
                        <p style={{ color: 'var(--muted-foreground)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                            {t('loginSelection.citizenDesc')}
                        </p>
                        <div style={{ color: 'var(--primary)', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            {t('common.login')} <ArrowRight size={16} />
                        </div>
                    </motion.div>

                    {/* Admin Role */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        onClick={() => onSelectRole('admin')}
                        className="glass-card"
                        style={{
                            padding: '2.5rem',
                            borderRadius: '2rem',
                            cursor: 'pointer',
                            border: '2px solid transparent',
                        }}
                    >
                        <div style={{
                            width: '44px',
                            height: '44px',
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
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>{t('loginSelection.admin')}</h2>
                        <p style={{ color: 'var(--muted-foreground)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                            {t('loginSelection.adminDesc')}
                        </p>
                        <div style={{ color: 'var(--secondary)', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            {t('common.login')} <ArrowRight size={16} />
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    )
}

export default LoginSelection
