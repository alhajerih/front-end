"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";
import { getTransactions } from "@/app/api/actions/auth";
import type {
  Transaction,
  TransactionType,
  TransactionCategory,
} from "@/types/transaction";

// type TransactionType = "DEPOSIT" | "WITHDRAWAL";

// type TransactionCategory =
//   | "FOOD_GROCERY"
//   | "OTHER_GROCERY"
//   | "PERSONAL"
//   | "EATING_OUT"
//   | "ENTERTAINMENT"
//   | "TRANSPORTATION"
//   | "SUBSCRIPTION"
//   | "FIXED_EXPENSE"
//   | "ONE_TIME_EXPENSE"
//   | "OTHER";

// type Transaction = {
//   id: number;
//   amount: number;
//   date: string;
//   message: string;
//   transactionType: TransactionType;
//   transactionCategory: TransactionCategory;
// };

type SortField =
  | "date"
  | "amount"
  | "message"
  | "transactionType"
  | "transactionCategory";

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString("en-US");
};

const categoryColors: Record<TransactionCategory, string> = {
  FOOD_GROCERY: "bg-[#3182CE] text-[#E6FFFA]",
  OTHER_GROCERY: "bg-[#2A4365] text-[#CBD5E0]",
  PERSONAL: "bg-[#4299E1] text-[#EBF8FF]",
  EATING_OUT: "bg-[#F56565] text-[#FFF5F5]",
  ENTERTAINMENT: "bg-[#805AD5] text-[#FAF5FF]",
  TRANSPORTATION: "bg-[#38B2AC] text-[#E6FFFA]",
  SUBSCRIPTION: "bg-[#D53F8C] text-[#FFF5F7]",
  FIXED_EXPENSE: "bg-[#E53E3E] text-[#FFF5F5]",
  ONE_TIME_EXPENSE: "bg-[#ED8936] text-[#FFFAF0]",
  OTHER: "bg-[#4A5568] text-[#E2E8F0]",
};

export default function TransactionList() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [filterText, setFilterText] = useState("");
  const [filterCategory, setFilterCategory] = useState<
    TransactionCategory | "ALL"
  >("ALL");

  useEffect(() => {
    async function fetchTransactions() {
      try {
        // Fetch transactions for the user
        const data = await getTransactions();
        setTransactions(data);
        // console.log(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching transactions:", err);
        setError("Failed to load transactions. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.message.toLowerCase().includes(filterText.toLowerCase()) &&
      (filterCategory === "ALL" ||
        transaction.transactionCategory === filterCategory)
  );

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortDirection === "asc" ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransactions = sortedTransactions.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const pageCount = Math.ceil(sortedTransactions.length / itemsPerPage);

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const renderSortIcon = (field: SortField) => {
    if (field !== sortField) return <ChevronsUpDown className="ml-2 h-4 w-4" />;
    return sortDirection === "asc" ? (
      <ChevronUp className="ml-2 h-4 w-4" />
    ) : (
      <ChevronDown className="ml-2 h-4 w-4" />
    );
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxButtons = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(pageCount, startPage + maxButtons - 1);

    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <Button
          key={i}
          variant={i === currentPage ? "default" : "outline"}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </Button>
      );
    }

    return buttons;
  };

  if (isLoading) {
    return <div className="text-center">Loading transactions...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <Card className="w-full max-w-4xl bg-[#1A1D29] text-gray-300 shadow-2xl rounded-3xl">
      <CardHeader>
        <CardTitle className="text-[#A3BFFA]">Transaction List</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex gap-4">
          <Input
            placeholder="Filter by message..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="max-w-sm"
          />
          <Select
            value={filterCategory}
            onValueChange={(value) =>
              setFilterCategory(value as TransactionCategory | "ALL")
            }
          >
            <SelectTrigger className="w-[180px] bg-[#2C3141] text-[#A3BFFA]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Categories</SelectItem>
              {Object.keys(categoryColors).map((category) => (
                <SelectItem key={category} value={category}>
                  {category.replace(/_/g, " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Table className="bg-[#1A1D29] text-gray-300 shadow-md rounded-lg">
          <TableHeader>
            <TableRow className="bg-[#23273A] text-[#A3BFFA]">
              <TableHead>
                <Button
                  variant="ghost"
                  className="text-[#A3BFFA]"
                  onClick={() => handleSort("date")}
                >
                  Date {renderSortIcon("date")}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  className="text-[#A3BFFA]"
                  onClick={() => handleSort("message")}
                >
                  Description {renderSortIcon("message")}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  className="text-[#A3BFFA]"
                  onClick={() => handleSort("amount")}
                >
                  Amount {renderSortIcon("amount")}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  className="text-[#A3BFFA]"
                  onClick={() => handleSort("transactionType")}
                >
                  Type {renderSortIcon("transactionType")}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  className="text-[#A3BFFA]"
                  onClick={() => handleSort("transactionCategory")}
                >
                  Category {renderSortIcon("transactionCategory")}
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentTransactions.map((transaction) => (
              <TableRow
                key={transaction.id}
                className="bg-[#1A1D29] hover:bg-[#23273A] text-[#A3BFFA] border-b border-[#2C3141]"
              >
                <TableCell>{formatDate(transaction.date)}</TableCell>
                <TableCell>{transaction.message}</TableCell>
                <TableCell
                  className={`${
                    transaction.amount < 0 ? "text-[#FF6F61]" : "text-[#38B2AC]"
                  }`}
                >
                  ${Math.abs(transaction.amount).toFixed(2)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="default"
                    className={`${
                      transaction.transactionType === "DEPOSIT"
                        ? "bg-[#2D3748] text-[#9AE6B4]"
                        : "bg-[#2C3141] text-[#FC8181]"
                    }`}
                  >
                    {transaction.transactionType === "DEPOSIT"
                      ? " CREDIT"
                      : "DEBIT"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    className={`${
                      categoryColors[transaction.transactionCategory] ||
                      "bg-gray-700"
                    }`}
                  >
                    {transaction.transactionCategory.replace(/_/g, " ")}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex justify-between items-center mt-4">
          <div>
            Showing {indexOfFirstItem + 1} to{" "}
            {Math.min(indexOfLastItem, sortedTransactions.length)} of{" "}
            {sortedTransactions.length} entries
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            {renderPaginationButtons()}
            <Button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, pageCount))
              }
              disabled={currentPage === pageCount}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
