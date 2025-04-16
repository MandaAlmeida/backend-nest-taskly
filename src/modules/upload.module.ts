import { UploadController } from '@/controllers/upload.controller';
import { UploadService } from '@/services/upload.service';
import { Module } from '@nestjs/common';


@Module({
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule { }
