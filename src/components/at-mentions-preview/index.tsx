import React, { useMemo } from 'react'
import { IMention } from '../at-mentions/types'
import './index.scss'

interface IProps {
  pureString: string
  mentions?: IMention[]
  className?: string
  minHeight?: number
}

interface IMentionData {
  content: string
  mention?: IMention
}
export const AtMentionsPreview = (props: IProps) => {
  const { pureString, mentions = [], className = '', minHeight = -1 } = props

  const formatMentionsData = useMemo(() => {
    // 按照 at 开始位置排序
    const mentionsSorted = mentions.sort((a, b) => a.offset - b.offset)
    const result: IMentionData[] = []
    let pointer = 0

    // 递归切割字符串
    const recursion = () => {
      if (mentionsSorted.length === 0) {
        result.push({
          content: pureString.substring(pointer),
        })
        return
      }

      if (pointer >= pureString.length) {
        return
      }

      // 取出列表中最前面的信息
      const info = mentionsSorted[0]
      mentionsSorted.splice(0, 1)

      // @开始位置 != 当前指针位置
      if (pointer !== info.offset) {
        result.push({
          content: pureString.substring(pointer, info.offset),
        })
      }

      result.push({
        mention: info,
        content: pureString.substring(info.offset, info.offset + info.length),
      })

      pointer = info.offset + info.length

      recursion()
    }

    recursion()

    return result
  }, [mentions, pureString])

  const renderView = (data: IMentionData) => {
    const { mention, content } = data
    if (!mention) {
      return <span>{content}</span>
    } else {
      return <span className='at-mentions-preview__mention'>{content}</span>
    }
  }
  return (
    <div
      className={`at-mentions-preview ${className}`}
      style={{ minHeight: minHeight > 0 ? minHeight : 'auto' }}
    >
      {formatMentionsData.map(renderView)}
    </div>
  )
}
