import app from '../server/src/app.js';
import { connectDB } from '../server/src/config/db.js';

export default async function handler(request: any, response: any) {
  await connectDB();
  return app(request, response);
}
