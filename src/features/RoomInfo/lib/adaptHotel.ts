import {HotelForRoom} from "@/shared/api/hotel/hotel";
import {RoomForm} from "@/features/RoomInfo/ui/RoomInfo";
import {TravelOption} from "@/shared/api/reserve/reserve";

export const adaptToOption = (item: { id: string, title: string }): TravelOption => ({
    id: item.id,
    label: item.title
})
