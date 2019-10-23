import { config } from "dotenv";
import app from "./app";

config();
const port = process.env.PORT || 5000;

app.listen({ port }, () => console.log(`🚀 Server ready on port ${port}`));
