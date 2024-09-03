const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');


const getTasksFromStorage = () => JSON.parse(localStorage.getItem('tasks')) || [];
const saveTasksToStorage = tasks => localStorage.setItem('tasks', JSON.stringify(tasks));

// Render tasks to the DOM
const renderTasks = () => 
	{
    const tasks = getTasksFromStorage();
    taskList.innerHTML = '';
    tasks.forEach(({ id, content, completed }) => 
	{
        const taskItem = document.createElement('li');
        taskItem.className = `task-item ${completed ? 'completed' : ''}`;
        taskItem.innerHTML = `
            <div class="task-content">${content}</div>
            <div class="task-buttons">
                <button class="edit-btn" data-id="${id}">Edit</button>
                <button class="complete-btn" data-id="${id}">${completed ? 'Undo' : 'Completed'}</button>
                <button class="delete-btn" data-id="${id}">Delete</button>
            </div>
        `;
        taskList.appendChild(taskItem);
    });
};

// Add task
const addTask = () => 
{
    const taskContent = taskInput.value.trim(); 
    if (!taskContent) 
	{
        alert("Feild is Empty!!! Please enter.");
        return;
    }

    const tasks = getTasksFromStorage();
    const newTask = 
	{
        id: Date.now().toString(),
        content: taskContent,
        completed: false
    };
    tasks.push(newTask);
    saveTasksToStorage(tasks);
    renderTasks();
    taskInput.value = '';
};

// Edit task
const editTask = id => 
{
    const tasks = getTasksFromStorage();
    const taskIndex = tasks.findIndex(task => task.id === id);
    const newContent = prompt('Edit your task:', tasks[taskIndex].content);
    if (newContent !== null && newContent.trim() !== '') 
	{
        tasks[taskIndex].content = newContent.trim();
        saveTasksToStorage(tasks);
        renderTasks();
    }
};

// Delete task
const deleteTask = id => 
	{
    const tasks = getTasksFromStorage();
    const updatedTasks = tasks.filter(task => task.id !== id);
    saveTasksToStorage(updatedTasks);
    renderTasks();
};

// Mark a task as completed
const toggleCompleteTask = id => 
	{
    const tasks = getTasksFromStorage();
    const task = tasks.find(task => task.id === id);
    task.completed = !task.completed;
    saveTasksToStorage(tasks);
    renderTasks();
};

addTaskBtn.addEventListener('click', addTask);


taskInput.addEventListener('keydown', e => 
{
    if (e.key === 'Enter') 
	{
        addTask();
    }
});

taskList.addEventListener('click', e => 
{
    const { target } = e;
    const { id } = target.dataset;

    if (target.classList.contains('edit-btn')) 
	{
        editTask(id);
    } 
	else if (target.classList.contains('delete-btn')) 
	{
        deleteTask(id);
    } 
	else if (target.classList.contains('complete-btn')) 
	{
        toggleCompleteTask(id);
    }
});

document.addEventListener('DOMContentLoaded', renderTasks);
