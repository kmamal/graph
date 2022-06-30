
class Node {
	constructor (...args) {
		this._graph._initNode(this, ...args)
	}

	incomingNum () { return this._graph.incomingNum(this) }
	outgoingNum () { return this._graph.outgoingNum(this) }
	adjacentNum () { return this._graph.adjacentNum(this) }

	incoming () { return this._graph.incoming(this) }
	outgoing () { return this._graph.outgoing(this) }
	adjacent () { return this._graph.adjacent(this) }

	opposite (edge) { return this._graph.opposite(edge, this) }

	parentsNum () { return this._graph.parentsNum(this) }
	childrenNum () { return this._graph.childrenNum(this) }
	neighborsNum () { return this._graph.neighborsNum(this) }

	parents () { return this._graph.parents(this) }
	children () { return this._graph.children(this) }
	neighbors () { return this._graph.neighbors(this) }

	getEdgesNumTo (other) { return this._graph.getEdgesNum(this, other) }
	getEdgesNumFrom (other) { return this._graph.getEdgesNum(other, this) }

	getEdgesTo (other) { return this._graph.getEdges(this, other) }
	getEdgesFrom (other) { return this._graph.getEdges(other, this) }

	edgeTo (target) { return new this._graph.Edge(this, target) }
	edgeFrom (source) { return new this._graph.Edge(source, this) }

	remove () { this._graph.removeNode(this) }
}

module.exports = { Node }
