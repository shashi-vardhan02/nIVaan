import React from 'react'
import { MapPin, Shield, ArrowRight, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'

const LocationPermission = ({ t, onContinue }) => {
    return (
        <div className="flex-center" style={{ minHeight: '100vh', padding: '2rem' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card"
                style={{
                    maxWidth: '450px',
                    width: '100%',
                    padding: '3rem 2rem',
                    textAlign: 'center',
                    borderRadius: '2rem'
                }}
            >
                <div style={{ marginBottom: '2.5rem' }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        background: 'var(--muted)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.5rem auto'
                    }}>
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/800px-Emblem_of_India.svg.png"
                            alt="Government Emblem"
                            style={{ width: '40px', height: 'auto' }}
                        />
                    </div>
                    <p style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        {t('landing.badge')}
                    </p>
                </div>

                <div style={{ marginBottom: '2.5rem' }}>
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
                        <MapPin size={32} />
                    </div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '1rem', lineHeight: '1.2' }}>
                        {t('location.title')}
                    </h1>
                    <p style={{ color: 'var(--muted-foreground)', lineHeight: '1.6' }}>
                        {t('location.description')}
                    </p>
                </div>

                <div style={{ display: 'grid', gap: '1rem' }}>
                    <button
                        className="btn btn-primary"
                        onClick={onContinue}
                        style={{ width: '100%', padding: '1rem' }}
                    >
                        {t('location.allow')} <ArrowRight size={18} />
                    </button>
                </div>

                <div style={{ marginTop: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>
                    <Shield size={16} />
                    <span>{t('location.privacy')}</span>
                </div>
            </motion.div>
        </div>
    )
}

export default LocationPermission
