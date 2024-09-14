import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import axios from "axios";
import promiseRetry from "promise-retry";
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
    const body = request.body;
    const authorization = await Authorization();

    const result = await promiseRetry(
      (retry, number) => {
        console.log(`Attempt number: ${number}`);
        return axios
          .post(
            "https://api.omno.com/transaction/h2h/create",
            {
              ...body,
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
          )
          .catch(retry);
      },
      {
        retries: 3, // Number of retries
        minTimeout: 1000, // Minimum time between retries (in milliseconds)
        maxTimeout: 5000, // Maximum time between retries (in milliseconds)
        factor: 2, // Exponential factor for retry delay
      }
    );

    reply.status(200).send({
      message: "Transaction created successfully",
      data: result.data,
    });
    return;
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

    return reply.status(200).send({ message: "Webhook received" });
  } catch (error) {
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
