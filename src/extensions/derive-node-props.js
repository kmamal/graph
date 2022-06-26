
const deriveNodeProps = (properties) => {
	const _initNode = function (next, node, options) {
		next.call(this, node, options)

		for (const property of properties) {
			for (const [ propKey, { derive } ] of Object.entries(property)) {
				node[propKey] = derive(node)
			}
		}
	}

	const moveEdge = function (next, edge, source, target) {
		const {
			_source: oldSource,
			_target: oldTarget,
		} = edge

		next.call(this, edge, source, target)

		if (oldSource !== source) {
			oldSource && recalculateAll(oldSource)
			source && recalculateAll(source)
		}

		if (oldTarget !== target) {
			oldTarget && recalculateAll(oldTarget)
			target && recalculateAll(target)
		}
	}

	const recalculateAll = (node) => properties
		.forEach((property) => recalculate(node, property))

	const recalculate = (node, property) => {
		for (const [ propKey, { derive, propagate } ] of Object.entries(property)) {
			const oldValue = node[propKey]
			const value = derive(node)

			// TODO: _isEqual
			if (value === oldValue) { continue }

			node[propKey] = value
			node.onChange && node.onChange(propKey, value, oldValue) // TODO: remove from here

			if (!propagate) { continue }

			const targets = propagate(node)
			for (const target of targets) {
				recalculate(target, property)
			}
		}
	}

	const extension = {
		_initNode,
		moveEdge,
	}

	return {
		recalculate,
		extension,
	}
}

module.exports = deriveNodeProps
