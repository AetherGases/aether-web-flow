import { lazy } from 'react'
import PageBoundary from './components/PageBoundary'
import NavigationAccessibility from './components/NavigationAccessibility'
import { useTranslation } from './hooks/useTranslation'
import { Navigate, Route, Routes } from 'react-router-dom'
import { analystOverviewMock, administratorOverviewMock } from './mocks/overview'
import PrivateRoute from './components/PrivateRoute'
import { useAuth } from './hooks/useAuth'
import { getHomePath } from './utils/auth'

const LoginPage = lazy(() => import('./pages/login'))
const OverviewPage = lazy(() => import('./pages/overview'))
const DataAnalysisPage = lazy(() => import('./pages/data-analysis'))
const AdministratorOverviewPage = lazy(() => import('./pages/overview-admin'))
const AdministrationPage = lazy(() => import('./pages/administration'))
const DataUploadPage = lazy(() => import('./pages/data-upload'))
const DataAnalysisChoicePage = lazy(() => import('./pages/data-analysis-choice'))
const CalculatorPage = lazy(() => import('./pages/calculator'))
const AssistantPage = lazy(() => import('./pages/assistant'))
const ProfilePage = lazy(() => import('./pages/profile'))
const ErrorPage = lazy(() => import('./pages/error'))

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
    <PageBoundary key={page}>{pages[page]}</PageBoundary>
  </>
}

function App() {
  const { t } = useTranslation()
  const { user, status, error, retry } = useAuth()
  if (status === 'loading') return <main id="main-content"><p role="status">{t("Recuperando sessão…")}</p></main>
  if (status === 'error') return <main id="main-content"><p role="alert">{t(error ?? "Não foi possível recuperar sua sessão.")}</p><button type="button" onClick={retry}>{t("Tentar novamente")}</button></main>

  return <><NavigationAccessibility /><Routes>
    <Route path="/" element={user ? <Navigate to={getHomePath(user.role)} replace /> : <PageBoundary><LoginPage /></PageBoundary>} />
    <Route element={<PrivateRoute />}>
      <Route path="/overview" element={<AuthenticatedPage page="overview" />} />
      <Route path="/data-analysis" element={<AuthenticatedPage page="analysis" />} />
      <Route path="/data-analysis/upload" element={<AuthenticatedPage page="upload" />} />
      <Route path="/data-analysis/upload/:scope" element={<AuthenticatedPage page="upload" />} />
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
    <Route path="*" element={<PageBoundary><ErrorPage /></PageBoundary>} />
  </Routes><footer className="visually-hidden">Aether</footer></>
}

export default App
