import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function AdminTasks() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', assignedTo: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);

  const fetchTasks = async () => {
    const res = await api.get('/tasks');
    setTasks(res.data);
  };

  const fetchUsers = async () => {
    const res = await api.get('/auth/users'); // You'll need to create this API to return all users with role=member
    setUsers(res.data.filter((u) => u.role === 'member'));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/tasks', form);
      setForm({ title: '', description: '', assignedTo: '' });
      fetchTasks();
    } catch (err) {
      alert('Task creation failed');
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    await api.delete(`/tasks/${id}`);
    fetchTasks();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Admin - Manage Tasks</h2>

      {/* Task creation */}
      <form onSubmit={handleSubmit} className="bg-white p-4 shadow rounded mb-6 space-y-4">
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
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          {loading ? 'Creating...' : 'Create Task'}
        </button>
      </form>

      {/* Task list */}
      <div className="bg-white shadow rounded p-4">
        <h3 className="text-lg font-semibold mb-3">All Tasks</h3>
        {tasks.length === 0 ? (
          <p className="text-gray-500">No tasks yet.</p>
        ) : (
          <ul className="space-y-2">
            {tasks.map((task) => (
              <li key={task._id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <h4 className="font-semibold">{task.title}</h4>
                  <p className="text-sm text-gray-600">{task.description}</p>
                  <p className="text-xs text-gray-400">
                    Assigned to: {task.assignedTo?.name || 'Unassigned'} | Status: {task.status}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(task._id)}
                  className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
