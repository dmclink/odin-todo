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

	// start screen in dark mode if user prefers dark
	if (window.matchMedia('(prefers-color-scheme: dark').matches) {
		dc.toggleDarkMode();
	}

	// bind event for dark mode toggle button
	document
		.querySelector('#header__dark-toggle')
		.addEventListener('click', () => {
			dc.toggleDarkMode();
		});

	// bind event to open modal
	document.querySelector('#header__add-btn').addEventListener('click', () => {
		dc.showModal();
	});

	// bind event to close modal on cancel button click
	document.querySelector('#new-todo__cancel').addEventListener('click', () => {
		dc.closeModal();
	});

	// DELETE: attaching to window so we can test in command line
	window.pm = pm;

	// initially populate projects list
	const projects = pm.listProjectNamesAndCounts();
	dc.renderProjectsList(projects);
});
