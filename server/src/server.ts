import 'dotenv/config';
import app from './app.js';
import { connectDB } from './config/db.js';

const port = Number(process.env.PORT || 5001);
await connectDB();
app.listen(port, () => console.log(`THE ETERNAL JOURNEY API: http://localhost:${port}/api/health`));
