const { Node } = require('./node')
const { Edge } = require('./edge')

const EMPTY_SET = {
	get size () { return 0 },
	* values () { },
}

const _addEdgeToNode = (map, node, edge) => {
	let set = map.get(node)
	if (!set) {
		set = new Set()
		map.set(node, set)
	}
	set.add(edge)
}

const _removeEdgeFromNode = (map, node, edge) => {
	const set = map.get(node)
	if (set.size === 1) {
		map.delete(node)
	} else {
		set.delete(edge)
	}
}

const _allEdges = (map) => {
	let size = null
	return {
		get size () {
			if (size !== null) { return size }
			size = 0
			for (const set of map.values()) { size += set.size }
			return size
		},
		* values () {
			for (const set of map.values()) {
				for (const edge of set.values()) {
					yield edge
				}
			}
		},
	}
}

const _nodesFor = (node, edges) => ({
	get size () { return edges.size },
	* values () {
		for (const edge of edges.values()) {
			yield edge.opposite(node)
		}
	},
})

class Graph {
	constructor (options) {
		this.Node = class extends Node {}
		this.Node.prototype._graph = this

		this.Edge = class extends Edge {}
		this.Edge.prototype._graph = this

		this._init?.(options)
	}

	_initNode (node) {
		node._incoming = new Map()
		node._outgoing = new Map()
	}

	_initEdge (edge, source, target) {
		this.moveEdge(edge, source, target)
	}

	getEdges (source, target) {
		return source._outgoing.get(target) ?? EMPTY_SET
	}

	moveEdge (edge, source, target) {
		const { _source: oldSource, _target: oldTarget } = edge

		if (oldSource !== source) {
			oldSource && _removeEdgeFromNode(oldSource._outgoing, oldTarget, edge)
			edge._source = source
			source && _addEdgeToNode(source._outgoing, target, edge)
		}

		if (oldTarget !== target) {
			oldTarget && _removeEdgeFromNode(oldTarget._incoming, oldSource, edge)
			edge._target = target
			target && _addEdgeToNode(target._incoming, source, edge)
		}
	}

	source (edge) { return edge._source }
	target (edge) { return edge._target }

	incoming (node) { return _allEdges(node._incoming) }
	outgoing (node) { return _allEdges(node._outgoing) }

	// Optional but incredibly common

	removeNode (node) {
		for (const edge of this.adjacent(node).values()) {
			this.removeEdge(edge)
		}
	}

	removeEdge (edge) {
		this.moveEdge(edge, null, null)
	}

	adjacent (node) {
		return {
			get size () { return node._incoming.size + node.outgoing().size },
			* values () {
				for (const edge of node._incoming.values()) { yield edge }
				for (const edge of node._outgoing.values()) { yield edge }
			},
		}
	}

	opposite (edge, node) {
		const source = this.source(edge)
		const target = this.target(edge)
		return node === source ? target
					 : node === target ? source
					 : null
	}

	parents (node) { return _nodesFor(node, this.incoming(node)) }
	children (node) { return _nodesFor(node, this.outgoing(node)) }
	neighbors (node) { return _nodesFor(node, this.adjacent(node)) }

	setSource (edge, source) { this.moveEdge(edge, source, this.target(edge)) }
	setTarget (edge, target) { this.moveEdge(edge, this.source(edge), target) }

	reverseEdge (edge) {
		const { _source: target, _target: source } = edge
		this.moveEdge(source, target)
	}
}

module.exports = { Graph }
