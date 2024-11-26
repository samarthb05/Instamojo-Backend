const { default: axios } = require("axios");
const express = require("express");
require("dotenv").config();

const app = express();
const port = 8080;

app.use(express.json());

//create-order api
app.post("/create-order", async (req, res) => {
  const { amount, purpose, buyer_name, email, phone } = req.body;
  try {
    const headers = {
      "X-Api-Key": process.env.API_KEY,
      "X-Auth-Token": process.env.AUTH_TOKEN,
    };
    const payResponse = {
      amount: amount,
      purpose: purpose,
      buyer_name: buyer_name,
      email: email,
      phone: phone,
      redirect_url: "http://localhost:8080",
      webhook: "http://localhost:8080",
      allow_repeated_payments: false,
      send_email: false,
    };
    try {
      const response = await axios.post(
        "https://test.instamojo.com/v2/payment-requests/",

        payResponse,
        { headers }
      );

      return res.status(201).json({
        message: "Instamojo order created successfully!",
        data: response.data,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

//webhook
app.post("/webhook", async (req, res) => {
  try {
    const { amount, payment_request_id, status, purpose } = req.body;
    if (status === "Credit") {
      // condition to check payment status
      const payment = {
        orderId: payment_request_id,
        amount,
        purpose,
        status,
      };
    }
    return res.status(200).json({ message: "webhook data received!" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
app.listen(port, () => {
  console.log(`server listen to ${port}`);
});
