import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAuthStore } from './store'
import LandingPage from './pages/LandingPage'
import MatchScreen from './pages/MatchScreen'

const queryClient = new QueryClient()

function AppRoutes() {
  const role = useAuthStore(s => s.role)
  return (
    <Routes>
      <Route path="/"      element={<LandingPage />} />
      <Route path="/match" element={<MatchScreen />} />
      <Route path="*" element={
        role === 'client' ? <Navigate to="/match" replace /> :
                            <Navigate to="/" replace />
      } />
    </Routes>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '1rem' }}>
          <div className="phone-frame">
            <AppRoutes />
          </div>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
