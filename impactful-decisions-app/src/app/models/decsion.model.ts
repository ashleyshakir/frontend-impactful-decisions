export class Decision {
    id: number;
    title: string;
    description: string;
    creationDate: Date;
    resolved: boolean;

    constructor(id: number, title: string, description: string, creationDate: Date, resolved: boolean) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.creationDate = creationDate;
        this.resolved = resolved;
    }

  }