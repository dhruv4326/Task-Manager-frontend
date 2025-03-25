import { useEffect, useState } from "react";
import { getTasks, addTask, updateTask, deleteTask } from "./services/taskService";
import { X } from "lucide-react";



function App() {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [updatedTaskTitle, setUpdatedTaskTitle] = useState("");

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { message: "Good Morning!", icon: "☀️" };
    if (hour < 18) return { message: "Good Afternoon!", icon: "🌤️" };
    return { message: "Good Evening!", icon: "🌙" };
  };

  const { message, icon } = getGreeting();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    const data = await getTasks();
    setTasks(data);
    setLoading(false);
  };
  

  const handleAddTask = async () => {
    if (!newTask) return;
    const newTaskObj = await addTask({ title: newTask });
    setTasks([...tasks, newTaskObj]);  // ✅ Just add the new task, no need to re-fetch
    setNewTask("");
  };
  

  const handleUpdateTask = async (id) => {
    if (!updatedTaskTitle) return;
    const updatedTask = await updateTask(id, { title: updatedTaskTitle });
    setTasks(tasks.map(task => (task._id === id ? updatedTask : task))); // ✅ Update only that task
    setEditingTask(null);
    setUpdatedTaskTitle("");
  };
  

  const handleToggleTask = async (task) => {
    const updatedTask = await updateTask(task._id, { completed: !task.completed });
    setTasks(tasks.map(t => (t._id === task._id ? updatedTask : t))); // ✅ Update only toggled task
  };
  
  const handleDeleteTask = async (id) => {
    await deleteTask(id);
    setTasks(tasks.filter(task => task._id !== id));  // ✅ Remove deleted task without re-fetching everything
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-900 via-purple-700 to-blue-500 p-4 flex justify-center items-center">
      <div className="max-w-lg w-full bg-white p-6 rounded-lg shadow-md">
        
        {/* Greeting Section */}
        <div className="text-center text-gray-800 mb-6">
          <h1 className="text-3xl font-bold">{message} {icon}</h1>
          <p className="text-lg text-gray-600">Stay productive and make the most of your day!</p>
        </div>

        {/* Task Manager Header */}
        <h2 className="text-2xl font-bold text-center mb-4">Your Task Manager</h2>
        <p className="text-center text-gray-500 mb-4">Manage Your Daily Tasks Efficiently</p>

        {/* Add Task Input */}
        <div className="flex gap-2 mb-4">
          <input
            className="border p-2 flex-grow rounded"
            placeholder="Enter task title..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleAddTask}>
            Add Task
          </button>
        </div>

        {/* Task List */}
        <ul>
          {tasks.map((task) => (
            <li key={task._id} className="flex justify-between items-center p-3 border-b">
              {editingTask === task._id ? (
                <input
                  className="border p-2 flex-grow rounded"
                  value={updatedTaskTitle}
                  onChange={(e) => setUpdatedTaskTitle(e.target.value)}
                  autoFocus
                />
              ) : (
                <span
                  className={`cursor-pointer ${task.completed ? "line-through text-gray-400" : "text-gray-800"}`}
                  onClick={() => handleToggleTask(task)}
                >
                  {task.title}
                </span>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2">
                {editingTask === task._id ? (
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                    onClick={() => handleUpdateTask(task._id)}
                  >
                    Save
                  </button>
                ) : (
                  <button
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    onClick={() => {
                      setEditingTask(task._id);
                      setUpdatedTaskTitle(task.title);
                    }}
                  >
                    ✏️ Edit
                  </button>
                )}

                <button
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
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
