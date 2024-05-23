import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import PersonalInfo from './pages/PersonalInfo'
import Movie from './pages/Movie'
import ActorScreenUser from './pages/ActorScreenUser'
import HomePage from './pages/HomePage'
import SearchPage from './pages/SearchPage'

import ShoppingCart from './pages/ShoppingCart'
import History from './pages/History'
import Wishlist from './pages/Wishlist'
import Show from './pages/Show'
const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/ForgotPassword' element={<ForgotPassword />} />
      <Route path='/Register' element={<Register />} />
      <Route path='/PersonalInfo' element={<PersonalInfo />} />
      <Route path='/Movie' element={<Movie />} /> 
      <Route path='/ActorScreenUser' element={<ActorScreenUser/>}/>
      <Route path='/HomePage' element={<HomePage/>}/>
      <Route path='/SearchPage' element={<SearchPage/>}/>
      
      <Route path='/ShoppingCart' element={<ShoppingCart/>}/>
      <Route path='/History' element={<History/>}/>
      <Route path='/Wishlist' element={<Wishlist/>}/>
      <Route path='/Show' element={<Show/>}/>
    </Routes>
  )
}

export default App
