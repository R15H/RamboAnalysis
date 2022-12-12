# compiles and executes the project
# it also passes any arguments to the program
mvn compile
mvn exec:java -Dexec.mainClass="main" -Dexec.args="$*"
