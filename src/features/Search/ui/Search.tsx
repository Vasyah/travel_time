import React, {FC, useState} from 'react'
import {Button} from "@consta/uikit/Button";
import {Select} from "@consta/uikit/Select";
import {DatePicker} from "@consta/uikit/DatePicker";
import {IconCalendar} from "@consta/icons/IconCalendar";
import {FieldGroup} from "@consta/uikit/FieldGroup";
import {HOTEL_TYPES} from "@/features/HotelModal/lib/const";
import moment from "moment/moment";
import {changeTravelFilter} from "@/shared/models/hotels";
import {TextField} from "@consta/uikit/TextField";

type Item = {
    label: string;
    id: number;
};

export interface SearchFeatureProps {

}

export const SearchFeature: FC<SearchFeatureProps> = (props: SearchFeatureProps) => {
    const [date, setValue] = useState<[Date?, Date?] | null>(null);
    const [category, setCategory] = useState<Item | null>();
    const [quantity, setQuantity] = useState<number>(0);

    const onSearch = () => {
        let filter = undefined;
        if (!!date?.length) {

            filter = {start_time: moment(date[0]).hour(12).unix(), end_time: moment(date[1]).hour(11).unix()}
        }

        if (filter || category || quantity) {
            console.log('im here', filter)
            changeTravelFilter({
                type: category?.label,
                start: filter?.start_time,
                end: filter?.end_time,
                quantity: quantity
            })
        }

    };

    return (
        <FieldGroup form="default" size="m">
            <Select style={{
                minWidth: 200,
                maxWidth: '200px',
            }} items={HOTEL_TYPES} value={category} onChange={setCategory}
                    placeholder={'Категория'}/>
            <DatePicker
                style={{
                    zIndex: 90,
                    maxWidth: '378px'
                    // minWidth: 400
                }}
                type="date-range"
                value={date}
                onChange={(e) => setValue(e)}
                leftSide={[IconCalendar, IconCalendar]}
                placeholder={['Заезд', 'Выезд']}
                dateTimeView={'classic'}
                withClearButton
            />
            <TextField value={String(quantity)} onChange={(value) => setQuantity(value ? +value : 0)}
                       placeholder={'Гости'} type={'number'} withClearButton style={{maxWidth: '144px'}}
                       incrementButtons={false}
            />
            <Button label={'Найти'} onClick={onSearch}/>
        </FieldGroup>
    );
}
