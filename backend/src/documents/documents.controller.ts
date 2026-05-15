import { Controller, Get, Post, Delete, Param, Body, Query, UseGuards, Request, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { DocumentsService } from './documents.service';

@ApiTags('Documents')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('documents')
export class DocumentsController {
  constructor(private readonly docsService: DocumentsService) {}

  @Get() findAll(@Query() q: any) { return this.docsService.findAll(q); }
  @Get(':id') findOne(@Param('id') id: string) { return this.docsService.findOne(id); }
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/documents',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
      }
    })
  }))
  uploadFile(@UploadedFile() file: Express.Multer.File, @Body() body: any, @Request() req: any) {
    if (!file) throw new BadRequestException('File is required');
    
    return this.docsService.create({
      ...body,
      originalName: file.originalname,
      fileName: file.filename,
      mimeType: file.mimetype,
      size: file.size,
      filePath: file.path,
    }, req.user?.id);
  }

  @Post() create(@Body() body: any, @Request() req: any) { return this.docsService.create(body, req.user?.id); }
  @Delete(':id') delete(@Param('id') id: string, @Request() req: any) { return this.docsService.delete(id, req.user?.id); }
}
