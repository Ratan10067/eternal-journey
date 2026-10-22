import { randomBytes } from 'node:crypto';
import bcrypt from 'bcryptjs';

const key = randomBytes(32).toString('base64url');
const hash = await bcrypt.hash(key, 12);

console.log('Save the key in a password manager. It is shown only in this terminal output.');
console.log(`ADMIN_KEY=${key}`);
console.log(`ADMIN_KEY_HASH=${hash}`);
console.log('Add only ADMIN_KEY_HASH to server/.env. Do not commit either value.');
