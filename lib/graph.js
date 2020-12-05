class Graph {
  constructor(verbose) {
    this.nodes = {};
    this.index = 0;
  }

  exists(id) {
    return !!this.nodes[id];
  }

  get(id) {
    return this.nodes[id];
  }

  ids() {
    return Object.keys(this.nodes);
  }

  addNode(id, data) {
    if (id === undefined) {
      id = this.index++;
    }
    if (!this.exists(id)) {
      this.nodes[id] = {
        id: id,
        parents: [],
        children: [],
        data: data,
      }
    }
    return this.nodes[id];
  }

  setParentChild(parent, child) {
    parent = typeof parent !== 'object' ? this.nodes[parent] : parent;
    child = typeof child !== 'object' ? this.nodes[child]: child;
    parent.children.push(child);
    child.parents.push(parent);
  }

  getAscendants(id) {
    let node = this.get(id);
    let ascendants = [];
    while (node.parents.length > 0) {
      node = node.parents[0];
      ascendants.push(node.id);
    }
    return ascendants;
  }

  getAscendantsCount(id) {
    return this.getAscendants(id).length;
  }
}

module.exports = {
  Graph: Graph,
}