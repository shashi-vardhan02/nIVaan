import React, { useState } from 'react'
import { translations } from './utils/translations'
import LandingPage from './pages/LandingPage'
import LoginSelection from './pages/LoginSelection'
import CitizenLogin from './pages/CitizenLogin'
import AdminLogin from './pages/AdminLogin'
import CitizenDashboard from './pages/CitizenDashboard'
import AdminDashboard from './pages/AdminDashboard'
import RegisterComplaint from './pages/RegisterComplaint'
import ComplaintSubmitted from './pages/ComplaintSubmitted'
import EscalationView from './pages/EscalationView'

function App() {
  // Simple state-based routing for the demo/prototype
  const [currentScreen, setCurrentScreen] = useState('landing')
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
      case 'landing':
        return <LandingPage
          t={t}
          language={language}
          setLanguage={setLanguage}
          onLogin={() => navigate('login-selection')}
        />
      case 'login-selection':
        return <LoginSelection
          t={t}
          language={language}
          setLanguage={setLanguage}
          onSelectRole={(role) => {
            setUserRole(role)
            navigate(role === 'citizen' ? 'citizen-login' : 'admin-login')
          }}
          onBack={() => navigate('landing')}
        />
      case 'citizen-login':
        return <CitizenLogin
          t={t}
          language={language}
          setLanguage={setLanguage}
          onLogin={() => navigate('citizen-dashboard')}
          onBack={() => navigate('login-selection')}
        />

      case 'admin-login':
        return <AdminLogin
          t={t}
          language={language}
          setLanguage={setLanguage}
          onLogin={() => navigate('admin-dashboard')}
          onBack={() => navigate('login-selection')}
        />
      case 'citizen-dashboard':
        return <CitizenDashboard
          t={t}
          language={language}
          setLanguage={setLanguage}
          onRaiseComplaint={() => navigate('register-complaint')}
          onLogout={() => navigate('landing')}
        />
      case 'admin-dashboard':
        return <AdminDashboard
          t={t}
          language={language}
          setLanguage={setLanguage}
          onLogout={() => navigate('landing')}
          onViewEscalations={() => navigate('escalation')}
        />
      case 'register-complaint':
        return <RegisterComplaint
          t={t}
          language={language}
          setLanguage={setLanguage}
          onSubmit={(data) => {
            setComplaintData(data)
            navigate('complaint-submitted')
          }}
          onBack={() => navigate('citizen-dashboard')}
        />
      case 'complaint-submitted':
        return <ComplaintSubmitted
          t={t}
          language={language}
          setLanguage={setLanguage}
          data={complaintData}
          onHome={() => navigate('citizen-dashboard')}
        />

      case 'escalation':
        return <EscalationView
          t={t}
          language={language}
          setLanguage={setLanguage}
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
