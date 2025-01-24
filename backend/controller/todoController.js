import todoModel from "../model/todoModels.js";
// Get all todos
export const getTodos = async (req, res) => {
  try {
    const todos = await todoModel.find().sort({ createdAt: -1 });
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch todos", error });
  }
};

// Get a single todo by ID
export const getTodoById = async (req, res) => {
  const { id } = req.params;
  try {
    const todo = await todoModel.findById(id);
    if (!todo) return res.status(404).json({ message: "Todo not found" });
    res.status(200).json(todo);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch the todo", error });
  }
};

// Create a new todo
export const createTodo = async (req, res) => {
  const { title } = req.body;
  try {
    const newTodo = new todoModel({ title });
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ message: "Failed to create todo", error });
  }
};

// Update a todo by ID
export const updateTodo = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  try {
    const updatedTodo = await todoModel.findByIdAndUpdate(
      id,
      { title },
      { new: true, runValidators: true }
    );
    if (!updatedTodo) return res.status(404).json({ message: "Todo not found" });
    res.status(200).json(updatedTodo);
  } catch (error) {
    res.status(500).json({ message: "Failed to update the todo", error });
  }
};

// Delete a todo by ID
export const deleteTodo = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedTodo = await todoModel.findByIdAndDelete(id);
    if (!deletedTodo) return res.status(404).json({ message: "Todo not found" });
    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete the todo", error });
  }
};
