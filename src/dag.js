const extendGraph = require('./extend')
const deriveNodeProps = require('./extensions/derive-node-props')
const partialOrder = require('./extensions/derivations/partial-order')

const Dag = extendGraph([
	require('./extensions/strong'),
	require('./extensions/simple'),
	require('./extensions/printable'),
	deriveNodeProps([ partialOrder('_order') ]).extension,
	{
		_init (next) {
			next.call(this)

			this.Node.prototype.onChange = function onChange (prop, value, oldValue) {
				console.log(`node ${this.toString()}.${prop} ${oldValue} -> ${value}`)
			}
		},
	},
	require('./extensions/logging'),
])

module.exports = Dag
