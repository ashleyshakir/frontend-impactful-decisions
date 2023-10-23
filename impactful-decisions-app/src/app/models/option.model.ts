import { Decision } from "./decsion.model";
import { ProCon, ProConItem } from "./procon.model";

export class Option {
    id?: number;
    name?: string;
    decision?: Decision;
    proConList?: ProConItem[];

    constructor(id?: number, name?: string, decision?: Decision, proConList?: ProConItem[]) {
        this.id = id;
        this.name = name;
        this.decision = decision;
        this.proConList = proConList
    }
}