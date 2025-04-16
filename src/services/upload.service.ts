import { UploadDTO } from '@/contracts/upload.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadService {

    async upload(file: UploadDTO) {
        console.log(file)
    }
}
