import React, { useState } from 'react'
import {
    ChevronLeft,
    MapPin,
    Camera,
    Video,
    Upload,
    X,
    CheckCircle2,
    Navigation,
    FileText,
    AlertCircle
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const RegisterComplaint = ({ t, language, setLanguage, onSubmit, onBack }) => {
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState({
        department: '',
        category: '',
        description: '',
        location: 'Detecting...',
        files: []
    })

    const departments = ['Electricity', 'Water', 'Gas', 'Municipality']
    const categories = {
        'Electricity': ['Power Outage', 'Street Light Not Working', 'High Voltage Issue', 'Meter Fault'],
        'Water': ['No Water Supply', 'Pipe Leakage', 'Contaminated Water', 'Billing Issue'],
        'Gas': ['Gas Leakage', 'Supply Interruption', 'New Connection Request', 'Meter Issue'],
        'Municipality': ['Garbage Collection', 'Pothole Repair', 'Pest Control', 'Public Infrastructure']
    }

    const handleNext = () => setStep(step + 1)
    const handleBack = () => step > 1 ? setStep(step - 1) : onBack()

    return (
        <div style={{ minHeight: '100vh', background: 'var(--muted)', padding: '2rem' }}>
            <main style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <button
                        onClick={handleBack}
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
                    <div style={{ display: 'flex', background: 'var(--border)', padding: '0.2rem', borderRadius: '0.5rem' }}>
                        <button onClick={() => setLanguage('en')} style={{ border: 'none', background: language === 'en' ? 'white' : 'transparent', padding: '0.2rem 0.6rem', borderRadius: '0.3rem', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '700' }}>EN</button>
                        <button onClick={() => setLanguage('hi')} style={{ border: 'none', background: language === 'hi' ? 'white' : 'transparent', padding: '0.2rem 0.6rem', borderRadius: '0.3rem', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '700' }}>HI</button>
                        <button onClick={() => setLanguage('te')} style={{ border: 'none', background: language === 'te' ? 'white' : 'transparent', padding: '0.2rem 0.6rem', borderRadius: '0.3rem', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '700' }}>TE</button>
                    </div>
                </div>

                {/* Step Indicator */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '3rem' }}>
                    {[1, 2, 3].map((s) => (
                        <div key={s} style={{
                            flex: 1,
                            height: '4px',
                            background: s <= step ? 'var(--primary)' : 'var(--border)',
                            borderRadius: '2px',
                            transition: 'var(--transition)'
                        }}></div>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="glass-card"
                            style={{ padding: '3rem', borderRadius: '2rem' }}
                        >
                            <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.5rem' }}>Select Department & Issue</h2>
                            <p style={{ color: 'var(--muted-foreground)', marginBottom: '2.5rem' }}>Help us direct your complaint to the right team.</p>

                            <div style={{ display: 'grid', gap: '2rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '700' }}>Department</label>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                                        {departments.map(dept => (
                                            <button
                                                key={dept}
                                                onClick={() => setFormData({ ...formData, department: dept, category: '' })}
                                                style={{
                                                    padding: '1rem',
                                                    borderRadius: '1rem',
                                                    border: formData.department === dept ? '2px solid var(--primary)' : '1px solid var(--border)',
                                                    background: formData.department === dept ? 'var(--primary-glow)' : 'white',
                                                    color: formData.department === dept ? 'var(--primary)' : 'var(--foreground)',
                                                    fontWeight: '700',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s ease'
                                                }}
                                            >
                                                {dept}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {formData.department && (
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '700' }}>Problem Category</label>
                                        <select
                                            className="form-input"
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        >
                                            <option value="" disabled>Choose a category</option>
                                            {categories[formData.department].map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>

                            <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'flex-end' }}>
                                <button
                                    className="btn btn-primary"
                                    disabled={!formData.category}
                                    onClick={handleNext}
                                    style={{ padding: '1rem 3rem' }}
                                >
                                    {t('common.next')}
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="glass-card"
                            style={{ padding: '3rem', borderRadius: '2rem' }}
                        >
                            <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.5rem' }}>Describe the Issue</h2>
                            <p style={{ color: 'var(--muted-foreground)', marginBottom: '2.5rem' }}>Provide details and evidence to help us resolve it faster.</p>

                            <div style={{ display: 'grid', gap: '2rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '700' }}>Detailed Description</label>
                                    <textarea
                                        className="form-input"
                                        placeholder="Tell us what's wrong..."
                                        style={{ minHeight: '150px', padding: '1rem' }}
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    ></textarea>
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '700' }}>Add Proof (Optional)</label>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <div style={{
                                            flex: 1,
                                            padding: '2rem',
                                            border: '2px dashed var(--border)',
                                            borderRadius: '1rem',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            cursor: 'pointer',
                                            color: 'var(--muted-foreground)'
                                        }}>
                                            <Camera size={32} />
                                            <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>Take Photo</span>
                                        </div>
                                        <div style={{
                                            flex: 1,
                                            padding: '2rem',
                                            border: '2px dashed var(--border)',
                                            borderRadius: '1rem',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            cursor: 'pointer',
                                            color: 'var(--muted-foreground)'
                                        }}>
                                            <Upload size={32} />
                                            <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>Upload File</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '700' }}>Auto-Detected Location</label>
                                    <div style={{ padding: '1.25rem', background: 'var(--muted)', borderRadius: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <Navigation size={20} color="var(--primary)" />
                                        <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>Sector 45, North Extension, Metro City - 400012</span>
                                    </div>
                                </div>
                            </div>

                            <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'space-between' }}>
                                <button className="btn btn-secondary" onClick={handleBack} style={{ padding: '1rem 2rem' }}>{t('common.back')}</button>
                                <button
                                    className="btn btn-primary"
                                    disabled={!formData.description}
                                    onClick={handleNext}
                                    style={{ padding: '1rem 2.5rem' }}
                                >
                                    Final Review
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="glass-card"
                            style={{ padding: '3rem', borderRadius: '2rem' }}
                        >
                            <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.5rem' }}>Review & Submit</h2>
                            <p style={{ color: 'var(--muted-foreground)', marginBottom: '2.5rem' }}>Please verify the details before final submission.</p>

                            <div style={{ display: 'grid', gap: '1.5rem', background: 'var(--muted)', padding: '2rem', borderRadius: '1.5rem', marginBottom: '2.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                                    <span style={{ color: 'var(--muted-foreground)', fontWeight: '600' }}>Department</span>
                                    <span style={{ fontWeight: '700' }}>{formData.department}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                                    <span style={{ color: 'var(--muted-foreground)', fontWeight: '600' }}>Category</span>
                                    <span style={{ fontWeight: '700' }}>{formData.category}</span>
                                </div>
                                <div>
                                    <span style={{ color: 'var(--muted-foreground)', fontWeight: '600', display: 'block', marginBottom: '0.5rem' }}>Description</span>
                                    <p style={{ fontSize: '0.9rem', lineHeight: '1.5', margin: 0 }}>{formData.description}</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '1.25rem', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)', borderRadius: '1rem' }}>
                                <AlertCircle size={24} style={{ flexShrink: 0 }} />
                                <p style={{ fontSize: '0.875rem', fontWeight: '600', margin: 0, lineHeight: '1.4' }}>
                                    By submitting, you confirm that the information provided is accurate and relevant to the selected department.
                                </p>
                            </div>

                            <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'space-between' }}>
                                <button className="btn btn-secondary" onClick={handleBack} style={{ padding: '1rem 2rem' }}>{t('common.back')}</button>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => onSubmit(formData)}
                                    style={{ padding: '1rem 3rem' }}
                                >
                                    Confirm & Submit
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    )
}

export default RegisterComplaint
