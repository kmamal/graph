const { max } = require('@kmamal/util/array/max')
const propagate = require('./propagations/downstream')

const partialOrderDerivation = (propKey) => {
	const getProp = (node) => node[propKey]

	return ({
		[propKey]: {
			derive: (node) => {
				const value = max([ ...node.parents() ].map(getProp)) + 1

				if (node._graph.nodes && value > node._graph.nodes().size) {
					throw new Error(`Graph is not acyclic`)
				}

				return value
			},
			propagate,
		},
	})
}

module.exports = partialOrderDerivation
