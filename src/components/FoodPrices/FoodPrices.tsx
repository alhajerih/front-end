"use client";

import React, { useEffect, useState } from "react";

export default function FoodPrices({
  prices,
  setPrices,
  dailyCost,
  setDailyCost,
}) {
  useEffect(() => {
    async function fetchPrices() {
      try {
        const res = await fetch("/api/numbeo"); // Call the API endpoint
        if (!res.ok) throw new Error("Failed to fetch prices");
        const data = await res.json();

        setPrices(data);

        // Calculate daily cost
        const quantities = {
          milkQty: 0.71, // liters/day
          breadQty: 0.42, // 420g/day
          riceQty: 0.21, // kg/day
          cheeseQty: 0.02, // kg/day
          meatQty: 0.25, // kg/day
          chickenQty: 0.25, // kg/day
          eggQty: 0.024, // dozen/day
          fruitQty: 0.5, // kg/day
          vegetableQty: 0.42, // kg/day
        };

        const totalDailyCost =
          (quantities.milkQty * data.milkPrice +
            quantities.breadQty * data.breadPrice +
            quantities.riceQty * data.ricePrice +
            quantities.cheeseQty * data.cheesePrice +
            quantities.meatQty * data.meatPrice +
            quantities.chickenQty * data.chickenPrice +
            quantities.eggQty * data.eggPrice + // Price per dozen
            quantities.fruitQty *
              ((data.applePrice + data.bananaPrice + data.orangePrice) / 3) + // Average fruit price
            quantities.vegetableQty *
              ((data.tomatoPrice +
                data.potatoPrice +
                data.onionPrice +
                data.lettucePrice) /
                4)) *
          1.5; // Multiplied by 1.5 as Premium Constant,
        //  leaving some room for getting more premium cuts and other more expensive foods
        setDailyCost(totalDailyCost);
      } catch (error) {
        console.error("Error fetching prices:", error);
      }
    }

    fetchPrices();
  }, []);

  if (!prices || dailyCost === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
      <h1>Daily Food Cost Calculator</h1>
      <p>The estimated daily food cost is:</p>
      <h2>{dailyCost.toFixed(2)} KWD</h2>
      <p>
        This calculation is calculated from the USDA's Moderate-Cost Food Plan
        and the average current prices of local groceries.
      </p>
    </div>
  );
}
