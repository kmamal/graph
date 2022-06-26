
const upstream = function * (node) {
	for (const edge of node.incoming().values()) {
		yield edge.opposite(node)
	}
}

module.exports = upstream
