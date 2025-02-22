import {HotelForRoom} from "@/shared/api/hotels/hotels";
import {RoomForm} from "@/features/RoomInfo/ui/RoomInfo";

export const adaptHotelToForm = (hotel: HotelForRoom): RoomForm['hotel_id'] => ({id: hotel.id, label: hotel.title})
