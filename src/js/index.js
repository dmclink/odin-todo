import ProjectManager from './projectmanager.js';
// DELETE:
import Project from './project.js';
import ToDo from './todo.js';

window.ProjectManager = ProjectManager;
window.Project = Project;
window.ToDo = ToDo;

document.addEventListener('DOMContentLoaded', () => {
	const pm = new ProjectManager();
	console.log('hello world');

	// DELETE: attaching to window so we can test in command line
	window.pm = pm;
});
