import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { DateProvider } from './context/DateContext';;
import { ExpenseProvider } from './context/ExpenseContext';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { DashboardProvider } from './context/DashboardContext';
import { Dashboard } from './pages/Dashboard';
import { Navbar } from './components/navbar';
import { ExpensesPage } from './pages/ExpensesPage';
import { IncomeProvider } from './context/IncomeContext';
import { IncomePage } from './pages/IncomePage';
import { Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { BudgetProvider } from './context/BudgetContext';
import { BudgetOverview } from './features/budget/components/BudgetOverview';

function App() {
  const DefaultRoute = () => {
    const { isAuthenticated } = useAuth();
    return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
};
  return (
    <BrowserRouter>
      <AuthProvider>
        <DateProvider>
          <BudgetProvider>
          <Navbar/>
            <Routes>
            <Route path="/" element={<DefaultRoute/>}/>
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/register" element={<RegisterPage/>}/>
              <Route path="/expenses" element={
                <ProtectedRoute>
                  <ExpenseProvider>
                    <ExpensesPage/>
                  </ExpenseProvider>
                </ProtectedRoute>
              }/>
              <Route path="/income" element={
                <ProtectedRoute>
                  <IncomeProvider>
                    <IncomePage/>
                  </IncomeProvider>
                </ProtectedRoute>
              }/> 
              <Route path="/dashboard" element={
                <ProtectedRoute>
                    <DashboardProvider>
                      <Dashboard/>
                    </DashboardProvider>
                </ProtectedRoute>
              }/>
            </Routes>
          </BudgetProvider>
        </DateProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
