import Task from "/scripts/TaskModule.js";

const tasksContainer = document.querySelector(".todo-list-container");
const tasks = Task.loadTasks();
const newTaskForm = document.querySelector(".input-container");
const newTaskInput = newTaskForm.querySelector("#task-input");
const errorMessege = document.querySelector(".error");
const deleteAllTasksButtons = document.querySelectorAll(".delete-btn");
const renderTasks = (tasks) => {
  tasksContainer.innerHTML = "";
  tasks.forEach((task) => {
    tasksContainer.appendChild(task.createHTML());
  });
};


newTaskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!newTaskInput.value) {
    errorMessege.textContent = "Please enter a task";
    return;
  } else if (/^\d/.test(newTaskInput.value) || /^[!@#$%^&*(),.?":{}|<>_-]/.test(newTaskInput.value)) {
    errorMessege.textContent = "Task cannot start with a number or special character";
    return;
  } else if (newTaskInput.value.length < 5) {
    errorMessege.textContent = "Task must be at least 5 characters long";
    return;
  }

  errorMessege.textContent = "";
  const task = new Task(newTaskInput.value.trim());
  tasks.push(task);
  Task.saveTasks(tasks);
  renderTasks(tasks);
  newTaskInput.value = "";
});

window.addEventListener("load", () => {
  renderTasks(tasks);
});

deleteAllTasksButtons[1].addEventListener("click", () => {

  Task.clearTasks();  
  
  while (tasks.length > 0) {
    tasks.pop();
  }  
  
  renderTasks(tasks);
  console.log(Task.loadTasks());

});

deleteAllTasksButtons[0].addEventListener("click", () => {
  let tasks = Task.loadTasks();
  tasks = tasks.filter((task) => task.done === true);
  console.log(tasks, "tasks");

  if (Task.loadTasks().length === 0) {
    deleteAllTasksButtons[0].disabled = true;
  }
});

