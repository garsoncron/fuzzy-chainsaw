import * as migration_20250706_223956 from './20250706_223956';
import * as migration_20250709_222212_1234 from './20250709_222212_1234';

export const migrations = [
  {
    up: migration_20250706_223956.up,
    down: migration_20250706_223956.down,
    name: '20250706_223956'
  },
  {
    up: migration_20250709_222212_1234.up,
    down: migration_20250709_222212_1234.down,
    name: '20250709_222212_1234'
  },
];
