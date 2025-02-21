import supabase from "@/app/config/supabase";
import {QueryData} from "@supabase/supabase-js";

export type Reserve = {
    id: string; // Уникальный идентификатор брони
    room_id: string;  // ID номера, к которому относится бронь
    start: number; // Начало бронирования (Unix timestamp)
    end: number; // Конец бронирования (Unix timestamp)
    title: string; // Обязательное название брони
    prepayment?: number; // Предоплата (опционально, используется для внутренних расчетов)
    guest: string; // Имя гостя
    phone: string; // Телефон гостя
    comment?: string; // Комментарий к брони
};

// Тип Room
export type RoomDTO = {
    id: string; // Уникальный идентификатор номера
    hotel_id: string;
    title: string; // Название номера
    price: number; // Цена за ночь
    quantity: number; // Количество номеров данного типа
    image_title: string  // Название изображения
    image_path: string; // Путь к изображению
    comment?: string; // Комментарий к номеру
};

export type Room = Omit<RoomDTO, "id">;

export type RoomReserves = {
    id: string; // Уникальный идентификатор номера
    hotel_id: string;
    title: string; // Название номера
    price: number; // Цена за ночь
    quantity: number; // Количество номеров данного типа
    image_title: string  // Название изображения
    image_path: string; // Путь к изображению
    comment?: string; // Комментарий к номеру
    reserves: Reserve[]; // Список бронирований для этого номера
};

// Тип Hotel
export type HotelDTO = {
    id: string; // Уникальный идентификатор отеля
    title: string; // Название отеля
    type: string; // Тип объекта размещения (например, "hotel", "apartment")
    rating: number; // Рейтинг отеля
    address: string; // Адрес отеля
    telegram_url?: string; // Ссылка на Telegram (опционально)
    phone: string; // Телефон отеля
    description: string; // Описание отеля
};

export type Hotel = Omit<HotelDTO, "id">;

// Тип Hotel
export type HotelRooms = {
    id: string; // Уникальный идентификатор отеля
    title: string; // Название отеля
    type: string; // Тип объекта размещения (например, "hotel", "apartment")
    rating: number; // Рейтинг отеля
    address: string; // Адрес отеля
    telegram_url?: string; // Ссылка на Telegram (опционально)
    phone: string; // Телефон отеля
    description: string; // Описание отеля
    rooms: Room[]; // Список номеров в отеле
};

export type HotelRoomsReserves = {
    id: string; // Уникальный идентификатор отеля
    title: string; // Название отеля
    type: string; // Тип объекта размещения (например, "hotel", "apartment")
    rating: number; // Рейтинг отеля
    address: string; // Адрес отеля
    telegram_url?: string; // Ссылка на Telegram (опционально)
    phone: string; // Телефон отеля
    description: string; // Описание отеля
    rooms: Room[]; // Список номеров в отеле
};

export async function getAllHotels(): Promise<Hotel[]> {
    try {
        const response = await supabase.from('hotels').select();
        return response.data as HotelDTO[]; // Возвращаем массив отелей
    } catch (error) {
        console.error('Ошибка при получении отелей:', error);
        throw error;
    }
}

const hotelWithRoomsAndServesQuery = supabase.from('hotels').select(`
        id,
        title,
        type,
        rating,
        address,
        telegram_url,
        phone,
        description,
        rooms(id,
              hotel_id,
              title,
              price,
              quantity,
              image_title,
              image_path,
              comment,
              reserves(id,
                    room_id,
                    start,
                    end,
                    guest,
                    phone,
                    comment
                )
        )
        `);

type HotelsWithRoomsAndReserves = QueryData<typeof hotelWithRoomsAndServesQuery>

export async function getHotelsWithRoomsAndeServes(): Promise<HotelsWithRoomsAndReserves> {
    try {
        const {data} = await hotelWithRoomsAndServesQuery;
        return data as HotelsWithRoomsAndReserves; // Возвращаем массив отелей
    } catch (error) {
        console.error('Ошибка при получении отелей:', error);
        throw error;
    }
}

export async function fetchHotelWithRoomsAndReserves(hotelId: string): Promise<Hotel | null> {
    try {
        // Шаг 1: Получить отель по ID
        const hotelResponse = supabase.from(`hotels?id=eq.${hotelId}`).select(`
        id,
        title,
        type,
        rating,
        address,
        telegram_url,
        phone,
        description,
        rooms(id,
              hotel_id,
              title,
              price,
              quantity,
              image_title,
              image_path,
              comment,
              reserves(id,
                    room_id,
                    start,
                    end,
                    guest,
                    phone,
                    comment
                )
        )
        `);
        const {data} = await hotelWithRoomsAndServesQuery;
        return data as Hotel

        // return hotel;
    } catch (error) {
        console.error('Ошибка при получении данных отеля:', error);
        throw error;
    }
}

export async function insertItem<Type>(tableName: string, data: Type, options?: {
    count?: "exact" | "planned" | "estimated"
}) {
    try {
        const {data: responseData, error} = await supabase
            .from(tableName)
            .insert(data, options)
        return {responseData, error};
    } catch (error) {
        console.error(error);

        throw error;
    }


}


export const createHotelApi = async (hotel: Hotel) => {
    const {responseData} = await insertItem<Hotel>('hotels', hotel)

    if (responseData) {
        console.log(responseData);
    }
}

export const createRoomApi = async (room: Room) => {
    const {responseData} = await insertItem<Room>('room', room)

    if (responseData) {
        console.log(responseData);
    }
}
