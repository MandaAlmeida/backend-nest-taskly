import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Env } from './env';
import { ValidationPipe } from '@nestjs/common';
import { initSwagger } from './swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  initSwagger(app);

  const configService = app.get<ConfigService<Env, true>>(ConfigService)
  app.useGlobalPipes(new ValidationPipe({
    whitelist: false, //TODO: alterar para true quando todos os contratos possuirem regras de validacao nos campos
    forbidNonWhitelisted: true,
    transform: true,
    disableErrorMessages: false,
  }));

  const port = configService.get("PORT", { infer: true })

  await app.listen(port);
}
bootstrap();
