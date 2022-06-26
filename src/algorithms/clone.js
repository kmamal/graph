
const clone = (graph, clone, mappings = {}) {
  const {
    nodes_to,
    nodes_from,
    edges_to,
    edges_from,
  } = mappings

  for (const node of graph.nodes().values()) {
    const node_clone = new clone.Node()
    nodes_to && nodes_to.set(node, node_clone)
    nodes_from && nodes_from.set(node_clone, node)
  }

  for (const edge of graph.edges().values()) {
    const source = nodes_to.get(edge._source)
    const target = nodes_to.get(edge._target)
    const edge_clone = new clone.Edge(source, target)
    edges_to && edges_to.set(edge, edge_clone)
    edges_from && edges_from.set(edge_clone, edge)
  }

  return clone
}

module.exports = clone
