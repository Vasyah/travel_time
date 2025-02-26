import {QueryClient} from "@tanstack/react-query";

export const QUERY_KEYS = {
    hotels: ['hotels'],
    rooms: ['rooms'],
    roomsByHotel: ['roomsByHotel'],
    roomsWithReservesByHotel: ['roomsWithReservesByHotel'],
    hotelsForRoom: ['hotelsForRoom'],

}

export const queryClient = new QueryClient()



