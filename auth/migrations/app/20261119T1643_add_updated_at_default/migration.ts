#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/e3479bf9c1ccbc45a1686cd266f3f333815958443f95e22f3ebc12053695b817/contract';
import endContract from '../../snapshots/e3479bf9c1ccbc45a1686cd266f3f333815958443f95e22f3ebc12053695b817/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/f8587b88239349c17d10039f5d015f4bc675514897b0c4d56bca8605e32b8263/contract';
import startContract from '../../snapshots/f8587b88239349c17d10039f5d015f4bc675514897b0c4d56bca8605e32b8263/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, sql } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.setDefault({
        schema: 'public',
        table: 'User',
        column: col('updatedAt', 'timestamptz(3)', {
          default: fn(sql`now()`),
          codecRef: { codecId: 'pg/timestamptz-date@1', typeParams: { precision: 3 } },
        }),
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
