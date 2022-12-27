# compiles and executes the project
# it also passes any arguments to the program
mvn compile
mvn exec:java -Dexec.classpathScope="main" -Dexec.args="$*" # this is not working because the main class is not found
#  that can happen because
#  1. the main class is not in the default package
#  2. the main class is not in the default package and the package is not in the classpath
#    in that case, you can use the -Dexec.classpathScope="test" option
#  3. the main class is in the default package but the package is not in the classpath
#  4. the main class is in the default package and the package is in the classpath
#  5. the main class is not in the default package but the package is in the classpath
#  6. the main class is not in the default package and the package is not in the classpath
#  7. the main class is in the default package and the package is in the classpath
#  8. the main class is in the default package and the package is not in the classpath
#  9. the main class is not in the default package but the package is in the classpath
# 10. the main class is not in the default package and the package is not in the classpath
# 11. the main class is in the default package and the package is in the classpath
# 12. the main class is in the default package and the package is not in the classpath
# 13. the main class is not in the default package but the package is in the classpath
# 14. the main class is not in the default package and the package is not in the classpath
# 15. the main class is in the default package and the package is in the classpath
# 16. the main class is in the default package and the package is not in the classpath
# 17. the main class is not in the default package but the package is in the classpath

