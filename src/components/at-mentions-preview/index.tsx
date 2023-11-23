import React, { useCallback, useMemo, useRef, useState } from 'react'
import { IMention } from '../at-mentions/types'
import cls from 'classnames'
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
  const [showCard, setShowCard] = useState(false)
  const curPersonInfo = useRef<IMention>()
  const [curPersonId, setCurPersonId] = useState('')
  const { x: cardX, y: cardY } = useMemo(() => {
    if (curPersonId) {
      return document.getElementById(curPersonId)?.getBoundingClientRect()
    } else {
      return { x: 0, y: 0 }
    }
  }, [curPersonId])

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

  const renderPersonCard = useCallback(() => {
    if (!(curPersonId && curPersonId.length > 0 && curPersonInfo.current)) {
      return null
    }
    const { userId, userName, avatar } = curPersonInfo.current
    return (
      <div
        className={cls('card-mask', { 'card-mask--hide': !showCard })}
        onClick={() => {
          setShowCard(false)
        }}
      >
        <div
          className={cls('card-content', { 'card-content--hide': !showCard })}
          style={{ top: `${Number(cardY) + 26}px`, left: `${Number(cardX)}px` }}
        >
          <div className='card-content__header'>
            <img className='card-content__header__avatar' src={avatar} />
            <div className='card-content__header__mask' />
            <div className='card-content__header__name'>{userName}</div>
            <div className='card-content__header__id'>{userId}</div>
          </div>
          <div className='card-content__item'>电话： 123456789</div>
          <div className='card-content__item'>地址： 湖北省武汉市洪山区</div>
          <div className='card-content__item'>跳转个人主页</div>
        </div>
      </div>
    )
  }, [cardX, cardY, curPersonId, showCard])

  const renderPreview = (data: IMentionData, index: number) => {
    const { mention, content } = data
    if (!mention) {
      return <span key={index}>{content}</span>
    } else {
      const curId = `${mention.userId}${index}`
      return (
        <span
          id={curId}
          className='at-mentions-preview__mention'
          onClick={() => {
            curPersonInfo.current = mention
            setCurPersonId(curId)
            setTimeout(() => {
              setShowCard(true)
            }, 100)
          }}
          key={index}
        >
          {content}
        </span>
      )
    }
  }

  return (
    <div
      className={`at-mentions-preview ${className}`}
      style={{ minHeight: minHeight > 0 ? minHeight : 'auto' }}
    >
      {formatMentionsData.map(renderPreview)}
      {renderPersonCard()}
    </div>
  )
}
