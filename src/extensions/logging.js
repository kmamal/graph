
const extension = {
	_init (next, { logger, ...options } = {}) {
		next.call(this, options)
		this._logger = logger
	},

	_initNode (next, node, options) {
		this._logger?.group("creating node")
		next.call(this, node, options)
		this._logger?.groupEnd()
		this._logger?.log(`created node ${node}`)
	},

	_initEdge (next, edge, source, target, options) {
		this._logger?.group(`creating edge from ${source} to ${target}`)
		next.call(this, edge, source, target, options)
		this._logger?.groupEnd()
		this._logger?.log(`created edge ${edge}`)
	},

	moveEdge (next, edge, source, target) {
		edge.source() && this._logger?.group(`moving edge ${edge} to ${source} -> ${target}`)
		next.call(this, edge, source, target)
		this._logger?.groupEnd()
		this._logger?.log(`moved edge ${edge}`)
	},

	setSource (next, edge, source) {
		edge.source() && this._logger?.group(`seting source of ${edge} to ${source}`)
		next.call(this, edge, source)
		this._logger?.groupEnd()
		this._logger?.log(`set source of ${edge}`)
	},

	setTarget (next, edge, target) {
		edge.target() && this._logger?.group(`seting target of ${edge} to ${target}`)
		next.call(this, edge, target)
		this._logger?.groupEnd()
		this._logger?.log(`set target of ${edge}`)
	},

	removeNode (next, node) {
		this._logger?.group(`removing node ${node}`)
		next.call(this, node)
		this._logger?.groupEnd()
		this._logger?.log(`removed node ${node}`)
	},

	removeEdge (next, edge) {
		this._logger?.group(`removing edge ${edge}`)
		next.call(this, edge)
		this._logger?.groupEnd()
		this._logger?.log(`removed edge ${edge}`)
	},
}

module.exports = extension
