document.addEventListener('DOMContentLoaded', function() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!loggedInUser) {
        window.location.href = 'login.html';
        return;
    }

    // Load projects
    const projects = JSON.parse(localStorage.getItem('projects')) || [];
    const projectList = document.getElementById('project-list');
    projects.forEach(project => {
        const li = document.createElement('li');
        li.textContent = project.name;
        projectList.appendChild(li);
    });

    // Load tasks
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    console.log('Retrieved tasks:', tasks);

    // Filter tasks assigned to the logged-in user
    const userTasks = tasks.filter(task => task.assignee === loggedInUser.email);

    const newTasksList = document.getElementById('new-tasks');
    const inProgressTasksList = document.getElementById('in-progress-tasks');
    const completedTasksList = document.getElementById('completed-tasks');

    userTasks.forEach(task => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${task.details}</strong> (Assigned to: ${task.assignee}, Due: ${task.dueDate})<br>
            Description: ${task.description}<br>
            Status: ${task.status}<br>
            ${task.attachment ? `Attachment: ${task.attachment}<br>` : ''}
            ${task.status !== 'Completed' ? `
                <button onclick="updateStatus(${task.taskId}, 'Completed')">Complete</button>
                <button onclick="updateStatus(${task.taskId}, 'In Progress')">In Progress</button>
                <button onclick="updateStatus(${task.taskId}, 'Changes Required')">Changes Required</button>
                <form id="comment-form-${task.taskId}" onsubmit="addComment(event, ${task.taskId})">
                    <label for="comment">Comment:</label>
                    <input type="text" id="comment-${task.taskId}" name="comment" required>
                    <label for="comment-attachment">Attach File:</label>
                    <input type="file" id="comment-attachment-${task.taskId}" name="comment-attachment">
                    <button type="submit">Add Comment</button>
                </form>
            ` : ''}
            <div id="comments-${task.taskId}">
                ${task.comments.map(comment => `<p>${comment.text} ${comment.attachment ? ` (Attachment: ${comment.attachment})` : ''}</p>`).join('')}
            </div>
        `;

        if (task.status === 'In Progress') {
            inProgressTasksList.appendChild(li);
        } else if (task.status === 'Completed') {
            completedTasksList.appendChild(li);
        } else {
            newTasksList.appendChild(li);
        }
    });
});

function updateStatus(taskId, status) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskIndex = tasks.findIndex(task => task.taskId === taskId);
    if (taskIndex !== -1) {
        tasks[taskIndex].status = status;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        window.location.reload();
    }
}

function addComment(event, taskId) {
    event.preventDefault();
    const commentText = document.getElementById(`comment-${taskId}`).value;
    const commentAttachment = document.getElementById(`comment-attachment-${taskId}`).files[0];

    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskIndex = tasks.findIndex(task => task.taskId === taskId);
    if (taskIndex !== -1) {
        tasks[taskIndex].comments.push({ text: commentText, attachment: commentAttachment ? commentAttachment.name : '' });
        localStorage.setItem('tasks', JSON.stringify(tasks));
        window.location.reload();
    }
}
