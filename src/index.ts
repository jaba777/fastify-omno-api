import fastify from "fastify";
import FastifyPlugin from "fastify-plugin";
import dotenv from "dotenv";
import transactionRoutes from "./routes/transaction";
import FastifySwagger from "@fastify/swagger";
import FastifySwaggerUI from "@fastify/swagger-ui";
import { Server } from "socket.io";

const app = fastify();

dotenv.config();

// Register Swagger
app.register(FastifySwagger, {
  swagger: {
    info: {
      title: "Omno API",
      description: "API documentation for the Omno transaction integration",
      version: "1.0.0",
    },
    tags: [
      { name: "transactions", description: "Transaction related endpoints" },
    ],
    basePath: "/",
  },
});

// Register Swagger UI
app.register(FastifySwaggerUI, {
  routePrefix: "/documentation",
  uiConfig: {
    docExpansion: "full",
    deepLinking: false,
  },
  uiHooks: {
    onRequest: function (request, reply, next) {
      next();
    },
    preHandler: function (request, reply, next) {
      next();
    },
  },
  staticCSP: true,
  transformStaticCSP: (header) => header,
  transformSpecification: (swaggerObject, request, reply) => {
    return swaggerObject;
  },
  transformSpecificationClone: true,
});

app.register(
  FastifyPlugin(async (fastify) => {
    fastify.register(transactionRoutes, { prefix: "/api" });
  })
);

const io = new Server(app.server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.decorate("io", io);

io.on("connection", (socket) => {
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

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

export { io };
