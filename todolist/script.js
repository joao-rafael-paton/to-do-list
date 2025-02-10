const input = document.getElementById('item');
const addButton = document.querySelector('.buttonadd');
const todoList = document.querySelector('.todo-list');
const filterButtons = document.querySelectorAll('.filter-btn');
const stats = document.querySelector('.stats');
let todos = [];
let currentFilter = 'all';


//SALVAR LOCALMENTE
function loadTodos() {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
        todos = JSON.parse(savedTodos);
        todos.forEach(todo => createTodoElement(todo.text, todo.completed));
    }
    updateStats();
}

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
    updateStats();
}

function updateStats() {
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    const pending = total - completed;
    stats.textContent = `Total: ${total} | Concluídas: ${completed} | Pendentes: ${pending}`;
}

//CRIANDO A TAREFA

function createTodoElement(text, completed = false) {
    const todoItem = document.createElement('div');
    todoItem.className = 'todo-item';
    
    todoItem.innerHTML = `
        <span class="todo-text ${completed ? 'completed' : ''}">${text}</span>
        <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
    `;

    //ADD
    
    todoItem.querySelector('.todo-text').addEventListener('click', () => {
        const isCompleted = todoItem.querySelector('.todo-text').classList.toggle('completed');
        const index = todos.findIndex(todo => todo.text === text);
        if (index !== -1) {
            todos[index].completed = isCompleted;
            saveTodos();
            applyFilter(currentFilter);
        }
    });
    
    //REMOVE
    
    todoItem.querySelector('.delete-btn').addEventListener('click', () => {
        todoItem.remove();
        todos = todos.filter(todo => todo.text !== text);
        saveTodos();
        applyFilter(currentFilter);
    });

    todoList.appendChild(todoItem);
    applyFilter(currentFilter);
}

//FILTRO

function applyFilter(filter) {
    currentFilter = filter;
    const items = todoList.querySelectorAll('.todo-item');
    
    items.forEach(item => {
        const isCompleted = item.querySelector('.todo-text').classList.contains('completed');
        switch(filter) {
            case 'completed':
                item.classList.toggle('hidden', !isCompleted);
                break;
            case 'pending':
                item.classList.toggle('hidden', isCompleted);
                break;
            default:
                item.classList.remove('hidden');
        }
    });

    filterButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === filter);
    });
}

function addTodo() {
    const text = input.value.trim();
    if (!text) return;

    todos.push({ text, completed: false });
    createTodoElement(text);
    saveTodos();
    input.value = '';
}

//ADICIONAR COM ENTER

addButton.addEventListener('click', addTodo);
input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTodo();
});

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        applyFilter(btn.dataset.filter);
    });
});

loadTodos();