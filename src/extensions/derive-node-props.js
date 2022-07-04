const { eq } = require('@kmamal/util/operators')

const deriveNodeProps = (properties) => {
	const recalculate = (node, property) => {
		for (const entry of Object.entries(property)) {
			const [
				propKey, {
					derive,
					propagate,
					isEqual = eq,
				},
			] = entry

			const oldValue = node[propKey]
			const value = derive(node)

			if (isEqual(value, oldValue)) { continue }

			node[propKey] = value

			if (propagate) {
				const targets = propagate(node)
				for (const target of targets) {
					recalculate(target, property)
				}
			}

			if (node.onChange && node[propKey] === value) {
				node.onChange(propKey, value, oldValue)
			}
		}
	}

	const _recalculateAll = (node) => {
		for (const property of properties) {
			recalculate(node, property)
		}
	}

	const extension = {
		_initNode (next, node, options) {
			next.call(this, node, options)

			for (const property of properties) {
				for (const [ propKey, { derive } ] of Object.entries(property)) {
					node[propKey] = derive(node)
				}
			}
		},

		_addIncoming (next, target, source, edge) {
			const res = next.call(this, target, source, edge)
			_recalculateAll(target)
			return res
		},

		_addOutgoing (next, source, target, edge) {
			const res = next.call(this, source, target, edge)
			_recalculateAll(target)
			return res
		},

		_removeIncoming (next, target, source, edge) {
			const res = next.call(this, target, source, edge)
			_recalculateAll(target)
			return res
		},

		_removeOutgoing (next, source, target, edge) {
			const res = next.call(this, source, target, edge)
			_recalculateAll(target)
			return res
		},
	}

	return {
		recalculate,
		extension,
	}
}

module.exports = { deriveNodeProps }
