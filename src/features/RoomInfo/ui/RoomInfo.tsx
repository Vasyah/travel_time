import React, {FC, useCallback, useMemo} from 'react'
import cx from './style.module.css'
import {TextField} from "@consta/uikit/TextField";
import {Select} from "@consta/uikit/Select";
import {type CurrentReserveType} from "@/features/Scheduler/ui/Calendar";
import {Controller, useForm} from "react-hook-form";
import {FormButtons} from "@/shared/ui/FormButtons/FormButtons";
import {
    Room,
    RoomForm,
    useGetHotelsForRoom
} from "@/shared/api/hotel/hotel";
import {FormTitle} from "@/shared/ui/FormTitle/FormTitle";
import {FORM_GAP_SIZE, FORM_SIZE} from "@/shared/lib/const";
import {Grid, GridItem} from "@consta/uikit/Grid";
import {DragNDropField} from "@consta/uikit/DragNDropField";
import {Button} from "@consta/uikit/Button";
import {Text} from "@consta/uikit/Text";
import {adaptToOption} from "@/features/RoomInfo/lib/adaptHotel";
import {Modal} from "@/shared/ui/Modal/Modal";

export interface RoomInfoProps {
    isOpen: boolean;
    onClose: () => void;
    onAccept: (args?: any) => void;
    currentReserve?: CurrentReserveType
    isLoading?: boolean;
}


export const RoomInfo: FC<RoomInfoProps> = ({
                                                isOpen = false,
                                                onAccept,
                                                onClose,
                                                currentReserve,
                                                isLoading = false,
                                            }: RoomInfoProps) => {
        const {data: hotels, isPending} = useGetHotelsForRoom()


        const loading = isLoading || isPending


        const hotelOptions = useMemo(() => {
            const hotelsTmp = hotels?.map(adaptToOption)
            return hotelsTmp ?? []
        }, [hotels])

        const {
            control,
            getValues,
            register,
            formState: {errors},
        } = useForm<RoomForm>({
            defaultValues: {
                quantity: 3,
                price: 0
            }
        })

        const deserializeData = (data: RoomForm): Room => {
            return {...data, hotel_id: data?.hotel_id.id, image_path: '', image_title: ''}
        }

        const onAcceptForm = useCallback(() => {

            const serializedData = deserializeData(getValues())

            onAccept(serializedData)
        }, []);


        return (
            <Modal
                hasOverlay
                isOpen={isOpen}
                onClickOutside={onClose}
                onEsc={onClose}
                loading={loading}
            >
                <FormTitle>
                    Добавление номера
                </FormTitle>
                <Controller
                    name="hotel_id"
                    control={control}
                    rules={{required: true}}
                    render={({field}) => <
                        Select
                        {...field}
                        items={hotelOptions}
                        placeholder={'Выберите из списка'}
                        label={"Название отеля"} required size={FORM_SIZE}
                        dropdownClassName={cx.dropdown}
                        className={cx.fields}
                        disabled={loading}
                    />}
                />

                <TextField
                    {...register('title')}
                    placeholder="Введите название"
                    label="Название номера"
                    required
                    size={FORM_SIZE}
                    className={cx.fields}
                    disabled={loading}
                />
                <Grid cols={3} gap={FORM_GAP_SIZE}>
                    <GridItem col={2}>
                        <TextField
                            {...register('price', {valueAsNumber: true})}
                            placeholder="Введите стоимость"
                            label="Стоимость номера"
                            required
                            size={FORM_SIZE}
                            className={cx.fields}
                            disabled={loading}
                        />
                    </GridItem>
                    <GridItem>
                        <TextField
                            {...register('quantity', {valueAsNumber: true})}
                            placeholder="Введите число"
                            label="Вместимость"
                            required
                            type="number"
                            size={FORM_SIZE}
                            className={cx.fields}
                            disabled={loading}
                        />

                    </GridItem>
                </Grid>
                <DragNDropField onDropFiles={(files) => console.log(files)}
                                disabled={loading}>
                    {({openFileDialog}) => (
                        <>
                            <Text view="primary">Пример с Render Props, открывает окно для выбора файла из дочернего
                                блока</Text>
                            <br/>
                            <Button onClick={openFileDialog} label="Выбрать файл"/>
                        </>
                    )}
                </DragNDropField>
                <TextField
                    {...register('comment')} label="Комментарии" type="textarea" cols={200}
                    rows={3}
                    placeholder="Введите комментарий"
                    size={FORM_SIZE}
                    className={cx.fields}
                    disabled={loading}
                />
                <FormButtons isLoading={loading} onAccept={onAcceptForm} onClose={onClose}/>

            </Modal>
        );
    }
;
