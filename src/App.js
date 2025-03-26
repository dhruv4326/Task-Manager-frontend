import { useEffect, useState } from "react";
import { getTasks, addTask, updateTask, deleteTask } from "./services/taskService";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

function App() {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [updatedTaskTitle, setUpdatedTaskTitle] = useState("");
  const navigate = useNavigate();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return { message: "Good Morning!", icon: "☀️", motivation: "Start your day with positivity! ☕" };
    } else if (hour < 18) {
      return { message: "Good Afternoon!", icon: "🌤️", motivation: "Keep pushing forward! 🚀" };
    } else if (hour < 22) {
      return { message: "Good Evening!", icon: "🌙", motivation: "Unwind and reflect on your day. 🌠" };
    } else {
      return { message: "Good Night!", icon: "🌌", motivation: "Rest well and recharge for tomorrow. 😴" };
    }
  };

  const { message, icon, motivation } = getGreeting();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchTasks();
  }, []); // ✅ Added dependency array to prevent re-renders

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      if (error.response?.status === 401) {
        handleLogout(); // ✅ Logout if unauthorized
      }
    }
    setLoading(false);
  };

  const handleAddTask = async () => {
    if (!newTask.trim()) return;
  
    try {
      const newTaskObj = await addTask({ title: newTask, completed: false }); // ✅ Add completed field
      setTasks([...tasks, newTaskObj]);
      setNewTask("");
    } catch (error) {
      console.error("Error adding task:", error.response?.data || error);
    }
  };
  

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      setTasks(tasks.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error.response?.data || error);
    }
  };
  

  const startEditingTask = (task) => {
    setEditingTask(task._id);
    setUpdatedTaskTitle(task.title);
  };

  const handleUpdateTask = async () => {
    if (!updatedTaskTitle.trim()) return;
  
    try {
      const updatedTask = await updateTask(editingTask, { title: updatedTaskTitle, completed: false }); // ✅ Ensure proper payload
      setTasks(tasks.map((task) => (task._id === editingTask ? { ...task, ...updatedTask } : task)));
      setEditingTask(null);
      setUpdatedTaskTitle("");
    } catch (error) {
      console.error("Error updating task:", error.response?.data || error);
    }
  };
  

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear JWT token
    navigate("/login"); // Redirect to login
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-900 via-purple-700 to-blue-500 flex justify-center items-center p-4">
      <button
        className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        onClick={handleLogout}
      >
        Logout
      </button>
      <div className="max-w-lg w-full bg-white p-6 rounded-2xl shadow-lg">
        {/* Greeting Section */}
        <div className="text-center text-gray-800 mb-6">
          <h1 className="text-3xl font-bold">
            {message} {icon}
          </h1>
          <p className="text-lg text-gray-600">{motivation}</p>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-center mb-4">Your Task Manager</h2>
        <p className="text-center text-gray-500 mb-4">Manage Your Daily Tasks Efficiently</p>

        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <input
            className="border p-2 flex-grow rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter task title..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 w-full sm:w-auto"
            onClick={handleAddTask}
          >
            Add Task
          </button>
        </div>

        <ul className="space-y-3">
          {tasks.map((task) => (
            <li key={task._id} className="flex flex-wrap justify-between items-center p-3 border-b hover:bg-gray-100 rounded-lg transition">
              {editingTask === task._id ? (
                <input
                  className="border p-1 rounded w-full sm:w-auto flex-grow mr-2"
                  value={updatedTaskTitle}
                  onChange={(e) => setUpdatedTaskTitle(e.target.value)}
                />
              ) : (
                <span
                  className={`cursor-pointer flex-grow ${task.completed ? "line-through text-gray-400" : "text-gray-800"}`}
                >
                  {task.title}
                </span>
              )}

              <div className="flex gap-2 mt-2 sm:mt-0">
                {editingTask === task._id ? (
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600"
                    onClick={handleUpdateTask}
                  >
                    ✅ Save
                  </button>
                ) : (
                  <button
                    className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600"
                    onClick={() => startEditingTask(task)}
                  >
                    ✏️ Edit
                  </button>
                )}

                <button
                  className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700"
                  onClick={() => handleDeleteTask(task._id)}
                >
                  <X size={18} className="text-white" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
