'use client'
import React from 'react'
import styles from './style.module.css'
import cn from 'classnames'
import { HotelDTO } from '@/shared/api/hotel/hotel'
import { Card } from '@consta/uikit/Card'
import { HotelImage } from '@/shared/ui/Hotel/HotelImage'
import hotelImage from './room.svg'
import { HotelRating } from '@/shared/ui/Hotel/HotelRating'
import { HotelTitle } from '@/shared/ui/Hotel/HotelTitle'
import { Flex, Button } from 'antd'
import { HotelTelegram } from '@/shared/ui/Hotel/HotelTelegram'
import { Button as ConstaButton } from '@consta/uikit/Button'
import { IconForward } from '@consta/icons/IconForward'
import { ConfirmButton } from '@/shared/ui/ConfirmButton/ConfirmButton'
import { IconEdit } from '@consta/icons/IconEdit'
import Link from 'next/link'
import { RoomReserves } from '@/shared/api/room/room'

export interface HotelProps {
  children?: React.ReactNode
  className?: string
  room: RoomReserves
  onDelete: (id: string) => void
  onEdit: (room: RoomReserves) => void
}

export const Room = ({ className, room, onDelete, onEdit }: HotelProps) => {
  const { id, title, quantity, price, comment } = room

  return (
    <Card className={cn(styles.container, className)} shadow title={title}>
      <Flex gap={'large'}>
        <HotelImage src={hotelImage.src} width={260} height={216} />
        <div className={styles.infoContainer}>
          <Flex
            vertical
            justify="space-around"
            className={styles.verticalContainer}
          >
            <div>
              <Flex align={'center'} justify={'space-between'}>
                <HotelTitle>{title}</HotelTitle>
                <Button
                  icon={<IconEdit />}
                  color={'primary'}
                  type={'text'}
                  onClick={() => onEdit(room)}
                />
              </Flex>

              <div className={styles.info}>
                <div>Вместимость: {quantity}</div>
                <div>Стоимость: {price}/сутки</div>
                <div>Заметки: {comment}</div>
              </div>
            </div>

            <Flex className={styles.actions} align={'center'} gap={'small'}>
              <ConfirmButton onConfirm={() => onDelete(id)} />
            </Flex>
          </Flex>
        </div>
      </Flex>
    </Card>
  )
}
