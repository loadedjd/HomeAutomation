import { Socket } from 'socket.io';
import { Client } from '../models/Client';
import { Config } from '../models/Config';
import { Data } from '../models/Data';
import { DatabaseService } from './DatabaseService';
import { Injectable } from '@nestjs/common';

var colors = require('Colors');

@Injectable()
export class SocketService {

    public static connectedClients = new Array<Socket>();
    public static registeredClients = new Array<Client>();

    public static sendMessageToRegisteredClient(id: string, data: any) {
        let client = SocketService.registeredClients.find(c => c.id === id);
        if (client) {
            client.socket.emit('command', data);
        }
    }

    public static addConnectedClient(socket: Socket) {
        SocketService.connectedClients.push(socket);
        DatabaseService.addConnectedClient(socket, results => { })
    }

    public static addRegisteredClient(socket: Socket, config: Config) {
        DatabaseService.addConnectedClient(socket, () => {

            if (SocketService.validateConfig(config)) {
                var newClient = new Client(config.id, socket, config.location, config.description, config.commands);
                if (SocketService.registeredClients.findIndex(client => client.id === config.id)) {
                    SocketService.registeredClients.push(newClient);
                    DatabaseService.addRegisteredClient(newClient, results => {
                        DatabaseService.addClientCommand(newClient, result => {
                        });
                    });

                    DatabaseService.addClientIdForConnectedClient(newClient, socket);
                    console.log(colors.bgGreen(`New client registered ${newClient.id}`));
                } else {
                    console.log(colors.bgRed(`Client already registered`));
                    SocketService.registeredClients.push(newClient);
                    DatabaseService.addClientIdForConnectedClient(newClient, socket);
                }
            } else {
                console.log(colors.bgRed('Invalid client config'));
            }
        });
    }

    public static removeConnectedClient(socket: Socket) {
        SocketService.connectedClients = SocketService.connectedClients.filter(s => s.id !== socket.id);
        DatabaseService.removeConnectedClient(socket, results => { });
    }

    public static removeRegisteredClient(id: string) {
        let client = SocketService.registeredClients.find(client => client.id == id);
        if (client) {
            SocketService.removeConnectedClient(client.socket);
            SocketService.registeredClients = SocketService.registeredClients.filter(s => s.id !== client.id);
        }

        console.log(colors.bgMagenta(`Client ${client.id} disconnected`));
    }

    public static validateConfig(config: Config): boolean {
        Object.keys(config).forEach(key => {
            if (config[key] === undefined)
                return false;
        });

        return true;
    }

    public static addNewData(data: Data, socket: Socket) {
        let client = this.findClientFromSocket(socket);
        console.log(colors.bgCyan(`New data from client ${client.id} | ${data.title} | ${data.value}`));
        DatabaseService.addClientData(client, data, results => { });
    }

    private static findClientFromSocket(socket: Socket): Client {
        let client = SocketService.registeredClients.find(c => c.socket == socket || c.socket.id == socket.id);
        return client;
    }
}
