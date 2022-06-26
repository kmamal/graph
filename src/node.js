
class Node {
	constructor (...args) {
		this._graph._initNode(this, ...args)
	}

	incoming () { return this._graph.incoming(this) }
	outgoing () { return this._graph.outgoing(this) }
	adjacent () { return this._graph.adjacent(this) }

	opposite (edge) { return this._graph.opposite(edge, this) }

	parents () { return this._graph.parents(this) }
	children () { return this._graph.children(this) }
	neighbors () { return this._graph.neighbors(this) }

	edgeTo (target) { return new this._graph.Edge(this, target) }
	edgeFrom (source) { return new this._graph.Edge(source, this) }

	remove () { this._graph.removeNode(this) }
}

module.exports = { Node }
