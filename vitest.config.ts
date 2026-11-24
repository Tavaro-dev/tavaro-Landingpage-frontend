import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    // A stand-in Lekvya key: the real ones live in .env, which tests never read (lib/env.ts).
    env: { LEKVYA_KEY_RESORT: 'pk_test_resort' },
    include: ['tests/unit/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
  },
});
