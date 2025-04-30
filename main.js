document.addEventListener("DOMContentLoaded", () => {
  // Select page elements
  const input = document.querySelector(".input"); // Input field for task text
  const submit = document.querySelector(".add"); // Button to add new tasks
  const tasksDiv = document.querySelector(".tasks"); // Container for displaying tasks
  const taskCounter = document.querySelector(".task-counter"); // Task counter element
  const toggleDarkModeButton = document.querySelector(".toggle-dark-mode"); // Button to toggle dark mode
  const body = document.body; // Body element for applying dark mode

  // Retrieve tasks from localStorage or initialize an empty array
  let arrayOfTasks = JSON.parse(localStorage.getItem("tasks")) || [];

  // Default tasks to display on the first visit
  const defaultTasks = [
    { id: 1, title: "◆ Add your own tasks using the input above", completed: false, isDefault: true },
    { id: 2, title: "◆ Click here to mark a task as done", completed: true, isDefault: true },
    { id: 3, title: "◆ Click the delete button to remove a task", completed: false, isDefault: true },
  ];

  // Add default tasks on the first visit
  if (!localStorage.getItem("hasVisited")) {
    arrayOfTasks = [...defaultTasks]; // Copy default tasks into the task array
    localStorage.setItem("hasVisited", "true"); // Mark that the user has visited
    saveTasks(); // Save default tasks to localStorage
  }

  // Function to render tasks on the page
  function renderTasks() {
    tasksDiv.innerHTML = ""; // Clear the task container
    arrayOfTasks.forEach((task) => {
      // Create a task element
      const div = document.createElement("div");
      div.className = `task ${task.completed ? "done" : ""}`; // Add "done" class if the task is completed
      div.setAttribute("data-id", task.id); // Set a unique ID for the task
      div.appendChild(document.createTextNode(task.title)); // Add the task title

      // Create a delete button for the task
      const span = document.createElement("span");
      span.className = "del";
      span.appendChild(document.createTextNode("Delete"));
      div.appendChild(span);

      // Append the task element to the task container
      tasksDiv.appendChild(div);
    });
    updateTaskCounter(); // Update the task counter after rendering
  }

  // Function to add a new task
  function addTask(title) {
    // Remove default tasks if they exist
    arrayOfTasks = arrayOfTasks.filter((task) => !task.isDefault);

    const task = { id: Date.now(), title, completed: false, isDefault: false }; // Create a new task object
    arrayOfTasks.push(task); // Add the task to the array
    saveTasks(); // Save the updated task array to localStorage
    renderTasks(); // Re-render the tasks
  }

  // Function to delete a task
  function deleteTask(taskId) {
    arrayOfTasks = arrayOfTasks.filter((task) => task.id != taskId); // Remove the task from the array
    saveTasks(); // Save the updated task array to localStorage
    renderTasks(); // Re-render the tasks
  }

  // Function to toggle the completion status of a task
  function toggleTaskStatus(taskId) {
    arrayOfTasks = arrayOfTasks.map((task) =>
      task.id == taskId ? { ...task, completed: !task.completed } : task
    ); // Toggle the "completed" property of the task
    saveTasks(); // Save the updated task array to localStorage
    renderTasks(); // Re-render the tasks
  }

  // Function to save tasks to localStorage
  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(arrayOfTasks)); // Save the task array as a JSON string
  }

  // Function to update the task counter
  function updateTaskCounter() {
    taskCounter.textContent = `Tasks: ${arrayOfTasks.length}`; // Update the counter with the number of tasks
  }

  // Event listener for adding a new task
  submit.addEventListener("click", () => {
    if (input.value.trim()) {
      addTask(input.value.trim()); // Add the task if the input is not empty
      input.value = ""; // Clear the input field
    }
  });

  // Event listener for task interactions (delete or toggle completion)
  tasksDiv.addEventListener("click", (e) => {
    const taskId = e.target.getAttribute("data-id") || e.target.parentElement.getAttribute("data-id");
    if (e.target.classList.contains("del")) {
      deleteTask(taskId); // Delete the task if the delete button is clicked
    } else if (e.target.classList.contains("task")) {
      e.target.classList.toggle("done"); // Toggle the "done" class for visual feedback
      toggleTaskStatus(taskId); // Update the task's completion status in the array
    }
  });

  // Event listener for toggling dark mode
  toggleDarkModeButton.addEventListener("click", () => {
    body.classList.toggle("dark-mode"); // Toggle the "dark-mode" class on the body
    toggleDarkModeButton.textContent = body.classList.contains("dark-mode")
      ? "Light Mode"
      : "Dark Mode"; // Update the button text based on the current mode
  });

  // Initial render of tasks
  renderTasks();
});