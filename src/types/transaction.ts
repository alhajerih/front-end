export type TransactionType = "DEPOSIT" | "WITHDRAWAL";

export type TransactionCategory =
  | "FOOD_GROCERY"
  | "OTHER_GROCERY"
  | "PERSONAL"
  | "EATING_OUT"
  | "ENTERTAINMENT"
  | "TRANSPORTATION"
  | "SUBSCRIPTION"
  | "FIXED_EXPENSE"
  | "ONE_TIME_EXPENSE"
  | "OTHER";

export interface Transaction {
  id: number;
  amount: number;
  date: string;
  message: string; // This matches the API response
  transactionType: TransactionType;
  transactionCategory: TransactionCategory;
}
