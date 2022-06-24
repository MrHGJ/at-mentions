export interface IPerson {
  userId: string
  userName: string
  avatar: string
}

export interface IMention extends IPerson {
  userId: string
  userName: string
  avatar: string
  offset: number
  length: number
}

export enum NodeType {
  text = 'text',
  br = 'br',
  at = 'at',
}

export interface INode {
  type: NodeType
  data: IPerson | string
}

// 数据类型转换  NodeList => MentionData
export const transformNodeListToMentionData = (nodeList: INode[]) => {
  let pureString = ''
  const mentionList: IMention[] = []
  nodeList.forEach((item) => {
    if (item.type === NodeType.text || item.type === NodeType.br) {
      pureString += item.data
    }
    if (item.type === NodeType.at) {
      const { userId, userName, avatar } = item.data as IPerson
      mentionList.push({
        userId: userId,
        userName: userName,
        avatar: avatar,
        length: userName.length + 1,
        offset: pureString.length,
      })
      pureString += '@' + userName
    }
  })
  return { pureString, mentionList }
}

// 数据类型转换 MentionData => NodeList
export const transformMentionDataToNodeList = (
  pureString: string,
  mentionList: IMention[],
): INode[] => {
  let cutStart: number = 0
  const nodeList: INode[] = []
  if (mentionList.length > 0) {
    mentionList.forEach((item) => {
      const { offset, length: nameLength } = item
      const textPart = pureString.slice(cutStart, offset)
      if (textPart.length > 0) {
        nodeList.push({
          type: NodeType.text,
          data: textPart,
        })
      }
      nodeList.push({
        type: NodeType.at,
        data: {
          userId: item.userId,
          userName: item.userName,
          avatar: item.avatar,
        },
      })
      cutStart = offset + nameLength
    })
    const remainText = pureString.slice(cutStart)
    if (remainText.length > 0) {
      nodeList.push({
        type: NodeType.text,
        data: remainText,
      })
    }
  } else {
    if (pureString.length > 0) {
      nodeList.push({
        type: NodeType.text,
        data: pureString,
      })
    }
  }
  return nodeList
}
