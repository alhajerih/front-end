"use server";

import { NextResponse } from "next/server";
import * as cheerio from "cheerio";
import axios from "axios";

export async function GET() {
  try {
    const url =
      "https://www.numbeo.com/cost-of-living/country_result.jsp?country=Kuwait";
    const response = await axios.get(url); // Fetch the HTML
    const html = response.data;
    const $ = cheerio.load(html);

    const items = [
      { name: "Milk (regular), (1 liter)", key: "milkPrice" },
      { name: "Loaf of Fresh White Bread (500g)", key: "breadPrice" },
      { name: "Rice (white), (1kg)", key: "ricePrice" },
      { name: "Eggs (regular) (12)", key: "eggPrice" },
      { name: "Local Cheese (1kg)", key: "cheesePrice" },
      { name: "Chicken Fillets (1kg)", key: "chickenPrice" },
      {
        name: "Beef Round (1kg) (or Equivalent Back Leg Red Meat)",
        key: "meatPrice",
      },
      { name: "Apples (1kg)", key: "applePrice" },
      { name: "Banana (1kg)", key: "bananaPrice" },
      { name: "Oranges (1kg)", key: "orangePrice" },
      { name: "Tomato (1kg)", key: "tomatoPrice" },
      { name: "Potato (1kg)", key: "potatoPrice" },
      { name: "Onion (1kg)", key: "onionPrice" },
      { name: "Lettuce (1 head)", key: "lettucePrice" },
      { name: "Water (1.5 liter bottle)", key: "waterPrice" },
    ];

    const prices = {};

    $("table.data_wide_table tr").each((index, element) => {
      const itemName = $(element).find("td:nth-child(1)").text().trim();
      const priceText = $(element)
        .find("td:nth-child(2)")
        .find(".first_currency")
        .text()
        .trim();
      const price = parseFloat(priceText.replace("KWD", "").trim()); // Extract the numeric price

      const item = items.find((i) => i.name === itemName);
      if (item) {
        prices[item.key] = price;
      }
    });

    console.log("Extracted Prices:", prices);

    return NextResponse.json(prices);
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
