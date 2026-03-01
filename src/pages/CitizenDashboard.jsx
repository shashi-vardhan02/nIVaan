import React, { useState, useEffect } from 'react'
import {
    PlusCircle,
    Search,
    Clock,
    CheckCircle2,
    AlertCircle,
    Bell,
    User,
    LogOut,
    ChevronRight,
    MapPin,
    Zap,
    Droplets,
    Flame,
    Building2,
    PhoneCall
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import VoiceAssistant from '../components/VoiceAssistant'

const CitizenDashboard = ({ t, language, setLanguage, onRaiseComplaint, onTrackProgress, onLogout, locationGranted, setLocationGranted, userName }) => {
    const [isCheckingLocation, setIsCheckingLocation] = useState(true)
    const [selectedDept, setSelectedDept] = useState('Electricity')
    const [searchQuery, setSearchQuery] = useState('')
    const [showProfileMenu, setShowProfileMenu] = useState(false)

    const departments = [
        { id: 'Electricity', icon: <Zap size={24} />, color: '#fbbf24', label: t('dashboard.depts.electricity'), desc: t('dashboard.depts.electricityDesc') },
        { id: 'Water', icon: <Droplets size={24} />, color: '#3b82f6', label: t('dashboard.depts.water'), desc: t('dashboard.depts.waterDesc') },
        { id: 'Gas', icon: <Flame size={24} />, color: '#ef4444', label: t('dashboard.depts.gas'), desc: t('dashboard.depts.gasDesc') },
        { id: 'Municipality', icon: <Building2 size={24} />, color: '#10b981', label: t('dashboard.depts.municipality'), desc: t('dashboard.depts.municipalityDesc') }
    ]

    const issues = {
        'Electricity': [
            { id: 'e1', label: 'Power Outage', desc: 'Report a total blackout affecting your entire neighborhood or street.' },
            { id: 'e2', label: 'Street Light Failure', desc: 'Report non-functional public street lights or flickering hazard lights.' },
            { id: 'e3', label: 'Sparking Wires', desc: 'High Priority: Report dangerous electrical infrastructure issues.' },
            { id: 'e4', label: 'Billing Issue', desc: 'Dispute excessive charges or report calculation errors on your bill.' }
        ],
        'Water': [
            { id: 'w1', label: 'No Water Supply', desc: 'Total interruption of water service to your premises.' },
            { id: 'w2', label: 'Major Pipe Leakage', desc: 'Visible water gushing from public distribution lines.' },
            { id: 'w3', label: 'Low Water Pressure', desc: 'Inadequate flow preventing normal usage.' },
            { id: 'w4', label: 'Water Quality Issue', desc: 'Discoloration, odor, or particles in the water supply.' }
        ],
        'Gas': [
            { id: 'g1', label: 'Gas Leakage', desc: 'Emergency: Smell of gas or visible damage to pipelines.' },
            { id: 'g2', label: 'Supply Interruption', desc: 'Loss of gas flow to your home or business.' },
            { id: 'g3', label: 'Meter Malfunction', desc: 'Display issues or suspected inaccurate readings.' },
            { id: 'g4', label: 'New Connection', desc: 'Apply for a new domestic or commercial connection.' }
        ],
        'Municipality': [
            { id: 'm1', label: 'Garbage Collection', desc: 'Missed pickup or overflow in public dumpsters.' },
            { id: 'm2', label: 'Pothole Repair', desc: 'Dangerous road conditions needing immediate filling.' },
            { id: 'm3', label: 'Drainage Clog', desc: 'Street flooding or overflowing sewage systems.' },
            { id: 'm4', label: 'Park Maintenance', desc: 'Broken equipment or overgrown vegetation in public parks.' }
        ]
    }

    useEffect(() => {
        // Simulate location check
        const timer = setTimeout(() => {
            setIsCheckingLocation(false)
        }, 1500)
        return () => clearTimeout(timer)
    }, [])

    const requestLocation = () => {
        setIsCheckingLocation(true)
        // Simulate permission grant
        setTimeout(() => {
            setLocationGranted(true)
            setIsCheckingLocation(false)
        }, 1000)
    }

    if (!locationGranted) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)', padding: '2rem' }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card"
                    style={{ maxWidth: '450px', width: '100%', padding: '3rem', borderRadius: '2rem', textAlign: 'center' }}
                >
                    <div style={{ width: '80px', height: '80px', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                        <MapPin size={40} />
                    </div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '1rem' }}>{t('location.title')}</h2>
                    <p style={{ color: 'var(--muted-foreground)', marginBottom: '2.5rem', lineHeight: '1.6' }}>
                        {t('location.description')}
                    </p>
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        <button
                            className="btn btn-primary"
                            onClick={requestLocation}
                            disabled={isCheckingLocation}
                            style={{ height: '3.5rem', fontSize: '1rem' }}
                        >
                            {isCheckingLocation ? 'Requesting Access...' : t('location.allow')}
                        </button>
                    </div>
                </motion.div>
            </div>
        )
    }

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
            {/* Header */}
            <nav style={{
                background: 'white',
                padding: '0.75rem 4rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid #e2e8f0',
                position: 'sticky',
                top: 0,
                zIndex: 50
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '32px', height: '32px', background: 'var(--primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                            <Building2 size={20} />
                        </div>
                        <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a' }}>nIVaan</span>
                    </div>
                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                        <button onClick={onRaiseComplaint} style={{ background: 'none', border: 'none', fontWeight: '600', color: '#64748b', cursor: 'pointer' }}>{t('header.fileComplaint')}</button>
                        <button style={{ background: 'none', border: 'none', fontWeight: '600', color: 'var(--primary)', borderBottom: '2px solid var(--primary)', padding: '0.5rem 0', cursor: 'pointer' }}>{t('header.dashboard')}</button>
                        <button onClick={onTrackProgress} style={{ background: 'none', border: 'none', fontWeight: '600', color: '#64748b', cursor: 'pointer' }}>{t('header.trackStatus')}</button>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input
                            placeholder="Search services..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ background: '#f1f5f9', border: 'none', borderRadius: '8px', padding: '0.6rem 1rem 0.6rem 2.8rem', width: '200px', fontSize: '0.9rem' }}
                        />
                    </div>

                    {/* Language Switcher */}
                    <div style={{ display: 'flex', background: '#f1f5f9', padding: '0.2rem', borderRadius: '0.5rem' }}>
                        {['en', 'hi', 'te'].map(lang => (
                            <button
                                key={lang}
                                onClick={() => setLanguage(lang)}
                                style={{
                                    border: 'none',
                                    background: language === lang ? 'white' : 'transparent',
                                    padding: '0.2rem 0.6rem',
                                    borderRadius: '0.3rem',
                                    cursor: 'pointer',
                                    fontSize: '0.7rem',
                                    fontWeight: '700',
                                    color: language === lang ? 'var(--primary)' : '#64748b'
                                }}
                            >
                                {lang.toUpperCase()}
                            </button>
                        ))}
                    </div>

                    <div style={{ position: 'relative' }}>
                        <div
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingLeft: '1rem', borderLeft: '1px solid #e2e8f0', cursor: 'pointer' }}
                        >
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0f172a' }}>{userName}</div>
                                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{t('header.citizenAccount')}</div>
                            </div>
                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid white', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                <User size={20} color="var(--primary)" />
                            </div>
                        </div>

                        <AnimatePresence>
                            {showProfileMenu && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    style={{
                                        position: 'absolute',
                                        top: '120%',
                                        right: 0,
                                        width: '200px',
                                        background: 'white',
                                        borderRadius: '1rem',
                                        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                                        border: '1px solid #e2e8f0',
                                        padding: '0.5rem',
                                        zIndex: 100
                                    }}
                                >
                                    <button style={{ width: '100%', padding: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem', border: 'none', background: 'none', borderRadius: '0.5rem', color: '#0f172a', fontWeight: '600', cursor: 'pointer' }}>
                                        <User size={18} color="#64748b" /> {t('header.editProfile')}
                                    </button>
                                    <div style={{ height: '1px', background: '#f1f5f9', margin: '0.25rem 0' }}></div>
                                    <button
                                        onClick={onLogout}
                                        style={{ width: '100%', padding: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem', border: 'none', background: 'none', borderRadius: '0.5rem', color: '#ef4444', fontWeight: '600', cursor: 'pointer' }}
                                    >
                                        <LogOut size={18} /> {t('header.signOut')}
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </nav>

            <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 4rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
                    <div>
                        <div style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '0.5rem' }}>{t('header.dashboard')} › <span style={{ color: '#0f172a', fontWeight: '600' }}>{t('common.next')}</span></div>
                        <h1 style={{ fontSize: '2.25rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem' }}>{t('dashboard.welcome')}</h1>
                        <p style={{ color: '#64748b' }}>{t('dashboard.identifyIssue')}</p>
                    </div>
                    {/* Location Toggle */}
                    <div
                        onClick={() => setLocationGranted(!locationGranted)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.75rem 1.25rem',
                            background: locationGranted ? '#dcfce7' : '#fee2e2',
                            borderRadius: '1rem',
                            cursor: 'pointer',
                            transition: 'var(--transition)',
                            border: '1px solid ' + (locationGranted ? '#86efac' : '#fecaca')
                        }}
                        title={locationGranted ? t('dashboard.disableLocation') : t('dashboard.enableLocation')}
                    >
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: locationGranted ? '#22c55e' : '#ef4444' }}></div>
                        <span style={{ fontSize: '0.85rem', fontWeight: '700', color: locationGranted ? '#166534' : '#991b1b' }}>
                            {locationGranted ? t('dashboard.locationEnabled') : t('dashboard.locationDisabled')}
                        </span>
                        <MapPin size={16} color={locationGranted ? '#166534' : '#991b1b'} />
                    </div>
                </div>

                {/* Section 1: Select Department */}
                <section style={{ marginBottom: '3rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        <div style={{ width: '4px', height: '24px', background: 'var(--primary)', borderRadius: '2px' }}></div>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a' }}>{t('dashboard.selectDept')}</h2>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
                        {departments.filter(d =>
                            d.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            d.desc.toLowerCase().includes(searchQuery.toLowerCase())
                        ).map(dept => (
                            <motion.div
                                key={dept.id}
                                whileHover={{ y: -5 }}
                                onClick={() => setSelectedDept(dept.id)}
                                style={{
                                    padding: '1.5rem',
                                    borderRadius: '1rem',
                                    background: 'white',
                                    border: selectedDept === dept.id ? `2px solid var(--primary)` : '1px solid #e2e8f0',
                                    cursor: 'pointer',
                                    boxShadow: selectedDept === dept.id ? '0 10px 15px -3px rgba(59, 130, 246, 0.1)' : 'none',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '12px',
                                    background: selectedDept === dept.id ? 'rgba(59, 130, 246, 0.1)' : '#f8fafc',
                                    color: selectedDept === dept.id ? 'var(--primary)' : dept.color,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: '1rem'
                                }}>
                                    {dept.icon}
                                </div>
                                <h3 style={{ fontWeight: '700', marginBottom: '0.5rem', color: '#0f172a' }}>{dept.label}</h3>
                                <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: '1.5' }}>{dept.desc}</p>
                                {selectedDept === dept.id && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: '700', marginTop: '1rem' }}>
                                        <CheckCircle2 size={14} /> Selected
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Section 2: Identify Specific Issue */}
                <section style={{ marginBottom: '4rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ width: '4px', height: '24px', background: 'var(--primary)', borderRadius: '2px' }}></div>
                            <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a' }}>{t('dashboard.identifyIssue')}</h2>
                        </div>
                        <div style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)', fontSize: '0.75rem', fontWeight: '800', padding: '0.3rem 0.8rem', borderRadius: '1rem', textTransform: 'uppercase' }}>
                            {selectedDept}
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
                        {issues[selectedDept].map(issue => (
                            <motion.div
                                key={issue.id}
                                whileHover={{ x: 5 }}
                                onClick={() => onRaiseComplaint({ department: selectedDept, category: issue.label })}
                                style={{
                                    padding: '1.25rem',
                                    borderRadius: '1rem',
                                    background: 'white',
                                    border: '1px solid #e2e8f0',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    height: '160px'
                                }}
                            >
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                        <div style={{ color: '#94a3b8' }}><AlertCircle size={20} /></div>
                                        <ChevronRight size={18} color="#94a3b8" />
                                    </div>
                                    <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>{issue.label}</h4>
                                    <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: '1.4' }}>{issue.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            onClick={() => onRaiseComplaint({ department: selectedDept, category: 'Select Category' })}
                            style={{
                                padding: '1.25rem',
                                borderRadius: '1rem',
                                background: 'white',
                                border: '1px dashed #cbd5e1',
                                cursor: 'pointer',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                textAlign: 'center',
                                height: '160px'
                            }}
                        >
                            <div style={{ color: '#94a3b8', marginBottom: '0.5rem' }}>•••</div>
                            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0f172a' }}>{t('dashboard.otherIssue')}</h4>
                            <p style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', marginTop: '0.2rem' }}>{t('dashboard.issueNotListed')}</p>
                        </motion.div>
                    </div>
                </section>

                {/* Emergency Services */}
                <div style={{ background: 'rgba(59, 130, 246, 0.05)', borderRadius: '1.5rem', padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(59, 130, 246, 0.1)' }}>
                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                        <div style={{ width: '56px', height: '56px', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <PhoneCall size={24} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.25rem' }}>Emergency Services</h3>
                            <p style={{ fontSize: '0.9rem', color: '#64748b', maxWidth: '600px' }}>
                                If this is a life-threatening emergency or involves immediate public danger, please call the 24/7 Civic Emergency Helpline at <strong style={{ color: '#0f172a' }}>1122</strong> immediately.
                            </p>
                        </div>
                    </div>
                    <button className="btn btn-primary" style={{ padding: '0.8rem 2rem', borderRadius: '12px' }}>Call Helpline</button>
                </div>

                {/* Voice Assistant Overlay */}
                <VoiceAssistant
                    t={t}
                    language={language}
                    userName={userName}
                    onRaiseComplaint={onRaiseComplaint}
                />
            </main>

            {/* Footer */}
            <footer style={{ background: 'white', borderTop: '1px solid #e2e8f0', padding: '4rem 4rem 2rem', marginTop: '4rem' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '4rem' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                            <div style={{ width: '28px', height: '28px', background: 'var(--primary)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                                <Building2 size={16} />
                            </div>
                            <span style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a' }}>nIVaan</span>
                        </div>
                        <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.6', maxWidth: '300px' }}>
                            Empowering citizens through digital governance. Faster resolution, transparent tracking, better cities.
                        </p>
                    </div>
                    <div>
                        <h4 style={{ fontSize: '0.85rem', fontWeight: '800', color: '#0f172a', textTransform: 'uppercase', marginBottom: '1.5rem', letterSpacing: '0.05em' }}>Quick Links</h4>
                        <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '0.75rem' }}>
                            <li><a href="#" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.9rem' }}>Privacy Policy</a></li>
                            <li><a href="#" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.9rem' }}>Citizen Rights Charter</a></li>
                            <li><a href="#" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.9rem' }}>Open Data Portal</a></li>
                            <li><a href="#" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.9rem' }}>Accessibility Statement</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 style={{ fontSize: '0.85rem', fontWeight: '800', color: '#0f172a', textTransform: 'uppercase', marginBottom: '1.5rem', letterSpacing: '0.05em' }}>Connect With Us</h4>
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', cursor: 'pointer' }}>
                                <Search size={18} />
                            </div>
                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', cursor: 'pointer' }}>
                                <Bell size={18} />
                            </div>
                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', cursor: 'pointer' }}>
                                <User size={18} />
                            </div>
                        </div>
                        <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>© 2024 nIVaan Platform. Official Government of City resource.</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default CitizenDashboard
