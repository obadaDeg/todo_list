import Task from "./TaskModule.js";
import formValidator from "./formValidator.js";

const tasksContainer = document.querySelector(".todo-list-container");
const tasks = Task.loadTasks();
const newTaskForm = document.querySelector(".input-container");
const newTaskInput = newTaskForm.querySelector("#task-input");
const errorMessege = document.querySelector(".error");
const renameErrorMessege = document.querySelector(".rename-error");
const deleteDoneTasksButton = document.querySelector(".delete-done-btn");
const deleteAllTasksButton = document.querySelector(".delete-all-btn");
const filterButtons = document.querySelectorAll(".filter-btn");

const filterType = ["all", "done", "todo"];
let currentFilter = "all";

const renameModal = document.getElementById("rename-modal");
const deleteModal = document.getElementById("delete-modal");
const deleteDoneModal = document.getElementById("delete-done-modal");
const deleteAllModal = document.getElementById("delete-all-modal");
const renameInput = document.getElementById("rename-input");
const okBtn = document.getElementById("ok-btn");
const saveBtn = document.getElementById("save-btn");
const cancelBtn = document.getElementById("cancel-btn");
const confirmBtn = document.getElementById("confirm-btn");
const cancelDeleteBtn = document.getElementById("cancel-delete-btn");
const cancelDeleteDoneBtn = document.getElementById("cancel-delete-done-btn");
const cancelDeleteAllBtn = document.getElementById("cancel-delete-all-btn");
const confirmAllBtn = document.getElementById("confirm-all-btn");
const confirmDoneBtn = document.getElementById("confirm-done-btn");

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
  deleteDoneModal.classList.add("hidden");
  deleteAllModal.classList.add("hidden");
  currentTask = null;
};

const renderTasks = (tasks) => {
  tasksContainer.innerHTML = "";
  tasks.forEach((task) => {
    tasksContainer.appendChild(task.createHTML());
  });
};

tasksContainer.addEventListener("click", (e) => {
  const taskElement = e.target.closest(".task");
  if (!taskElement) return;
  const taskID = parseInt(taskElement.getAttribute("data-task-id"), 10);
  const task = tasks.find((t) => t._taskID === taskID);

  const modifyButton = e.target.closest(".task-modify");
  const deleteButton = e.target.closest(".task-delete");
  const checkbox = e.target.closest(".task-checkbox");

  if (modifyButton) {
    openRenameModal(task);
  } else if (deleteButton) {
    openDeleteModal(task);
  } else if (checkbox) {
    task.toggle();
    Task.saveTasks(tasks);
    const filteredTasks = Task.filterTasks(tasks, currentFilter); 
    renderTasks(filteredTasks);
    updateButtonStates();
  }
});


newTaskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const validationError = formValidator.validateTaskInput(
    newTaskInput.value.trim()
  );
  if (validationError) {
    errorMessege.innerHTML =
      '<i class="fa-solid fa-circle-exclamation"></i>' + validationError;
    return;
  }
  errorMessege.textContent = "";
  const task = new Task(newTaskInput.value.trim());
  tasks.push(task);
  Task.saveTasks(tasks);
  renderTasks(tasks);
  updateButtonStates();
  newTaskInput.value = "";
});

window.addEventListener("load", () => {
  renderTasks(tasks);
});

filterButtons.forEach((button, index) => {
  button.setAttribute("data-filter", filterType[index]);
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    const filteredTasks = Task.filterTasks(tasks, currentFilter);
    renderTasks(filteredTasks);
  });
});

deleteAllTasksButton.addEventListener("click", (e) => {
  deleteAllModal.classList.remove("hidden");
});
deleteDoneTasksButton.addEventListener("click", (e) => {
  deleteDoneModal.classList.remove("hidden");
});

const updateButtonStates = () => {
  const hasTasks = tasks.length > 0;
  const hasDoneTasks = tasks.some((task) => task.done);

  deleteAllTasksButton.disabled = !hasTasks;
  deleteDoneTasksButton.disabled = !hasDoneTasks;

  deleteAllTasksButton.classList.toggle("disabled", !hasTasks);
  deleteDoneTasksButton.classList.toggle("disabled", !hasDoneTasks);
};



window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeModals();
  }
});

window.addEventListener("keydown", (e) => {
  if (e.key === "/") {
    e.preventDefault();
    newTaskInput.select();

  }
});

confirmDoneBtn.addEventListener("click", () => {
  let filteredTasks = tasks.filter((task) => !task.done);
  tasks.splice(0, tasks.length, ...filteredTasks);
  Task.saveTasks(tasks);
  renderTasks(tasks);
  closeModals();
  updateButtonStates();
});

confirmAllBtn.addEventListener("click", () => {
  Task.clearTasks();

  while (tasks.length > 0) {
    tasks.pop();
  }

  renderTasks(tasks);
  closeModals();
  updateButtonStates();
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
  const validationError = formValidator.validateTaskInput(
    renameInput.value.trim()
  );
  if (validationError) {
    renameErrorMessege.innerHTML =
      '<i class="fa-solid fa-circle-exclamation"></i>' + validationError;
    return;
  }
  okBtn.classList.remove("hidden");
  currentTask.edit(renameInput.value.trim());
  Task.saveTasks(tasks);
  renderTasks(tasks);
  closeModals();
});

cancelBtn.addEventListener("click", () => {
  renameErrorMessege.textContent = "";
  okBtn.classList.remove("hidden");
  closeModals();
});

confirmBtn.addEventListener("click", () => {
  tasks.splice(tasks.indexOf(currentTask), 1);
  Task.saveTasks(tasks);
  renderTasks(tasks);
  closeModals();
});

cancelDeleteBtn.addEventListener("click", closeModals);
cancelDeleteDoneBtn.addEventListener("click", closeModals);
cancelDeleteAllBtn.addEventListener("click", closeModals);

window.addEventListener("click", (e) => {
  if (
    e.target === renameModal ||
    e.target === deleteModal ||
    e.target === deleteDoneModal ||
    e.target === deleteAllModal
  ) {
    closeModals();
  }
});
