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
    option?: Option; 
    criteria?: Criteria; 

    constructor(id?: number, type?: 'pro' | 'con', rating?: number, description?: string, option?: Option, criteria?: Criteria){
      this.id = id;
      this.type = type;
      this.rating = rating;
      this.description = description;
      this.option = new Option();
      this.criteria = new Criteria();
    }
  }
  