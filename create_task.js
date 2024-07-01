document.addEventListener('DOMContentLoaded', function() {
    const projects = JSON.parse(localStorage.getItem('projects')) || [];
    const projectSelect = document.getElementById('project');

    projects.forEach(project => {
        const option = document.createElement('option');
        option.value = project.name;
        option.textContent = project.name;
        projectSelect.appendChild(option);
    });
});

document.getElementById('task-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const details = document.getElementById('details').value;
    const description = document.getElementById('description').value;
    const assignee = document.getElementById('assignee').value;
    const dueDate = document.getElementById('dueDate').value;
    const project = document.getElementById('project').value;
    const attachment = document.getElementById('attachment').files[0];

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(user => user.email === assignee);

    if (!user) {
        alert('The assignee email is not registered.');
        return;
    }

    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskId = Date.now(); // unique task ID based on current time
    tasks.push({ taskId, details, description, assignee, dueDate, project, attachment: attachment ? attachment.name : '', status: 'In Progress', comments: [] });
    localStorage.setItem('tasks', JSON.stringify(tasks));

    alert('Task created!');
    window.location.href = 'home.html?newTask=true';
});
