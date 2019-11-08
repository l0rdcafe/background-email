import schedule from "node-schedule";
import { queue, worker } from "./index";
import { scheduler } from "../scheduler";

async function main() {
  await queue.connect();
  await worker.connect();
  worker.start();

  await scheduler.connect();
  scheduler.start();

  schedule.scheduleJob("5 21 * * *", async () => {
    console.log(">>> enquing a job");
    await queue.enqueue("email", "remind", ["ismailarafa18@gmail.com"]);
  });
}

main();
