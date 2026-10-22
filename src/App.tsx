import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import LoginPage from './pages/login'
import OverviewPage from './pages/overview'
import DataAnalysisPage from './pages/data-analysis'
import DataAnalysisChoicePage from './pages/data-analysis-choice'
import DataUploadPage from './pages/data-upload'
import CalculatorPage from './pages/calculator'
import AssistantPage from './pages/assistant'
import ProfilePage from './pages/profile'
import ErrorPage from './pages/error'
import PrivateRoute from './components/PrivateRoute'
import { analystOverviewMock, administratorOverviewMock } from './mocks/overview'
import { analystProfileMock } from './mocks/profile'
import { useAuth } from './hooks/useAuth'
import { getHomePath } from './utils/auth'

type Page = 'overview' | 'analysis' | 'select' | 'upload' | 'calculator' | 'assistant' | 'profile'
interface AuthenticatedPageProps { page: Page }

function AuthenticatedPage({ page }: AuthenticatedPageProps) {
  const { user, logout, error } = useAuth()
  const navigate = useNavigate()
  if (!user) return <Navigate to="/" replace />
  const overviewFixture = user.role === 'administrator' ? administratorOverviewMock : analystOverviewMock
  const props = { data: { ...overviewFixture, userName: user.name, role: user.role }, onLogout: () => { void logout() } }
  const pages = {
    overview: <OverviewPage {...props} />,
    analysis: <DataAnalysisPage {...props} />,
    select: <DataAnalysisChoicePage {...props} onSelectPlant={() => navigate('/data-analysis/upload')} />,
    upload: <DataUploadPage {...props} />,
    calculator: <CalculatorPage {...props} />,
    assistant: <AssistantPage {...props} />,
    profile: <ProfilePage {...props} profile={{ ...analystProfileMock, fullName: user.name, email: user.email }} />,
  }
  return <>
    {error && <div role="alert">{error}</div>}
    {pages[page]}
  </>
}

function App() {
  const { user, status, error, retry } = useAuth()
  if (status === 'loading') return <main><p role="status">Recuperando sessão…</p></main>
  if (status === 'error') return <main><p role="alert">{error}</p><button type="button" onClick={retry}>Tentar novamente</button></main>

  return <Routes>
    <Route path="/" element={user ? <Navigate to={getHomePath(user.role)} replace /> : <LoginPage />} />
    <Route element={<PrivateRoute />}>
      <Route path="/overview" element={<AuthenticatedPage page="overview" />} />
      <Route path="/data-analysis" element={<AuthenticatedPage page="analysis" />} />
      <Route path="/data-analysis/upload" element={<AuthenticatedPage page="upload" />} />
      <Route path="/calculator" element={<AuthenticatedPage page="calculator" />} />
      <Route path="/assistant" element={<AuthenticatedPage page="assistant" />} />
      <Route path="/profile" element={<AuthenticatedPage page="profile" />} />
      <Route element={<PrivateRoute allowedRoles={['administrator']} />}>
        <Route path="/data-analysis/select" element={<AuthenticatedPage page="select" />} />
      </Route>
    </Route>
    <Route path="*" element={<ErrorPage />} />
  </Routes>
}

export default App
