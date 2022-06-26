
const downstream = function * (node) {
	for (const edge of node.outgoing().values()) {
		yield edge.opposite(node)
	}
}

module.exports = downstream
