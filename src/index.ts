import Lujuria from "./utils/Lujuria.js";

async function main(): Promise<void> {
  const lujuria = new Lujuria();
  return await lujuria.exec();
}

main();
