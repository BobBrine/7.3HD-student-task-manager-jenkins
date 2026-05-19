const express = require("express");
const client = require("prom-client");
const app = express();

app.use(express.json());
client.collectDefaultMetrics();

const httpRequestCounter = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status"]
});

app.use((req, res, next) => {
  res.on("finish", () => {
    httpRequestCounter.inc({
      method: req.method,
      route: req.route ? req.route.path : req.path,
      status: res.statusCode
    });
  });

  next();
});

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

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

module.exports = app;