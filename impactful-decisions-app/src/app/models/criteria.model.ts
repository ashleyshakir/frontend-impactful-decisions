import { Decision } from "./decsion.model";

export class Criteria {
    id?: number;
    name?: string;
    weight?: number;
    decision?: Decision;

    constructor(id?: number, name?: string, weight?: number, decision?: Decision) {
        this.id = id;
        this.name = name;
        this.weight = weight;
        this.decision = decision;
    }
}