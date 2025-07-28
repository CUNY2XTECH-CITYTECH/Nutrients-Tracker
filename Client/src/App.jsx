import './App.css'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { Home } from './Pages/Home'
import { FoodLogger } from  './Pages/FoodLogger'
import { Food } from './Pages/Food'
import { Stats } from './Pages/Stats'
import { Login } from './Pages/login'
import { Layout } from '../Layouts'

function App() {

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route element={<Layout />}>
          <Route path="/Home" element= {<Home/>}/>
          <Route path="/logs" element= {<FoodLogger/>}/>
          <Route path="/food" element= {<Food/>}/>
          <Route path="/stats" element= {<Stats/>}/>
        </Route>
      </Routes>
    </HashRouter>
      
  )
}

export default App
