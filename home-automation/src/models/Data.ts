export class Data {
    public title: string;
    public value: any;
    public type: string;

    constructor(title: string, type: string, value: any) {
        this.title = title;
        this.value = value;
        this.type = type;
    }
}