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
      
    </Routes>
  )
}

export default App
