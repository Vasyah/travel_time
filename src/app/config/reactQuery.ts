import {QueryClient} from "@tanstack/react-query";

export const QUERY_KEYS = {
    hotels: ['hotels'],
    rooms: ['rooms'],
    hotelsForRoom: ['hotelsForRoom'],

}

export const queryClient = new QueryClient()



