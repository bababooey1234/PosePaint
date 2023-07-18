import Coords from "./Coords";
export default interface Tool {
    lastApplied: Coords | null;
    apply(location: Coords | null): void;
}