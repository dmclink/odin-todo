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
	pm.bindEvents();
	const defaultProjectId = pm.getProject().id;

	const dc = new DisplayController(defaultProjectId);
	dc.bindEvents();

	// start screen in dark mode if user prefers dark
	if (window.matchMedia('(prefers-color-scheme: dark').matches) {
		dc.toggleDarkMode();
	}

	// DELETE: attaching to window so we can test in command line
	window.pm = pm;
	window.dc = dc;

	// initially populate projects list
	const projects = pm.listProjectNamesAndCounts();
	dc.renderProjectsList(projects);

	// initialize header for the default selection
	dc.updateHeader();
});
