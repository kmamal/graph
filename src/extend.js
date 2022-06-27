const { Graph } = require('./graph')
const { noop } = require('@kmamal/util/function/noop')

const extend1 = (extensions) => {
	const Extended = class extends Graph {}
	for (const extension of extensions) {
		for (const [ key, handler ] of Object.entries(extension)) {
			Extended.prototype[key] ??= Graph.prototype[key] ?? noop
			const next = Extended.prototype[key]
			Extended.prototype[key] = function (...args) {
				return handler.call(this, next, ...args)
			}
		}
	}
	return Extended
}

const extend2 = (extensions) => {
	let Constructor = Graph
	for (const Extension of extensions) {
		Constructor = class extends Extension {}
	}
	return Constructor
}

module.exports = { extend: extend1 }
