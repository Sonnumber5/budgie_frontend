import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { DateProvider } from './context/DateContext'
import { ExpenseProvider } from './context/ExpenseContext'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'
import { DashboardProvider } from './context/DashboardContext'
import { Dashboard } from './pages/Dashboard'
import { Navbar } from './components/navbar'
import { ExpensesPage } from './pages/ExpensesPage'
import { IncomeProvider } from './context/IncomeContext'
import { IncomePage } from './pages/IncomePage'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar/>
        <DateProvider>
          <Routes>
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
        </DateProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
