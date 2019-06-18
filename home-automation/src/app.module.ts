import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientGateway } from './gateways/clientGateway';
import { SocketService } from './services/SocketService';
import { DatabaseService } from './services/DatabaseService';
import { FilesController } from './controllers/files.controller';
import { ApiController } from './controllers/api.controller';

@Module({
  imports: [],
  controllers: [AppController, FilesController, ApiController],
  providers: [AppService, ClientGateway, SocketService, DatabaseService],
})
export class AppModule {}
