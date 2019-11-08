import NodeResque from "node-resque";
import { connection } from "../config";

export const scheduler = new NodeResque.Scheduler({ connection });

scheduler.on("start", () => {
  console.log("scheduler started");
});

scheduler.on("end", () => {
  console.log("scheduler ended");
});

scheduler.on("poll", () => {
  console.log("scheduler polling");
});

scheduler.on("master", () => {
  console.log("scheduler became master");
});

scheduler.on("error", (error: any) => {
  console.log(`scheduler error >> ${error}`);
});

scheduler.on("workingTimestamp", (timestamp: any) => {
  console.log(`scheduler working timestampe ${timestamp}`);
});
