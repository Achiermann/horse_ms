// Database utilities
export const SCHEMA = 'horse_ms';

export function withSchema(tableName) {
  return `${SCHEMA}.${tableName}`;
}
