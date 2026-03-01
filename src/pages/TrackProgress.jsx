import React, { useState } from 'react'
import {
    Search,
    ChevronRight,
    CheckCircle2,
    Clock,
    MapPin,
    User,
    LogOut,
    Phone,
    MessageSquare,
    Info,
    ArrowLeft,
    Building2,
    Bell,
    Navigation,
    ShieldCheck,
    Download,
    Share2
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { jsPDF } from 'jspdf'

const TrackProgress = ({ t, language, setLanguage, onBack, onRaiseComplaint, onLogout, userName, complaintData }) => {
    const [showProfileMenu, setShowProfileMenu] = useState(false)
    const [searchId, setSearchId] = useState('')

    // New state for fetching from backend
    const [complaintList, setComplaintList] = useState([])
    const [selectedComplaint, setSelectedComplaint] = useState(null)
    const [loading, setLoading] = useState(true)

    React.useEffect(() => {
        const fetchUserComplaints = async () => {
            setLoading(true)
            try {
                const token = localStorage.getItem('token')
                const res = await fetch('http://localhost:8080/api/complaints', {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                if (res.ok) {
                    const data = await res.json()
                    // Map backend data to frontend expected format
                    const formatted = data.map(c => ({
                        id: c.id,
                        status: c.status,
                        dateSubmitted: new Date(c.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                        department: c.department,
                        category: c.category,
                        priority: c.priority,
                        address: c.location_address,
                        officer: {
                            name: c.assignee !== 'Not Assigned' ? c.assignee : 'Pending Assignment',
                            role: 'Dept Official'
                        },
                        history: [
                            {
                                title: t('history.submitted'),
                                date: new Date(c.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
                                desc: t('history.submittedDesc'),
                                completed: true
                            },
                            {
                                title: c.status === 'Resolved' ? 'Resolved' : t('history.assigned'),
                                date: c.status === 'Resolved' ? new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : '--',
                                desc: c.status === 'Resolved' ? 'Issue has been resolved' : t('history.assignedDesc'),
                                active: c.status !== 'Resolved',
                                subText: c.status !== 'Resolved' ? t('status.pending') : ''
                            }
                        ]
                    }))
                    // Sort so newest is first (assuming larger ID or sorting by date)
                    formatted.reverse()
                    setComplaintList(formatted)

                    // Priority selection: passed complaintData > first in list > null
                    if (complaintData && formatted.find(c => c.id === complaintData.id)) {
                        setSelectedComplaint(formatted.find(c => c.id === complaintData.id))
                        setSearchId(complaintData.id)
                    } else if (formatted.length > 0) {
                        setSelectedComplaint(formatted[0])
                        setSearchId(formatted[0].id)
                    }
                }
            } catch (err) {
                console.error("Failed to fetch complaints:", err)
            } finally {
                setLoading(false)
            }
        }
        fetchUserComplaints()
    }, [complaintData, t])

    const downloadReceipt = () => {
        if (!selectedComplaint) return
        const doc = new jsPDF()

        doc.setFillColor(59, 130, 246)
        doc.rect(0, 0, 210, 40, 'F')
        doc.setTextColor(255, 255, 255)
        doc.setFontSize(24)
        doc.text("nIVaan Status Report", 105, 25, { align: 'center' })

        doc.setTextColor(0, 0, 0)
        doc.setFontSize(16)
        doc.text("Complaint Tracking Details", 20, 60)

        doc.setFontSize(11)
        doc.text(`Reference ID: ${selectedComplaint.id}`, 20, 75)
        doc.text(`Current Status: ${selectedComplaint.status}`, 20, 83)
        doc.text(`Date Submitted: ${selectedComplaint.dateSubmitted}`, 20, 91)
        doc.text(`Department: ${selectedComplaint.department}`, 20, 99)
        doc.text(`Category: ${selectedComplaint.category}`, 20, 107)
        doc.text(`Priority: ${selectedComplaint.priority}`, 20, 115)

        doc.setFontSize(12)
        doc.text("Location Details:", 20, 130)
        doc.setFontSize(10)
        doc.text(`Address: ${selectedComplaint.address || 'Detected Location'}`, 20, 138, { maxWidth: 170 })

        // Evidence Image (Fallback to original complaintData if viewing the actively submitted one)
        const viewingActive = selectedComplaint.id === complaintData?.id
        if (viewingActive && complaintData.evidence?.photo) {
            try {
                doc.addPage()
                doc.setFontSize(16)
                doc.text("Evidence Image", 20, 20)
                doc.addImage(complaintData.evidence.photo, 'JPEG', 20, 30, 170, 120)
            } catch (e) {
                console.error("Could not add image to PDF", e)
            }
        }

        const offices = {
            'Electricity': {
                name: 'State Electricity Board HQ',
                address: 'Power Bhavan, Bengaluru, KA 560001',
                contact: '+91 80 2222 1111',
                hours: 'Mon - Sat: 09:00 AM - 05:30 PM'
            },
            'Water': {
                name: 'Jal Board Main Office',
                address: 'Water Works, Bengaluru, KA 560002',
                contact: '+91 80 2333 2222',
                hours: 'Mon - Fri: 10:00 AM - 06:00 PM'
            },
            'Gas': {
                name: 'Petronet Gas Distribution Center',
                address: 'Energy Park, Bengaluru, KA 560003',
                contact: '+91 80 2444 3333',
                hours: 'Mon - Sun: 08:00 AM - 10:00 PM'
            },
            'Municipality': {
                name: 'City Municipal Corporation HQ',
                address: 'Civic Plaza, Bengaluru, KA 560004',
                contact: '+91 80 2555 4444',
                hours: 'Mon - Sat: 10:00 AM - 05:30 PM'
            }
        }
        const office = offices[selectedComplaint.department] || offices['Municipality']

        doc.setFontSize(12)
        doc.text("Routing Information:", 20, 155)
        doc.setFontSize(10)
        doc.text(`Office: ${office.name}`, 20, 163)
        doc.text(`Address: ${office.address}`, 20, 169)
        doc.text(`Contact: ${office.contact}`, 20, 175)

        doc.setDrawColor(200, 200, 200)
        doc.line(20, 270, 190, 270)

        doc.setFontSize(9)
        doc.setTextColor(100, 100, 100)
        doc.text("Report generated on: " + new Date().toLocaleString(), 105, 280, { align: 'center' })
        doc.text("© 2024 nIVaan Public Service Portal", 105, 285, { align: 'center' })

        doc.save(`nivaan_status_${selectedComplaint.id}.pdf`)
    }

    const shareStatus = async () => {
        if (!selectedComplaint) return
        const shareData = {
            title: 'nIVaan Complaint Status',
            text: `Reference ID: ${selectedComplaint.id}\nStatus: ${selectedComplaint.status}\nDepartment: ${selectedComplaint.department}\nCategory: ${selectedComplaint.category || 'N/A'}\n\nTrack progress on nIVaan portal!`,
            url: window.location.origin
        }

        try {
            if (navigator.share) {
                await navigator.share(shareData)
            } else {
                await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`)
                alert('Status details copied to clipboard!')
            }
        } catch (err) {
            console.error('Error sharing:', err)
        }
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
                        <button onClick={onBack} style={{ background: 'none', border: 'none', fontWeight: '600', color: '#64748b', cursor: 'pointer' }}>{t('header.dashboard')}</button>
                        <button style={{ background: 'none', border: 'none', fontWeight: '600', color: 'var(--primary)', borderBottom: '2px solid var(--primary)', padding: '0.5rem 0', cursor: 'pointer' }}>{t('header.trackStatus')}</button>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
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

            <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '3rem 2rem' }}>
                <div style={{ marginBottom: '2.5rem' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem' }}>{t('track.title')}</h1>
                    <p style={{ color: '#64748b' }}>{t('track.subtitle')}</p>
                </div>

                {/* Search Bar & Selector */}
                <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '1rem', background: 'white', border: '1px solid #e2e8f0', display: 'flex', gap: '1rem', marginBottom: '2.5rem', alignItems: 'center' }}>
                    <div style={{ flex: 1, display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        {complaintList.length > 0 && (
                            <select
                                value={selectedComplaint?.id || ''}
                                onChange={(e) => {
                                    const c = complaintList.find(x => x.id === e.target.value);
                                    if (c) {
                                        setSelectedComplaint(c);
                                        setSearchId(c.id);
                                    }
                                }}
                                style={{
                                    padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: '600', color: 'var(--primary)', flexShrink: 0
                                }}
                            >
                                {complaintList.map(c => (
                                    <option key={c.id} value={c.id}>{c.id} ({c.department})</option>
                                ))}
                            </select>
                        )}
                        <div style={{ position: 'relative', flex: 1 }}>
                            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input
                                placeholder={t('track.searchPlaceholder')}
                                value={searchId}
                                onChange={(e) => setSearchId(e.target.value)}
                                style={{ width: '100%', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.8rem 1rem 0.8rem 3rem', fontSize: '1rem' }}
                            />
                        </div>
                    </div>
                    <button
                        className="btn btn-primary"
                        style={{ padding: '0.8rem 2rem', borderRadius: '8px' }}
                        onClick={() => {
                            const found = complaintList.find(c => c.id.toLowerCase() === searchId.toLowerCase());
                            if (found) setSelectedComplaint(found);
                            else alert("Complaint ID not found in your records.");
                        }}
                    >
                        <Navigation size={18} /> {t('track.trackButton')}
                    </button>
                </div>

                {loading ? (
                    <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                        <div style={{ color: '#64748b', fontSize: '1.2rem', fontWeight: '600' }}>Loading your complaints...</div>
                    </div>
                ) : !selectedComplaint ? (
                    <div style={{ padding: '4rem 2rem', textAlign: 'center', background: 'white', borderRadius: '1.5rem', border: '1px dashed #cbd5e1' }}>
                        <div style={{ width: '64px', height: '64px', background: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                            <Bell size={24} color="#94a3b8" />
                        </div>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.75rem' }}>No active complaints found</h2>
                        <p style={{ color: '#64748b', marginBottom: '2rem', maxWidth: '400px', marginInline: 'auto' }}>
                            You haven't submitted any complaints yet. Your submitted issues will appear here for tracking.
                        </p>
                        <button
                            onClick={onRaiseComplaint}
                            className="btn btn-primary"
                            style={{ borderRadius: '12px', padding: '0.8rem 2rem' }}
                        >
                            File Your First Complaint
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '2rem' }}>
                        {/* Left Side: Summary & History */}
                        <div style={{ display: 'grid', gap: '2rem' }}>
                            {/* Summary Card */}
                            <div className="glass-card" style={{ padding: '2rem', borderRadius: '1rem', background: 'white', border: '1px solid #e2e8f0' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.25rem' }}>{t('track.refNumber')}</div>
                                        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)' }}>{selectedComplaint.id}</h2>
                                    </div>
                                    <div style={{ background: '#dbeafe', color: 'var(--primary)', padding: '0.4rem 1rem', borderRadius: '2rem', fontSize: '0.85rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Clock size={16} /> {selectedComplaint.status}
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginBottom: '2rem' }}>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.25rem' }}>{t('track.dateSubmitted')}</div>
                                        <div style={{ fontWeight: '700', color: '#0f172a' }}>{selectedComplaint.dateSubmitted}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.25rem' }}>{t('track.categoryLabel')}</div>
                                        <div style={{ fontWeight: '700', color: '#0f172a' }}>{selectedComplaint.category}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.25rem' }}>{t('track.priorityLabel')}</div>
                                        <div style={{ fontWeight: '700', color: '#f97316', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                            <ShieldCheck size={16} /> {selectedComplaint.priority}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem' }}>
                                    <button onClick={downloadReceipt} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', color: '#0f172a', fontWeight: '600', cursor: 'pointer' }}>
                                        <Download size={18} /> Download Receipt
                                    </button>
                                    <button onClick={shareStatus} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', color: '#0f172a', fontWeight: '600', cursor: 'pointer' }}>
                                        <Share2 size={18} /> Share Status
                                    </button>
                                </div>
                            </div>

                            {/* Activity History */}
                            <div className="glass-card" style={{ padding: '2rem', borderRadius: '1rem', background: 'white', border: '1px solid #e2e8f0' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
                                    <Clock size={20} color="var(--primary)" />
                                    <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a' }}>{t('track.historyTitle')}</h2>
                                </div>

                                <div style={{ position: 'relative' }}>
                                    {/* Timeline Line */}
                                    <div style={{ position: 'absolute', left: '16px', top: '10px', bottom: '10px', width: '2px', background: '#f1f5f9' }}></div>

                                    <div style={{ display: 'grid', gap: '2.5rem' }}>
                                        {selectedComplaint.history.map((item, i) => (
                                            <div key={i} style={{ display: 'flex', gap: '1.5rem', position: 'relative' }}>
                                                <div style={{
                                                    width: '34px',
                                                    height: '34px',
                                                    borderRadius: '50%',
                                                    background: item.completed ? '#22c55e' : (item.active ? '#3b82f6' : 'white'),
                                                    border: item.completed || item.active ? 'none' : '2px solid #e2e8f0',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: 'white',
                                                    zIndex: 1
                                                }}>
                                                    {item.completed ? <CheckCircle2 size={18} /> : (item.active ? <Navigation size={18} fill="white" /> : <div style={{ width: '8px', height: '8px', background: '#e2e8f0', borderRadius: '50%' }}></div>)}
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                                                        <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0f172a' }}>{item.title}</h3>
                                                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', background: '#f8fafc', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>{item.date}</div>
                                                    </div>
                                                    <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: item.active ? '0.75rem' : 0 }}>{item.desc}</p>
                                                    {item.active && item.subText && (
                                                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.75rem', background: '#eff6ff', borderRadius: '6px', color: '#3b82f6', fontSize: '0.8rem', fontWeight: '600' }}>
                                                            <User size={14} /> {item.subText}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Officer & Help */}
                        <div style={{ display: 'grid', gap: '2rem', height: 'fit-content' }}>
                            {/* Assigned Officer */}
                            <div className="glass-card" style={{ padding: '2rem', borderRadius: '1rem', background: 'white', border: '1px solid #e2e8f0' }}>
                                <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '1.5rem' }}>{t('track.assignedOfficer')}</div>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <User size={24} color="white" />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: '700', color: '#0f172a' }}>{selectedComplaint.officer.name}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{selectedComplaint.officer.role}</div>
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gap: '0.75rem' }}>
                                    <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', fontSize: '0.85rem', background: '#eff6ff', border: 'none', color: '#3b82f6' }}>
                                        <MessageSquare size={16} /> {t('track.contactDept')}
                                    </button>
                                    <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', fontSize: '0.85rem' }}>
                                        <Phone size={16} /> {t('track.callHelpline')}
                                    </button>
                                </div>
                            </div>

                            {/* Routing To Card (Dynamic) */}
                            {(() => {
                                const offices = {
                                    'Electricity': {
                                        name: 'State Electricity Board HQ',
                                        address: 'Power Bhavan, Bengaluru, KA 560001',
                                        contact: '+91 80 2222 1111',
                                        hours: 'Mon - Sat: 09:00 AM - 05:30 PM'
                                    },
                                    'Water': {
                                        name: 'Jal Board Main Office',
                                        address: 'Water Works, Bengaluru, KA 560002',
                                        contact: '+91 80 2333 2222',
                                        hours: 'Mon - Fri: 10:00 AM - 06:00 PM'
                                    },
                                    'Gas': {
                                        name: 'Petronet Gas Distribution Center',
                                        address: 'Energy Park, Bengaluru, KA 560003',
                                        contact: '+91 80 2444 3333',
                                        hours: 'Mon - Sun: 08:00 AM - 10:00 PM'
                                    },
                                    'Municipality': {
                                        name: 'City Municipal Corporation HQ',
                                        address: 'Civic Plaza, Bengaluru, KA 560004',
                                        contact: '+91 80 2555 4444',
                                        hours: 'Mon - Sat: 10:00 AM - 05:30 PM'
                                    }
                                }
                                const office = offices[selectedComplaint.department] || offices['Municipality']

                                return (
                                    <div className="glass-card" style={{ padding: '2rem', borderRadius: '1rem', background: 'white', border: '1px solid #e2e8f0' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                            <Building2 size={20} color="var(--primary)" />
                                            <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a' }}>{t('routing.title')}</h2>
                                        </div>
                                        <div style={{ display: 'grid', gap: '1rem' }}>
                                            <div>
                                                <div style={{ fontSize: '0.7rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.2rem' }}>{t('routing.officeName')}</div>
                                                <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f172a' }}>{office.name}</div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                                <MapPin size={16} color="#64748b" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
                                                <div>
                                                    <div style={{ fontSize: '0.7rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.2rem' }}>{t('routing.address')}</div>
                                                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{office.address}</div>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                                <Phone size={16} color="#64748b" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
                                                <div>
                                                    <div style={{ fontSize: '0.7rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.2rem' }}>{t('routing.contact')}</div>
                                                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{office.contact}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })()}

                            {/* Need Help Card */}
                            <div style={{ padding: '2rem', borderRadius: '1rem', background: '#eff6ff', position: 'relative', overflow: 'hidden' }}>
                                <div style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', width: '32px', height: '32px', background: '#3b82f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                                    <Info size={18} />
                                </div>
                                <div style={{ marginTop: '2.5rem' }}>
                                    <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.75rem' }}>{t('track.needHelp')}</h3>
                                    <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                                        {t('track.helpSubtitle')}
                                    </p>
                                    <a href="#" style={{ color: '#3b82f6', fontSize: '0.85rem', fontWeight: '700', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        {t('track.viewFaqs')} <ChevronRight size={16} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}

export default TrackProgress
