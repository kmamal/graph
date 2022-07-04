const { Node } = require('./node')
const { Edge } = require('./edge')

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
		node._incomingNum = 0
		node._outgoing = new Map()
		node._outgoingNum = 0
	}

	_countIncoming (node) { return node._incomingNum }
	_countOutgoing (node) { return node._outgoingNum }

	* __iterateEdges (nodeMap) {
		for (const set of nodeMap.values()) { yield* set }
	}

	_iterateIncoming (node) { return this.__iterateEdges(node._incoming) }
	_iterateOutgoing (node) { return this.__iterateEdges(node._outgoing) }

	_countParents (node) { return node._incoming.size }
	_countChildren (node) { return node._outgoing.size }

	_iterateParents (node) { return node._incoming.keys() }
	_iterateChildren (node) { return node._outgoing.keys() }

	_countEdges (source, target) {
		return source._outgoing.get(target)?.size ?? 0
	}

	_iterateEdges (source, target) { return source._outgoing.get(target) ?? [] }

	__addEdge (nodeMap, otherNode, edge) {
		let edgeSet = nodeMap.get(otherNode)
		if (!edgeSet) {
			edgeSet = new Set()
			nodeMap.set(otherNode, edgeSet)
		}
		const size = edgeSet.size
		edgeSet.add(edge)
		return size !== edgeSet.size
	}

	_addIncoming (target, source, edge) {
		const wasAdded = this.__addEdge(target._incoming, source, edge)
		if (wasAdded) { target._incomingNum++ }
		return wasAdded
	}

	_addOutgoing (source, target, edge) {
		const wasAdded = this.__addEdge(source._outgoing, target, edge)
		if (wasAdded) { source._outgoingNum++ }
		return wasAdded
	}

	__removeEdge (nodeMap, otherNode, edge) {
		const edgeSet = nodeMap.get(otherNode)
		if (!edgeSet || edgeSet.size === 0) { return false }
		const wasRemoved = edgeSet.delete(edge)
		if (!wasRemoved) { return false }
		if (edgeSet.size === 0) { nodeMap.delete(otherNode) }
		return true
	}

	_removeIncoming (target, source, edge) {
		const wasRemoved = this.__removeEdge(target._incoming, source, edge)
		if (wasRemoved) { target._incomingNum-- }
		return wasRemoved
	}

	_removeOutgoing (source, target, edge) {
		const wasRemoved = this.__removeEdge(source._outgoing, target, edge)
		if (wasRemoved) { source._outgoingNum-- }
		return wasRemoved
	}

	_initEdge (edge, source, target) {
		edge._source = source
		edge._target = target
		if (source) { this._addOutgoing(source, target, edge) }
		if (target) { this._addIncoming(target, source, edge) }
	}

	_getSource (edge) { return edge._source }
	_getTarget (edge) { return edge._target }

	_moveEdge (edge, source, target) {
		const { _source: oldSource, _target: oldTarget } = edge

		const sourceChanged = source !== oldSource
		if (sourceChanged) {
			edge._source = source
			if (oldSource) { this._removeOutgoing(oldSource, oldTarget, edge) }
			if (source) { this._addOutgoing(source, target, edge) }
		}

		const targetChanged = target !== oldTarget
		if (targetChanged) {
			edge._target = target
			if (oldTarget) { this._removeIncoming(oldTarget, oldSource, edge) }
			if (target) { this._addIncoming(target, source, edge) }
		}

		return sourceChanged || targetChanged
	}

	incomingNum (node) { return this._countIncoming(node) }
	outgoingNum (node) { return this._countOutgoing(node) }
	adjacentNum (node) {
		return this._countIncoming(node) + this._countOutgoing(node)
	}

	incoming (node) { return this._iterateIncoming(node) }
	outgoing (node) { return this._iterateOutgoing(node) }
	* adjacent (node) {
		yield* this._iterateIncoming(node)
		yield* this._iterateOutgoing(node)
	}

	parentsNum (node) { return this._countParents(node) }
	childrenNum (node) { return this._countChildren(node) }
	neighborsNum (node) {
		return this._countParents(node) + this._countChildren(node)
	}

	parents (node) { return this._iterateParents(node) }
	children (node) { return this._iterateChildren(node) }
	* neighbors (node) {
		yield* this._iterateParents(node)
		yield* this._iterateChildren(node)
	}

	getEdgesNum (source, target) { return this._countEdges(source, target) }
	getEdges (source, target) { return this._iterateEdges(source, target) }

	removeNode (node) {
		for (const edge of this.adjacent(node)) {
			this.removeEdge(edge)
		}
	}

	source (edge) { return this._getSource(edge) }
	target (edge) { return this._getTarget(edge) }

	opposite (edge, node) {
		const source = this._getSource(edge)
		const target = this._getTarget(edge)
		return node === source ? target
					 : node === target ? source
					 : null
	}

	moveEdge (edge, source, target) { this._moveEdge(edge, source, target) }
	setSource (edge, source) { this._moveEdge(edge, source, edge.target) }
	setTarget (edge, target) { this._moveEdge(edge, edge.source, target) }
	reverseEdge (edge) { this._moveEdge(edge, edge.target, edge.source) }
	removeEdge (edge) { this._moveEdge(edge, null, null) }
}

module.exports = { Graph }
