import '../css/style.css';
import ProjectManager from './projectmanager.js';
import DisplayController from './displaycontroller.js';
// DELETE:
import Project from './project.js';
import ToDo from './todo.js';

window.ProjectManager = ProjectManager;
window.Project = Project;
window.ToDo = ToDo;

document.addEventListener('DOMContentLoaded', () => {
	const pm = new ProjectManager();
	const dc = new DisplayController();

	// DELETE: attaching to window so we can test in command line
	window.pm = pm;

	const projects = pm.listProjectNamesAndCounts();
	dc.renderProjectsList(projects);
});
