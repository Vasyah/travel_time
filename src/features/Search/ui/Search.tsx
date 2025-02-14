import React, {FC, useState} from 'react'
import {Button} from "@consta/uikit/Button";
import {Layout} from "@consta/uikit/Layout";
import {Select} from "@consta/uikit/Select";
import {DatePicker} from "@consta/uikit/DatePicker";
import {IconCalendar} from "@consta/icons/IconCalendar";
import {FieldGroup} from "@consta/uikit/FieldGroup";

type Item = {
    label: string;
    id: number;
};

const categories: Item[] = [
    {
        label: 'Первый',
        id: 1,
    },
    {
        label: 'Второй',
        id: 2,
    },
    {
        label: 'Третий',
        id: 3,
    },
];

const guests: Item[] = [
    {
        label: 'Первый',
        id: 1,
    },
    {
        label: 'Второй',
        id: 2,
    },
    {
        label: 'Третий',
        id: 3,
    },
];

export interface SearchFeatureProps {

}

export const SearchFeature: FC<SearchFeatureProps> = (props: SearchFeatureProps) => {
    const [value, setValue] = useState<[Date?, Date?] | null>(null);
    const [category, setCategory] = useState<Item | null>();
    const [guest, setGuests] = useState<Item | null>();
    return (
        <FieldGroup form="default" size="m">
            <Select items={categories} value={category} onChange={setCategory}
                    placeholder={'Категория'}/>
            <DatePicker
                style={{zIndex: 90}}
                type="date-range"
                value={value}
                onChange={setValue}
                leftSide={[IconCalendar, IconCalendar]}
                placeholder={['Заезд', 'Выезд']}
                dateTimeView={'slider'}
            />
            <Select items={guests} value={guest} onChange={setGuests} placeholder={'Гости'}/>
            <Button label={'Найти'}/>
        </FieldGroup>
    );
}

