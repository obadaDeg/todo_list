export default class Task {
  static getDefaultTitle() {
    return "Task";
  }

  constructor(title = Task.getDefaultTitle()) {
    this.title = title;
    this.done = false;
    this._taskID = Task.count++;
    // console.log("Task constructor");
  }

  toggle() {
    this.done = !this.done;
  }

  edit(newTitle) {
    this.title = newTitle;
  }

  createHTML() {
    const task = document.createElement("div");
    task.classList.add("task");
    task.innerHTML = `
              <div class="task-flex">
                <div class="task-content">
                  <span class="task-text">${this.title}</span>
                </div>
                <div class="task-operations">
                  <input type="checkbox" class="task-checkbox" ${
                    this.done ? "checked" : ""
                  } />
                  <button class="task-modify">
                    <i class="fa-solid fa-pen"></i>
                  </button>
                  <button class="task-delete">
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </div>
              </div>
          `;
    return task;
  }

  static filterTasks(tasks, filterType) {
    if (filterType === "done") {
      return tasks.filter((task) => task.done);
    } else if (filterType === "todo") {
      return tasks.filter((task) => !task.done);
    } else {
      return tasks;
    }
  }

  static count = 1;

  static saveTasks(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  static loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const tasksObject = tasks.map((task) => {
      const newTask = new Task(task.title);
      newTask.done = task.done;
      newTask._taskID = task._taskID;
      return newTask;
    });
    return tasksObject ? tasksObject : [];
  }

  static clearTasks() {
    localStorage.removeItem("tasks");
  }

  static clearDoneTasks(tasks) {
    return tasks.filter((task) => !task.done);
  }

  static sortTasks(tasks) {
    return tasks.sort((a, b) => a.done - b.done);
  }

  static getTaskByID(tasks, taskID) {
    return tasks.find((task) => task._taskID === taskID);
  }

  static deleteTask(tasks, taskID) {
    return tasks.filter((task) => task._taskID !== taskID);
  }
}
