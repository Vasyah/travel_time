'use client'
import React from 'react'
import styles from './style.module.css'
import cn from 'classnames'
import { Text } from '@consta/uikit/Text'
import { Flex } from 'antd'

export interface HotelHeadingProps {
  children?: React.ReactNode
  className?: string
  hotels: number
  rooms: number
}

export const HotelHeading = ({
  className,
  hotels,
  rooms,
}: HotelHeadingProps) => {
  return (
    <div className={cn(styles.headingContainer, className)}>
      <Text size="2xl" weight={'semibold'} view={'success'}>
        Все отели
      </Text>
      <Flex gap={'middle'}>
        <Text size="m" view={'success'} style={{ marginTop: '0.5rem' }}>
          Всего {hotels} отелей, {rooms} номеров
        </Text>
      </Flex>
    </div>
  )
}
