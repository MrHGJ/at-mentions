import React, { useEffect, useRef, useState } from 'react'
import {
  IMention,
  INode,
  IPerson,
  NodeType,
  transformMentionDataToNodeList,
  transformNodeListToMentionData,
} from './types'
import cls from 'classnames'
import { fetchUsers, getSelectionCoords, getEditorRange, resetRange } from './tools'
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

  // 根据传入的数据初始化editor内容显示
  const init = () => {
    const nodeList = transformMentionDataToNodeList(value, mentions)
    if (!editorRef) return
    nodeList.forEach((item) => {
      if (item.type === NodeType.text) {
        const textNode = document.createTextNode(item.data)
        editorRef.current.appendChild(textNode)
      }
      if (item.type === NodeType.at) {
        const btn = document.createElement('button')
        btn.dataset.person = JSON.stringify(item.data)
        btn.textContent = `@${item.data.userName}`
        btn.setAttribute(
          'style',
          'color:#4387f4;border:none;background:transparent;padding:0;font-size:16px',
        )
        btn.contentEditable = 'false'
        btn.addEventListener(
          'click',
          () => {
            return false
          },
          false,
        )
        btn.tabIndex = 0
        editorRef.current.appendChild(btn)
      }
    })
    setIsInit(true)
  }

  useEffect(() => {
    // 仅在加载时初始化
    if (value && value.length > 0 && !isInit) {
      init()
    }
    // 初始化value为空处理
    if (!(value && value.length > 0) && !isInit) {
      setTimeout(() => {
        init()
      }, 500)
    }
    // 清空输入
    if (!(value && value.length > 0) && isInit && editorRef.current) {
      while (editorRef.current?.firstChild) {
        editorRef.current.removeChild(editorRef.current.firstChild)
      }
    }
    setInputStr(value)
  }, [value, mentions])

  useEffect(() => {
    fetchUsers(searchKey, (data) => {
      setPersonList(data)
    })
  }, [searchKey])

  // 关闭选人弹窗时，重置选择的人的位置
  useEffect(() => {
    if (!showDialog) {
      setActiveIndex(0)
    }
  }, [showDialog])
  // 人员列表变换时，重置选择的人位置
  useEffect(() => {
    setActiveIndex(0)
  }, [personList])

  // 弹窗展示时，根据光标更新位置
  useEffect(() => {
    if (showDialog) {
      // 获取光标的位置
      const { x: cursorX, y: cursorY } = getSelectionCoords()
      if (editorRef.current) {
        const editorWidth = editorRef.current.offsetWidth
        const editorLeft = editorRef.current.getBoundingClientRect().left
        const editorRight = editorLeft + editorWidth
        const dialogWidth = 300
        // 弹窗超出右边界处理
        if (cursorX + dialogWidth > editorRight) {
          setDialogPosition({ x: editorRight - dialogWidth, y: cursorY })
        } else {
          setDialogPosition({ x: cursorX, y: cursorY })
        }
      } else {
        setDialogPosition({ x: cursorX, y: cursorY })
      }
    }
  }, [showDialog])

  // 当输入框值发生变化时，解析它的数据，并回传
  const onDataChangeCallBack = () => {
    if (editorRef.current) {
      // const buttons = [].slice.call(editorRef.current.querySelectorAll('button'))
      const nodeList: INode[] = []
      const editorChildNodes = [].slice.call(editorRef.current.childNodes)
      if (editorChildNodes.length > 0) {
        editorChildNodes.forEach((element) => {
          // 文本
          if (element.nodeName === '#text') {
            if (element.data && element.data.length > 0) {
              nodeList.push({
                type: NodeType.text,
                data: element.data,
              })
            }
          }
          // br换行
          if (element.nodeName === 'BR') {
            nodeList.push({
              type: NodeType.br,
              data: '\n',
            })
          }
          // button
          if (element.nodeName === 'BUTTON') {
            const personInfo = JSON.parse(element.dataset.person)
            nodeList.push({
              type: NodeType.at,
              data: personInfo,
            })
          }
        })
      }
      const { pureString, mentionList } = transformNodeListToMentionData(nodeList)
      // 文本末尾换行出现两个换行符处理
      if (pureString.length > 0 && pureString.charAt(pureString.length - 1) === '\n') {
        onChange(pureString.substring(0, pureString.length - 1), mentionList)
      } else {
        onChange(pureString, mentionList)
      }
    }
  }

  // @字符输入检测  是否展示选人弹窗
  const checkIsShowSelectDialog = () => {
    const rangeInfo = getEditorRange()
    if (!rangeInfo || !rangeInfo.range || !rangeInfo.selection) return
    const curNode = rangeInfo.range.endContainer
    // 处理文本结尾是@人员Button并且没有任何字符的情况
    // 如果光标超出编辑器，则选中最后一个子元素
    if (curNode.nodeName === 'DIV') {
      const { childNodes } = curNode
      const childNodesToArray = [].slice.call(childNodes)
      const notEmptyNodes = childNodesToArray.filter(
        (item: Node) => !(item.nodeName === '#text' && item.textContent === ''),
      )
      if (notEmptyNodes.length > 0) {
        const lastChildNode: Node = notEmptyNodes[notEmptyNodes.length - 1]
        if (lastChildNode && lastChildNode?.nodeName === 'BUTTON') {
          document.execCommand('insertHTML', false, '\n')
          // rangeInfo.range.setStartBefore(lastChildNode)
          // rangeInfo.range.setEndAfter(lastChildNode)
        }
      }
    }
    if (!curNode || !curNode.textContent || curNode.nodeName !== '#text') return
    const searchStr = curNode.textContent.slice(0, rangeInfo.selection.focusOffset)
    // 判断光标位置前方是否有at，只有一个at则展示默认dialog，除了at还有关键字则展示searchDialog
    const keywords = /@([^@]*)$/.exec(searchStr)
    if (keywords && keywords.length >= 2) {
      // 展示搜索选人
      const keyWord = keywords[1]
      const allMathStr = keywords[0]
      // 搜索关键字不超过20个字符
      if (keyWord && keyWord.length > 20) {
        setShowDialog(false)
        setSearchKey('')
        setPersonList([])
        return
      }
      setShowDialog(true)
      setSearchKey(keyWord)
      // 记下弹窗前光标位置range
      editorRange.current = rangeInfo
    } else {
      // 关掉选人
      setShowDialog(false)
    }
  }

  // 选择人员后插入@人员样式
  const insertHtmlAtCaret = ([btn, bSpaceNode], selection, range) => {
    if (selection.getRangeAt && selection.rangeCount) {
      if (selection.focusNode.parentNode.nodeName === 'BUTTON') return
      range.deleteContents()
      const el = document.createElement('div')
      el.appendChild(btn)
      if (bSpaceNode) {
        el.appendChild(bSpaceNode)
      }
      const frag = document.createDocumentFragment()
      let node
      let lastNode
      while ((node = el.firstChild)) {
        lastNode = frag.appendChild(node)
      }
      range.insertNode(frag)
      if (lastNode) {
        range = range.cloneRange()
        range.setStartAfter(lastNode)
        range.collapse(true)
        selection.removeAllRanges()
        selection.addRange(range)
      }
    }
  }

  // 选择@的人。替换原来的检索文案，并插入新的@标签<button/>
  const onSelectPerson = (personItem: IPerson) => {
    // 选择人员后关闭并重置选人框，重置搜索词
    setShowDialog(false)
    setPersonList([])
    const editor = editorRef.current
    if (editor) {
      // editor.focus()
      const myEditorRange = editorRange?.current?.range
      if (!myEditorRange) return
      const textNode = myEditorRange.endContainer // 拿到末尾文本节点
      const endOffset = myEditorRange.endOffset // 光标位置
      // 找出光标前的@符号位置
      const textNodeValue = textNode.nodeValue
      const expRes = /@([^@]*)$/.exec(textNodeValue)
      if (expRes && expRes.length > 1) {
        myEditorRange.setStart(textNode, expRes.index)
        myEditorRange.setEnd(textNode, endOffset)
        myEditorRange.deleteContents() // 删除草稿end
        const btn = document.createElement('button')
        btn.dataset.person = JSON.stringify(personItem)
        btn.textContent = `@${personItem.userName}`
        btn.setAttribute(
          'style',
          'color:#4387f4;border:none;background:transparent;padding:0;font-size:16px',
        )
        btn.contentEditable = 'false'
        btn.addEventListener(
          'click',
          () => {
            return false
          },
          false,
        )
        btn.tabindex = '0'
        // const bSpaceNode = document.createTextNode('\u200b') // 不可见字符，为了放光标方便
        const bSpaceNode = document.createTextNode('\u00A0') // 插入空格字符
        insertHtmlAtCaret(
          [btn, bSpaceNode],
          editorRange.current.selection,
          editorRange.current.range,
        )
      }
      onDataChangeCallBack()
    }
  }

  // 键盘弹起
  const onInputKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // 输入了@，直接弹选人浮层
    if (e.keyCode === 50 && e.shiftKey) {
      setShowDialog(true)
    } else {
      // 这里是输入的不是@，但是可能前方有@，因此需要进行检测看看是否要展示选人浮层
      checkIsShowSelectDialog()
    }
  }

  // 键盘按下
  const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // 设置maxLength后，限制字符数输入
    if (maxLength && maxLength > 0) {
      if (e.target.innerText.length >= maxLength) {
        // 不屏蔽删除键
        if (!(e.keyCode === 8 || e.keyCode === 46)) {
          e.preventDefault()
        }
      }
    }
    if (showDialog && personList.length > 0) {
      const dialogHeight = 250
      const itemHeight = 46
      // 向下移动光标，调整dialog选中的人
      if (e.keyCode === 40) {
        e.preventDefault()
        let newIndex = activeIndex + 1
        if (newIndex === personList.length) {
          newIndex = personList.length - 1
        }
        setActiveIndex(newIndex)
        const nowScrollTop = document.getElementById('at-mentions-dialog').scrollTop
        // 调整滚动条的位置
        if ((newIndex + 1) * itemHeight > dialogHeight + nowScrollTop) {
          document.getElementById('at-mentions-dialog').scrollTop =
            (newIndex + 1) * itemHeight - dialogHeight
        }
      }
      // 向上移动光标，调整dialog选中的人
      if (e.keyCode === 38) {
        e.preventDefault()
        let newIndex = activeIndex - 1
        if (newIndex < 0) {
          newIndex = 0
        }
        setActiveIndex(newIndex)
        const nowScrollTop = document.getElementById('at-mentions-dialog').scrollTop
        if (newIndex * itemHeight < nowScrollTop) {
          document.getElementById('at-mentions-dialog').scrollTop =
            newIndex === 0 ? 0 : newIndex * itemHeight
        }
      }
      // 按Enter键，确认选择当前人
      if (e.keyCode === 13) {
        e.preventDefault()
        onSelectPerson(personList[activeIndex])
      }
    }
    // 去除Crtl+b/Ctrl+i/Ctrl+u等快捷键
    // e.metaKey for mac
    if (e.ctrlKey || e.metaKey) {
      switch (e.keyCode) {
        case 66: // ctrl+B or ctrl+b
        case 98:
        case 73: // ctrl+I or ctrl+i
        case 105:
        case 85: // ctrl+U or ctrl+u
        case 117: {
          e.preventDefault()
          break
        }
      }
    }
    // tab键插入两个空格
    if (e.keyCode === 9) {
      e.preventDefault()
      document.execCommand('insertHTML', false, '  ')
    }
  }

  // 输入框文本改变时触发
  const onInputText = () => {
    if (editorRef.current) {
      const text = editorRef.current.innerText
      setInputStr(text)
    }
    onDataChangeCallBack()
  }

  // 输入框失去焦点
  const onInputBlur = () => {
    onBlur()
    editorRange.current = getEditorRange()
    onCallBackRefAndRange(editorRef?.current, editorRange?.current?.range)
    // onDataChangeCallBack()
    // 加一段延时。防止选人时，未来得及执行选人点击事件就直接隐藏对话框
    setTimeout(() => {
      setShowDialog(false)
      setPersonList([])
      setSearchKey('')
    }, 500)
  }

  const onInputFocus = () => {
    onFocus()
    // 聚焦时是否展示选人弹窗
    checkIsShowSelectDialog()
  }

  // 拦截粘贴，只允许粘贴文本
  const onPaste = (e) => {
    e.preventDefault()
    let pastedText
    if (window.clipboardData && window.clipboardData.getData) {
      // IE
      pastedText = window.clipboardData.getData('Text')
    } else if (e.clipboardData && e.clipboardData.getData) {
      pastedText = e.clipboardData.getData('text/plain')
    }
    document.execCommand('insertHTML', false, pastedText)
    return false
  }

  return (
    <div className={`at-mentions ${className}`}>
      {/* 真正的输入框 */}
      <div
        className='at-mentions__editor'
        ref={editorRef}
        style={{ minHeight: minHeight > 0 ? minHeight : 'auto' }}
        suppressContentEditableWarning
        contentEditable
        tabIndex={0}
        onKeyUp={onInputKeyUp}
        onKeyDown={onInputKeyDown}
        onBlur={onInputBlur}
        onFocus={onInputFocus}
        onMouseUp={checkIsShowSelectDialog}
        onPaste={onPaste}
        onInput={onInputText}
      ></div>
      {/* 人员选择对话框 */}
      {showDialog && (
        <div
          id='at-mentions-dialog'
          className='at-mentions__dialog'
          style={{ top: dialogPosition.y + 20, left: dialogPosition.x }}
        >
          {personList.map((item, index) => (
            <div
              className={cls('person-item', { 'person-item--active': index === activeIndex })}
              key={item.userId}
              onClick={() => onSelectPerson(item)}
            >
              <img src={item.avatar} className='person-item__avatar' />
              <div className='person-item__name'>{`${item.userName}(${item.userId})`}</div>
            </div>
          ))}
        </div>
      )}
      {/* placeholder展示 */}
      {!(inputStr && inputStr.length > 0 && inputStr !== '\n') && placeholder.length > 0 && (
        <div className='at-mentions__placeholder'>{placeholder}</div>
      )}
    </div>
  )
}
