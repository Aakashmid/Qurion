
import { AuthProvider } from './context/AuthContext'
import useTheme from './hooks/useTheme';
import AppRoutes from './routes/AppRoutes'
import { useEffect } from 'react';


function App() {
  const {theme, toggleTheme} = useTheme('theme', 'light');

  //  set data theme to the html element
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
  },[theme])
  return (
    <>
      <AuthProvider>
          <AppRoutes />
      </AuthProvider>
    </>
  )
}

export default App
