export class Config {
    public id: string;
    public location: string;
    public description: string;
    public commands: Array<Object>;

    public constructor(id: string, location: string, description: string, commands: Array<object>) {
        this.id = id;
        this.description = description;
        this.location = location;
        this.commands = commands;
    }
}
