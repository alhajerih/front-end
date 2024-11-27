const axios = require("axios");

// Bearer token for authentication
const BEARER_TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJIYW1hZCIsInJvbGUiOiJ1c2VyIiwiaWQiOjEsInVzZXJOYW1lIjoiSGFtYWQiLCJleHAiOjE3MzI3ODY0NDcsImlhdCI6MTczMjcwMDA0N30.6QSHtYPYlG4_SZzwVJRfnpaZSdgjEgiT6hQ089E3zow"; // Replace with your token

// API endpoint
const API_URL = "http://localhost:8081/api/v1/user/transactions";

// Possible transaction categories
const TRANSACTION_CATEGORIES = [
  "GROCERY",
  "ESSENTIALS",
  "ENTERTAINMENT",
  "EATING_OUT",
  "PERSONAL",
  "TRANSPORTATION",
  "SUBSCRIPTION",
  "FIXED_EXPENSE",
  "ONETIME_EXPENSE",
  "RENT",
  // "UNCATEGORIZED",
  "OTHER",
];

// Possible transaction types
const TRANSACTION_TYPES = ["DEPOSIT", "WITHDRAWAL"];
// const TRANSACTION_TYPES = ["DEPOSIT"];

// Generate a random transaction body
const generateRandomTransaction = () => {
  const amount = Math.floor(Math.random() * 1000) + 100; // Random amount between 100 and 1,000
  const message = `Random message ${Math.floor(Math.random() * 1000)}`;
  const transactionCategory =
    TRANSACTION_CATEGORIES[
      Math.floor(Math.random() * TRANSACTION_CATEGORIES.length)
    ];
  const transactionType =
    TRANSACTION_TYPES[Math.floor(Math.random() * TRANSACTION_TYPES.length)];

  return {
    amount,
    message,
    transactionCategory,
    transactionType,
  };
};

// Function to send a transaction
const sendTransaction = async (transaction) => {
  try {
    const response = await axios.post(API_URL, transaction, {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    console.log(`Transaction sent successfully:`, response.data);
  } catch (error) {
    console.error(
      `Failed to send transaction:`,
      transaction,
      error.response ? error.response.data : error.message
    );
  }
};

// Generate and send multiple transactions
const createTransactions = async (count) => {
  for (let i = 0; i < count; i++) {
    const transaction = generateRandomTransaction();
    console.log(`Sending transaction ${i + 1}/${count}:`, transaction);
    await sendTransaction(transaction);
  }
};

// Number of transactions to create
const TRANSACTION_COUNT = 20; // Adjust this number as needed

// Start the script
createTransactions(TRANSACTION_COUNT).then(() => {
  console.log("All transactions have been sent.");
});
