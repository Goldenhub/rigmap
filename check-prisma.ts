
import db from './src/lib/db';

async function checkModels() {
  console.log("Prisma Models:", Object.keys(db).filter(k => !k.startsWith('_') && !k.startsWith('$')));
  process.exit(0);
}

checkModels();
