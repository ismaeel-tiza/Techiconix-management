document.getElementById('project-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;

    const projects = JSON.parse(localStorage.getItem('projects')) || [];
    projects.push({ name });
    localStorage.setItem('projects', JSON.stringify(projects));

    alert('Project created!');
    window.location.href = 'home.html';
});
