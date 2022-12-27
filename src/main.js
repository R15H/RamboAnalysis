"use strict";
// Node js is used to run this file
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var patternFile = process.argv[2];
var sliceFile = process.argv[3];
var nodeHandelers = {
    'Expr_FuncCall': function (node) {
        return new Expr_FuncCall(node);
    },
    'Expr_Assign': function (node) {
        return new Expr_Assign(node);
    },
    '__cast_node__': function (node) {
        return new CastNode(node);
    }
};
var patterns = JSON.parse((0, fs_1.readFileSync)(patternFile, 'utf8'));
var slice_ast = JSON.parse((0, fs_1.readFileSync)(sliceFile, 'utf8'));
// In an AST, the root node is always a Stmt_Expression
// Each entry in the slice file is a Stmt_Expression, which if conventional formatting is done corresponds to a line of code
// Keys that lead to more nodes
var branchKeys = ['expr', 'var', 'exprs', 'left', 'right', 'cond', 'else', 'stmts', 'stmt', 'test', 'body', 'args', 'parts', 'name', 'dim'];
var binaryOperations = ['Expr_BinaryOp_Concat', 'Expr_BinaryOp_Plus', 'Expr_BinaryOp_Minus', 'Expr_BinaryOp_Mul', 'Expr_BinaryOp_Div', 'Expr_BinaryOp_Mod', 'Expr_BinaryOp_Pow', 'Expr_BinaryOp_ShiftLeft', 'Expr_BinaryOp_ShiftRight', 'Expr_BinaryOp_BitwiseAnd', 'Expr_BinaryOp_BitwiseOr', 'Expr_BinaryOp_BitwiseXor', 'Expr_BinaryOp_BooleanAnd', 'Expr_BinaryOp_BooleanOr', 'Expr_BinaryOp_LogicalAnd', 'Expr_BinaryOp_LogicalOr', 'Expr_BinaryOp_LogicalXor', 'Expr_BinaryOp_Equal', 'Expr_BinaryOp_NotEqual', 'Expr_BinaryOp_Identical', 'Expr_BinaryOp_NotIdentical', 'Expr_BinaryOp_Greater', 'Expr_BinaryOp_GreaterOrEqual', 'Expr_BinaryOp_Smaller', 'Expr_BinaryOp_SmallerOrEqual', 'Expr_BinaryOp_Spaceship', 'Expr_BinaryOp_Coalesce'];
var assignmentOperations = ['Minus', 'Plus', 'Mul', 'Div', 'Mod', 'Pow', 'ShiftLeft', 'ShiftRight', 'BitwiseAnd', 'BitwiseOr', 'BitwiseXor', 'Concat', 'Coalesce'];
// These ones are irrelevant, they are just used to traverse the AST
var castNodes = ['Expr_Cast_Array', 'Expr_Cast_Bool', 'Expr_Cast_Double', 'Expr_Cast_Int', 'Expr_Cast_Object', 'Expr_Cast_String', 'Expr_Cast_Unset'];
var Expr_FuncCall = /** @class */ (function () {
    function Expr_FuncCall(obj, parent) {
        this.raw = obj;
        this.name = obj.name.parts[0];
        this.parent = parent;
        this.leafs = [];
        if (this.name in targetSinks)
            SinkNodes.push(this);
        this.exploreLeafNodes();
    }
    Expr_FuncCall.prototype.exploreLeafNodes = function () {
        var _a;
        for (var i = 0; i < this.raw.args.length; i++) {
            var arg = this.raw.args[i];
            if (arg.nodeType === 'Arg')
                this.arg_variables.push(arg.value.name);
            else if (arg.nodeType === 'Expr_FuncCall') {
                var call = new Expr_FuncCall(arg);
                // add the variables from the call to the arg_variables
                (_a = this.arg_variables).push.apply(_a, call.getVariables());
                this.leafs.push(call);
            }
            else if (arg.nodeType === "Scalar_String") {
                // do nothing
            }
        }
    };
    Expr_FuncCall.prototype.isSink = function () {
        return targetSinks.includes(this.name);
    };
    Expr_FuncCall.prototype.getVariables = function () {
        return;
    };
    return Expr_FuncCall;
}());
// The following function is used to traverse the AST and find the nodes that are function calls to the sinks
// The function returns an array of nodes that are function calls to the sinks
function findSinks(ast) {
    var sinks = [];
    if (ast.type === 'Expr_FuncCall') { // one of the args of this function may well be a sink
        var isSink = targetSinks.indexOf(ast.name.parts[0]) !== -1, sinks_2, push = void 0;
        (ast);
    }
    for (var _i = 0, branchKeys_1 = branchKeys; _i < branchKeys_1.length; _i++) {
        var key = branchKeys_1[_i];
        if (ast[key]) {
            if (Array.isArray(ast[key])) {
                for (var _a = 0, _b = ast[key]; _a < _b.length; _a++) {
                    var node_1 = _b[_a];
                    sinks.push.apply(sinks, findSinks(node_1));
                }
            }
            else
                sinks.push.apply(sinks, findSinks(ast[key]));
        }
    }
    if (ast.children) {
        for (var _c = 0, _d = ast.children; _c < _d.length; _c++) {
            var child = _d[_c];
            sinks.push.apply(sinks, findSinks(child));
        }
    }
    return sinks;
}
// get all diferent sinks
var targetSinks = patterns.flatMap(function (p) { return p.sinks; }).filter(function (v, i, a) { return a.indexOf(v) === i; });
var foundSinks = [];
// for loop to iterate over slice_ast from the end to the beginning
function sinkFinder(statementList) {
    var sinks, SinkNodes, _a = [];
    for (var i = statementList.length - 1; i >= 0; i--) {
        var statement = statementList[i];
        var node_2 = nodeHandelers[statement.nodeType](statement);
        foundSinks.push.apply(foundSinks, node_2.getSinks());
    }
    return sinks;
}
var sinks = sinkFinder(slice_ast);
// for each sink
for (var _i = 0, sinks_1 = sinks; _i < sinks_1.length; _i++) {
    var sink = sinks_1[_i];
    // get the variables that influence the sink
    var variables = sink.getVariables();
    // for each variable
    for (var _a = 0, variables_1 = variables; _a < variables_1.length; _a++) {
        var variable = variables_1[_a];
        var datasources = variable.getExplicitDataSources(); // get the data sources (aka vars) that influence the variable
        for (var _b = 0, datasources_1 = datasources; _b < datasources_1.length; _b++) {
            var ds = datasources_1[_b];
            var ds_1 = variable.getExplicitDataSources(); // get the data sources (aka vars) that influence the variable
            var ds2 = variable.getImplicitDataSources(); // get the data sources (aka vars) that influence the variable
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
for (var i = slice_ast.length - 1; i >= 0; i--) {
    var nodeSimpleObj = slice_ast[i];
    var isCastNode = castNodes.indexOf(nodeSimpleObj.nodeType) == -1;
    var binaryOperation = binaryOperations.indexOf(nodeSimpleObj.nodeType) == -1;
    var node_3;
    if (isCastNode)
        node_3 = nodeHandelers["__cast_node__"](nodeSimpleObj);
    else if (binaryOperation)
        node_3 = nodeHandelers["__binop_node__"](nodeSimpleObj);
    else
        node_3 = nodeHandelers[nodeSimpleObj.nodeType](nodeSimpleObj);
}
var node = slice_ast[i];
// check if the node is a function call
if (node.type === 'Expr_FuncCall') {
    // check if the function name is a sink
    if (sinks.includes(node.name.parts[0])) {
        // check if the function is called with a variable as argument
        if (node.args[0].value.type === 'Expr_Variable') {
            // check if the variable is defined in the slice
            var variable_1 = node.args[0].value.name;
            // find where the variable is defined
            var variableDefinition_1 = slice_ast.find(function (n) { return n.type === 'Expr_Assign' && n.var.name === variable_1; });
            if (variableDefinition_1) {
                // check if the variable is assigned to a string
                if (variableDefinition_1.expr.type === 'Scalar_String') {
                    // check if the string is a pattern
                    var pattern = patterns.find(function (p) { return p.sinks.includes(node.name.parts[0]) && p.sources.includes(variableDefinition_1.expr.value); });
                    if (pattern) {
                        // print the pattern
                        console.log(pattern);
                    }
                }
            }
        }
        slice_ast.forEach(function (node) {
            if (node.type === 'Expr_FuncCall') {
                if (node.name.nodeType !== 'Name') {
                    console.log('ERROR: Expected node name to be of type Name, but it was ' + node.name.nodeType);
                    // weird function calls like $a = $b();
                }
                if (sinks.includes(node.name.parts[0]))
                    ;
            }
        });
        {
            console.log(node);
        }
    }
}
