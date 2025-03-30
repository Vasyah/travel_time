'use client'
import React from 'react'
import styles from './style.module.css'
import cn from 'classnames'
import { Text } from '@consta/uikit/Text'
import { Flex } from 'antd'
import { TravelButton } from '@/shared/ui/Button/Button'

export interface HotelHeadingProps {
  title: string
  children?: React.ReactNode
  className?: string
  hotels: number
  rooms: number
  buttonProps?: {
    className?: string
    label: string
    onClick?: () => void
  }
}

export const HotelHeading = ({
  className,
  title,
  hotels,
  rooms,
  buttonProps,
}: HotelHeadingProps) => {
  return (
    <Flex className={cn(styles.headingContainer, className)} align={'center'}>
      <div>
        <Text size="2xl" weight={'semibold'} view={'success'}>
          {title}
        </Text>
        <Flex gap={'middle'}>
          <Text size="m" view={'success'} style={{ marginTop: '0.5rem' }}>
            Всего {hotels} отелей, {rooms} номеров
          </Text>
        </Flex>
      </div>
      {buttonProps && (
        <div style={{ marginLeft: 'auto' }}>
          <TravelButton
            label={buttonProps.label}
            onClick={buttonProps.onClick}
          />
        </div>
      )}
    </Flex>
  )
}
