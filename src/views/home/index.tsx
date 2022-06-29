import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { AtMentions } from '@/components/at-mentions'
import './index.scss'
import { IMention } from '@/components/at-mentions/types'
import { AtMentionsPreview } from '@/components/at-mentions-preview'

function Home() {
  const [pureString, setPureString] = useState('')
  const [mentionList, setMentionList] = useState<IMention[]>([])
  return (
    <div className='home'>
      {/* @编辑器部分 */}
      <div>
        <div className='home__title'>@编辑器输入框：</div>
        <AtMentions
          className='home__editor'
          value={pureString}
          mentions={mentionList}
          onChange={(value, mentions) => {
            setPureString(value)
            setMentionList(mentions)
          }}
          minHeight={200}
          placeholder='请输入文本'
        />
      </div>
      {/* 结果展示部分 */}
      <div style={{ marginLeft: '35px' }}>
        <div className='home__title'>结果展示：</div>
        <AtMentionsPreview
          className='home__preview'
          pureString={pureString}
          mentions={mentionList}
          minHeight={200}
        />
      </div>
    </div>
  )
}

export default Home
