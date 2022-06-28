import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { AtMentions } from '@/components/at-mentions'
import './index.scss'

function Home() {
  const [pureString,setPureString]=useState('')
  const [mentionList,setMentionList]=useState([])
  return (
    <div className='home'>
      <div>
        <div className='home__title'>@编辑器输入框：</div>
        <AtMentions className='home__at' minHeight={200} />
      </div>
      <div style={{ marginLeft: '15px' }}>
        <div className='home__title'>展示：</div>
        <AtMentions className='home__at' minHeight={200} />
      </div>
    </div>
  )
}

export default Home
