import { Socket } from "socket.io";
import { Data } from './data';

export class Client {
    public id: string;
    public socket: Socket;
    public location: string;
    public description: string;
    public commands: Array<Object>;
    public data: Array<Data>;

    public constructor(id: string, socket: Socket, location: string, description: string, commands: Array<object>) {
        this.id = id;
        this.socket = socket;
        this.description = description;
        this.location = location;
        this.commands = commands;
    }
}