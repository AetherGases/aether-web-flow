import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import LoginPage from './pages/login'
import OverviewPage from './pages/overview'
import DataAnalysisPage from './pages/data-analysis'
import { analystOverviewMock } from './mocks/overview'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to="/overview" replace />
          ) : (
            <LoginPage
              onLogin={() => setIsAuthenticated(true)}
            />
          )
        }
      />

      <Route
        path="/overview"
        element={
          isAuthenticated ? (
            <OverviewPage
              data={analystOverviewMock}
              onLogout={() => setIsAuthenticated(false)}
            />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      <Route
        path="/data-analysis"
        element={
          isAuthenticated ? (
            <DataAnalysisPage />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App