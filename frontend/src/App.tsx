import {BrowserRouter,Routes,Route,Navigate} from 'react-router-dom';
import {useAuthStore} from './stores/authStore.ts';
import {ChatPage} from './pages/ChatPage';
import { AuthPage } from './pages/authPage.tsx';
function ProtectedRoute ({children}: {children: React.ReactNode}){
  const token = useAuthStore((s)=> s.token);
  return token ? <>{children}</> : <Navigate to="/login" replace />
}
export default function App () {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<AuthPage />} />
        <Route path ="/" element={
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        } />
        <Route path ="/chat/:conversationId" element={
          <ProtectedRoute>
            <ChatPage />    
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}