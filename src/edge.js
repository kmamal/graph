
class Edge {
	constructor (source, target, ...args) {
		this._graph._initEdge(this, source, target, ...args)
	}

	source () { return this._graph.source(this) }
	target () { return this._graph.target(this) }

	opposite (node) { return this._graph.opposite(this, node) }

	setSource (node) { this._graph.setSource(this, node) }
	setTarget (node) { this._graph.setTarget(this, node) }
	move (source, target) { this._graph.moveEdge(this, source, target) }

	reverse () { this._graph.reverseEdge(this) }

	remove () { this._graph.removeEdge(this) }
}

module.exports = { Edge }
