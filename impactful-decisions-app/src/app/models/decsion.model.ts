export class Decision {
    id: number;
    title: string;
    description: string;
    creationDate: Date;
    isResolved: boolean;

    constructor(id: number, title: string, description: string, creationDate: Date, isResolved: boolean) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.creationDate = creationDate;
        this.isResolved = isResolved;
    }

  }