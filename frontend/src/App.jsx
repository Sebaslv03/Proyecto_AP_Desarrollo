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

import HomePageAdmin from './pages/HomePageAdmin'
import AddMovie from './pages/AddMovie'
import AddShow from './pages/AddShow'
import AddActorDirector from './pages/AddActorDirector'
import EditMovie from './pages/EditMovie'
import EditShow from './pages/EditShow'

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/ForgotPassword' element={<ForgotPassword />} />
      <Route path='/Register' element={<Register />} />
      <Route path='/PersonalInfo' element={<PersonalInfo />} />
      <Route path='/Movie' element={<Movie />} /> 
      <Route path='/ActorScreenUser/:id' element={<ActorScreenUser/>}/>
      <Route path='/HomePage' element={<HomePage/>}/>
      <Route path='/SearchPage' element={<SearchPage/>}/>
      
      <Route path='/ShoppingCart' element={<ShoppingCart/>}/>
      <Route path='/History' element={<History/>}/>
      <Route path='/Wishlist' element={<Wishlist/>}/>
      <Route path='/Show' element={<Show/>}/>
      



      <Route path='/HomePageAdmin' element={<HomePageAdmin/>}/>
      <Route path='/AddMovie' element={<AddMovie/>}/>
      <Route path='/AddShow' element={<AddShow/>}/>
      <Route path='/AddActorDirector' element={<AddActorDirector/>}/>
      <Route path='/EditMovie/:id' element={<EditMovie/>}/>
      <Route path='/EditShow/:id' element={<EditShow/>}/>
    </Routes>
  )
}

export default App
