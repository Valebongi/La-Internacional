import { IsNotEmpty, IsOptional, IsNumber, IsString, validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';

/**
 * Validación centralizada de variables de entorno
 * Usable por todos los servicios del monorepo
 *
 * Uso en app.module.ts:
 *   import { validateConfig } from '@lid/common/config';
 *   ...
 *   bootstrap() {
 *     validateConfig();  // Lanza error si hay vars faltantes
 *   }
 */

export class EnvironmentVariables {
  @IsString()
  @IsNotEmpty()
  NODE_ENV: string = 'development';

  @IsNumber()
  @IsOptional()
  GATEWAY_PORT?: number = 8080;

  @IsNumber()
  @IsOptional()
  AUTH_PORT?: number = 3001;

  @IsNumber()
  @IsOptional()
  CRM_CORE_PORT?: number = 3002;

  @IsNumber()
  @IsOptional()
  MESSAGING_PORT?: number = 3003;

  @IsNumber()
  @IsOptional()
  BROADCASTS_PORT?: number = 3004;

  @IsNumber()
  @IsOptional()
  POSTSALE_PORT?: number = 3005;

  @IsNumber()
  @IsOptional()
  ANALYTICS_PORT?: number = 3006;

  @IsNumber()
  @IsOptional()
  INTEGRATION_PORT?: number = 3007;

  @IsString()
  @IsOptional()
  AUTH_URL?: string;

  @IsString()
  @IsOptional()
  CRM_CORE_URL?: string;

  @IsString()
  @IsOptional()
  MESSAGING_URL?: string;

  @IsString()
  @IsOptional()
  BROADCASTS_URL?: string;

  @IsString()
  @IsOptional()
  POSTSALE_URL?: string;

  @IsString()
  @IsOptional()
  ANALYTICS_URL?: string;

  @IsString()
  @IsOptional()
  INTEGRATION_URL?: string;

  @IsString()
  @IsNotEmpty()
  DATABASE_URL: string;

  @IsString()
  @IsNotEmpty()
  POSTSALE_DATABASE_URL: string;

  @IsString()
  @IsNotEmpty()
  JWT_SECRET: string;

  @IsString()
  @IsNotEmpty()
  JWT_EXPIRES_IN: string = '7d';

  @IsString()
  @IsOptional()
  META_APP_ID?: string;

  @IsString()
  @IsOptional()
  META_APP_SECRET?: string;

  @IsString()
  @IsOptional()
  META_PHONE_NUMBER_ID?: string;

  @IsString()
  @IsOptional()
  META_BUSINESS_ACCOUNT_ID?: string;

  @IsString()
  @IsOptional()
  META_ACCESS_TOKEN?: string;

  @IsString()
  @IsOptional()
  META_VERIFY_TOKEN?: string;

  @IsString()
  @IsOptional()
  META_GRAPH_VERSION?: string = 'v25.0';

  @IsString()
  @IsOptional()
  EXTERNAL_SYSTEM_BASE_URL?: string;

  @IsString()
  @IsOptional()
  EXTERNAL_SYSTEM_API_KEY?: string;

  @IsString()
  @IsOptional()
  EXTERNAL_SYSTEM_MOCK?: string = 'true';
}

export function validateConfig(): EnvironmentVariables {
  const config = plainToInstance(EnvironmentVariables, process.env, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(config, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    const messages = errors
      .map((err) => `  ${err.property}: ${Object.values(err.constraints || {}).join(', ')}`)
      .join('\n');
    console.error(`\n[CONFIG ERROR] Environment variables missing or invalid:\n${messages}\n`);
    process.exit(1);
  }

  return config;
}
