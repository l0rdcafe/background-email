import { Router } from "express";
import { genSalt, compare, hash } from "bcrypt";
import knex from "../db/knex";
import { queue } from "../worker";

const router = Router();

async function init() {
  await queue.connect();
}

init();

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!email || !emailRegex.test(email)) {
      throw new Error("No valid email provided");
    }

    let [user] = await knex("users")
      .select("*")
      .where("email", email);

    if (user) {
      const isValidPassword = await compare(password, user.password);
      if (!isValidPassword) {
        throw new Error("Wrong password");
      }
    } else {
      const salt = await genSalt(10);
      const hashedPassword = await hash(password, salt);
      user = await knex("users")
        .insert({ email, password: hashedPassword })
        .returning("email");
    }

    await queue.enqueue("email", "notify", email);

    res.status(200).end();
  } catch (e) {
    next(e);
  }
});

export default router;
