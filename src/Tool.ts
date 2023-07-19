import Coords from "./Coords";

/**
 * Generic structure of a tool - remembers where it was last applied, and contains a function to apply at a location or nowhere
 */
export default interface Tool {
    lastApplied: Coords | null;
    apply(location: Coords | null): void;
}