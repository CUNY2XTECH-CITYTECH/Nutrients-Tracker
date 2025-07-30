import './App.css'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { Home } from './Pages/Home'
import { FoodLogger } from  './Pages/FoodLogger'
import { Food } from './Pages/Food'
import { Stats } from './Pages/Stats'
import { Login } from './Pages/Login'
import { SignUp } from './Pages/SignUp'
import { Welcome } from './Pages/Welcome'
import { Layout } from '../Layouts'
import { Suggestions } from './Pages/Suggestions'

function App() {

  return (
    <HashRouter>
      <Routes>
        <Route path="/Welcome" element= {<Welcome/>}/>
        <Route path="/Login" element={<Login/>} />
        <Route path="/Signup" element={<SignUp/>} />

        <Route element={<Layout />}>
          <Route path="/Home" element= {<Home/>}/>
          <Route path="/logs" element= {<FoodLogger/>}/>
          <Route path="/food" element= {<Food/>}/>
          <Route path="/stats" element= {<Stats/>}/>
          <Route path="/Suggestions" element={<Suggestions/>}/>
        </Route>
      </Routes>
    </HashRouter>
      
  )
}

export default App
