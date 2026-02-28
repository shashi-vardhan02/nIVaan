import React from 'react'
import { Languages, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'

const LanguageSelection = ({ onSelect }) => {
    const languages = [
        { code: 'en', name: 'English', native: 'English' },
        { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
        { code: 'te', name: 'Telugu', native: 'తెలుగు' }
    ]

    return (
        <div className="flex-center" style={{ minHeight: '100vh', padding: '2rem', background: 'var(--background)' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card"
                style={{
                    maxWidth: '500px',
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
                        background: 'var(--primary-glow)',
                        color: 'var(--primary)',
                        borderRadius: '1.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.5rem auto'
                    }}>
                        <Languages size={40} />
                    </div>
                    <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '1rem' }}>Choose Your Language</h1>
                    <p style={{ color: 'var(--muted-foreground)', lineHeight: '1.6' }}>
                        Select your preferred language to continue with the Nivaan Public Service Portal.
                    </p>
                </div>

                <div style={{ display: 'grid', gap: '1rem' }}>
                    {languages.map((lang) => (
                        <motion.button
                            key={lang.code}
                            whileHover={{ scale: 1.02, x: 5 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onSelect(lang.code)}
                            className="btn"
                            style={{
                                width: '100%',
                                padding: '1.25rem 1.5rem',
                                justifyContent: 'space-between',
                                background: 'white',
                                border: '1px solid var(--border)',
                                color: 'var(--foreground)',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                            }}
                        >
                            <div style={{ textAlign: 'left' }}>
                                <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>{lang.native}</div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>{lang.name}</div>
                            </div>
                            <ChevronRight size={20} color="var(--primary)" />
                        </motion.button>
                    ))}
                </div>

                <div style={{ marginTop: '2.5rem', fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
                    You can change your language later in settings.
                </div>
            </motion.div>
        </div>
    )
}

export default LanguageSelection
