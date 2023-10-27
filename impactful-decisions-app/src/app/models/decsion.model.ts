import { Option } from "./option.model";
import { Criteria } from "./criteria.model";

export class Decision {
    id: number;
    title: string;
    description: string;
    creationDate: Date;
    resolved: boolean;
    optionList?: Option[];
    criteriaList?: Criteria[];


    constructor(id: number, title: string, description: string, creationDate: Date, resolved: boolean, optionList?: Option[], criteriaList?: Criteria[]) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.creationDate = creationDate;
        this.resolved = resolved;
        this.optionList = optionList;
        this.criteriaList = criteriaList;
    }

  }