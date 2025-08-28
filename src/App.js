// src/App.js
import { AuthProvider } from './components/auth/AuthProvider';
import ProtectedRoute from './components/auth/ProtectedRoute';
import DashboardPage from './pages/Dashboard';

function App() {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    </AuthProvider>
  );
}

export default App;