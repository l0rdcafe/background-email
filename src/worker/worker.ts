import { queue, worker } from "./index";

async function main() {
  await queue.connect();
  await worker.connect();
  await worker.start();
}

main();
