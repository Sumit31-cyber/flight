import { store } from "@/redux/store";
import axios from "axios";
import { FlightSearchResponse, SearchAirportResponse } from "./types";

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
          "x-rapidapi-key": API_KEY,
          "x-rapidapi-host": "sky-scrapper.p.rapidapi.com",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching airport data:", error);
  }
};
const searchFlight = async (
  originSkyId: string,
  destinationSkyId: string,
  originEntityId: string,
  destinationEntityId: string,
  date: string,
  cabinClass: string,
  adults: number
) => {
  try {
    const response = await axiosInstance.get<FlightSearchResponse>(
      "/api/v2/flights/searchFlights",
      {
        params: {
          originSkyId,
          destinationSkyId,
          originEntityId,
          destinationEntityId,
          date,
          cabinClass,
          adults,
          sortBy: "best",
          currency: "INR",
          market: "en-GB",
          countryCode: "IN",
        },
        headers: {
          "x-rapidapi-key": API_KEY,
          "x-rapidapi-host": "sky-scrapper.p.rapidapi.com",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching airport data:", error);
  }
};

export { searchAirports, searchFlight };
