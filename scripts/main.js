import Task from "./TaskModule.js";

const tasksContainer = document.querySelector(".todo-list-container");
const tasks = Task.loadTasks();
const newTaskForm = document.querySelector(".input-container");
const newTaskInput = newTaskForm.querySelector("#task-input");
const errorMessege = document.querySelector(".error");
const deleteAllTasksButtons = document.querySelectorAll(".delete-btn");
const renameModal = document.getElementById("rename-modal");
const deleteModal = document.getElementById("delete-modal");
const renameInput = document.getElementById("rename-input");
const okBtn = document.getElementById("ok-btn");
const saveBtn = document.getElementById("save-btn");
const cancelBtn = document.getElementById("cancel-btn");
const confirmBtn = document.getElementById("confirm-btn");
const cancelDeleteBtn = document.getElementById("cancel-delete-btn");

let currentTask = null;

const openRenameModal = (task) => {
  currentTask = task;
  renameInput.value = task.title;
  renameModal.classList.remove("hidden");
  saveBtn.classList.add("hidden");
  cancelBtn.classList.add("hidden");
};

const openDeleteModal = (task) => {
  currentTask = task;
  deleteModal.classList.remove("hidden");
};

const closeModals = () => {
  renameModal.classList.add("hidden");
  deleteModal.classList.add("hidden");
  currentTask = null;
};

const renderTasks = (tasks) => {
  tasksContainer.innerHTML = "";
  tasks.forEach((task) => {
    tasksContainer.appendChild(task.createHTML());
  });
};

tasksContainer.addEventListener("click", (e) => {
  const modifyButton = e.target.closest(".task-modify");
  const deleteButton = e.target.closest(".task-delete");

  if (modifyButton) {
    const taskTitle = modifyButton.closest(".task").querySelector(".task-text").textContent;
    const task = tasks.find((t) => t.title === taskTitle);
    openRenameModal(task);
  } else if (deleteButton) {
    const taskTitle = deleteButton.closest(".task").querySelector(".task-text").textContent;
    const task = tasks.find((t) => t.title === taskTitle);
    openDeleteModal(task);
  }
});


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

renameInput.addEventListener("input", () => {
  if (renameInput.value !== currentTask.title) {
    saveBtn.classList.remove("hidden");
    cancelBtn.classList.remove("hidden");
    okBtn.classList.add("hidden");
  } else {
    saveBtn.classList.add("hidden");
    cancelBtn.classList.add("hidden");
    okBtn.classList.remove("hidden");
  }
});

okBtn.addEventListener("click", closeModals);

saveBtn.addEventListener("click", () => {
  okBtn.classList.remove("hidden");
  currentTask.edit(renameInput.value.trim());
  Task.saveTasks(tasks);
  renderTasks(tasks);
  closeModals();
});

cancelBtn.addEventListener("click", ()=>{
  okBtn.classList.remove("hidden")
  closeModals();
});

confirmBtn.addEventListener("click", () => {
  tasks.splice(tasks.indexOf(currentTask), 1);
  Task.saveTasks(tasks);
  renderTasks(tasks);
  closeModals();
});

cancelDeleteBtn.addEventListener("click", closeModals);

window.addEventListener("click", (e) => {
  if (e.target === renameModal || e.target === deleteModal) {
    closeModals();
  }
});