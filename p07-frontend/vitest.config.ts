import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    restoreMocks: true,
    coverage: {
      provider: 'v8',
      include: [
        'src/attendance.ts',
        'src/modules/attendance/summary.ts',
        'src/modules/attendance/domain/**/*.ts',
        'src/modules/attendance/storage.ts',
      ],
      exclude: ['**/types.ts', '**/demoData.ts'],
      reporter: ['text', 'html', 'json', 'json-summary'],
      reportOnFailure: true,
    },
  },
})
