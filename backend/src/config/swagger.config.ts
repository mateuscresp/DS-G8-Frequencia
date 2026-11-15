import { registerAs } from '@nestjs/config';

export default registerAs('swagger', () => ({
  title: process.env.SWAGGER_TITLE ?? 'Controle de Frequência grupo-8 API',
  description: process.env.SWAGGER_DESCRIPTION ?? 'Documentação da API ds-gp8-frequencia',
  version: process.env.SWAGGER_VERSION ?? '1.0.0',
  path: process.env.SWAGGER_PATH ?? 'api/docs',
}));
