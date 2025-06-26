import { useEffect, useState } from "react"
import api from "../api/axios"

export default function AdminTasks() {
  const [tasks, setTasks] = useState([])
  const [users, setUsers] = useState([])
  const [form, setForm] = useState({
    title: "",
    description: "",
    assignedTo: "",
    dueDate: "",
  })
  const [loading, setLoading] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editingTaskId, setEditingTaskId] = useState(null)

  useEffect(() => {
    fetchTasks()
    fetchUsers()
  }, [])

  const fetchTasks = async () => {
    const res = await api.get("/tasks")
    setTasks(res.data)
  }

  const fetchUsers = async () => {
    const res = await api.get("/auth/users")

    setUsers(res?.data?.users?.filter((u) => u.role === "member"))
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (editMode && editingTaskId) {
        await api.put(`/tasks/${editingTaskId}`, form)
      } else {
        await api.post("/tasks", form)
      }
      setForm({ title: "", description: "", assignedTo: "", dueDate: "" })
      setEditMode(false)
      setEditingTaskId(null)
      fetchTasks()
    } catch (err) {
      console.log(err, "error saving task")
      alert("Failed to save task")
    }

    setLoading(false)
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return
    await api.delete(`/tasks/${id}`)
    fetchTasks()
  }

  const handleEdit = (task) => {
    setForm({
      title: task.title,
      description: task.description,
      assignedTo: task.assignedTo?._id || "",
      dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
    })
    setEditMode(true)
    setEditingTaskId(task._id)
  }

  const handleCancelEdit = () => {
    setForm({ title: "", description: "", assignedTo: "", dueDate: "" })
    setEditMode(false)
    setEditingTaskId(null)
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">
        Admin - {editMode ? "Edit Task" : "Create Task"}
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 shadow rounded mb-6 space-y-4"
      >
        <div>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Task Title"
            className="w-full p-3 border rounded"
            required
          />
        </div>
        <div>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Task Description"
            className="w-full p-3 border rounded"
          />
        </div>
        <div>
          <select
            name="assignedTo"
            value={form.assignedTo}
            onChange={handleChange}
            className="w-full p-3 border rounded"
            required
          >
            <option value="">Assign to</option>
            {users?.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
        </div>
        <div>
          <input
            type="date"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
            placeholder="Due Date"
            className="w-full p-3 border rounded"
          />
        </div>
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            {loading
              ? editMode
                ? "Updating..."
                : "Creating..."
              : editMode
              ? "Update Task"
              : "Create Task"}
          </button>
          {editMode && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="bg-gray-400 text-white py-2 px-4 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="bg-white shadow rounded p-4">
        <h3 className="text-lg font-semibold mb-3">All Tasks</h3>
        {tasks.length === 0 ? (
          <p className="text-gray-500">No tasks yet.</p>
        ) : (
          <ul className="space-y-2">
            {tasks.map((task) => (
              <li
                key={task._id}
                className="flex justify-between items-center border-b pb-2"
              >
                <div>
                  <h4 className="font-semibold">{task.title}</h4>
                  <p className="text-sm text-gray-600">{task.description}</p>
                  <p className="text-xs text-gray-400">
                    Assigned to: {task.assignedTo?.name || "Unassigned"} |
                    Status: {task.status}{" "}
                    {task.dueDate && (
                      <span>
                        | Due Date:{" "}
                        {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(task)}
                    className="text-sm bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
