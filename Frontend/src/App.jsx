import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import CreateReceipt from './components/receipt/CreateReceipt';
import PrivateRoute from './components/common/PrivateRoute';
import './App.css';

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated() ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/create-receipt"
        element={
          <PrivateRoute>
            <CreateReceipt />
          </PrivateRoute>
        }
      />
        <Route 
    path="/edit-receipt/:id" 
    element={
      <PrivateRoute>
        <CreateReceipt />
      </PrivateRoute>
    } 
  />
    </Routes>

    
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <AppRoutes />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
