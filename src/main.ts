import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { envs } from './config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
   // Crear servidor HTTP
   const app = await NestFactory.create(AppModule);

   app.useGlobalPipes(
     new ValidationPipe({
       whitelist: true,
       forbidUnknownValues: true,
     }),
   );
 
   // Configurar puerto HTTP desde variable de entorno
   const port = process.env.PORT || 8080;  // Cambio aquí
 
   // Conectar microservicio TCP
   const microservice = app.connectMicroservice<MicroserviceOptions>({
     transport: Transport.TCP,
     options: {
       port: 3004, // Puerto del microservicio
     },
   });
 
   await app.startAllMicroservices(); // Inicia microservicio
   await app.listen(port);            // Inicia servidor HTTP

}
bootstrap();
