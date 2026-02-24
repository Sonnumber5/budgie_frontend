import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { DateProvider } from './context/DateContext'
import { ExpenseProvider } from './context/ExpenseContext'
import { ExpensesPage } from './pages/ExpensePage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
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
          </Routes>
        </DateProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
