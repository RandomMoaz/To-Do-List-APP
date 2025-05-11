//Initialize variables
const checkboxElems = document.querySelectorAll(".__checkbox");
const todoForm = document.querySelector(".__create_todo");
const todoInput = document.querySelector(".__todo_input");
const toDos = document.querySelector(".__tasks");
const checkbox = document.querySelector(".checkbox__inner");
const themeToggle = document.getElementById("darkmode-toggle");
const header = document.getElementById("__appname");
const tasksContainer = document.querySelector(".__tasks__container");
const pendingText = document.querySelector(".__pending_text");
const statusContainer = document.querySelector(".__status_container");
const statusSelectors = document.querySelectorAll(".statuses");

for (var i = 0; i < statusSelectors.length; i++) {
  statusSelectors[i].addEventListener("click", function (event) {
    filterTodos(event);
  });
}

//todos array
let todos = [];

function toggleTask(id) {
  todos.forEach(function (item) {
    if (item.id == id) {
      item.completed = !item.completed;
    }
  });
  persistTodos(todos);
}

function addToDo(item) {
  if (item != "") {
    const todo = {
      id: Date.now(),
      name: item,
      completed: false,
    };
    todos.push(todo);
    persistTodos(todos);
  }
  todoInput.value = "";
}

function deleteToDo(id) {
  todos = todos.filter((item) => item.id != id);
  persistTodos(todos);
}

function persistTodos(todos) {
  localStorage.setItem("todos", JSON.stringify(todos));
  renderTodos(todos);
}

function filterTodos(event) {
  const filter = event.target.innerHTML;
  document.querySelector(".statuses.active").classList.remove("active");
  event.target.classList.toggle("active");
  let filteredTodos;
  if (filter == "Active") {
    filteredTodos = todos.filter((item) => !item.completed);
  } else if (filter == "Completed") {
    filteredTodos = todos.filter((item) => item.completed);
  } else {
    filteredTodos = todos;
  }
  renderTodos(filteredTodos);
}

function renderTodos(todos) {
  //clear the list
  toDos.innerHTML = "";
  pendingText.innerHTML = "";

  //loop through the todos and render them
  todos.forEach(function (item) {
    const checked = item.completed ? "completed" : null;
    const li = document.createElement("li");
    li.setAttribute("data-key", item.id);

    if (item.completed === true) {
      li.classList.toggle("completed");
    }
    const label = document.createElement("label");
    const input = document.createElement("input");
    input.setAttribute("type", "checkbox");
    input.setAttribute("class", `__checkbox_input ${checked}`);
    const box = document.createElement("span");
    box.setAttribute("class", `checkbox ${checked}`);
    const span = document.createElement("span");
    span.setAttribute("class", "__todo");
    span.innerText = item.name;
    const deleteBtn = document.createElement("button");
    deleteBtn.setAttribute("class", "delete-button");
    deleteBtn.innerHTML = "X";
    label.append(input);
    label.append(box);
    li.append(label);
    li.append(span);
    li.append(deleteBtn);
    toDos.append(li);
  });
  const pendingTodos = todos.filter((x) => !x.completed);
  pendingText.innerHTML = `${pendingTodos.length} items left`;
}

function getTodos() {
  const ref = localStorage.getItem("todos");
  if (ref) {
    todos = JSON.parse(ref);
    renderTodos(todos);
  }
}

getTodos();

//Event listeners
todoForm.addEventListener("submit", function (event) {
  event.preventDefault();
  addToDo(todoInput.value);
});

toDos.addEventListener("click", function (event) {
  if (event.target.type === "checkbox") {
    const item = event.target.parentElement;
    const listItem = item.parentElement;
    toggleTask(listItem.getAttribute("data-key"));
  }

  if (event.target.classList.contains("delete-button")) {
    const item = event.target.parentElement;
    item.classList.add("fall");
    item.addEventListener("transitionend", function () {
      deleteToDo(item.getAttribute("data-key"));
    });
  }
});

themeToggle.addEventListener("change", function (event) {
  document.body.classList.toggle("dark");
  header.classList.toggle("dark");
  todoForm.classList.toggle("dark");
  tasksContainer.classList.toggle("dark");
  statusContainer.classList.toggle("dark");
});
