import { Option } from "./option.model";
import { Criteria } from "./criteria.model";

export class ProCon {
  pros: ProConItem[] = [];
  cons: ProConItem[] = [];
}

export class ProConItem {
    id?: number;
    type?: 'pro' | 'con'; 
    rating?: number;
    description?: string;
    optionId?: number; 
    criteriaId?: number; 
    criteriaName?: string;
    option?: Option;
    criteria?: string;

    constructor(id?: number, type?: 'pro' | 'con', rating?: number, 
                description?: string, optionId?: number, criteriaId?: number, 
                criteriaName?: string, option?: Option, criteria?: string) {
      this.id = id;
      this.type = type;
      this.rating = rating;
      this.description = description;
      this.optionId = optionId;
      this.criteriaId = criteriaId;
      this.criteriaName = criteriaName;
      this.option = option;
      this.criteria = criteria;
    }
  }
  