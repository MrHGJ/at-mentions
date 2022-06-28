import { IPerson } from './types'

// 获取当前光标选取的信息（即在弹出选人之前，把输入框中此刻的光标位置先记下来）
export const getEditorRange = () => {
  let range = null
  let selection = null
  if (window.getSelection) {
    selection = window.getSelection()
    if (selection && selection.getRangeAt && selection.rangeCount) {
      range = selection.getRangeAt(0)
      return {
        range,
        selection,
      }
    } else {
      return null
    }
  } else {
    return null
  }
}

// 重新设置光标的位置
export const resetRange = (range) => {
  if (range) {
    const selection = window.getSelection()
    if (selection) {
      selection.removeAllRanges()
      selection.addRange(range)
    } else if (range.select) {
      range.select()
    }
  }
}

// 获取光标坐标
export const getSelectionCoords = () => {
  const win = window
  const doc = win.document
  let sel = doc.selection
  let range
  let rects
  let rect
  let x = 0
  let y = 0
  if (sel) {
    if (sel.type !== 'Control') {
      range = sel.createRange()
      range.collapse(true)
      x = range.boundingLeft
      y = range.boundingTop
    }
  } else if (win.getSelection) {
    sel = win.getSelection()
    if (sel.rangeCount) {
      range = sel.getRangeAt(0).cloneRange()
      if (range.getClientRects) {
        range.collapse(true)
        rects = range.getClientRects()
        if (rects.length > 0) {
          rect = rects[0]
        }
        // 光标在行首时，rect为undefined
        if (rect) {
          x = rect.left
          y = rect.top
        }
      }
      if ((x === 0 && y === 0) || rect === undefined) {
        const span = doc.createElement('span')
        if (span.getClientRects) {
          span.appendChild(doc.createTextNode('\u200b'))
          range.insertNode(span)
          rect = span.getClientRects()[0]
          x = rect.left
          y = rect.top
          const spanParent = span.parentNode
          spanParent.removeChild(span)
          spanParent.normalize()
        }
      }
    }
  }
  return { x: x, y: y }
}

// 通过关键词搜索用户列表
export const fetchUsers = async (
  searchKey: string,
  callback: { (data: any): void; (arg0: IPerson[]): void },
) => {
  // 随机头像api，https://api.sunweihu.com/api/sjtx/api.php?lx=c1
  const testData: IPerson[] = [
    {
      userId: 'lisi',
      userName: '李四',
      avatar: 'https://tva1.sinaimg.cn/large/9bd9b167ly1fzjxys7prej20b40b4gm5.jpg',
    },
    {
      userId: 'wangwu',
      userName: '王五',
      avatar: 'https://tva4.sinaimg.cn/large/9bd9b167ly1g1p9pdc5x9j20b40b4wep.jpg',
    },
    {
      userId: 'zhangsan',
      userName: '张三',
      avatar: 'https://tva4.sinaimg.cn/large/9bd9b167gy1g1p9vnmuuoj20b40b4dg2.jpg',
    },
  ]

  const userList: IPerson[] = testData.filter((item) => item.userId.includes(searchKey))
  callback(userList)
}
