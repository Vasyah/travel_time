'use client'
import React from 'react'
import styles from './style.module.css'
import cn from 'classnames'
import { LinkIcon } from '@/shared/ui/LinkIcon/LinkIcon'
import { FaTelegram } from 'react-icons/fa'

export interface HotelTelegramProps {
  url: string
  className?: string
}

export const HotelTelegram = ({ className, url }: HotelTelegramProps) => {
  return (
    <div className={cn(styles.container, className)}>
      <LinkIcon icon={<FaTelegram color="2AABEE" size={'24px'} />} link={url} />
    </div>
  )
}
