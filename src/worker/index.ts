import NodeResque from "node-resque";
import { config } from "dotenv";
import { connection, jobs } from "../config";

config();

export const queue = new NodeResque.Queue({ connection }, jobs);
export const worker = new NodeResque.Worker({ connection, queues: ["email"] }, jobs);

worker.on("start", () => {
  console.log("Worker started!");
});

worker.on("end", () => {
  console.log("Worker ended!");
});

worker.on("poll", (q: string) => {
  console.log(`worker polling ${q}`);
});

worker.on("ping", time => {
  console.log(`worker check in @ ${time}`);
});

worker.on("success", async (q: string, job: any) => {
  console.log(`job success ${q} ${JSON.stringify(job)}`);
  await worker.end();
  process.exit(0);
});

worker.on("error", (error: any, q: string, job: any) => {
  console.log(`error ${q} ${JSON.stringify(job)}  >> ${error}`);
});
