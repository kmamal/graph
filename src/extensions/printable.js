
const extension = {
	_init (next, options) {
		next.call(this, options)

		this.Node.prototype.toString = function toString () {
			return this._id
		}

		this.Edge.prototype.toString = function toString () {
			return `${this._id}(${this.source()}->${this.target()})`
		}
	},

	toString () {
		return Array
			.from(this.nodes().values())
			.map((node) => {
				const childNodes = Array.from(node.children().values())
				return `${node.toString()} -> ${childNodes.join(', ')}`
			})
			.join('\n')
	},
}

module.exports = extension
