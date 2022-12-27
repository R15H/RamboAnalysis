export interface Pattern {
    vulnerability: string;
    sources: string[];
    sanitizers: string[];
    sinks: string[];
    implicit: boolean;
}
