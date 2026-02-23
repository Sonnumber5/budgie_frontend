import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { DateProvider } from './context/DateContext'
import { ExpenseProvider } from './context/ExpenseContext'
import { ExpensesPage } from './pages/ExpensePage'

function App() {

  return (
    <BrowserRouter>
      <DateProvider>
        <ExpenseProvider>
          <Routes>
            <Route path="/expenses" element={<ExpensesPage/>}></Route>
          </Routes>
        </ExpenseProvider>
      </DateProvider>
    </BrowserRouter>
  )
}

export default App
