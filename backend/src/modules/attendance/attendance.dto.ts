import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
export const OpenCallSchema = z.object({ minutes: z.number().int().min(1).max(120) }).strict();
export const RegisterSchema = z
  .object({
    code: z
      .string()
      .trim()
      .toUpperCase()
      .regex(/^[A-Z0-9]{6}$/),
  })
  .strict();
export const CorrectionSchema = z.object({ status: z.enum(['presente', 'ausente']) }).strict();
export class OpenCallDto extends createZodDto(OpenCallSchema) {}
export class RegisterDto extends createZodDto(RegisterSchema) {}
export class CorrectionDto extends createZodDto(CorrectionSchema) {}
