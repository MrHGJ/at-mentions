import React, { useState } from 'react'
import { AtMentions } from '@/components/at-mentions'
import { IMention } from '@/components/at-mentions/types'
import { AtMentionsPreview } from '@/components/at-mentions-preview'
import './index.scss'

function Home() {
  const [pureString, setPureString] = useState('')
  const [mentionList, setMentionList] = useState<IMention[]>([])
  return (
    <div className='home'>
      {/* @编辑器部分 */}
      <div>
        <div className='home__title'>@编辑器：</div>
        <div className='home__tip'>「输入@字符弹出人员搜索选择」</div>
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
        <div className='home__title'>文本展示：</div>
        <div className='home__tip'>「点击@人员展示个人卡片」</div>
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
