"use client";

import { marked } from "marked";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState, useEffect, useCallback, useRef } from "react";

import { SparklesIcon } from "@heroicons/react/24/solid";
import { getHeaders } from "@/app/api/actions/config";

interface BudgetProps {
  budget: number;
  chartData: any[];
  totalSavingsOrLoss: number;
  dailyCost: number; // Pass dailyCost as a prop
}

export function StyledDialog({
  budget,
  chartData,
  totalSavingsOrLoss,
  dailyCost,
}: BudgetProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [displayedText, setDisplayedText] = useState<string[]>([]);
  const [currentRecommendation, setCurrentRecommendation] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [currentTypedText, setCurrentTypedText] = useState<string>(""); // Actively typing text
  const [recommendations, setRecommendations] = useState<string[]>([]);

  // Cache to store responses
  const cache = useRef<Map<string, any>>(new Map());

  const generateCacheKey = () => {
    return JSON.stringify({ budget, chartData, totalSavingsOrLoss, dailyCost });
  };

  const sendBudgetData = async () => {
    const cacheKey = generateCacheKey();

    if (cache.current.has(cacheKey)) {
      console.log("Using cached response");
      const cachedResponse = cache.current.get(cacheKey);
      setRecommendations(cachedResponse);
      return;
    }

    try {
      // setRecommendations(["Loading personalized recommendations..."]);
      const response = await fetch("http://localhost:8081/api/v1/user/chat", {
        method: "POST",
        headers: await getHeaders(),
        body: JSON.stringify({
          prompt: `You are an AI chatbot for a financial budgeting website. Your task is to provide personalized financial recommendations based on the user's budget and spending data. The following data is provided:
          - Total Budget: $${budget}
          - Chart Data (breakdown of expenses): ${JSON.stringify(chartData)}
          - Total Savings or Loss: $${totalSavingsOrLoss}
          - Average daily cost of food per person within the area: $${dailyCost}.
          
          Analyze this data and suggest actionable recommendations to help the user save money and manage their budget effectively. Ensure the recommendations are practical, personalized, concise, brief, and easy to implement.`,
        }),
      });

      if (!response.ok) {
        console.error("Failed to send data:", response);
        return;
      }

      let result = await response.json();

      console.log(result.choices[0].message.content);
      result = result.choices[0].message.content;

      // Assume the API returns the recommendations as a string or an array of strings
      if (result) {
        cache.current.set(cacheKey, [result]); // Cache the response
        setRecommendations([result]);
      }
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  // Function to safely parse and render Markdown as HTML
  const renderMarkdown = (markdown: string) => {
    const html = marked(markdown);
    return { __html: html }; // Return the HTML safely for React
  };

  const typeText = useCallback(() => {
    if (currentRecommendation >= recommendations.length) {
      setIsTyping(false);
      return;
    }

    setIsTyping(true);
    const recommendation = marked(recommendations[currentRecommendation]);
    let typedText = "";
    let charIndex = 0;

    const typeChunk = () => {
      const chunkSize = Math.floor(Math.random() * 3) + 1; // Random chunk size between 1 and 3
      const chunk = recommendation.slice(charIndex, charIndex + chunkSize);
      typedText += chunk;
      charIndex += chunkSize;

      setCurrentTypedText(typedText);

      if (charIndex < recommendation.length) {
        const delay = Math.floor(Math.random() * 1); // Random delay between 40ms and 160ms
        setTimeout(typeChunk, delay);
      } else {
        setDisplayedText((prev) => [...prev, typedText]); // Add the completed text to the displayed list
        setCurrentTypedText(""); // Clear actively typing text
        setTimeout(() => {
          setCurrentRecommendation((prev) => prev + 1);
          setIsTyping(false);
        }, 600); // Pause before moving to the next recommendation
      }
    };

    typeChunk();
  }, [currentRecommendation, recommendations]);

  useEffect(() => {
    if (
      isDialogOpen &&
      !isTyping &&
      currentRecommendation < recommendations.length
    ) {
      const delay =
        currentRecommendation === 0
          ? 800
          : Math.floor(Math.random() * 500) + 200; // Longer delay before the first recommendation
      setTimeout(typeText, delay);
    }
  }, [
    isDialogOpen,
    isTyping,
    currentRecommendation,
    typeText,
    recommendations,
  ]);

  useEffect(() => {
    if (!isDialogOpen) {
      // setDisplayedText([]);
      // setRecommendations([]);
      // setCurrentRecommendation(0);
      // setIsTyping(false);
      // setCurrentTypedText("");
    }
  }, [isDialogOpen]);

  const handleClick = () => {
    setIsDialogOpen(true);
    sendBudgetData(); // Send data when the button is clicked
  };

  return (
    <div className="mt-5 min-w-0 flex-auto flex justify-center">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="bg-[#1e295f] hover:bg-[#2a3a8c] border-white min-w-0 whitespace-normal h-auto rounded-3xl flex items-center gap-2 p-3"
            onClick={handleClick} // Trigger the POST request
          >
            <SparklesIcon className="w-5 h-5 text-yellow-300" />
            <span className="bg-gradient-to-r from-yellow-300 via-red-500 to-purple-500 bg-clip-text text-transparent font-bold">
              Get AI Saving Recommendations
            </span>
          </Button>
        </DialogTrigger>
        <DialogContent
          className="sm:max-w-[425px] bg-[#1e295f] text-white border-white p-6 md:max-w-[900px] text-center"
          style={{
            maxHeight: "70vh", // Maximum height as a percentage of viewport height
            overflowY: "auto", // Enable vertical scrolling
            overflowX: "hidden", // Prevent horizontal scrolling
          }}
        >
          <DialogHeader className="flex flex-col items-center space-y-2">
            <div className="flex items-center space-x-2">
              <SparklesIcon className="w-5 h-5 text-yellow-300" />
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-yellow-300 via-red-500 to-purple-500 bg-clip-text text-transparent">
                AI Saving Recommendations
              </DialogTitle>
            </div>
            <DialogDescription className="text-gray-300 text-center">
              Here are some personalized recommendations to help you save money:
            </DialogDescription>
          </DialogHeader>

          <ul className="list-disc pl-6 space-y-2 text-gray-200 [&_strong]:font-bold [&_strong]:text-lg [&_strong]:leading-10">
            {recommendations.length === 0 && !isTyping && (
              <li className="min-h-[1.5em] text-gray-400 flex items-center gap-2 justify-center">
                <span className="animate-bounce">🔄</span>
                Loading...
              </li>
            )}
            {displayedText.map((text, index) => (
              <div
                key={index}
                className="text-sm"
                dangerouslySetInnerHTML={{ __html: text }}
              />
            ))}
            {isTyping && (
              <div className="text-sm">
                <span
                  dangerouslySetInnerHTML={{
                    __html: currentTypedText,
                  }}
                />
                <span className="blinking-cursor">|</span>
              </div>
            )}
          </ul>
        </DialogContent>
      </Dialog>
    </div>
  );
}
