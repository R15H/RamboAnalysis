// prints hello world

import com.fasterxml.jackson.databind.ObjectMapper;
public class main {
    // receives the names of 2 json files
    public static void main(String[] args) {
        // Provide help and parse arguments
        // The user can provide a php file
        // that will be used to generate the json files
        // or the user can provide the json files directly

        // What is a good library to parse args in java?
        // I'm thinking of using jopt-simple
        // https://pholser.github.io/jopt-simple/
        // but a more popular library is




        if (args.length != 2) {
            System.out.println("Usage: java main <slice.json> <patterns.json>");
            System.exit(1);
        }

        File patternsFile = new File(args[0]);
        Pattern[] patterns = mapper.readValue(patternsFile, Pattern[].class);

        // print the patterns
        for (Pattern pattern : patterns) {
            System.out.println(pattern.vulnerability);
            System.out.println(pattern.sources);
            System.out.println(pattern.sanitizers);
            System.out.println(pattern.sinks);
            System.out.println(pattern.implicit);
        }


    }

}

// How do I run this?
// Using maven?
// Open a terminal and type:
    /*
mvn compile
mvn exec:java -Dexec.mainClass="main"

     */

