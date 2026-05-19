const request = require("supertest");
const app = require("../app");

test("home page should return welcome message", async () => {
  const response = await request(app).get("/");

  expect(response.statusCode).toBe(200);
  expect(response.text).toBe("Welcome to Student Task Manager");
});

test("health page should return OK", async () => {
  const response = await request(app).get("/health");

  expect(response.statusCode).toBe(200);
  expect(response.body.status).toBe("OK");
});

test("tasks page should return task list", async () => {
  const response = await request(app).get("/tasks");

  expect(response.statusCode).toBe(200);
  expect(Array.isArray(response.body)).toBe(true);
});

test("should add a new task", async () => {
  const response = await request(app)
    .post("/tasks")
    .send({ title: "Learn DevOps" });

  expect(response.statusCode).toBe(201);
  expect(response.body.title).toBe("Learn DevOps");
});