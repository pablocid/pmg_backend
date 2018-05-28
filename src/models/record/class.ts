export class Record {
    public _id: string;
    public schm: string;
    public created: Date;
    public attributes: [Attribute];
}

export class Attribute {
    public id: string;
    public string: string;
    public number: number;
    public boolean: boolean;
    public list: [string];
    public listOfObj: [{}];
    public reference: string;
}