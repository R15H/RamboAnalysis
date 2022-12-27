var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Node = /** @class */ (function () {
    function Node(name, parent) {
        this.name = name;
        this.children = [];
        this.parent = parent;
    }
    return Node;
}());
var FunctionCallNode = /** @class */ (function (_super) {
    __extends(FunctionCallNode, _super);
    function FunctionCallNode(name, parent) {
        var _this = _super.call(this, name, parent) || this;
        _this.arguments = [];
        return _this;
    }
    return FunctionCallNode;
}(Node));
// Abstract Syntax Tree
var AST = /** @class */ (function () {
    function AST() {
        this.root = new Node('root', null);
    }
    return AST;
}());
