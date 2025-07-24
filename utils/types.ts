export interface SearchAirportResponse {
  status: boolean;
  timestamp: number;
  data: AirportData[];
}

export interface AirportData {
  skyId: string;
  entityId: string;
  presentation: Presentation;
  navigation: Navigation;
}

export interface Presentation {
  title: string;
  suggestionTitle: string;
  subtitle: string;
}

export interface Navigation {
  entityId: string;
  entityType: "AIRPORT" | "CITY";
  localizedName: string;
  relevantFlightParams: RelevantFlightParams;
  relevantHotelParams: RelevantHotelParams;
}

export interface RelevantFlightParams {
  skyId: string;
  entityId: string;
  flightPlaceType: "AIRPORT" | "CITY";
  localizedName: string;
}

export interface RelevantHotelParams {
  entityId: string;
  entityType: "CITY";
  localizedName: string;
}

export interface FlightSearchResponse {
  status: boolean;
  timestamp: number;
  data: {
    context: {
      status: string;
      sessionId: string;
      totalResults: number;
    };
    itineraries: Itinerary[];
    messages: any[]; // Replace 'any' with a more specific type if messages have a known structure
    filterStats: {
      duration: {
        min: number;
        max: number;
        multiCityMin: number;
        multiCityMax: number;
      };
      total: number;
      hasCityOpenJaw: boolean;
      multipleCarriers: {
        minPrice: string;
        rawMinPrice: null | number;
      };
      airports: {
        city: string;
        airports: {
          id: string;
          entityId: string;
          name: string;
        }[];
      }[];
      carriers: {
        id: number;
        alternateId: string;
        logoUrl: string;
        name: string;
        minPrice: string;
        allianceId: number;
      }[];
      stopPrices: {
        direct: {
          isPresent: boolean;
          formattedPrice: string;
          rawPrice: number;
        };
        one: {
          isPresent: boolean;
          formattedPrice: string;
          rawPrice: number;
        };
        twoOrMore: {
          isPresent: boolean;
        };
      };
      alliances: {
        id: number;
        name: string;
      }[];
    };
    flightsSessionId: string;
    destinationImageUrl: string;
  };
}

export interface Itinerary {
  id: string;
  price: {
    raw: number;
    formatted: string;
    pricingOptionId: string;
  };
  legs: Leg[];
  isSelfTransfer: boolean;
  isProtectedSelfTransfer: boolean;
  farePolicy: {
    isChangeAllowed: boolean;
    isPartiallyChangeable: boolean;
    isCancellationAllowed: boolean;
    isPartiallyRefundable: boolean;
  };
  fareAttributes: Record<string, unknown>; // Could be more specific if attributes are known
  tags?: string[];
  isMashUp: boolean;
  hasFlexibleOptions: boolean;
  score: number;
}

export interface Leg {
  id: string;
  origin: Location;
  destination: Location;
  durationInMinutes: number;
  stopCount: number;
  isSmallestStops: boolean;
  departure: string;
  arrival: string;
  timeDeltaInDays: number;
  carriers: {
    marketing: MarketingCarrier[];
    operationType: string;
  };
  segments: Segment[];
}

export interface Location {
  id: string;
  entityId: string;
  name: string;
  displayCode: string;
  city: string;
  country: string;
  isHighlighted: boolean;
}

export interface MarketingCarrier {
  id: number;
  alternateId: string;
  logoUrl: string;
  name: string;
}

export interface Segment {
  id: string;
  origin: SegmentLocation;
  destination: SegmentLocation;
  departure: string;
  arrival: string;
  durationInMinutes: number;
  flightNumber: string;
  marketingCarrier: Carrier;
  operatingCarrier: Carrier;
  transportMode: string;
}

export interface SegmentLocation {
  flightPlaceId: string;
  displayCode: string;
  parent: {
    flightPlaceId: string;
    displayCode: string;
    name: string;
    type: string;
  };
  name: string;
  type: string;
  country: string;
}

export interface Carrier {
  id: number;
  name: string;
  alternateId: string;
  allianceId: number;
  displayCode: string;
}
