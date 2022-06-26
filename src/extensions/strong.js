
const extension = {
	_init (next, options) {
		next.call(this, options)

		this._nodes = new Set()
		this._edges = new Set()
	},

	_initNode (next, node, options) {
		next.call(this, node, options)
		this._nodes.add(node)
	},

	_initEdge (next, edge, source, target, options) {
		next.call(this, edge, source, target, options)
		this._edges.add(edge)
	},

	removeNode (next, node) {
		this._nodes.delete(node)
		next.call(this, node)
	},

	removeEdge (next, edge) {
		this._edges.delete(edge)
		next.call(this, edge)
	},

	nodes () { return this._nodes },
	edges () { return this._edges },
}

module.exports = extension
