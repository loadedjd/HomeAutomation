import { Controller, Get, Req, Param, Res } from '@nestjs/common';
import * as path from 'path';
import { join } from 'path';

@Controller('files')
export class FilesController {
    @Get(':url')
    getFile(@Param('url') url, @Res() res): string {
        res.sendFile(`${url}`, {root: 'files'});
        return 'ok';
    }
}
