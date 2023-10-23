import { Decision } from "./decsion.model";

export class Option {
    id?: number;
    name?: string;
    decision?: Decision;

    constructor(id?: number, name?: string, decision?: Decision) {
        this.id = id;
        this.name = name;
        this.decision = decision;
    }
}