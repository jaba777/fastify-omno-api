import { FastifyPluginAsync } from "fastify";
import { createTransaction } from "../controllers/transactionController";

const transactionRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post("//create-transaction", createTransaction);
};

export default transactionRoutes;
