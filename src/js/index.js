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

	dc.bindEvents();

	// bind event to add new todo
	document.querySelector('#new-todo__add').addEventListener('click', () => {
		const formData = dc.getFormData();
		// check required name field has a value
		if (!formData.get('name')) {
			document
				.querySelector('#new-todo__name')
				.setCustomValidity('Name is required');
			document.querySelector('#new-todo__name').reportValidity();
			return;
		}

		const projectId = dc.selectedProject();
		pm.getProject(projectId).add(
			new ToDo(
				formData.get('name'),
				formData.get('description'),
				formData.get('due-date'),
				formData.get('priority'),
				formData.get('notes')
			)
		);

		const projects = pm.listProjectNamesAndCounts();
		dc.renderProjectsList(projects);
		dc.updateHeader();
		dc.closeModal();
	});

	// DELETE: attaching to window so we can test in command line
	window.pm = pm;
	window.dc = dc;

	// initially populate projects list
	const projects = pm.listProjectNamesAndCounts();
	dc.renderProjectsList(projects);

	// initialize header for the default selection
	dc.updateHeader();
});
