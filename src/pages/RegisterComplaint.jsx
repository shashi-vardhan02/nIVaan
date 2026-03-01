import React, { useState, useRef, useEffect } from 'react'
import {
    ChevronLeft,
    MapPin,
    Camera,
    Upload,
    Building2,
    Phone,
    Clock,
    Send,
    FileText,
    Image,
    Paperclip,
    ExternalLink,
    User,
    LogOut,
    Search
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const RegisterComplaint = ({ t, language, setLanguage, onSubmit, onBack, onTrackProgress, onLogout, initialData, userName, userLocation, userAddress, locationError }) => {
    const [loading, setLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    const [formData, setFormData] = useState({
        fullName: userName || 'Alex Johnson',
        phoneNumber: '+91 98765 43210',
        department: initialData?.department || 'Electricity',
        category: initialData?.category || 'Select Category',
        description: '',
        location: '12, Vidhana Soudha, Bengaluru, KA'
    })

    const [evidence, setEvidence] = useState({ photo: null, file: null, face: null, idCard: null })
    const [showProfileMenu, setShowProfileMenu] = useState(false)
    const [isCameraOpen, setIsCameraOpen] = useState(false)
    const [captureMode, setCaptureMode] = useState('face') // 'face' or 'idCard'
    const videoRef = useRef(null)
    const canvasRef = useRef(null)
    const cameraInputRef = useRef(null)
    const fileInputRef = useRef(null)

    const startCamera = async () => {
        setIsCameraOpen(true)
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
            if (videoRef.current) {
                videoRef.current.srcObject = stream
            }
        } catch (err) {
            console.error("Error accessing camera: ", err)
            alert("Unable to access camera. Please check permissions.")
            setIsCameraOpen(false)
        }
    }

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks()
            tracks.forEach(track => track.stop())
        }
        setIsCameraOpen(false)
    }

    const capturePhoto = () => {
        const video = videoRef.current
        const canvas = canvasRef.current
        if (video && canvas) {
            canvas.width = video.videoWidth
            canvas.height = video.videoHeight
            canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height)
            const dataUrl = canvas.toDataURL('image/jpeg')
            setEvidence(prev => ({
                ...prev,
                [captureMode]: { data: dataUrl, name: `${captureMode}_capture_${Date.now()}.jpg` }
            }))
            stopCamera()
        }
    }

    useEffect(() => {
        if (userAddress) {
            setFormData(prev => ({ ...prev, location: userAddress }));
        }
    }, [userAddress]);

    useEffect(() => {
        if (userName) {
            setFormData(prev => ({ ...prev, fullName: userName }))
        }
    }, [userName])

    const handleFileChange = (type, e) => {
        const file = e.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setEvidence(prev => ({ ...prev, [type]: { data: reader.result, name: file.name } }))
            }
            reader.readAsDataURL(file)
        }
    }

    const removeEvidence = (type, e) => {
        e.stopPropagation();
        setEvidence(prev => ({ ...prev, [type]: null }));
    }

    const departments = ['Electricity', 'Water', 'Gas', 'Municipality']
    const categoriesMap = {
        'Electricity': t('categories.electricity', { returnObjects: true }),
        'Water': t('categories.water', { returnObjects: true }),
        'Gas': t('categories.gas', { returnObjects: true }),
        'Municipality': t('categories.municipality', { returnObjects: true })
    }

    useEffect(() => {
        if (initialData) {
            setFormData(prev => ({
                ...prev,
                department: initialData.department || 'Electricity',
                category: initialData.issue || ''
            }))
        }
    }, [initialData])

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
                        <button style={{ background: 'none', border: 'none', fontWeight: '600', color: 'var(--primary)', borderBottom: '2px solid var(--primary)', padding: '0.5rem 0', cursor: 'pointer' }}>{t('header.fileComplaint')}</button>
                        <button onClick={onBack} style={{ background: 'none', border: 'none', fontWeight: '600', color: '#64748b', cursor: 'pointer' }}>{t('header.dashboard')}</button>
                        <button onClick={onTrackProgress} style={{ background: 'none', border: 'none', fontWeight: '600', color: '#64748b', cursor: 'pointer' }}>{t('header.trackStatus')}</button>
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

            <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2.5rem 4rem' }}>
                <div style={{ marginBottom: '2.5rem' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem' }}>{t('complaint.title')}</h1>
                    <p style={{ color: '#64748b' }}>{t('complaint.subtitle')}</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '2.5rem', alignItems: 'start' }}>
                    {/* Left Column: Form */}
                    <div className="glass-card" style={{ padding: '2.5rem', borderRadius: '1.25rem', background: 'white', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                            <FileText size={20} color="var(--primary)" />
                            <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a' }}>{t('complaint.detailsTitle')}</h2>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>{t('complaint.fullName')}</label>
                                <input
                                    className="form-input"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>{t('complaint.phone')}</label>
                                <input
                                    className="form-input"
                                    value={formData.phoneNumber}
                                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>{t('complaint.location')}</label>
                            <div style={{ position: 'relative' }}>
                                <MapPin size={16} color="var(--primary)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#f8fafc', padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                    <MapPin size={18} color="var(--primary)" />
                                    <span style={{ fontSize: '1rem', color: '#0f172a', fontWeight: '500', flex: 1 }}>{userAddress || t('complaint.location')}</span>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>{t('complaint.department')}</label>
                                    <select
                                        value={formData.department}
                                        onChange={(e) => setFormData({ ...formData, department: e.target.value, category: '' })}
                                        style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', color: '#0f172a' }}
                                    >
                                        <option value="">Select Department</option>
                                        {departments.map(dept => (
                                            <option key={dept} value={dept}>{t(`dashboard.depts.${dept.toLowerCase()}`)}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>{t('complaint.category')}</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', color: '#0f172a' }}
                                    >
                                        <option value="">Select Category</option>
                                        {(categoriesMap[formData.department] || []).map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>{t('complaint.description')}</label>
                                <textarea
                                    className="form-input"
                                    style={{ minHeight: '120px', resize: 'none' }}
                                    placeholder={t('complaint.descriptionPlaceholder')}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div style={{ marginBottom: '2.5rem' }}>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>{t('complaint.evidence')}</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    capture="environment"
                                    ref={cameraInputRef}
                                    style={{ display: 'none' }}
                                    onChange={(e) => handleFileChange('photo', e)}
                                />
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                    onChange={(e) => handleFileChange('file', e)}
                                />
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div
                                        onClick={() => cameraInputRef.current.click()}
                                        style={{ border: '2px dashed #e2e8f0', borderRadius: '0.75rem', padding: '1.5rem', textAlign: 'center', cursor: 'pointer', background: evidence.photo ? '#f0f9ff' : 'transparent', borderColor: evidence.photo ? 'var(--primary)' : '#e2e8f0', position: 'relative' }}
                                    >
                                        {evidence.photo && (
                                            <button
                                                onClick={(e) => removeEvidence('photo', e)}
                                                style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '10px' }}
                                            >
                                                ✕
                                            </button>
                                        )}
                                        <Camera size={24} color={evidence.photo ? 'var(--primary)' : "#94a3b8"} style={{ margin: '0 auto 0.5rem' }} />
                                        <div style={{ fontSize: '0.85rem', color: evidence.photo ? '#0f172a' : '#64748b', fontWeight: evidence.photo ? '700' : '400', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {evidence.photo ? evidence.photo.name : t('complaint.uploadPhoto')}
                                        </div>
                                    </div>
                                    <div
                                        onClick={() => fileInputRef.current.click()}
                                        style={{ border: '2px dashed #e2e8f0', borderRadius: '0.75rem', padding: '1.5rem', textAlign: 'center', cursor: 'pointer', background: evidence.file ? '#f0f9ff' : 'transparent', borderColor: evidence.file ? 'var(--primary)' : '#e2e8f0', position: 'relative' }}
                                    >
                                        {evidence.file && (
                                            <button
                                                onClick={(e) => removeEvidence('file', e)}
                                                style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '10px' }}
                                            >
                                                ✕
                                            </button>
                                        )}
                                        <Paperclip size={24} color={evidence.file ? 'var(--primary)' : "#94a3b8"} style={{ margin: '0 auto 0.5rem' }} />
                                        <div style={{ fontSize: '0.85rem', color: evidence.file ? '#0f172a' : '#64748b', fontWeight: evidence.file ? '700' : '400', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {evidence.file ? evidence.file.name : t('complaint.attachFile')}
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <button
                                className="btn btn-primary"
                                disabled={loading}
                                style={{ width: '100%', padding: '1.1rem', borderRadius: '12px', fontSize: '1rem', opacity: loading ? 0.7 : 1 }}
                                onClick={async () => {
                                    setLoading(true)
                                    try {
                                        const token = localStorage.getItem('token')
                                        const priorityVal = (formData.category === 'Sparking Wires' || formData.category === 'Gas Leakage') ? 'Critical' : 'Medium'

                                        const res = await fetch('http://localhost:8080/api/complaints', {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json',
                                                'Authorization': `Bearer ${token}`
                                            },
                                            body: JSON.stringify({
                                                category: formData.category || 'General',
                                                department: formData.department,
                                                priority: priorityVal,
                                                description: formData.description,
                                                location_lat: userLocation ? userLocation.lat.toString() : null,
                                                location_lng: userLocation ? userLocation.lng.toString() : null,
                                                location_address: formData.location
                                            })
                                        })

                                        if (res.ok) {
                                            const savedData = await res.json()
                                            onSubmit({ ...formData, evidence, backend_id: savedData.id, status: savedData.status })
                                        } else {
                                            alert('Failed to submit complaint. Make sure you are logged in.')
                                        }
                                    } catch (err) {
                                        console.error(err)
                                        alert('Unable to connect to server.')
                                    } finally {
                                        setLoading(false)
                                    }
                                }}
                            >
                                {loading ? 'Submitting...' : t('complaint.submit')} {!loading && <Send size={18} style={{ marginLeft: '0.5rem' }} />}
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Routing & Map */}
                    <div style={{ display: 'grid', gap: '2rem', position: 'sticky', top: '2.5rem' }}>
                        {/* Routing Card */}
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
                            const office = offices[formData.department] || offices['Municipality']

                            return (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="glass-card"
                                    style={{ padding: '2rem', borderRadius: '1.5rem', background: 'white', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                                        <div style={{ padding: '0.6rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px' }}>
                                            <Building2 size={24} color="var(--primary)" />
                                        </div>
                                        <div>
                                            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>{t('routing.title')}</h2>
                                            <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>Assigned handling office</p>
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gap: '1.25rem' }}>
                                        <div style={{ padding: '1.25rem', background: '#f8fafc', borderRadius: '1rem', border: '1px solid #f1f5f9' }}>
                                            <div style={{ fontSize: '0.7rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>{t('routing.officeName')}</div>
                                            <div style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--primary)', lineHeight: '1.3' }}>{office.name}</div>
                                        </div>

                                        <div style={{ display: 'flex', gap: '1rem', padding: '0.5rem' }}>
                                            <div style={{ width: '36px', height: '36px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                <MapPin size={18} color="#64748b" />
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '0.7rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.25rem' }}>{t('routing.address')}</div>
                                                <div style={{ fontSize: '0.9rem', color: '#475569', fontWeight: '500' }}>{office.address}</div>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', gap: '1rem', padding: '0.5rem' }}>
                                            <div style={{ width: '36px', height: '36px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                <Phone size={18} color="#64748b" />
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '0.7rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.25rem' }}>{t('routing.contact')}</div>
                                                <div style={{ fontSize: '0.9rem', color: '#475569', fontWeight: '500' }}>{office.contact}</div>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', gap: '1rem', padding: '0.5rem' }}>
                                            <div style={{ width: '36px', height: '36px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                <Clock size={18} color="#64748b" />
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '0.7rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.25rem' }}>{t('routing.workingHours')}</div>
                                                <div style={{ fontSize: '0.9rem', color: '#475569', fontWeight: '500' }}>{office.hours}</div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        })()}

                        {/* Map Card */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="glass-card"
                            style={{ padding: '0', borderRadius: '1.5rem', background: 'white', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', height: '400px' }}
                        >
                            <div style={{ padding: '1.25rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                    <MapPin size={18} color="#10b981" />
                                    <span style={{ fontSize: '0.9rem', fontWeight: '800', color: '#0f172a' }}>ROUTING MAP</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.6rem', background: '#ecfdf5', borderRadius: '20px' }}>
                                    <div style={{ width: '6px', height: '6px', background: '#10b981', borderRadius: '50%' }}></div>
                                    <span style={{ fontSize: '0.65rem', fontWeight: '800', color: '#10b981' }}>LIVE ROUTE</span>
                                </div>
                            </div>
                            <div style={{ width: '100%', height: 'calc(100% - 3.5rem)', background: '#f8fafc', position: 'relative' }}>
                                {locationError ? (
                                    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
                                        <div style={{ width: '48px', height: '48px', background: '#fee2e2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                                            <MapPin size={24} color="#ef4444" />
                                        </div>
                                        <div style={{ color: '#991b1b', fontWeight: '700', marginBottom: '0.5rem' }}>Location Access Denied</div>
                                        <div style={{ color: '#b91c1c', fontSize: '0.85rem' }}>{locationError}</div>
                                    </div>
                                ) : userLocation ? (
                                    <iframe
                                        title="Routing Map"
                                        width="100%"
                                        height="100%"
                                        style={{ border: 'none' }}
                                        srcDoc={`
                                            <!DOCTYPE html>
                                            <html>
                                            <head>
                                                <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
                                                <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
                                                <style>
                                                    body { margin: 0; }
                                                    #map { height: 100vh; width: 100vw; }
                                                    .leaflet-container { background: #f1f5f9; }
                                                </style>
                                            </head>
                                            <body>
                                                <div id="map"></div>
                                                <script>
                                                    const map = L.map('map', { zoomControl: false }).setView([${userLocation.lat}, ${userLocation.lng}], 15);
                                                    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                                                        attribution: '&copy; OpenStreetMap'
                                                    }).addTo(map);
                                                    L.marker([${userLocation.lat}, ${userLocation.lng}]).addTo(map)
                                                        .bindPopup('<b>Your Location</b>')
                                                        .openPopup();
                                                </script>
                                            </body>
                                            </html>
                                            `}
                                    />
                                ) : (
                                    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                                        <MapPin size={32} color="#94a3b8" />
                                        <p style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: '600' }}>Waiting for location…</p>
                                    </div>
                                )}
                                <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', background: 'white', padding: '0.4rem 0.8rem', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', fontSize: '0.65rem', fontWeight: '700', color: '#64748b', pointerEvents: 'none' }}>
                                    Leaflet | © OpenStreetMap
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                <AnimatePresence>
                    {isCameraOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{
                                position: 'fixed',
                                inset: 0,
                                background: 'rgba(15, 23, 42, 0.9)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 1000,
                                padding: '2rem'
                            }}
                        >
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.95, opacity: 0 }}
                                style={{
                                    background: 'white',
                                    borderRadius: '1.5rem',
                                    width: '100%',
                                    maxWidth: '500px',
                                    overflow: 'hidden',
                                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                                }}
                            >
                                <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                                            {captureMode === 'face' ? 'Capture Selfie' : 'Capture Face with ID'}
                                        </h3>
                                        <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
                                            {captureMode === 'face' ? 'Please look directly at the camera' : 'Hold your ID clearly next to your face'}
                                        </p>
                                    </div>
                                    <button onClick={stopCamera} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        ✕
                                    </button>
                                </div>

                                <div style={{ position: 'relative', background: 'black', aspectRatio: '4/3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <video ref={videoRef} autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    <canvas ref={canvasRef} style={{ display: 'none' }} />

                                    {/* Overlay Guides */}
                                    <div style={{ position: 'absolute', inset: '2rem', border: '2px dashed rgba(255, 255, 255, 0.5)', borderRadius: '1rem', pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {captureMode === 'face' ? (
                                            <div style={{ width: '60%', height: '70%', border: '2px solid rgba(255, 255, 255, 0.8)', borderRadius: '50%' }}></div>
                                        ) : (
                                            <div style={{ width: '80%', height: '40%', border: '2px solid rgba(255, 255, 255, 0.8)', borderRadius: '8px', marginTop: 'auto', marginBottom: '10%' }}></div>
                                        )}
                                    </div>
                                </div>

                                <div style={{ padding: '1.5rem', display: 'flex', gap: '1rem' }}>
                                    <button
                                        onClick={stopCamera}
                                        style={{ flex: 1, padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', fontWeight: '700', color: '#64748b', cursor: 'pointer' }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={capturePhoto}
                                        style={{ flex: 1.5, padding: '1rem', borderRadius: '12px', border: 'none', background: 'var(--primary)', fontWeight: '700', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                                    >
                                        <Camera size={20} /> Capture Now
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </main>
            <footer style={{ borderTop: '1px solid #e2e8f0', padding: '2rem 4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', marginTop: '4rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Building2 size={18} color="#94a3b8" />
                    <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>nIVaan Portal © 2024</span>
                </div>
                <div style={{ display: 'flex', gap: '2rem' }}>
                    <a href="#" style={{ textDecoration: 'none', color: '#64748b', fontSize: '0.85rem' }}>Privacy Policy</a>
                    <a href="#" style={{ textDecoration: 'none', color: '#64748b', fontSize: '0.85rem' }}>Terms of Service</a>
                    <a href="#" style={{ textDecoration: 'none', color: '#64748b', fontSize: '0.85rem' }}>Contact Support</a>
                </div>
            </footer>
        </div >
    )
}

export default RegisterComplaint
