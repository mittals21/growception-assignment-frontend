import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export default function Dashboard() {
  const navigate = useNavigate()
  const [role, setRole] = useState("")

  useEffect(() => {
    const userRole = localStorage.getItem("role")
    if (!userRole) {
      navigate("/login")
    } else {
      setRole(userRole)
    }
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("role")
    navigate("/login")
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-lg text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to QuickTask</h1>
        <p className="text-lg mb-6">
          You are logged in as{" "}
          <span className="font-semibold capitalize text-blue-600">{role}</span>
        </p>

        {role === "admin" ? (
          <div className="bg-blue-50 p-4 rounded-md mb-6">
            <h2 className="text-xl font-semibold text-blue-700 mb-2">
              Admin Panel
            </h2>
            <ul className="text-left list-disc list-inside text-gray-700">
              <li>Create and assign tasks</li>
              <li>View all user tasks</li>
              <li>Manage team productivity</li>
            </ul>
          </div>
        ) : (
          <div className="bg-green-50 p-4 rounded-md mb-6">
            <h2 className="text-xl font-semibold text-green-700 mb-2">
              Member Panel
            </h2>
            <ul className="text-left list-disc list-inside text-gray-700">
              <li>View assigned tasks</li>
              <li>Update task progress</li>
            </ul>
          </div>
        )}

        <div className="flex justify-center items-center gap-3">
          <div>
            {role === "admin" && (
              <a
                href="/admin/tasks"
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Manage Tasks
              </a>
            )}
            {role === "member" && (
              <a
                href="/member/tasks"
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                View My Tasks
              </a>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}
