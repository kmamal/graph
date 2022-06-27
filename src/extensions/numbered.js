
const extension = {
	_init (next, options) {
		next.call(this, options)
		this._nextNodeId = 0
		this._nextEdgeId = 0
	},

	_initNode (next, node, options) {
		next.call(this, node, options)
		node._id = this._nextNodeId++
	},

	_initEdge (next, edge, source, target, options) {
		next.call(this, edge, source, target, options)
		edge._id = this._nextEdgeId++
	},
}

module.exports = extension
