import * as sql from 'mysql';
import * as colors from 'colors';
import { Client } from '../models/Client';
import { Socket } from 'socket.io';
import { Data } from '../models/Data';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DatabaseService {

    private static _connection = sql.createConnection({
        host: 'localhost',
        user: 'node',
        password: 'R@ndom123',
        database: 'registeredclient'
    });

    constructor() {
        DatabaseService._connection.connect((err, args) => {
            if (err) {
                console.log(colors.bgRed(`Error connecting to sql server: ${err}`));
            } else {
                console.log(colors.bgGreen(`Connected to sql server`));
            }
        });
    }

    public static getAllRegisteredClients(): Promise<object[]> {
        const promise = new Promise<object[]>((resolve, reject) => {
            this._connection.query('select * from registeredclient', (err, results, fields) => {
                if (err) {
                    console.log(colors.bgRed(`Error in query to table registeredclient`));
                    reject(err);
                } else {
                    if (results)
                        resolve(results);
                }
            })
        });

        return promise;
    }

    public static getAllConnectedClients(callback: (results: object[]) => void) {
        this._connection.query('select * from connectedclient', (err, results, fields) => {
            if (err)
                console.log(colors.bgRed(`Error getting connected clients`));
            else {
                callback(results);
            }
        });
    }

    public static getAllClientData(): Promise<object[]> {
        const promise = new Promise<object[]>((resolve, reject) => {
            this._connection.query('select * from clientdata', (err, results, fields) => {
                if (err) {
                    console.log(colors.bgRed(`Error getting client data`));
                    reject(err);
                }
                else
                    resolve(results);
            });
        });
        return promise;
    }

    public static getRegisteredClient(id: string, callback: (results: object[]) => void) {
        this._connection.query('select * from registeredclient where id = ?', [id], (err, results, fields) => {
            if (err)
                console.log(colors.bgRed(`Error getting client ${id}`));
            else
                callback(results);
        });
    }

    public static getClientData(id: string, callback: (results: object[]) => void) {
        this._connection.query('select * from clientdata where clientid = ?', [id], (err, results, fields) => {
            if (err)
                console.log(colors.bgRed(`Error getting client data for ${id}`));
            else
                callback(results);
        });
    }

    public static getClientCommands(id: string): Promise<object[]> {
        const promise = new Promise<Object[]>((resolve, reject) => {
            this._connection.query('select * from clientcommand where clientid = ?', [id], (err, results, fields) => {
                if (err) {
                    console.log(colors.bgRed(`Error getting client commands for ${id}`));
                    reject(err);
                }
                else
                    resolve(results);
            });
        });

        return promise;
    }

    public static addRegisteredClient(client: Client, callback: (err) => void) {
        this._connection.query('insert into registeredclient (id, location, description) values (?, ?, ?)', [client.id, client.location, client.description], (err, results, fields) => {
            if (err)
                console.log(colors.bgRed(`Error adding new registered client ${client.id}, ${err}`));
            else
                callback(results);
        });
    }

    public static addConnectedClient(socket: Socket, callback: (err) => void) {
        this._connection.query('insert into connectedclient (connectedClientId, remoteAddress) values (UUID(), ?)', [socket.conn.remoteAddress], (err, results, fields) => {
            if (err)
                console.log(colors.bgRed(`Error adding new connected client ${socket.conn.remoteAddress}, ${err}`));
            else
                callback(results);
        });
    }

    public static addClientData(client: Client, data: Data, callback: (err) => void) {
        this._connection.query('insert into clientdata (dataid, value, title, type, clientid, time) values (UUID(), ?, ?, ?, ?, NOW() )', [data.value, data.title, data.type, client.id], (err, results, fields) => {
            if (err)
                console.log(colors.bgRed(`Error adding client data to db ${err}`));
            else
                callback(results);
        });
    }

    public static removeConnectedClient(socket: Socket, callback: (err) => void) {
        this._connection.query('delete from connectedclient where remoteAddress = ?', [socket.conn.remoteAddress], (err, results, fields) => {
            if (err)
                console.log(colors.bgRed(`Error adding new connected client ${socket.conn.remoteAddress}, ${err}`));
            else
                callback(results);
        });
    }

    public static addClientCommand(client: Client, callback: (err) => void) {
        if (client.commands) {
            client.commands.forEach(command => {
                this._connection.query('insert into clientcommand (commandid, clientId, name) values (UUID(), ?, ?)', [client.id, command], (err, results, fields) => {
                    if (err)
                        console.log(colors.bgRed(`Error adding new client command ${client.id}, ${err}`));
                    else
                        callback(results);
                });
            });
        }
    }

    public static addClientIdForConnectedClient(client: Client, socket: Socket) {
        let remoteAddress = socket.conn.remoteAddress;
        this._connection.query('update connectedclient set clientId = ? where remoteAddress = ?', [client.id, remoteAddress], (err, results, fields) => {
            if (err)
                console.log(colors.bgRed(`Error adding new client command ${client.id}, ${err}`));
        });
    }

    public static getAllConnectedAndRegisteredClients(): Promise<object[]> {
        const promise = new Promise<object[]>((resolve, reject) => {
            this._connection.query(`select registeredclient.id, registeredclient.description, registeredclient.location,
            connectedclient.remoteAddress from connectedclient inner join registeredclient on
            registeredclient.id =  connectedclient.clientId`, (err, results, fields) => {
                    if (err) {
                        console.log(colors.bgRed(`Error getting all connected and registered clients`));
                        reject(err);
                    }
                    else
                        resolve(results);
                });
        });
        return promise;
    }
}