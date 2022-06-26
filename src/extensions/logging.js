
const extension = {
	_init (next, { logger, ...options } = {}) {
		next.call(this, options)
		this._logger = logger
	},

	_initNode (next, node, options) {
		this._logger?.group("creating node")
		next.call(this, node, options)
		this._logger?.groupEnd()
		this._logger?.log("created node", node.toString())
	},

	_initEdge (next, edge, source, target, options) {
		this._logger?.group("creating edge from", source.toString(), "to", target.toString())
		next.call(this, edge, source, target, options)
		this._logger?.groupEnd()
		this._logger?.log("created edge", edge.toString())
	},

	moveEdge (next, edge, source, target, options) {
		if (edge.source() !== undefined) {
			this._logger?.group("moving edge", edge.toString(), "to", source && source.toString(), "->", target && target.toString())
		}
		next.call(this, edge, source, target, options)
		this._logger?.groupEnd()
		this._logger?.log("moved edge", edge.toString())
	},

	removeNode (next, node) {
		this._logger?.group("removing node", node.toString())
		next.call(this, node)
		this._logger?.groupEnd()
		this._logger?.log("removed node", node.toString())
	},

	removeEdge (next, edge) {
		this._logger?.group("removing edge", edge.toString())
		next.call(this, edge)
		this._logger?.groupEnd()
		this._logger?.log("removed edge", edge.toString())
	},
}

module.exports = extension
