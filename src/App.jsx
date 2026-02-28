import React, { useState } from 'react'
import { translations } from './utils/translations'
import LanguageSelection from './pages/LanguageSelection'
import LocationPermission from './pages/LocationPermission'
import LandingPage from './pages/LandingPage'
import LoginSelection from './pages/LoginSelection'
import CitizenLogin from './pages/CitizenLogin'
import CitizenRegister from './pages/CitizenRegister'
import AdminLogin from './pages/AdminLogin'
import CitizenDashboard from './pages/CitizenDashboard'
import AdminDashboard from './pages/AdminDashboard'
import RegisterComplaint from './pages/RegisterComplaint'
import ComplaintSubmitted from './pages/ComplaintSubmitted'
import TrackingTimeline from './pages/TrackingTimeline'
import ResolutionVerification from './pages/ResolutionVerification'
import ReComplaintPage from './pages/ReComplaintPage'
import EscalationView from './pages/EscalationView'

function App() {
  // Simple state-based routing for the demo/prototype
  const [currentScreen, setCurrentScreen] = useState('language')
  const [language, setLanguage] = useState('en')
  const [userRole, setUserRole] = useState(null) // 'citizen' or 'admin'
  const [complaintData, setComplaintData] = useState(null)

  // Translation helper
  const t = (path) => {
    const keys = path.split('.')
    let result = translations[language]
    for (const key of keys) {
      result = result?.[key]
    }
    return result || path
  }

  const navigate = (screen) => {
    window.scrollTo(0, 0)
    setCurrentScreen(screen)
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'language':
        return <LanguageSelection onSelect={(lang) => {
          setLanguage(lang)
          navigate('location')
        }} />
      case 'location':
        return <LocationPermission t={t} onContinue={() => navigate('landing')} />
      case 'landing':
        return <LandingPage
          t={t}
          onLogin={() => navigate('login-selection')}
          onTrack={() => navigate('tracking')}
        />
      case 'login-selection':
        return <LoginSelection
          t={t}
          onSelectRole={(role) => {
            setUserRole(role)
            navigate(role === 'citizen' ? 'citizen-login' : 'admin-login')
          }}
          onBack={() => navigate('landing')}
        />
      case 'citizen-login':
        return <CitizenLogin
          t={t}
          onLogin={() => navigate('citizen-dashboard')}
          onBack={() => navigate('login-selection')}
          onToggle={(screen) => navigate(screen)}
        />
      case 'citizen-register':
        return <CitizenRegister
          t={t}
          onToggle={() => navigate('citizen-login')}
          onRegisterSuccess={() => navigate('citizen-dashboard')}
        />
      case 'admin-login':
        return <AdminLogin
          t={t}
          onLogin={() => navigate('admin-dashboard')}
          onBack={() => navigate('login-selection')}
        />
      case 'citizen-dashboard':
        return <CitizenDashboard
          t={t}
          onRaiseComplaint={() => navigate('register-complaint')}
          onTrackComplaint={() => navigate('tracking')}
          onLogout={() => navigate('landing')}
        />
      case 'admin-dashboard':
        return <AdminDashboard
          t={t}
          onLogout={() => navigate('landing')}
          onViewEscalations={() => navigate('escalation')}
        />
      case 'register-complaint':
        return <RegisterComplaint
          t={t}
          onSubmit={(data) => {
            setComplaintData(data)
            navigate('complaint-submitted')
          }}
          onBack={() => navigate('citizen-dashboard')}
        />
      case 'complaint-submitted':
        return <ComplaintSubmitted
          t={t}
          data={complaintData}
          onTrack={() => navigate('tracking')}
          onHome={() => navigate('citizen-dashboard')}
        />
      case 'tracking':
        return <TrackingTimeline
          t={t}
          onBack={() => navigate(userRole === 'admin' ? 'admin-dashboard' : 'citizen-dashboard')}
          onVerify={() => navigate('resolution-verification')}
        />
      case 'resolution-verification':
        return <ResolutionVerification
          t={t}
          onResolved={() => navigate('citizen-dashboard')}
          onNotResolved={() => navigate('re-complaint')}
        />
      case 're-complaint':
        return <ReComplaintPage
          t={t}
          onSubmit={() => navigate('complaint-submitted')}
          onBack={() => navigate('resolution-verification')}
        />
      case 'escalation':
        return <EscalationView
          t={t}
          onBack={() => navigate('admin-dashboard')}
        />
      default:
        return <LandingPage t={t} onLogin={() => navigate('login-selection')} />
    }
  }

  return (
    <div className="app-container">
      {renderScreen()}
    </div>
  )
}

export default App
