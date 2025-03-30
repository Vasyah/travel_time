'use client'
import React from 'react'
import { Popconfirm, Button } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { FaRegTrashAlt } from 'react-icons/fa'

export interface ConfirmButtonProps {
  children?: React.ReactNode
  className?: string
  onConfirm: () => void
}

export const ConfirmButton = ({ onConfirm, children }: ConfirmButtonProps) => {
  return (
    <Popconfirm
      title={'Действительно хотите удалить?'}
      description={'Вы уверены?'}
      icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
      onConfirm={onConfirm}
      okText={'Удалить'}
      cancelText={'Отмена'}
    >
      <Button icon={<FaRegTrashAlt />} style={{ color: 'red' }} type={'text'}>
        {children}
      </Button>
    </Popconfirm>
  )
}
