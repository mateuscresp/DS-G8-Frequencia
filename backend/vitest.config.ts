import { defineConfig } from 'vitest/config';
import { resolve } from 'node:path';
export default defineConfig({
  resolve: { alias: { '@': resolve(__dirname, 'src') } },
  test: {
    environment: 'node', include: ['tests/unit/**/*.test.ts'],
    restoreMocks: true,
    coverage: { provider: 'v8', include: ['src/common/auth/guards/*.ts', 'src/modules/classes/*.service.ts', 'src/modules/attendance/*.ts'], exclude: ['**/*.module.ts', '**/*.controller.ts'], reporter: ['text', 'html', 'json-summary'], reportOnFailure: true },
  },
});
