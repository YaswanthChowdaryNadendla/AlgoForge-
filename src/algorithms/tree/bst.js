/**
 * Binary Search Tree with Animation Steps
 *
 * Provides insert, delete, search, and traversal operations.
 * Each operation records steps for visualization.
 * Automatic layout calculation assigns (x, y) positions to nodes
 * based on depth and in-order index.
 *
 * Step format:
 * {
 *   nodes: [{ value, left, right, x, y, id }],
 *   edges: [{ from: id, to: id }],
 *   highlighted: id | null,
 *   visited: [ids],
 *   description: string
 * }
 */

let bstNodeIdCounter = 0;

function generateId() {
  return `bst-${++bstNodeIdCounter}`;
}

/** Internal BST node */
class BSTNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.id = generateId();
    this.x = 0;
    this.y = 0;
  }
}

/**
 * Binary Search Tree with step recording for visualization.
 */
export default class BST {
  constructor() {
    this.root = null;
    this.steps = [];
  }

  // ─── Layout ─────────────────────────────────────────────────

  /**
   * Calculate x, y positions for all nodes based on an in-order traversal.
   * x is based on in-order index, y is based on depth.
   */
  _calculateLayout() {
    const HORIZONTAL_SPACING = 60;
    const VERTICAL_SPACING = 80;
    let index = 0;

    function assignPositions(node, depth) {
      if (!node) return;

      assignPositions(node.left, depth + 1);

      node.x = index * HORIZONTAL_SPACING;
      node.y = depth * VERTICAL_SPACING;
      index++;

      assignPositions(node.right, depth + 1);
    }

    index = 0;
    assignPositions(this.root, 0);
  }

  // ─── Snapshot ───────────────────────────────────────────────

  /**
   * Build a flat array of all nodes and edges for the current tree state.
   */
  _snapshot() {
    this._calculateLayout();

    const nodes = [];
    const edges = [];

    function traverse(node) {
      if (!node) return;

      nodes.push({
        value: node.value,
        left: node.left ? node.left.id : null,
        right: node.right ? node.right.id : null,
        x: node.x,
        y: node.y,
        id: node.id,
      });

      if (node.left) {
        edges.push({ from: node.id, to: node.left.id });
        traverse(node.left);
      }
      if (node.right) {
        edges.push({ from: node.id, to: node.right.id });
        traverse(node.right);
      }
    }

    traverse(this.root);
    return { nodes, edges };
  }

  /**
   * Record a step with optional highlighted node and visited list.
   */
  _recordStep(highlightedId, visited, description) {
    const { nodes, edges } = this._snapshot();
    this.steps.push({
      nodes,
      edges,
      highlighted: highlightedId,
      visited: [...visited],
      description,
    });
  }

  // ─── Insert ─────────────────────────────────────────────────

  /**
   * Insert a value into the BST.
   * @param {number} val - Value to insert
   */
  insert(val) {
    this.steps = [];
    const visited = [];

    this._recordStep(null, visited, `Inserting value ${val} into the BST.`);

    const newNode = new BSTNode(val);

    if (!this.root) {
      this.root = newNode;
      this._recordStep(newNode.id, visited, `Tree was empty. ${val} is now the root.`);
      return;
    }

    let current = this.root;

    while (true) {
      visited.push(current.id);
      this._recordStep(current.id, visited, `Visiting node ${current.value}. Comparing with ${val}.`);

      if (val < current.value) {
        if (!current.left) {
          current.left = newNode;
          this._recordStep(newNode.id, visited, `Inserted ${val} as the left child of ${current.value}.`);
          return;
        }
        this._recordStep(current.id, visited, `${val} < ${current.value}. Moving to left subtree.`);
        current = current.left;
      } else if (val > current.value) {
        if (!current.right) {
          current.right = newNode;
          this._recordStep(newNode.id, visited, `Inserted ${val} as the right child of ${current.value}.`);
          return;
        }
        this._recordStep(current.id, visited, `${val} > ${current.value}. Moving to right subtree.`);
        current = current.right;
      } else {
        // Duplicate value
        this._recordStep(current.id, visited, `Value ${val} already exists in the BST. Skipping insertion.`);
        return;
      }
    }
  }

  // ─── Delete ─────────────────────────────────────────────────

  /**
   * Delete a value from the BST.
   * @param {number} val - Value to delete
   */
  delete(val) {
    this.steps = [];
    const visited = [];

    this._recordStep(null, visited, `Deleting value ${val} from the BST.`);

    this.root = this._deleteNode(this.root, val, visited);

    this._recordStep(null, visited, `Deletion of ${val} complete.`);
  }

  /**
   * Recursively delete a node with the given value.
   * @returns {BSTNode|null} The new root of the subtree
   */
  _deleteNode(node, val, visited) {
    if (!node) {
      this._recordStep(null, visited, `Value ${val} not found in the BST.`);
      return null;
    }

    visited.push(node.id);
    this._recordStep(node.id, visited, `Visiting node ${node.value}. Looking for ${val}.`);

    if (val < node.value) {
      node.left = this._deleteNode(node.left, val, visited);
      return node;
    }

    if (val > node.value) {
      node.right = this._deleteNode(node.right, val, visited);
      return node;
    }

    // Found the node to delete (val === node.value)
    this._recordStep(node.id, visited, `Found node ${val} to delete.`);

    // Case 1: Leaf node (no children)
    if (!node.left && !node.right) {
      this._recordStep(node.id, visited, `Node ${val} is a leaf. Removing it.`);
      return null;
    }

    // Case 2: One child
    if (!node.left) {
      this._recordStep(node.id, visited, `Node ${val} has only a right child (${node.right.value}). Replacing with right child.`);
      return node.right;
    }

    if (!node.right) {
      this._recordStep(node.id, visited, `Node ${val} has only a left child (${node.left.value}). Replacing with left child.`);
      return node.left;
    }

    // Case 3: Two children — find in-order successor (smallest in right subtree)
    let successor = node.right;
    while (successor.left) {
      successor = successor.left;
    }

    this._recordStep(successor.id, visited, `Node ${val} has two children. In-order successor is ${successor.value}.`);

    node.value = successor.value;
    node.right = this._deleteNode(node.right, successor.value, visited);

    return node;
  }

  // ─── Search ─────────────────────────────────────────────────

  /**
   * Search for a value in the BST.
   * @param {number} val - Value to search for
   * @returns {BSTNode|null} The node if found, null otherwise
   */
  search(val) {
    this.steps = [];
    const visited = [];

    this._recordStep(null, visited, `Searching for value ${val} in the BST.`);

    let current = this.root;

    while (current) {
      visited.push(current.id);
      this._recordStep(current.id, visited, `Visiting node ${current.value}.`);

      if (val === current.value) {
        this._recordStep(current.id, visited, `Found value ${val}!`);
        return current;
      }

      if (val < current.value) {
        this._recordStep(current.id, visited, `${val} < ${current.value}. Moving left.`);
        current = current.left;
      } else {
        this._recordStep(current.id, visited, `${val} > ${current.value}. Moving right.`);
        current = current.right;
      }
    }

    this._recordStep(null, visited, `Value ${val} not found in the BST.`);
    return null;
  }

  // ─── Traversals ─────────────────────────────────────────────

  /**
   * In-order traversal (Left, Root, Right).
   * @returns {number[]} Values in in-order sequence
   */
  inorder() {
    this.steps = [];
    const visited = [];
    const result = [];

    this._recordStep(null, visited, 'Starting in-order traversal (Left → Root → Right).');

    this._inorderHelper(this.root, visited, result);

    this._recordStep(null, visited, `In-order traversal complete: [${result.join(', ')}].`);
    return result;
  }

  _inorderHelper(node, visited, result) {
    if (!node) return;

    this._inorderHelper(node.left, visited, result);

    visited.push(node.id);
    result.push(node.value);
    this._recordStep(node.id, visited, `Visited node ${node.value}.`);

    this._inorderHelper(node.right, visited, result);
  }

  /**
   * Pre-order traversal (Root, Left, Right).
   * @returns {number[]} Values in pre-order sequence
   */
  preorder() {
    this.steps = [];
    const visited = [];
    const result = [];

    this._recordStep(null, visited, 'Starting pre-order traversal (Root → Left → Right).');

    this._preorderHelper(this.root, visited, result);

    this._recordStep(null, visited, `Pre-order traversal complete: [${result.join(', ')}].`);
    return result;
  }

  _preorderHelper(node, visited, result) {
    if (!node) return;

    visited.push(node.id);
    result.push(node.value);
    this._recordStep(node.id, visited, `Visited node ${node.value}.`);

    this._preorderHelper(node.left, visited, result);
    this._preorderHelper(node.right, visited, result);
  }

  /**
   * Post-order traversal (Left, Right, Root).
   * @returns {number[]} Values in post-order sequence
   */
  postorder() {
    this.steps = [];
    const visited = [];
    const result = [];

    this._recordStep(null, visited, 'Starting post-order traversal (Left → Right → Root).');

    this._postorderHelper(this.root, visited, result);

    this._recordStep(null, visited, `Post-order traversal complete: [${result.join(', ')}].`);
    return result;
  }

  _postorderHelper(node, visited, result) {
    if (!node) return;

    this._postorderHelper(node.left, visited, result);
    this._postorderHelper(node.right, visited, result);

    visited.push(node.id);
    result.push(node.value);
    this._recordStep(node.id, visited, `Visited node ${node.value}.`);
  }

  /**
   * Level-order (breadth-first) traversal.
   * @returns {number[]} Values in level-order sequence
   */
  levelOrder() {
    this.steps = [];
    const visited = [];
    const result = [];

    this._recordStep(null, visited, 'Starting level-order (BFS) traversal.');

    if (!this.root) {
      this._recordStep(null, visited, 'Tree is empty.');
      return result;
    }

    const queue = [this.root];

    while (queue.length > 0) {
      const node = queue.shift();

      visited.push(node.id);
      result.push(node.value);
      this._recordStep(node.id, visited, `Visited node ${node.value}. Queue size: ${queue.length}.`);

      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }

    this._recordStep(null, visited, `Level-order traversal complete: [${result.join(', ')}].`);
    return result;
  }

  /**
   * Get the recorded steps from the last operation.
   * @returns {Object[]} Array of step objects
   */
  getSteps() {
    return this.steps;
  }
}
