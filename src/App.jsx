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
import TrackProgress from './pages/TrackProgress'
import EscalationView from './pages/EscalationView'
import { useEffect } from 'react'

function App() {
  // Initialize state from localStorage for persistence
  const getInitialState = (key, defaultValue) => {
    const saved = localStorage.getItem(key)
    try {
      return saved ? JSON.parse(saved) : defaultValue
    } catch {
      return saved || defaultValue
    }
  }

  // Simple state-based routing for the demo/prototype
  const [currentScreen, setCurrentScreen] = useState(localStorage.getItem('currentScreen') || 'landing')
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en')
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole')) // 'citizen' or 'admin'
  const [userName, setUserName] = useState(getInitialState('userName', 'Alex Johnson'))
  const [complaintData, setComplaintData] = useState(getInitialState('complaintData', null))
  const [initialComplaintData, setInitialComplaintData] = useState(getInitialState('initialComplaintData', null))
  const [locationGranted, setLocationGranted] = useState(localStorage.getItem('locationGranted') === 'true')
  const [userLocation, setUserLocation] = useState(getInitialState('userLocation', null)) // { lat, lng }
  const [userAddress, setUserAddress] = useState(getInitialState('userAddress', null))
  const [locationError, setLocationError] = useState(null)

  // Make sure adminDept is always correctly lowercased if it was saved as capitalized
  const storedAdminDept = getInitialState('adminDept', 'electricity')
  const [adminDept, setAdminDept] = useState(storedAdminDept?.toLowerCase() || 'electricity')

  // Persist state to localStorage
  useEffect(() => {
    localStorage.setItem('currentScreen', currentScreen)
    localStorage.setItem('language', language)
    if (userRole) localStorage.setItem('userRole', userRole)
    localStorage.setItem('userName', JSON.stringify(userName))
    localStorage.setItem('locationGranted', locationGranted)
    if (complaintData) localStorage.setItem('complaintData', JSON.stringify(complaintData))
    if (initialComplaintData) localStorage.setItem('initialComplaintData', JSON.stringify(initialComplaintData))
    if (userLocation) localStorage.setItem('userLocation', JSON.stringify(userLocation))
    if (userAddress) localStorage.setItem('userAddress', JSON.stringify(userAddress))
    if (adminDept) localStorage.setItem('adminDept', adminDept)
  }, [currentScreen, language, userRole, userName, locationGranted, complaintData, initialComplaintData, userLocation, userAddress, adminDept])

  // Translation helper
  const t = (path) => {
    const keys = path.split('.')
    let result = translations[language]
    for (const key of keys) {
      result = result?.[key]
    }
    return result || path
  }

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser")
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        })
        setLocationGranted(true)
        setLocationError(null)

        // Reverse Geocoding using Nominatim
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}&addressdetails=1`)
          .then(res => res.json())
          .then(data => {
            if (data && data.display_name) {
              setUserAddress(data.display_name)
            } else {
              setUserAddress(`${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`)
            }
          })
          .catch(() => {
            setUserAddress(`${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`)
          })
      },
      (error) => {
        let errorMsg = "Location permission required to show nearby complaints."
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = "Location permission required to show nearby complaints."
        }
        setLocationError(errorMsg)
        setLocationGranted(false)
      }
    )
  }

  const navigate = (screen) => {
    window.scrollTo(0, 0)
    setCurrentScreen(screen)
  }

  const handleLogout = () => {
    localStorage.clear()
    setLocationGranted(false)
    setUserLocation(null)
    setUserAddress(null)
    setUserName('Alex Johnson')
    setComplaintData(null)
    setInitialComplaintData(null)
    setAdminDept('electricity')
    navigate('landing')
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
          onLogin={(name) => {
            if (name) setUserName(name)
            requestLocation()
            navigate('citizen-dashboard')
          }}
          onBack={() => navigate('login-selection')}
        />

      case 'admin-login':
        return <AdminLogin
          t={t}
          language={language}
          setLanguage={setLanguage}
          onLogin={(dept) => {
            if (dept) setAdminDept(dept.toLowerCase())
            navigate('admin-dashboard')
          }}
          onBack={() => navigate('login-selection')}
        />
      case 'citizen-dashboard':
        return <CitizenDashboard
          t={t}
          language={language}
          setLanguage={setLanguage}
          userName={userName}
          locationGranted={locationGranted}
          setLocationGranted={(granted) => {
            if (granted) requestLocation()
            else {
              setLocationGranted(false)
              setUserLocation(null)
              setUserAddress(null)
            }
          }}
          onRaiseComplaint={(data) => {
            setInitialComplaintData(data)
            navigate('register-complaint')
          }}
          onTrackProgress={() => navigate('track-progress')}
          onLogout={handleLogout}
        />
      case 'track-progress':
        return <TrackProgress
          t={t}
          language={language}
          setLanguage={setLanguage}
          userName={userName}
          complaintData={complaintData}
          onBack={() => navigate('citizen-dashboard')}
          onRaiseComplaint={() => navigate('register-complaint')}
          onLogout={handleLogout}
        />
      case 'admin-dashboard':
        return <AdminDashboard
          t={t}
          language={language}
          setLanguage={setLanguage}
          initialDept={adminDept}
          onLogout={handleLogout}
          onViewEscalations={() => navigate('escalation')}
        />
      case 'register-complaint':
        return <RegisterComplaint
          t={t}
          language={language}
          setLanguage={setLanguage}
          userName={userName}
          initialData={initialComplaintData}
          userLocation={userLocation}
          userAddress={userAddress}
          locationError={locationError}
          onBack={() => {
            setInitialComplaintData(null)
            navigate('citizen-dashboard')
          }}
          onTrackProgress={() => navigate('track-progress')}
          onSubmit={(data) => {
            const enrichedData = {
              ...data,
              id: data.backend_id || `CIV-${Math.floor(10000 + Math.random() * 90000)}`,
              status: data.status || t('status.submitted'),
              category: data.category || initialComplaintData?.category || 'Select Category',
              dateSubmitted: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
              priority: (data.category === 'Sparking Wires' || data.category === 'Gas Leakage') ? t('priority.high') : t('priority.medium'),
              evidence: data.evidence, // Key fix: include images
              location: data.location || userLocation,
              address: data.locationAddress || userAddress,
              history: [
                {
                  title: t('history.submitted'),
                  date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
                  desc: t('history.submittedDesc'),
                  completed: true
                },
                {
                  title: t('history.assigned'),
                  date: '--',
                  desc: t('history.assignedDesc'),
                  active: true,
                  subText: t('status.pending')
                }
              ],
              officer: {
                name: 'Ravi Kumar',
                role: t('officer.chiefEngineer')
              }
            }
            setComplaintData(enrichedData)
            setInitialComplaintData(null)
            navigate('complaint-submitted')
          }}
          onLogout={handleLogout}
        />
      case 'complaint-submitted':
        return <ComplaintSubmitted
          t={t}
          language={language}
          setLanguage={setLanguage}
          data={complaintData}
          onHome={() => navigate('citizen-dashboard')}
          onTrack={() => navigate('track-progress')}
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
