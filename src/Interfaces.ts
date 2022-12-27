// The interfaces that represent the AST
export interface INode {
    nodeType: string;
    attributes: IAttributes;
    [key: string]: any;
}

export interface IAttributes {
    startLine: number;
    endLine: number;
}

export interface IStmt_Expression extends INode {
    expr: IExpr_Assign;
}

export interface IExpr_Assign extends INode {
    var: IExpr_Variable;
    expr: IExpr_ArrayDimFetch | IExpr_BinaryOp_Concat | IExpr_FuncCall;
}

export interface IExpr_ArrayDimFetch extends INode {
    name: string;
}

export interface IExpr_BinaryOp_Concat extends INode {
    left: IExpr_BinaryOp_Concat | IExpr_Variable | IExpr_FuncCall | IScalar_String;
    right: IExpr_BinaryOp_Concat | IExpr_Variable | IExpr_FuncCall | IScalar_String;
}

export interface IScalar_String extends INode {
    value: string;
}


export interface IExpr_FuncCall extends INode {
    name: IName;
    args: IArg[];
}

export interface IArg extends INode {
    name: null;
    value: IExpr_Variable;
    byRef: boolean;
    unpack: boolean;
}

export interface IExpr_Variable extends INode {
    name: string;
}

export interface IName extends INode {
    parts: string[];
}
