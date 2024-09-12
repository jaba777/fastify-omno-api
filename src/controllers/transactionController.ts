import { FastifyRequest, FastifyReply } from "fastify";
import axios from "axios";

export const createTransaction = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { amount, currency, billingInfo, cardData } = request.body as any;

    // Replace with actual Omno API endpoint and authentication
    const response = await axios.post(
      "https://api.omno.com/transaction/h2h/create",
      {
        amount,
        currency,
        billingInfo,
        cardData,
      }
    );

    reply.send(response.data);
    return;
  } catch (error: any) {
    reply.status(500).send(error.message);
  }
};
