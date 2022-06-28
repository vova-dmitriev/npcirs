import { ValidateInputPipe } from './core/pipes/validate.pipe';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(new ValidateInputPipe({ disableErrorMessages: false }));

  await app.listen(3000);
}
bootstrap();