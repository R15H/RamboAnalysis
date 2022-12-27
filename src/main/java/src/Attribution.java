

class FlowDependency {

}

class Stack {
    public ArrayList<Variable> variables; // initialized variables
    public ArrayList<Variable> entryPoints; // uninitialized variables

    public ArrayList<SanitationFunction> sanitationFunction;
    public ArrayList<Variable> taintedVariables; // variables that are tainted



}

class Attribution {
    public String variableName;
    public ArrayList<FlowDependency> flowDependencies; // all the conditionals that this attribution depends on
    public Any value; // the value of the attribution
}
