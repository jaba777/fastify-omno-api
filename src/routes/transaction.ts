import { FastifyPluginAsync } from "fastify";
import {
  createTransaction,
  processWebhook,
  processCallBack,
  processCallBackFail,
} from "../controllers/transactionController";
import {
  createTransactionSchema,
  createTransactionSchemssssa,
} from "../schemas/createTransactionSchema";

const transactionRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post("/create-transaction", {
    schema: {
      description: "Create a new transaction",
      tags: ["Transaction"],
      body: createTransactionSchema.body,
    },
    handler: createTransaction,
  });
  fastify.post("/webhook", processWebhook);
  fastify.get("/callback", processCallBack);
  fastify.get("/callbackFail", processCallBackFail);
};

export default transactionRoutes;
