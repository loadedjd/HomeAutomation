import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { DatabaseService } from '../services/DatabaseService';
import { SocketService } from '../services/SocketService';

@Controller('api')
export class ApiController {

    @Get('clients')
    getAllClients() {
        return DatabaseService.getAllConnectedAndRegisteredClients();
    }

    @Get('clients/:id')
    getClient(@Param('id') id) {
        return DatabaseService.getRegisteredClient(id);
    }

    @Get('command/:id')
    getClientCommand(@Param('id') id) {
        return DatabaseService.getClientCommands(id);
    }

    @Post('command')
    handleCommandRequest(@Body() body) {
        const command = body.command;
        const client = body.client;

        SocketService.sendMessageToRegisteredClient(client, command);
    }

    @Get('data')
    getAllClientData() {
        return DatabaseService.getAllClientData();
    }

    @Get('data/:id')
    getClientData(@Param('id') id) {
        return DatabaseService.getClientData(id);
    }

}
