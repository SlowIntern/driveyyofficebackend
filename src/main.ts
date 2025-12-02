import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import  cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';



async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.use(
    bodyParser.json({
      verify: (req: any, res, buf) => {
        req.rawBody = buf; // required for Stripe signature verification
      },
    }),
  );
  app.enableCors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type, Authorization",
  });

  await app.listen(3000);
}
bootstrap();
