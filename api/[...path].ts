import app from '../server/src/app.js';
import { connectDB } from '../server/src/config/db.js';

export default async function handler(request: any, response: any) {
  await connectDB();
  // Vercel removes the /api prefix when it invokes api/[...path].  The Express
  // routers deliberately keep their existing /api mount points for local use.
  if (typeof request.url === 'string' && !request.url.startsWith('/api/')) {
    request.url = `/api${request.url.startsWith('/') ? request.url : `/${request.url}`}`;
  }
  return app(request, response);
}
