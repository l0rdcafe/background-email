import NodeResque from "node-resque";
import nodemailer from "nodemailer";
import { config } from "dotenv";

config();

const connection = {
  pkg: "ioredis",
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  database: 0
};

const jobs = {
  notify: {
    perform: async (email: string) => {
      await new Promise(resolve => setTimeout(resolve, 10000));
      const transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD
        }
      });

      const mailOpts = {
        from: process.env.EMAIL,
        to: email,
        subject: "Thank You! We're Excited to Have You Aboard :)",
        html: `<h1>Hey there, ${email}!</h1><p>Thank you for signing up so I can send you a background job 8)</p>`
      };

      transport.sendMail(mailOpts, (error: Error, info: string) => {
        if (error) {
          console.error(error);
        } else {
          console.log(info);
        }
      });
    }
  }
};

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
