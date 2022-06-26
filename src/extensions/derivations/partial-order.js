const propagate = require('./propagations/downstream')

const partialOrderDerivation = (propKey) => ({
	[propKey]: {
		derive: (node) => {
			const parents = Array.from(node.parents().values())
			const parentValues = parents.map((parent) => parent[propKey])
			const value = Math.max(-1, ...parentValues) + 1

			if (node._graph.nodes && value > node._graph.nodes().size) {
				throw new Error(`Graph is not acyclic`)
			}

			return value
		},
		propagate,
	},
})

module.exports = partialOrderDerivation
