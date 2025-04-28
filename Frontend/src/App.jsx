
import { useTheme } from '@emotion/react';
import { AuthProvider } from './context/AuthContext'
import AppRoutes from './routes/AppRoutes'


function App() {
  const {theme, toggleTheme} = useTheme('theme', 'light');
  return (
    <>
      <AuthProvider>
        <main data-theme ={theme} >
          <AppRoutes />
        </main>
      </AuthProvider>
    </>
  )
}

export default App
