import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { DateProvider } from './context/DateContext'
import { ExpenseProvider } from './context/ExpenseContext'
import { ExpensesPage } from './pages/ExpensePage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'

function App() {
  return (
    <BrowserRouter>
      <DateProvider>
        <Routes>
          <Route path="/expenses" element={
            <ExpenseProvider>
              <ExpensesPage/>
            </ExpenseProvider>
          }/>
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/register" element={<RegisterPage/>}/>
        </Routes>
      </DateProvider>
    </BrowserRouter>
  )
}

export default App
