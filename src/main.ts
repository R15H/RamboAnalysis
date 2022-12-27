// Node js is used to run this file

// Mandatory constructs --> assignments, binary operations, function calls, condition test and while loop.
// Optional --> For loop / for each/  switch case / try catch /

// This program receives as arguments two file names called Pattern and Slice

import { INode } from './Nodes'; // says its not a module because

import { readFileSync } from 'fs';
import {Pattern} from "./IO";

const patternFile = process.argv[2];
const sliceFile = process.argv[3];


const nodeHandelers = {
    'Expr_FuncCall': (node: ASTNode) => {
        return new Expr_FuncCall(node);
    },
    'Expr_Assign': (node: ASTNode) => {
        return new Expr_Assign(node);

    },
    '__cast_node__': (node: ASTNode) => {
        return new CastNode(node);
    }
}

const patterns: Pattern[] = JSON.parse(readFileSync(patternFile, 'utf8'));
const slice_ast: any[] = JSON.parse(readFileSync(sliceFile, 'utf8'));

// In an AST, the root node is always a Stmt_Expression
// Each entry in the slice file is a Stmt_Expression, which if conventional formatting is done corresponds to a line of code

// Keys that lead to more nodes
const branchKeys = ['expr', 'var', 'exprs', 'left', 'right', 'cond', 'else', 'stmts', 'stmt', 'test', 'body', 'args', 'parts', 'name', 'dim'];
const binaryOperations = ['Expr_BinaryOp_Concat', 'Expr_BinaryOp_Plus', 'Expr_BinaryOp_Minus', 'Expr_BinaryOp_Mul', 'Expr_BinaryOp_Div', 'Expr_BinaryOp_Mod', 'Expr_BinaryOp_Pow', 'Expr_BinaryOp_ShiftLeft', 'Expr_BinaryOp_ShiftRight', 'Expr_BinaryOp_BitwiseAnd', 'Expr_BinaryOp_BitwiseOr', 'Expr_BinaryOp_BitwiseXor', 'Expr_BinaryOp_BooleanAnd', 'Expr_BinaryOp_BooleanOr', 'Expr_BinaryOp_LogicalAnd', 'Expr_BinaryOp_LogicalOr', 'Expr_BinaryOp_LogicalXor', 'Expr_BinaryOp_Equal', 'Expr_BinaryOp_NotEqual', 'Expr_BinaryOp_Identical', 'Expr_BinaryOp_NotIdentical', 'Expr_BinaryOp_Greater', 'Expr_BinaryOp_GreaterOrEqual', 'Expr_BinaryOp_Smaller', 'Expr_BinaryOp_SmallerOrEqual', 'Expr_BinaryOp_Spaceship', 'Expr_BinaryOp_Coalesce'];
const assignmentOperations = ['Minus', 'Plus', 'Mul', 'Div', 'Mod', 'Pow', 'ShiftLeft', 'ShiftRight', 'BitwiseAnd', 'BitwiseOr', 'BitwiseXor', 'Concat', 'Coalesce'];
// These ones are irrelevant, they are just used to traverse the AST
const castNodes = ['Expr_Cast_Array', 'Expr_Cast_Bool', 'Expr_Cast_Double', 'Expr_Cast_Int', 'Expr_Cast_Object', 'Expr_Cast_String', 'Expr_Cast_Unset'];

class Expr_FuncCall {
    name: string;
    arg_variables: string[]; // variables that influence the function call
    sinks: string[];
    leafs: any[];
    parent: any;
    raw: IExpr_FuncCall;
    constructor(obj : IExpr_FuncCall, parent: any) {
        this.raw = obj;
        this.name = obj.name.parts[0];
        this.parent = parent;
        this.leafs = [];
        if (this.name in targetSinks) SinkNodes.push(this)
        this.exploreLeafNodes();
    }

    exploreLeafNodes() {
         for (let i = 0; i < this.raw.args.length; i++) {
             const arg = this.raw.args[i];
             if (arg.nodeType === 'Arg') this.arg_variables.push(arg.value.name);
             else if (arg.nodeType === 'Expr_FuncCall') {
                let call = new Expr_FuncCall(arg);
                // add the variables from the call to the arg_variables
                 this.arg_variables.push(...call.getVariables())
                 this.leafs.push(call);
             } else if(arg.nodeType === "Scalar_String") {
                 // do nothing
             }

        }

    }

    isSink(): boolean {
        return targetSinks.includes(this.name);
    }

    getVariables(): string[] {
        return
    }
}


// The following function is used to traverse the AST and find the nodes that are function calls to the sinks
// The function returns an array of nodes that are function calls to the sinks
function findSinks(ast: ASTNode): ASTNode[] {
    const sinks: ASTNode[] = [];
    if (ast.type === 'Expr_FuncCall'){ // one of the args of this function may well be a sink
        let isSink = targetSinks.indexOf(ast.name.parts[0]) !== -1)

        sinks.push(ast);
    }
    for (const key of branchKeys) {
        if (ast[key]) {
            if (Array.isArray(ast[key])) {
                for (const node of ast[key]) sinks.push(...findSinks(node));
            } else sinks.push(...findSinks(ast[key]));
        }
    }


    if (ast.children) {
        for (const child of ast.children) {
            sinks.push(...findSinks(child));
        }
    }
    return sinks;
}



// get all diferent sinks
const targetSinks = patterns.flatMap(p => p.sinks).filter((v, i, a) => a.indexOf(v) === i);
const foundSinks = []
// for loop to iterate over slice_ast from the end to the beginning
function sinkFinder(statementList : INode[]) {
    const sinks SinkNodes[] = [];
    for (let i = statementList.length - 1; i >= 0; i--) {
        const statement = statementList[i];
        const node = nodeHandelers[statement.nodeType](statement);
        foundSinks.push(...node.getSinks());
    }
    return sinks;
}

const sinks = sinkFinder(slice_ast);
// for each sink
for (const sink of sinks) {
    // get the variables that influence the sink
    const variables = sink.getVariables();
    // for each variable
    for (const variable of variables) {
        const datasources = variable.getExplicitDataSources(); // get the data sources (aka vars) that influence the variable
        for (const ds of datasources) {
            const ds = variable.getExplicitDataSources(); // get the data sources (aka vars) that influence the variable
            const ds2 = variable.getImplicitDataSources(); // get the data sources (aka vars) that influence the variable

            // check if the datasource is tainted
            if (datasource.isTainted()) {
                // if it is, then the sink is also tainted
                sink.taint();
                break;
            }
        }

        variable.getImplicitDataSources(); // what variables influence if statements that influence the variable



    }
}


for (let i = slice_ast.length - 1; i >= 0; i--) {
    const nodeSimpleObj = slice_ast[i];
    let isCastNode = castNodes.indexOf(nodeSimpleObj.nodeType) == -1;
    let binaryOperation = binaryOperations.indexOf(nodeSimpleObj.nodeType) == -1;
    const node;
    if(isCastNode) node = nodeHandelers["__cast_node__"](nodeSimpleObj);
    else if(binaryOperation) node = nodeHandelers["__binop_node__"](nodeSimpleObj);
    else node = nodeHandelers[nodeSimpleObj.nodeType](nodeSimpleObj);

}
    const node = slice_ast[i];
    // check if the node is a function call
    if (node.type === 'Expr_FuncCall') {
        // check if the function name is a sink
        if (sinks.includes(node.name.parts[0])) {
            // check if the function is called with a variable as argument
            if (node.args[0].value.type === 'Expr_Variable') {
                // check if the variable is defined in the slice
                const variable = node.args[0].value.name;
                // find where the variable is defined

                const variableDefinition = slice_ast.find(n => n.type === 'Expr_Assign' && n.var.name === variable);
                if (variableDefinition) {
                    // check if the variable is assigned to a string
                    if (variableDefinition.expr.type === 'Scalar_String') {
                        // check if the string is a pattern
                        const pattern = patterns.find(p => p.sinks.includes(node.name.parts[0]) && p.sources.includes(variableDefinition.expr.value));
                        if (pattern) {
                            // print the pattern
                            console.log(pattern);
                        }
                    }

                }
}
slice_ast.forEach(node => {
    if (node.type === 'Expr_FuncCall'){
        if(node.name.nodeType !== 'Name'){
            console.log('ERROR: Expected node name to be of type Name, but it was ' + node.name.nodeType);
            // weird function calls like $a = $b();

        }
        if(sinks.includes(node.name.parts[0])))) {
        console.log(node);
        }
    }
}

