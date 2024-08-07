export default class TaskManager {
  constructor() {
    this.currentId = JSON.parse(localStorage.getItem("currentId")) || 0;
    this.tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  }

  addTask(name, description, assignedTo, dueDate, status = "To-Do") {
    this.currentId++;
    const theNewTask = {
      id: this.currentId,
      name: name,
      description: description,
      assignedTo: assignedTo,
      dueDate: dueDate,
      status: status,
    };

    this.tasks.push(theNewTask);
    this.saveTasks();
  }

  updateTask(id, updatedData) {
    const taskIndex = this.tasks.findIndex((task) => task.id === id);
    if (taskIndex > -1) {
      this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...updatedData };
      this.saveTasks();
      this.update_list();
    }
  }

  deleteTask(id) {
    this.tasks = this.tasks.filter((task) => task.id !== id);
    this.saveTasks();
    this.update_list();
  }

  saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(this.tasks));
    localStorage.setItem("currentId", this.currentId);
  }

  update_list() {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      const allTasks = JSON.parse(savedTasks);

      let todoTasksHTML = "";
      let inProgressTasksHTML = "";
      let reviewTasksHTML = "";
      let doneTasksHTML = "";

      for (const task of allTasks) {
        if (task.status === "To-Do") {
          todoTasksHTML += renderTaskHTML(task);
        } else if (task.status === "In-Progress") {
          inProgressTasksHTML += renderTaskHTML(task);
        } else if (task.status === "Review") {
          reviewTasksHTML += renderTaskHTML(task);
        } else if (task.status === "Done") {
          doneTasksHTML += renderTaskHTML(task);
        }
      }

      document.getElementById("to-do").innerHTML = todoTasksHTML;
      document.getElementById("in-progress").innerHTML = inProgressTasksHTML;
      document.getElementById("review").innerHTML = reviewTasksHTML;
      document.getElementById("done").innerHTML = doneTasksHTML;

      // Reattach event listeners
      this.attachEventListeners();
    }
  }

  attachEventListeners() {
    const updateButtons = document.querySelectorAll(".btn-update");
    const deleteButtons = document.querySelectorAll(".btn-delete");

    updateButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        const taskId = parseInt(event.target.dataset.taskId);
        const task = this.tasks.find((t) => t.id === taskId);
        if (task) {
          document.getElementById("task-name").value = task.name;
          document.getElementById("task-desc").value = task.description;
          document.getElementById("assignee").value = task.assignedTo;
          document.getElementById("due-date").value = task.dueDate;
          document.getElementById("status-code").value = task.status;

          const saveBtn = document.getElementById("task-save-btn");
          saveBtn.innerText = "Update";
          saveBtn.setAttribute("data-task-id", taskId);
        }
        // Implement your update logic here, e.g., show a modal for editing
        // this.updateTask(taskId, { status: 'Updated Status' }); // Example update
      });
    });

    deleteButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        const taskId = parseInt(event.target.dataset.taskId);
        this.deleteTask(taskId);
      });
    });
  }
}

function renderTaskHTML(task) {
  let actionButtons = "";
  if (task.status === "To-Do") {
    actionButtons = `
        <a href="#" class="btn btn-secondary btn-update" data-task-id="${task.id}">Update</a>
        <a href="#" class="btn btn-danger btn-delete" data-task-id="${task.id}">Delete</a>
      `;
  } else if (task.status === "In-Progress") {
    actionButtons = `<a href="#" class="btn btn-warning btn-update" data-task-id="${task.id}">Update</a>`;
  } else if (task.status === "Review") {
    actionButtons = `<a href="#" class="btn btn-info btn-update" data-task-id="${task.id}">Update</a>`;
  } else if (task.status === "Done") {
    actionButtons = `<a href="#" class="btn btn-success btn-update disabled" data-task-id="${task.id}"  aria-disabled="true">Done</a>`;
  }

  return `
      <div class="card mt-2" style="width: 15rem;">
        <div class="card-body">
          <h5 class="card-title text-center">${task.name}</h5>
          <hr/>
          <h6 class="sub-title">Description</h6>
          <p class="card-text">${task.description}</p>
        </div>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">
            <div class="hstack gap-3">
              <div class="p-1 sub-title">Assigned To
                <p>${task.assignedTo}</p>
              </div>
              <div class="p-1 sub-title">Due Date
                <p>${task.dueDate}</p>
              </div>
            </div>
          </li>
          <li class="list-group-item">Status: <span>${task.status}</span></li>
        </ul>
        <div class="card-body">
          ${actionButtons}
        </div>
      </div>
    `;
}

// Example usage:
document.addEventListener("DOMContentLoaded", () => {
  const taskManager = new TaskManager();
  taskManager.update_list(); // This will load and render tasks from localStorage
});

