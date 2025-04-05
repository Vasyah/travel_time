'use client'
import React from 'react'
import styles from './style.module.css'
import cn from 'classnames'
import { Text } from '@consta/uikit/Text'

export interface HotelTitleProps {
  children?: React.ReactNode
  className?: string
  onClick?: () => void
}

export const HotelTitle = ({
  className,
  onClick,
  children,
}: HotelTitleProps) => {
  return (
    <div className={cn(styles.container, className)} onClick={onClick}>
      <Text
        className={styles.title}
        transform={'uppercase'}
        weight={'semibold'}
        size={'xl'}
      >
        {children}
      </Text>
    </div>
  )
}
