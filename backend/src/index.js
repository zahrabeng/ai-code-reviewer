import { validateEnv, env } from '../config/env.js';
import app from './app.js';

validateEnv();

app.listen(env.port, () => {
  console.log(`[server] Listening on http://localhost:${env.port}`);
});
