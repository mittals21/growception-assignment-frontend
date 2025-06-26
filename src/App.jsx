import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import AdminTasks from "./pages/AdminTasks"
import MemberTasks from "./pages/MemberTasks"

function App() {
  const token = localStorage.getItem("token")
  const role = localStorage.getItem("role")

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={token && role ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<Navigate to="/dashboard" />} />
        <Route
          path="/admin/tasks"
          element={
            localStorage.getItem("role") === "admin" ? (
              <AdminTasks />
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />
        <Route
          path="/member/tasks"
          element={
            localStorage.getItem("role") === "member" ? (
              <MemberTasks />
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />
      </Routes>
    </Router>
  )
}

export default App
