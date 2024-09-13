import { FastifyPluginAsync } from "fastify";
import {
  createTransaction,
  processWebhook,
  processCallBack,
  processCallBackFail,
} from "../controllers/transactionController";
import { createTransactionSchema } from "../schemas/createTransactionSchema";

const transactionRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post("/create-transaction", createTransaction);
  fastify.post("/webhook", processWebhook);
  fastify.get("/callback", processCallBack);
  fastify.get("/callback-failed", processCallBackFail);
};

export default transactionRoutes;
