
const extension = {
	_init (next, options) {
		next.call(this, options)

		this.Edge = class extends this.Edge {
			constructor (source, target) {
				const edges = source._graph.getEdges(source, target)
				const { done, value } = edges.values().next()
				if (!done) { return value }

				super(source, target)
			}
		}
	},
}

module.exports = extension
