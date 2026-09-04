import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'node:crypto';
import { prisma } from '../infrastructure/database.js';
import { env } from '../config/env.js';
function accessToken(userId, role) {
    return jwt.sign({ sub: userId, role, type: 'access' }, env.JWT_SECRET, { expiresIn: '15m' });
}
export async function register(input) {
    const passwordHash = await argon2.hash(input.password, { type: argon2.argon2id });
    const user = await prisma.user.create({ data: { ...input, passwordHash } });
    return { id: user.id, email: user.email, username: user.username, displayName: user.displayName };
}
export async function login(email, password) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.status !== 'ACTIVE' || !(await argon2.verify(user.passwordHash, password)))
        throw new Error('INVALID_CREDENTIALS');
    const refresh = randomUUID() + randomUUID();
    const refreshHash = await argon2.hash(refresh, { type: argon2.argon2id });
    await prisma.session.create({ data: { userId: user.id, refreshHash, expiresAt: new Date(Date.now() + 30 * 86400000) } });
    return { accessToken: accessToken(user.id, user.role), refreshToken: refresh, user: { id: user.id, email: user.email, username: user.username, displayName: user.displayName, role: user.role } };
}
