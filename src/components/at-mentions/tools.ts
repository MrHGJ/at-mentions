import { IPerson } from './types'

const isSafari = () => {
  const userAgent = navigator.userAgent.toLowerCase()
  return userAgent.includes('applewebkit') && !userAgent.includes('chrome')
}

/**
 * 获取当前光标选区的信息。
 * @returns {Object|null} 包含光标选区和选择对象的对象，如果没有选区，则返回 null。
 */
export const getEditorRange = () => {
  let range = null
  let selection = null
  if (window.getSelection) {
    // 获取选区对象
    selection = window.getSelection()
    if (!selection) {
      return null
    }
    // 对于 Safari，直接获取第一个选区
    if (isSafari()) {
      range = selection.getRangeAt(0)
    } else {
      // 对于其他浏览器，检查 rangeCount 是否大于 0
      if (selection.rangeCount > 0) {
        range = selection.getRangeAt(0)
      }
    }
  } else {
    return null
  }
  return {
    range,
    selection,
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

// 通过关键词搜索用户列表。模拟搜索人员。
export const fetchUsers = async (
  searchKey: string,
  callback: { (data: any): void; (arg0: IPerson[]): void },
) => {
  // 随机头像api，https://api.multiavatar.com
  const testData: IPerson[] = [
    {
      userId: 'asan',
      userName: '阿三',
      avatar: 'https://api.multiavatar.com',
    },
    {
      userId: 'baobo',
      userName: '鲍勃',
      avatar: 'https://api.multiavatar.com',
    },
    {
      userId: 'chensheng',
      userName: '陈胜',
      avatar: 'https://api.multiavatar.com',
    },
    {
      userId: 'chengliang',
      userName: '程亮',
      avatar: 'https://api.multiavatar.com',
    },
    {
      userId: 'chenguang',
      userName: '程光',
      avatar: 'https://api.multiavatar.com',
    },
    {
      userId: 'huba',
      userName: '胡巴',
      avatar: 'https://api.multiavatar.com',
    },
    {
      userId: 'lisi',
      userName: '李四',
      avatar: 'https://api.multiavatar.com',
    },
    {
      userId: 'likui',
      userName: '李逵',
      avatar: 'https://api.multiavatar.com',
    },
    {
      userId: 'lizhaodi',
      userName: '李招娣',
      avatar: 'https://api.multiavatar.com',
    },

    {
      userId: 'liguang',
      userName: '李广',
      avatar: 'https://api.multiavatar.com',
    },
    {
      userId: 'liyuanfang',
      userName: '李元芳',
      avatar: 'https://api.multiavatar.com',
    },
    {
      userId: 'lidazhao',
      userName: '李大钊',
      avatar: 'https://api.multiavatar.com',
    },
    {
      userId: 'libai',
      userName: '李白',
      avatar: 'https://api.multiavatar.com',
    },
    {
      userId: 'wangwu',
      userName: '王五',
      avatar: 'https://api.multiavatar.com',
    },
    {
      userId: 'zhangsan',
      userName: '张三',
      avatar: 'https://api.multiavatar.com',
    },
  ]
  const testDataWithAvatar = testData.map((item) => {
    item.avatar = `https://api.multiavatar.com/${item.userId}.png`
    return item
  })
  const userList: IPerson[] = testDataWithAvatar.filter(
    (item) => item.userId.startsWith(searchKey) || item.userName.startsWith(searchKey),
  )
  callback(userList)
}
