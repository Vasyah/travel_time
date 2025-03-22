'use client'
import React from 'react'
import styles from './style.module.css'
import cn from 'classnames'
import { Text } from '@consta/uikit/Text'
import cx from '@/app/layout.module.css'
import { FaCaretDown } from 'react-icons/fa'
import { DateTime } from '@consta/uikit/DateTime'

export interface TodayProps {
  children?: React.ReactNode
  className?: string
  open?: boolean
  onToggle?: () => void
  currentDate: string
}

export const Today = ({
  className,
  onToggle,
  open,
  currentDate,
}: TodayProps) => {
  return (
    <div className={cn(styles.container, className)}>
      <Text size="xl" view={'success'}>
        Сегодня
      </Text>
      <div className={cx.dateContainer}>
        <Text size="2xl" view={'success'} cursor={'pointer'} onClick={onToggle}>
          {currentDate}
          <FaCaretDown size={14} />
        </Text>
        <DateTime type="date" className={cn(cx.date, { [cx.open]: open })} />
      </div>
    </div>
  )
}
