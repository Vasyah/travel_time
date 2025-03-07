import {TravelOption} from "@/shared/api/reserve/reserve";

export const adaptToOption = (item: { id: string, title: string }): TravelOption => ({
    id: item.id,
    label: item.title
})
