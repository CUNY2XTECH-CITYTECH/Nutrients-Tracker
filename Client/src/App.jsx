import './App.css'
import { Routes, Route } from 'react-router-dom'
import { Home } from './Pages/Home'
import FoodLogger from './Pages/FoodLogger'   
import { Food } from './Pages/Food'
import { Stats } from './Pages/Stats'
import { Login } from './Pages/Login/Login'
import { SignUp } from './Pages/SignUp/SignUp'
import { Welcome } from './Pages/welcome/Welcome'
import { Layout } from '../Layouts'
import { Suggestions } from './Pages/Suggestions/Suggestions'
import RequireAuth from './Componets/RequireAuth'

function App() {
  const username = "qqqqqqqq"  

  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route element={<RequireAuth />}>
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/logs" element={<FoodLogger username={username} />} />
          <Route path="/food" element={<Food />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/suggestions" element={<Suggestions />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
