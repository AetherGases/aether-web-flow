import { useState } from 'react'

import LoginPage from './pages/login'
import OverviewPage from './pages/overview'
import { analystOverviewMock } from './mocks/overview'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  if (!isAuthenticated) {
    return <LoginPage onLogin={() => setIsAuthenticated(true)} />
  }

  return (
    <OverviewPage
      data={analystOverviewMock}
      onLogout={() => setIsAuthenticated(false)}
    />
  )
}

export default App