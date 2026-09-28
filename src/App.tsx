import { useState } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'

import LoginPage from './pages/login'
import OverviewPage from './pages/overview'
import DataAnalysisPage from './pages/data-analysis'
import DataAnalysisChoicePage from './pages/data-analysis-choice'
import DataUploadPage from './pages/data-upload'
import CalculatorPage from './pages/calculator'
import AssistantPage from './pages/assistant'
import ErrorPage from './pages/error'
import { analystOverviewMock } from './mocks/overview'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const navigate = useNavigate()

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
        path="/data-analysis/select"
        element={
          <DataAnalysisChoicePage
            data={{ ...analystOverviewMock, role: 'administrator' }}
            onLogout={() => setIsAuthenticated(false)}
            onSelectPlant={() => navigate('/data-analysis/upload')}
          />
        }
      />

      <Route
        path="/data-analysis/upload"
        element={
          isAuthenticated ? (
            <DataUploadPage
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
            <DataAnalysisPage
              data={analystOverviewMock}
              onLogout={() => setIsAuthenticated(false)}
            />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      <Route
        path="/calculator"
        element={
          isAuthenticated ? (
            <CalculatorPage
              data={analystOverviewMock}
              onLogout={() => setIsAuthenticated(false)}
            />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      <Route
        path="/assistant"
        element={
          isAuthenticated ? (
            <AssistantPage
              data={analystOverviewMock}
              onLogout={() => setIsAuthenticated(false)}
            />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      <Route path="*" element={<ErrorPage />} />
    </Routes>
  )
}

export default App
