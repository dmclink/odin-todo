class EventEmitter {
	#events;

	constructor() {
		this.#events = {};
	}

	on(name, fn) {
		this.#events[name] = this.#events[name] || [];
		this.#events[name].push(fn);
	}

	off(name, rmFn) {
		if (this.#events[name]) {
			this.#events[name] = this.#events[name].filter((fn) => fn !== rmFn);
		}
	}

	emit(name, ...args) {
		if (this.#events[name]) {
			this.#events[name].forEach((fn) => {
				fn(...args);
			});
		}
	}
}

export default new EventEmitter();
