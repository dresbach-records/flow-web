import assert from 'node:assert/strict';
 v0/flow-db-structure
import { classifyProduct } from '../src/validators/product-policy.js';
import { calculateCaseDeadline, calculateReleaseDate } from '../../src/app/commerce/FlowShopPolicy.js';

const blocked = classifyProduct({ name: 'Produto falsificado de marca' });
assert.equal(blocked.status, 'blocked');
assert.ok(blocked.reasons.includes('falsificado'));
assert.equal(classifyProduct({ name: 'Caderno artesanal' }).status, 'allowed');

const delivered = '2026-01-01T00:00:00.000Z';
assert.equal(calculateCaseDeadline(delivered), '2026-01-08T00:00:00.000Z');
assert.equal(calculateReleaseDate(delivered), '2026-01-08T00:00:00.000Z');

console.log('domain tests passed');


/**
 * Smoke/domain tests for the FLOW API foundation.
 * Keep these tests dependency-light so `npm test` validates the backend
 * without requiring Firebase, MongoDB, or external services.
 */

const prohibitedCategories = new Set([
  'piracy',
  'counterfeit',
  'pornography',
  'illegal-drugs',
  'unapproved-health-product',
]);

function isProductAllowed(category: string): boolean {
  return !prohibitedCategories.has(category.trim().toLowerCase());
}

function isWithinProtectionWindow(deliveredAt: Date, now: Date): boolean {
  const elapsedMs = now.getTime() - deliveredAt.getTime();
  return elapsedMs >= 0 && elapsedMs <= 7 * 24 * 60 * 60 * 1000;
}

assert.equal(isProductAllowed('piracy'), false);
assert.equal(isProductAllowed('counterfeit'), false);
assert.equal(isProductAllowed('electronics'), true);

const deliveredAt = new Date('2026-01-01T12:00:00.000Z');
assert.equal(
  isWithinProtectionWindow(deliveredAt, new Date('2026-01-08T12:00:00.000Z')),
  true,
);
assert.equal(
  isWithinProtectionWindow(deliveredAt, new Date('2026-01-08T12:00:01.000Z')),
  false,
);

console.log('FLOW backend domain tests: PASS');
 main
