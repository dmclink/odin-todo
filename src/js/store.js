import em from './events.js';

export default {
	bindEvents() {
		em.on('updateStore', (jsonData) => {
			localStorage.setItem('projectsData', jsonData);
		});
	},
	retrieveData() {
		return localStorage.getItem('projectsData');
	},
};
