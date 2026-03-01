import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, X, Send, User, Bot, AlertTriangle, CheckCircle2, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const VoiceAssistant = ({ t, language, userName, onRaiseComplaint }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [messages, setMessages] = useState([]);
    const [step, setStep] = useState('greeting'); // greeting, category, area, duration, name, phone, confirm
    const [collectedData, setCollectedData] = useState({
        department: '',
        category: '',
        location: '',
        duration: '',
        fullName: userName || '',
        phoneNumber: '',
        description: ''
    });
    const [inputValue, setInputValue] = useState('');

    const recognitionRef = useRef(null);
    const synthesisRef = useRef(window.speechSynthesis);
    const chatEndRef = useRef(null);

    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = language === 'hi' ? 'hi-IN' : language === 'te' ? 'te-IN' : 'en-US';

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                handleUserInput(transcript);
                setIsListening(false);
            };

            recognitionRef.current.onerror = (event) => {
                console.error('Speech recognition error', event.error);
                setIsListening(false);
            };
        }
    }, [language]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const speak = (text) => {
        if (!synthesisRef.current) return;
        synthesisRef.current.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = language === 'hi' ? 'hi-IN' : language === 'te' ? 'te-IN' : 'en-US';
        synthesisRef.current.speak(utterance);
    };

    const addMessage = (text, sender) => {
        setMessages(prev => [...prev, { text, sender, id: Date.now() }]);
    };

    const startAssistant = () => {
        setIsOpen(true);
        const greeting = t('assistant.greeting');
        addMessage(greeting, 'bot');
        speak(greeting);
        setStep('category');
    };

    const handleUserInput = (input) => {
        if (!input?.trim()) return;
        addMessage(input, 'user');
        processStep(input);
        setInputValue('');
    };

    const processStep = (input) => {
        const lowerInput = input.toLowerCase();

        switch (step) {
            case 'category':
                let detectedCategory = '';
                let detectedDept = '';

                if (lowerInput.includes('water') || lowerInput.includes('पानी') || lowerInput.includes('నీరు')) {
                    detectedDept = 'Water';
                    detectedCategory = 'No Water Supply';
                } else if (lowerInput.includes('electricity') || lowerInput.includes('power') || lowerInput.includes('बिजली') || lowerInput.includes('విద్యుత్')) {
                    detectedDept = 'Electricity';
                    detectedCategory = 'Power Outage';
                } else if (lowerInput.includes('gas') || lowerInput.includes('गैस') || lowerInput.includes('గ్యాస్')) {
                    detectedDept = 'Gas';
                    detectedCategory = 'Gas Leakage';
                } else if (lowerInput.includes('municipality') || lowerInput.includes('garbage') || lowerInput.includes('कचरा') || lowerInput.includes('మున్సిపాలిటీ')) {
                    detectedDept = 'Municipality';
                    detectedCategory = 'Garbage Collection';
                }

                if (detectedDept) {
                    setCollectedData(prev => ({ ...prev, department: detectedDept, category: detectedCategory }));
                    const response = t('assistant.askArea').replace('{{category}}', detectedDept);
                    addMessage(response, 'bot');
                    speak(response);

                    // Add Smart Suggestion
                    const suggestion = t(`assistant.suggestions.${detectedDept.toLowerCase()}`);
                    if (suggestion) {
                        setTimeout(() => addMessage(suggestion, 'bot-suggestion'), 500);
                    }

                    setStep('area');
                } else {
                    const retry = "I'm sorry, I didn't quite catch the department. Could you please specify if it's about Electricity, Water, Gas, or Municipality?";
                    addMessage(retry, 'bot');
                    speak(retry);
                }
                break;

            case 'area':
                setCollectedData(prev => ({ ...prev, location: input }));
                const durationPrompt = t('assistant.askDuration');
                addMessage(durationPrompt, 'bot');
                speak(durationPrompt);
                setStep('duration');
                break;

            case 'duration':
                setCollectedData(prev => ({ ...prev, duration: input, description: `Issue reported since ${input} in area ${collectedData.location}.` }));
                const namePrompt = t('assistant.askName');
                addMessage(namePrompt, 'bot');
                speak(namePrompt);
                setStep('name');
                break;

            case 'name':
                setCollectedData(prev => ({ ...prev, fullName: input }));
                const phonePrompt = t('assistant.askPhone');
                addMessage(phonePrompt, 'bot');
                speak(phonePrompt);
                setStep('phone');
                break;

            case 'phone':
                setCollectedData(prev => ({ ...prev, phoneNumber: input }));
                const confirmMsg = "I have collected all details. Please review the summary below and click Submit to register your complaint.";
                addMessage(confirmMsg, 'bot');
                speak(confirmMsg);
                setStep('confirm');
                break;

            default:
                break;
        }
    };

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
        } else {
            recognitionRef.current?.start();
            setIsListening(true);
        }
    };

    const handleSubmit = () => {
        onRaiseComplaint({
            ...collectedData,
            dateSubmitted: new Date().toLocaleDateString()
        });
        const successMsg = t('assistant.success');
        addMessage(successMsg, 'bot');
        speak(successMsg);
        setTimeout(() => setIsOpen(false), 3000);
    };

    return (
        <>
            {/* FAB */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={startAssistant}
                style={{
                    position: 'fixed',
                    bottom: '2rem',
                    right: '2rem',
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'var(--primary)',
                    color: 'white',
                    border: 'none',
                    boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.4)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}
            >
                <div style={{ position: 'relative' }}>
                    <Mic size={28} />
                    <motion.div
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        style={{
                            position: 'absolute',
                            top: -10,
                            left: -10,
                            right: -10,
                            bottom: -10,
                            borderRadius: '50%',
                            background: 'white',
                            zIndex: -1
                        }}
                    />
                </div>
            </motion.button>

            {/* Assistant Interface */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 100, scale: 0.9 }}
                        style={{
                            position: 'fixed',
                            bottom: '6rem',
                            right: '2rem',
                            width: '400px',
                            maxHeight: '600px',
                            background: 'white',
                            borderRadius: '1.5rem',
                            boxShadow: '0 20px 50px -12px rgba(0,0,0,0.15)',
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                            zIndex: 1001,
                            border: '1px solid #e2e8f0'
                        }}
                    >
                        {/* Header */}
                        <div style={{ background: 'var(--primary)', padding: '1.25rem', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{ width: '32px', height: '32px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Bot size={20} />
                                </div>
                                <span style={{ fontWeight: '700' }}>nIVaan Assistant</span>
                            </div>
                            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                                <X size={20} />
                            </button>
                        </div>

                        {/* Chat Body */}
                        <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', background: '#f8fafc' }}>
                            {messages.map((msg) => (
                                <div key={msg.id} style={{ display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                                    {msg.sender === 'bot-suggestion' ? (
                                        <div style={{ background: '#fff7ed', border: '1px solid #ffedd5', padding: '1rem', borderRadius: '1rem', maxWidth: '90%', display: 'flex', gap: '0.75rem' }}>
                                            <AlertTriangle size={18} color="#f97316" style={{ flexShrink: 0 }} />
                                            <p style={{ fontSize: '0.85rem', color: '#9a3412', lineHeight: '1.5' }}>{msg.text}</p>
                                        </div>
                                    ) : (
                                        <div style={{
                                            padding: '0.75rem 1rem',
                                            borderRadius: '1rem',
                                            maxWidth: '85%',
                                            fontSize: '0.9rem',
                                            lineHeight: '1.5',
                                            background: msg.sender === 'user' ? 'var(--primary)' : 'white',
                                            color: msg.sender === 'user' ? 'white' : '#0f172a',
                                            boxShadow: msg.sender === 'user' ? '0 4px 6px -1px rgba(59, 130, 246, 0.1)' : '0 1px 3px rgba(0,0,0,0.05)',
                                            border: msg.sender === 'user' ? 'none' : '1px solid #e2e8f0'
                                        }}>
                                            {msg.text}
                                        </div>
                                    )}
                                </div>
                            ))}

                            {/* Summary Card */}
                            {step === 'confirm' && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    style={{ background: 'white', border: '2px solid #e2e8f0', borderRadius: '1rem', padding: '1.25rem', marginTop: '1rem' }}
                                >
                                    <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <CheckCircle2 size={14} color="var(--primary)" /> {t('assistant.summaryTitle')}
                                    </div>
                                    <div style={{ display: 'grid', gap: '0.75rem', fontSize: '0.85rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ color: '#64748b' }}>Department:</span>
                                            <span style={{ fontWeight: '700', color: '#0f172a' }}>{collectedData.department}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ color: '#64748b' }}>Area:</span>
                                            <span style={{ fontWeight: '700', color: '#0f172a' }}>{collectedData.location}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ color: '#64748b' }}>Reporter:</span>
                                            <span style={{ fontWeight: '700', color: '#0f172a' }}>{collectedData.fullName}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ color: '#64748b' }}>Phone:</span>
                                            <span style={{ fontWeight: '700', color: '#0f172a' }}>{collectedData.phoneNumber}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleSubmit}
                                        className="btn btn-primary"
                                        style={{ width: '100%', marginTop: '1.25rem', padding: '0.75rem', fontSize: '0.9rem' }}
                                    >
                                        Register Complaint
                                    </button>
                                </motion.div>
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Input Area */}
                        <div style={{ padding: '1.25rem', background: 'white', borderTop: '1px solid #e2e8f0' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleUserInput(inputValue)}
                                    placeholder="Type your message..."
                                    style={{
                                        flex: 1,
                                        padding: '0.75rem 1rem',
                                        borderRadius: '0.75rem',
                                        border: '1px solid #e2e8f0',
                                        fontSize: '0.9rem',
                                        outline: 'none'
                                    }}
                                />
                                <button
                                    onClick={() => handleUserInput(inputValue)}
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        background: 'var(--primary)',
                                        color: 'white',
                                        border: 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <motion.button
                                    animate={isListening ? { scale: [1, 1.2, 1] } : {}}
                                    transition={{ repeat: isListening ? Infinity : 0, duration: 1 }}
                                    onClick={toggleListening}
                                    style={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '50%',
                                        background: isListening ? '#ef4444' : '#f1f5f9',
                                        color: isListening ? 'white' : '#64748b',
                                        border: 'none',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    {isListening ? <MicOff size={24} /> : <Mic size={24} />}
                                </motion.button>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '0.85rem', fontWeight: '600', color: isListening ? '#ef4444' : '#64748b' }}>
                                        {isListening ? t('assistant.listening') : t('assistant.tapToSpeak')}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                                        Voice guidance enabled
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default VoiceAssistant;
