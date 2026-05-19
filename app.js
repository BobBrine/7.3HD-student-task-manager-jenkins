const express = require("express");

const app = express();

app.use(express.json());

let tasks = [
  { id: 1, title: "Study Jenkins" },
  { id: 2, title: "Finish report" }
];

app.get("/", (req, res) => {
  res.send("Welcome to Student Task Manager");
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    app: "Student Task Manager",
    message: "App is running"
  });
});

app.get("/tasks", (req, res) => {
  res.json(tasks);
});

app.post("/tasks", (req, res) => {
  const newTask = {
    id: tasks.length + 1,
    title: req.body.title
  };

  tasks.push(newTask);

  res.status(201).json(newTask);
});

app.delete("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);

  tasks = tasks.filter(task => task.id !== id);

  res.json({ message: "Task deleted" });
});

module.exports = app;