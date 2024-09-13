import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import axios from "axios";
import dotenv from "dotenv";
import { CreateTransactionDto } from "../dtos/transaction-dto";
import { Authorization } from "../helpers/transactionHelper";
import { io } from "..";

dotenv.config();

export const createTransaction = async (
  request: FastifyRequest<{ Body: CreateTransactionDto }>,
  reply: FastifyReply
) => {
  try {
    // Replace with actual Omno API endpoint and authentication

    const authorization = await Authorization();

    const response = await axios.post(
      "https://api.omno.com/transaction/h2h/create",
      {
        ...request.body,
        hookUrl: `${process.env.APP_URL}/api/webhook`,
        callback: `${process.env.APP_URL}/api/callback`,
        callbackFail: `${process.env.APP_URL}/api/callbackFail`,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authorization["access_token"]}`,
        },
      }
    );

    reply.status(200).send({ success: true, data: response.data });
    // it must return paymentId:
  } catch (error: any) {
    reply.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

export const processWebhook = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const webhookData: any = request.body;
  const redirectUrl = webhookData["3dsRedirectUrl"];
  try {
    console.log("Received webhook: ", webhookData);

    if (redirectUrl) {
      io.emit("3dsRedirectUrl", { redirectUrl });
    }
  } catch (error) {
    request.log.error("Error handling webhook", error);
    return reply
      .status(500)
      .send({ success: false, message: "Webhook handling failed" });
  }
};

export const processCallBack = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const callback = request.body;
  //3dsRedirectUrl
  try {
    return reply.send({
      success: true,
      message: "callback received successfully",
    });
  } catch (error) {
    request.log.error("Error handling webhook", error);
    return reply
      .status(500)
      .send({ success: false, message: "Webhook handling failed" });
  }
};

export const processCallBackFail = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    return reply.send({
      success: false,
      message: "callback failed",
    });
  } catch (error) {
    request.log.error("Error handling webhook", error);
    return reply
      .status(500)
      .send({ success: false, message: "Webhook handling failed" });
  }
};
