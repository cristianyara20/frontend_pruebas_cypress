import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "../pages/Login/Login"
import Users from "../pages/Users/Users"
import Roles from "../pages/Roles/Roles"
import UserStatus from "../pages/UserStatus/UserStatus"
import Register from "../pages/Register/Register"
import EditUser from "../pages/EditUser/EditUser"

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/edit/:id" element={<EditUser />} />
        <Route path="/roles" element={<Roles />} />
        <Route path="/userstatus" element={<UserStatus />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes