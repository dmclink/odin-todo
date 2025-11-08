import '../css/style.css';
import ProjectManager from './projectmanager.js';
import DisplayController from './displaycontroller.js';
import st from './store.js';
import reviver from './reviver.js';

document.addEventListener('DOMContentLoaded', () => {
	st.bindEvents();

	const data = st.retrieveData();
	let pm;
	if (data) {
		pm = JSON.parse(data, reviver);
	} else {
		pm = new ProjectManager();
	}

	pm.bindEvents();

	const defaultProjectId = pm.getProject().id;
	const dc = new DisplayController(defaultProjectId);
	dc.bindEvents();

	pm.init();

	// start screen in dark mode if user prefers dark
	if (window.matchMedia('(prefers-color-scheme: dark').matches) {
		dc.toggleDarkMode();
	}
});
