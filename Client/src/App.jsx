import './App.css'
import { Routes, Route } from 'react-router-dom'
import { Home } from './Pages/Home'
import { FoodLogger } from  './Pages/FoodLogger/FoodLogger'
import { Food } from './Pages/Food'
import { Stats } from './Pages/Stats'
import { Login } from './Pages/Login/Login'
import { SignUp } from './Pages/SignUp/SignUp'
import { Welcome } from './Pages/welcome/Welcome'
import { Layout } from '../Layouts'

import { Suggestions } from './Pages/Suggestions/Suggestions'
import RequireAuth from './Componets/RequireAuth'

function App() {

  return (
      <Routes>
        {/*Public Routes*/}
        <Route path="/" element= {<Welcome/>}/>
        <Route path="/Login" element={<Login/>} />
        <Route path="/Signup" element={<SignUp/>} />

        <Route element={<RequireAuth/>}>
          <Route element={<Layout />}>
            {/*Private Routes*/}
            <Route path="/Home" element= {<Home/>}/>
            <Route path="/logs" element= {<FoodLogger/>}/>
            <Route path="/food" element= {<Food/>}/>
            <Route path="/stats" element= {<Stats/>}/>
            <Route path="/Suggestions" element={<Suggestions/>}/>
          </Route>
        </Route>

       {/* <Route path="*" element={<Lost/>} /> */}     {/*FallBack route. If user enters endpoint that doesnt exist, If will redirect to this component*/}
      </Routes>
      
  )
}

export default App