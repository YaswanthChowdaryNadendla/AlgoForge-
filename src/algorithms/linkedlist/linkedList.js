/**
 * Linked List with Animation Steps
 *
 * A singly linked list that records every operation as a step
 * for visualization playback.
 *
 * Step format:
 * {
 *   nodes: [{ value, id }],
 *   pointers: [{ from: id, to: id }],
 *   highlighted: id | null,
 *   description: string
 * }
 */

let nodeIdCounter = 0;

/** Generate a unique ID for each node */
function generateId() {
  return `node-${++nodeIdCounter}`;
}

/** Internal node class */
class ListNode {
  constructor(value) {
    this.value = value;
    this.id = generateId();
    this.next = null;
  }
}

/**
 * Singly Linked List with step recording for visualization.
 */
export default class LinkedList {
  constructor() {
    this.head = null;
    this.steps = [];
  }

  // ─── Snapshot Helpers ───────────────────────────────────────

  /**
   * Build a snapshot of the current list state.
   * @returns {{ nodes: Object[], pointers: Object[] }}
   */
  _snapshot() {
    const nodes = [];
    const pointers = [];
    let current = this.head;

    while (current) {
      nodes.push({ value: current.value, id: current.id });
      if (current.next) {
        pointers.push({ from: current.id, to: current.next.id });
      }
      current = current.next;
    }

    return { nodes, pointers };
  }

  /**
   * Record a step.
   * @param {string|null} highlightedId - Node ID to highlight
   * @param {string}      description   - Human-readable description
   */
  _recordStep(highlightedId, description) {
    const { nodes, pointers } = this._snapshot();
    this.steps.push({
      nodes,
      pointers,
      highlighted: highlightedId,
      description,
    });
  }

  // ─── Operations ─────────────────────────────────────────────

  /**
   * Insert a value at the head of the list.
   * @param {*} val - Value to insert
   */
  insertHead(val) {
    this.steps = [];
    this._recordStep(null, `Inserting ${val} at the head of the list.`);

    const newNode = new ListNode(val);
    newNode.next = this.head;
    this.head = newNode;

    this._recordStep(newNode.id, `Inserted ${val} as the new head.`);
  }

  /**
   * Insert a value at the tail of the list.
   * @param {*} val - Value to insert
   */
  insertTail(val) {
    this.steps = [];
    this._recordStep(null, `Inserting ${val} at the tail of the list.`);

    const newNode = new ListNode(val);

    if (!this.head) {
      // Empty list — new node becomes the head
      this.head = newNode;
      this._recordStep(newNode.id, `List was empty. ${val} is now the head (and tail).`);
      return;
    }

    let current = this.head;

    // Traverse to the last node
    while (current.next) {
      this._recordStep(current.id, `Traversing: visiting node ${current.value} (id: ${current.id}).`);
      current = current.next;
    }

    this._recordStep(current.id, `Reached tail node ${current.value}. Linking new node.`);

    current.next = newNode;

    this._recordStep(newNode.id, `Inserted ${val} at the tail.`);
  }

  /**
   * Delete the first node with the given value.
   * @param {*} val - Value to delete
   * @returns {boolean} True if a node was deleted
   */
  deleteNode(val) {
    this.steps = [];
    this._recordStep(null, `Deleting first node with value ${val}.`);

    if (!this.head) {
      this._recordStep(null, 'List is empty. Nothing to delete.');
      return false;
    }

    // Special case: head node contains the value
    if (this.head.value === val) {
      const deletedId = this.head.id;
      this._recordStep(deletedId, `Head node has value ${val}. Removing it.`);
      this.head = this.head.next;
      this._recordStep(null, `Deleted node with value ${val}. New head: ${this.head ? this.head.value : 'null (list is now empty)'}.`);
      return true;
    }

    let current = this.head;

    while (current.next) {
      this._recordStep(current.id, `Checking next node: ${current.next.value}.`);

      if (current.next.value === val) {
        const deletedId = current.next.id;
        this._recordStep(deletedId, `Found node with value ${val}. Removing it.`);

        current.next = current.next.next;

        this._recordStep(current.id, `Deleted node with value ${val}. Linked ${current.value} → ${current.next ? current.next.value : 'null'}.`);
        return true;
      }

      current = current.next;
    }

    this._recordStep(null, `Value ${val} not found in the list.`);
    return false;
  }

  /**
   * Search for a value in the list.
   * @param {*} val - Value to search for
   * @returns {ListNode|null} The node if found, null otherwise
   */
  search(val) {
    this.steps = [];
    this._recordStep(null, `Searching for value ${val}.`);

    let current = this.head;
    let index = 0;

    while (current) {
      this._recordStep(current.id, `Visiting node ${index}: value = ${current.value}.`);

      if (current.value === val) {
        this._recordStep(current.id, `Found ${val} at position ${index}!`);
        return current;
      }

      current = current.next;
      index++;
    }

    this._recordStep(null, `Value ${val} not found in the list.`);
    return null;
  }

  /**
   * Reverse the linked list in place.
   */
  reverse() {
    this.steps = [];
    this._recordStep(null, 'Reversing the linked list.');

    let prev = null;
    let current = this.head;
    let next = null;

    while (current) {
      next = current.next;

      this._recordStep(current.id, `Reversing pointer of node ${current.value}: ${current.value} → ${prev ? prev.value : 'null'}.`);

      current.next = prev;
      prev = current;
      current = next;
    }

    this.head = prev;

    this._recordStep(this.head ? this.head.id : null, `List reversed. New head: ${this.head ? this.head.value : 'null'}.`);
  }

  /**
   * Convert the list to an array of values.
   * @returns {Array} Array of node values
   */
  toArray() {
    const result = [];
    let current = this.head;
    while (current) {
      result.push(current.value);
      current = current.next;
    }
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
