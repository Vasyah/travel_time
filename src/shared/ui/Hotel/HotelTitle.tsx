'use client'
import React from 'react'
import styles from './style.module.css'
import cn from 'classnames'
import { Text } from '@consta/uikit/Text'

export interface HotelTitleProps {
  children?: React.ReactNode
  className?: string
}

export const HotelTitle = ({ className, children }: HotelTitleProps) => {
  return (
    <div className={cn(styles.container, className)}>
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
