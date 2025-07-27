import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import UserProfile from '../../UserProfile'

const PrivateRoute = () => {
    const currentUser  = UserProfile.GetUserData()

    return (
        currentUser ? <Outlet /> : <Navigate to={'/login'} />
    )
}

export default PrivateRoute