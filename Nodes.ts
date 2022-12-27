
class Node {
    name: string; // aka node type
    children: Node[];
    parent: Node | null;

    constructor(name: string, parent: Node | null) {
        this.name = name;
        this.children = [];
        this.parent = parent;
    }
}

class FunctionCallNode extends Node {
    arguments: Node[];
    constructor(name: string, parent: Node | null, ) {
        super(name, parent);
        this.arguments = [];
    }
}

// Abstract Syntax Tree
class AST {
    root: Node;

    constructor() {
        this.root = new Node('root', null);
    }

