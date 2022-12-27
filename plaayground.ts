
// abstract syntax tree interface according to PHP-Parser
interface ASTNode {
    type: string;
    name: string;
    children: ASTNode[];
    attributes: {
        startLine: number;
        endLine: number;
        startTokenPos: number;
        endTokenPos: number;
        startFilePos: number;
        endFilePos: number;
    };
    parent: ASTNode | null;
    parts: ASTNode[];
    args: ASTNode[];
    expr: ASTNode;
    var: ASTNode;
    exprs: ASTNode[];
    left: ASTNode;
    right: ASTNode;
    cond: ASTNode;
    else: ASTNode;
    stmts: ASTNode[];
    stmt: ASTNode;
    test: ASTNode;
    body: ASTNode;
}

