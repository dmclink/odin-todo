import '../css/style.css';
import ProjectManager from './projectmanager.js';
import DisplayController from './displaycontroller.js';

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

	// initially populate projects list
	const projects = pm.listProjectNamesAndCounts();
	dc.renderProjectsList(projects, true);

	// initialize header for the default selection
	dc.updateHeader();
});
