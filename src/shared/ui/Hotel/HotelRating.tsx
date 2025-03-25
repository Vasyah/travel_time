'use client'
import React from 'react'
import styles from './style.module.css'
import cn from 'classnames'
import Image from 'next/image'
import star from '@/features/Calendar/star.svg'

export interface HotelRatingProps {
  children?: React.ReactNode
  rating: number
  className?: string
}

export const HotelRating = ({ className, rating }: HotelRatingProps) => {
  const stars = Array.from(Array(rating))
  return (
    <div className={cn(styles.container, className)}>
      {stars?.map((_, index) => {
        return (
          <Image
            src={star.src}
            alt={'Звезда отеля'}
            width={24}
            height={24}
            key={index}
          />
        )
      })}
    </div>
  )
}
