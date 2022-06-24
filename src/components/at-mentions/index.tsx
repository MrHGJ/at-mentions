import React, { useRef, useState } from 'react'
import { IMention, IPerson } from './types'

import './index.scss'

interface IProps {
  value: string
  mentions?: IMention[]
  className?: string
  placeholder?: string
  maxLength?: number
  minHeight?: number
  onChange: (value: string, mentions: IMention[]) => void
  onFocus?: () => void
  onBlur?: () => void
  onCallBackRefAndRange?: (ref, range) => void
}

export const AtMentions = (props: IProps) => {
  const {
    value,
    mentions = [],
    className = '',
    placeholder = '',
    maxLength = -1,
    minHeight = -1,
    onChange = () => {},
    onFocus = () => {},
    onBlur = () => {},
    onCallBackRefAndRange = () => {},
  } = props

  // 是否展示选人弹窗
  const [showDialog, setShowDialog] = useState(false)
  const [personList, setPersonList] = useState<IPerson[]>([])
  const [dialogPosition, setDialogPosition] = useState({ x: 0, y: 0 })
  // 选人弹窗当前选中的人
  const [activeIndex, setActiveIndex] = useState(0)
  // @字符后的关键字，用于搜索人员列表
  const [searchKey, setSearchKey] = useState('')
  // 编辑器是否已初始化过
  const [isInit, setIsInit] = useState(false)
  // 编辑器的ref
  const editorRef = useRef<HTMLDivElement>(null)
  // 记录编辑器光标的位置
  const editorRange = useRef(null)
  // 记录input文本内容
  const [inputStr, setInputStr] = useState(value)

  return (
    <div className={`at-mentions ${className}`}>
      <div
        className='at-mentions__editor'
        style={{ minHeight: minHeight > 0 ? minHeight : 'auto' }}
        ref={editorRef}
        contentEditable
      ></div>
    </div>
  )
}
