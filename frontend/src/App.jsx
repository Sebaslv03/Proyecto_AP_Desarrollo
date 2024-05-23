import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import PersonalInfo from './pages/PersonalInfo'
import Movie from './pages/Movie'
import ActorScreenUser from './pages/ActorScreenUser'
import ShoppingCart from './pages/ShoppingCart'
import History from './pages/History'
import Wishlist from './pages/Wishlist'

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/ForgotPassword' element={<ForgotPassword />} />
      <Route path='/Register' element={<Register />} />
      <Route path='/PersonalInfo' element={<PersonalInfo />} />
      <Route path='/Movie' element={<Movie />} /> 
      <Route path='/ActorScreenUser' element={<ActorScreenUser/>}/>
      <Route path='/ShoppingCart' element={<ShoppingCart/>}/>
      <Route path='/History' element={<History/>}/>
      <Route path='/Wishlist' element={<Wishlist/>}/>
    </Routes>
  )
}

export default App
