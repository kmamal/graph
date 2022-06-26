
const extension = {
	_init (next, options) {
		next.call(this, options)
		this._nextNodeId = 0
		this._nextEdgeId = 0

		this.Node.prototype.toString = function toString () {
			return this._id
		}

		this.Edge.prototype.toString = function toString () {
			return `${this._id}(${this.source()}->${this.target()})`
		}
	},

	_initNode (next, node, options) {
		next.call(this, node, options)
		node._id = this._nextNodeId++
	},

	_initEdge (next, edge, source, target, options) {
		next.call(this, edge, source, target, options)
		edge._id = this._nextEdgeId++
	},

	toString () {
		return Array
			.from(this.nodes().values())
			.map((node) => {
				const childNodes = Array.from(node.children().values())
				return `${node.toString()} -> ${childNodes.join(', ')}`
			})
			.join('\n')
	},
}

module.exports = extension
