import Task from "/scripts/TaskModule.js";

const tasksContainer = document.querySelector(".todo-list-container");

const renderTasks = (tasks) => {
  tasksContainer.innerHTML = "";
  tasks.forEach((task) => {
    tasksContainer.appendChild(task.createHTML());
  });
};

Task.saveTasks(tasks);

renderTasks(tasks);

const deleteAllTasksButtons = document.querySelectorAll(".delete-btn");

deleteAllTasksButtons[1].addEventListener("click", () => {

  if(Task.loadTasks().length === 0){
    deleteAllTasksButtons[1].disabled = true;
  }
  
  Task.clearTasks();
  renderTasks([]);
  console.log(Task.loadTasks());
});


deleteAllTasksButtons[0].addEventListener("click", () => {
  let tasks = Task.loadTasks();
  tasks = tasks.filter((task) => task.done === true);
  console.log(tasks, "tasks");
  
  
  if(Task.loadTasks().length === 0 ){
    deleteAllTasksButtons[0].disabled = true;
  }
});