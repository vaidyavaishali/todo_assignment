import express from "express";
import {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
} from "../controller/todoController.js";

const todoRouter = express.Router();
todoRouter.get("/get-all-todos", getTodos);
todoRouter.get("/get-todo-by-id/:id", getTodoById);
todoRouter.post("/create-todos", createTodo);
todoRouter.put("/update-todos/:id", updateTodo);
todoRouter.delete("/delete-todos/:id", deleteTodo);

export default todoRouter;
