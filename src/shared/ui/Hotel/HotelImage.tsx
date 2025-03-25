'use client'
import React from 'react'
import styles from './style.module.css'
import cn from 'classnames'
import Image from 'next/image'
import { Tag } from '@consta/uikit/Tag'

export interface HotelImageProps {
  children?: React.ReactNode
  className?: string
  src: string
  width: number
  height: number
  type?: string
}

export const HotelImage = ({
  type,
  className,
  src,
  height = 157,
  width = 164,
}: HotelImageProps) => {
  return (
    <div className={cn(styles.container, className)}>
      {type && (
        <Tag className={styles.tag} label={type} size={'s'} mode={'info'} />
      )}
      <Image
        className={styles.hotelIcon}
        src={src}
        alt={'Изображение отеля'}
        width={width}
        height={height}
      />
    </div>
  )
}
