import assert from 'node:assert/strict';
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
