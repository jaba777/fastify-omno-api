import fastify from "fastify";
import FastifyPlugin from "fastify-plugin";
import dotenv from "dotenv";
import transactionRoutes from "./routes/transaction";

const app = fastify();

dotenv.config();

app.register(
  FastifyPlugin(async (fastify) => {
    fastify.register(transactionRoutes, { prefix: "/transactions" });
  })
);

app.listen(
  { port: Number(process.env.PORT), host: "localhost" },
  (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
  }
);
