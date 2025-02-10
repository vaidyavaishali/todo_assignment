import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaEdit, FaTrashAlt, FaSun, FaMoon, FaListAlt, FaList, FaRegListAlt, FaListUl, FaListOl, FaThList, FaAssistiveListeningSystems, FaClipboardList } from "react-icons/fa";
import Swal from "sweetalert2";

const Todo = () => {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState("");
    const [editTodo, setEditTodo] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [darkMode, setDarkMode] = useState(true);
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const API_URL = "https://todo-assignment-ten-phi.vercel.app";
    //get all todos
    const fetchTodos = async () => {
        try {
            const response = await axios.get(`${API_URL}/get-all-todos`);
            setTodos(response.data);
        } catch (error) {
            console.error("Failed to fetch todos:", error);
        }
    };
    useEffect(() => {
        fetchTodos();
    }, []);

    const validateTodo = (title) => {
        if (!title.trim()) return "Todo cannot be empty.";
        if (title.length < 3) return "Todo must be at least 3 characters.";
        if (title.length > 50) return "Todo must not exceed 50 characters.";
        return null;
    };
    //add new todos
    const handleAddTodo = async () => {
        const validationError = validateTodo(newTodo);
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            const response = await axios.post(`${API_URL}/create-todos`, { title: newTodo });
            setTodos([...todos, response.data]);
            fetchTodos()
            setNewTodo("");
            setError("");
        } catch (error) {
            console.error("Failed to add todo:", error);
        }
    };

    //update existing todos
    const handleUpdateTodo = async () => {
        const validationError = validateTodo(editTitle);
        if (validationError) {
            setError(validationError);
            return;
        }

        const { isConfirmed } = await Swal.fire({
            title: "Are you sure?",
            text: "This action cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, update it!",
        });

        if (!isConfirmed) return;

        try {
            const response = await axios.put(`${API_URL}/update-todos/${editTodo._id}`, {
                title: editTitle,
            });
            setTodos(
                todos.map((todo) =>
                    todo._id === editTodo._id ? { ...todo, title: response.data.title } : todo
                )
            );
            setEditTodo(null);
            setEditTitle("");
            setShowModal(false);
            setError("");
            await Swal.fire({
                title: "Deleted!",
                text: "Your todo has been deleted.",
                icon: "success",
                confirmButtonText: "OK",
                confirmButtonColor: "#3085d6"
            });
        } catch (error) {
            console.error("Failed to update todo:", error);
        }
    };
    //delete todos
    const handleDeleteTodo = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This action cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`${API_URL}/delete-todos/${id}`);
                    setTodos(todos.filter((todo) => todo._id !== id));
                    Swal.fire({
                        title: "Deleted!",
                        text: "Your todo has been deleted.",
                        icon: "success",
                        confirmButtonText: "OK",
                        confirmButtonColor: "#3085d6"
                    });
                } catch (error) {
                    console.error("Failed to delete todo:", error);
                    Swal.fire("Error!", "Something went wrong. Please try again.", "error");
                }
            }
        });
    };

    const toggleDarkMode = () => {
        setDarkMode((prevMode) => !prevMode);
    };

    return (
        <div
            className={`${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
                } min-h-screen flex items-center justify-center transition-colors duration-300`}
        >
            <div className={`${darkMode ? "bg-gray-800" : "bg-white"
                } shadow-lg rounded-lg p-8 w-full max-w-lg duration-300`}>
                <div className="flex justify-between items-center mb-6">
                    <h1 className={`${darkMode ? "text-white" : "text-gray-900"
                        } text-2xl font-bold text-center font-serif flex gap-2`}>
                       <FaRegListAlt className="mt-1"/> Todo App
                    </h1>
                    {!darkMode ? (
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition"
                        >
                            <FaSun className="text-yellow-500" />
                        </button>
                    ) : (
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition"
                        >
                            <FaMoon className="text-gray-800" />
                        </button>
                    )}
                </div>

                {error && <p className="text-red-500 mb-4">{error}</p>}
                <div className="flex mb-4">
                    <input
                        type="text"
                        placeholder="Add a new todo"
                        value={newTodo}
                        onChange={(e) => setNewTodo(e.target.value)}
                        className={`flex-grow p-2 border ${darkMode
                            ? "border-gray-600 bg-gray-800 text-white"
                            : "border-gray-300 bg-gray-100 text-gray-900"
                            } rounded-l-lg`} />
                    <button
                        onClick={handleAddTodo}
                        className={`px-4 py-2 rounded-r-lg ${darkMode ? "bg-blue-600 text-white" : "bg-blue-500 text-white"
                            }`}>
                        <FaPlus />
                    </button>
                </div>
                <ol className="space-y-4 py-5 max-h-[300px] overflow-y-scroll scrollbar-hidden">
                    {todos.map((todo) => (
                        <li
                            key={todo._id}
                            className={`flex items-center justify-between p-4 border rounded-lg ${darkMode
                                ? "bg-gray-700 border-gray-600 text-gray-100"
                                : "bg-gray-50 border-gray-200 text-gray-900"
                                }`} >
                            <span>{todo.title}</span>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => {
                                        setEditTodo(todo);
                                        setEditTitle(todo.title);
                                        setShowModal(true);
                                    }}
                                    className="text-blue-500" >
                                    <FaEdit />
                                </button>
                                <button
                                    onClick={() => handleDeleteTodo(todo._id)}
                                    className="text-red-500"
                                >
                                    <FaTrashAlt />
                                </button>
                            </div>
                        </li>
                    ))}
                </ol>
            </div>
            {showModal && (
                <div
                    className={`fixed inset-0 ${darkMode ? "bg-black bg-opacity-70" : "bg-gray-900 bg-opacity-50"
                        } flex items-center justify-center`}
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className={`p-6 rounded-lg shadow-lg w-96 transition-all ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
                            }`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2
                            className={`text-xl mb-4 ${darkMode ? "text-gray-100" : "text-gray-900"
                                }`}
                        >
                            Edit Existing Todo
                        </h2>
                        {error && <p className="text-red-500 mb-2">{error}</p>}
                        <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => {
                                setEditTitle(e.target.value);
                                setError("");
                            }}
                            placeholder="Edit your todo here..."
                            className={`w-full p-2 border rounded-lg mb-4 transition-all ${darkMode
                                    ? "bg-gray-700 text-white border-gray-600 focus:ring-yellow-500"
                                    : "bg-gray-100 text-gray-900 border-gray-300 focus:ring-blue-400"
                                } focus:outline-none focus:ring-2`}
                        />
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => setShowModal(false)}
                                className={`px-4 py-2 rounded-lg transition-all ${darkMode
                                        ? "bg-gray-600 text-gray-200 hover:bg-gray-500"
                                        : "bg-gray-300 text-gray-800 hover:bg-gray-400"
                                    }`}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    const validationError = validateTodo(editTitle);
                                    if (validationError) {
                                        setError(validationError);
                                        return;
                                    }
                                    handleUpdateTodo();
                                    setShowModal(false);
                                }}
                                className={`px-4 py-2 rounded-lg transition-all ${darkMode
                                        ? "bg-blue-600 text-white hover:bg-blue-500"
                                        : "bg-blue-500 text-white hover:bg-blue-600"
                                    }`}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Todo;
