import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { EnvService } from '../src/env/env.service';
import { UploadModule } from '../src/modules/upload.module';
import { ConfigService } from '@nestjs/config';

describe('UploadController (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [UploadModule],
            providers: [EnvService, ConfigService],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    let uploadedFileName: string;

    it('Deve fazer upload de um arquivo', async () => {
        const res = await request(app.getHttpServer())
            .post('/uploads')
            .attach('file', Buffer.from('Teste de upload'), {
                filename: 'teste.txt',
                contentType: 'text/plain',
            });

        // Verifique o conteúdo da resposta para ver o nome completo do arquivo
        console.log(res.body);  // Para verificar o nome completo gerado do arquivo

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty('url');

        // Armazene o nome completo gerado para usar nos próximos testes
        uploadedFileName = res.body.data.url;  // O nome completo com UUID
    });

    it('Deve gerar a URL pública do arquivo', async () => {
        // Use o nome completo do arquivo com a parte aleatória (como UUID)
        const res = await request(app.getHttpServer()).get(`/uploads/${uploadedFileName}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body).toHaveProperty('url');
    });

    it('Deve fazer download do arquivo', async () => {
        // Use o nome completo do arquivo, incluindo o UUID
        const res = await request(app.getHttpServer()).get(`/uploads/download/${uploadedFileName}`);

        expect(res.status).toBe(200);
        expect(res.header['content-type']).toBeDefined();
    });

    it('Deve deletar o arquivo', async () => {
        // Use o nome completo do arquivo para deletar
        const res = await request(app.getHttpServer()).delete(`/uploads/${uploadedFileName}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
    });

});
