import { useNavigate } from "react-router-dom"

export default function Navbar() {
  const navigate = useNavigate()
  const role = localStorage.getItem("role") || ""
  const token = localStorage.getItem("token")

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("role")
    navigate("/login")
  }

  return token ? (
    <nav className="bg-white shadow p-4 flex justify-between items-center">
      <div
        className="text-xl font-semibold text-blue-600 cursor-pointer"
        onClick={() => navigate("dashboard")}
      >
        QuickTask
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600 capitalize">Role: {role}</span>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white text-sm px-3 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </nav>
  ) : null
}
