import { useEffect, useState } from "react"
import api from "../api/axios"
import { toast } from "sonner"

export default function MemberTasks() {
  const [tasks, setTasks] = useState([])
  const [updating, setUpdating] = useState(null)
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    fetchTasks()
  }, [filter])

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks")
      let filtered = res.data
      if (filter !== "all") {
        filtered = filtered.filter((t) => t.status === filter)
      }
      setTasks(filtered)
    } catch (err) {
      console.error("Error fetching tasks", err)
    }
  }

  const handleStatusChange = async (taskId, newStatus) => {
    setUpdating(taskId)
    try {
      const res = await api.put(`/tasks/${taskId}`, { status: newStatus })
      if (res.status !== 200) {
        return toast.error("Error changing task status")
      }
      toast.success(`Status changed to ${newStatus}`)
      fetchTasks()
    } catch (err) {
      console.log(err, "error updating task status")
      toast.error("Could not update task status")
    } finally {
      setUpdating(null)
    }
  }

  const statusOptions = ["todo", "in progress", "done"]

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">My Tasks</h2>
      <div className="mb-4 flex justify-end">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="all">All</option>
          <option value="todo">Todo</option>
          <option value="in progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>
      {tasks.length === 0 ? (
        <p className="text-gray-500">No tasks assigned to you yet.</p>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="bg-white p-4 shadow rounded flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center"
            >
              <div>
                <h3 className="font-semibold text-lg">{task.title}</h3>
                <p className="text-sm text-gray-600">{task.description}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Status: {task.status}
                </p>
              </div>
              <select
                value={task.status}
                onChange={(e) => handleStatusChange(task._id, e.target.value)}
                disabled={updating === task._id}
                className="p-2 border rounded text-sm"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
