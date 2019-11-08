import nodemailer from "nodemailer";
import { config } from "dotenv";

config();

export const connection = {
  pkg: "ioredis",
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  database: 0
};

export const jobs = {
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
  },
  remind: {
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
        html: `<h1>Hey there, ${email}!</h1><p>Thank you for signing up so I can send you a scheduled background at exactly ${new Date().toUTCString()} job 8)</p>`
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
