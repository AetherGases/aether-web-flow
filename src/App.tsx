import { useTranslation } from './hooks/useTranslation'
import { Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/login'
import OverviewPage from './pages/overview'
import DataAnalysisPage from './pages/data-analysis'
import { analystOverviewMock, administratorOverviewMock } from './mocks/overview'
import AdministratorOverviewPage from './pages/overview-admin'
import AdministrationPage from './pages/administration'
import DataUploadPage from './pages/data-upload'
import DataAnalysisChoicePage from './pages/data-analysis-choice'
import CalculatorPage from './pages/calculator'
import AssistantPage from './pages/assistant'
import ProfilePage from './pages/profile'
import ErrorPage from './pages/error'
import PrivateRoute from './components/PrivateRoute'
import { useAuth } from './hooks/useAuth'
import { getHomePath } from './utils/auth'

type Page = 'overview' | 'analysis' | 'select' | 'upload' | 'calculator' | 'assistant' | 'profile' | 'administration'
interface AuthenticatedPageProps { page: Page }

function AuthenticatedPage({ page }: AuthenticatedPageProps) {
  const { t } = useTranslation()
  const { user, logout, error } = useAuth()
  if (!user) return <Navigate to="/" replace />
  const fixture = user.role === 'administrator' ? administratorOverviewMock : analystOverviewMock
  const analysisData = { ...fixture, userName: user.name, role: user.role }
  const pages = {
    overview: user.role === 'administrator' ? <AdministratorOverviewPage key={user.id} /> : <OverviewPage key={user.id} />,
    analysis: <DataAnalysisPage key={user.id} data={analysisData} onLogout={() => { void logout() }} />,
    select: <DataAnalysisChoicePage key={user.id} />,
    upload: <DataUploadPage key={user.id} />,
    calculator: <CalculatorPage key={user.id} />,
    assistant: <AssistantPage key={user.id} />,
    profile: <ProfilePage key={user.id} />,
    administration: <AdministrationPage key={user.id} />,
  }
  return <>
    {error && <div role="alert">{t(error)}</div>}
    {pages[page]}
  </>
}

function App() {
  const { t } = useTranslation()
  const { user, status, error, retry } = useAuth()
  if (status === 'loading') return <main><p role="status">{t("Recuperando sessão…")}</p></main>
  if (status === 'error') return <main><p role="alert">{t(error ?? "Não foi possível recuperar sua sessão.")}</p><button type="button" onClick={retry}>{t("Tentar novamente")}</button></main>

  return <Routes>
    <Route path="/" element={user ? <Navigate to={getHomePath(user.role)} replace /> : <LoginPage />} />
    <Route element={<PrivateRoute />}>
      <Route path="/overview" element={<AuthenticatedPage page="overview" />} />
      <Route path="/data-analysis" element={<AuthenticatedPage page="analysis" />} />
      <Route path="/data-analysis/upload" element={<AuthenticatedPage page="upload" />} />
      <Route element={<PrivateRoute allowedRoles={['analyst']} />}>
        <Route path="/calculator" element={<AuthenticatedPage page="calculator" />} />
      </Route>
      <Route path="/assistant" element={<AuthenticatedPage page="assistant" />} />
      <Route path="/profile" element={<AuthenticatedPage page="profile" />} />
      <Route element={<PrivateRoute allowedRoles={['administrator']} />}>
        <Route path="/administration" element={<AuthenticatedPage page="administration" />} />
        <Route path="/data-analysis/select" element={<AuthenticatedPage page="select" />} />
      </Route>
    </Route>
    <Route path="*" element={<ErrorPage />} />
  </Routes>
}

export default App
