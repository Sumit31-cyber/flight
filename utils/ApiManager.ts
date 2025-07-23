import { store } from "@/redux/store";
import axios from "axios";
import { SearchAirportResponse } from "./types";

const BASE_URL = "https://sky-scrapper.p.rapidapi.com";
const API_KEY = process.env.EXPO_PUBLIC_RAPID_API_KEY;

export const axiosInstance = axios.create({
  baseURL: BASE_URL, // Replace with your API base URL
});

const searchAirports = async (query: string, locale = "en-US") => {
  try {
    const response = await axiosInstance.get<SearchAirportResponse>(
      "/api/v1/flights/searchAirport",
      {
        params: { query: query, locale: "en-US" },
        headers: {
          "x-rapidapi-key": API_KEY, // replace with real key
          "x-rapidapi-host": "sky-scrapper.p.rapidapi.com",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching airport data:", error);
  }
};

export { searchAirports };
