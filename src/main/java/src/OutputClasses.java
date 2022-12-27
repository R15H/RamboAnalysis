// This file implements the classes for the following BNF:
// <OUTPUT> ::= [ <VULNERABILITIES> ]
//<VULNERABILITIES> := "none" | <VULNERABILITY> | <VULNERABILITY>,<VULNERABILITIES>
//<VULNERABILITY> ::= { "name":"<STRING>",
//                    "source":"<STRING>",
//                    "sink":"<STRING>",
//                    "unsanitized flows": <YESNO>,
//                    "sanitized flows": [ <FLOWS> ] }
//<YESNO> ::= "yes" | "no"
//<FLOWS> ::= "none" | <FLOW> | <FLOW>,<FLOWS>
//<FLOW> ::= [ <SANITIZERS> ]
//<SANITIZERS> ::= <STRING> | <STRING>,<SANITIZERS>

import java.util.ArrayList;
import java.util.List;

class Pattern {
    public String vulnerability;
    public String[] sources;
    public String[] sanitizers;
    public String[] sinks;
    public Boolean implicit;
}

public class Vulnerability {
    private String name;
    private String source;
    private String sink;
    private boolean unsanitizedFlows;
    private List<String> sanitizedFlows;

    public Vulnerability(String name, String source, String sink, boolean unsanitizedFlows, List<String> sanitizedFlows) {
        this.name = name;
        this.source = source;
        this.sink = sink;
        this.unsanitizedFlows = unsanitizedFlows;
        this.sanitizedFlows = sanitizedFlows;
    }

    public String getName() {
        return name;
    }

    public String getSource() {
        return source;
    }

    public String getSink() {
        return sink;
    }

    public boolean hasUnsanitizedFlows() {
        return unsanitizedFlows;
    }

    public List<String> getSanitizedFlows() {
        return sanitizedFlows;
    }
}

public class Output {
    private List<Vulnerability> vulnerabilities;

    public Output(List<Vulnerability> vulnerabilities) {
        this.vulnerabilities = vulnerabilities;
    }

    public List<Vulnerability> getVulnerabilities() {
        return vulnerabilities;
    }
}


/*


class Vulnerability {
    public String name;
    public String source;
    public String sink;
    public String unsanitizedFlows;
    public List<Flow> sanitizedFlows;

    public Vulnerability(String name, String source, String sink, String unsanitizedFlows, List<Flow> sanitizedFlows) {
        this.name = name;
        this.source = source;
        this.sink = sink;
        this.unsanitizedFlows = unsanitizedFlows;
        this.sanitizedFlows = sanitizedFlows;
    }
}

class Flow {
    public List<String> sanitizers;

    public Flow(List<String> sanitizers) {
        this.sanitizers = sanitizers;
    }
}
class Output {
    public List<Vulnerability> vulnerabilities;

    public Output(List<Vulnerability> vulnerabilities) {
        this.vulnerabilities = vulnerabilities;
    }
}

 */
