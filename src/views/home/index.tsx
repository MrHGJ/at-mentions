import React from 'react'
import { useHistory } from 'react-router-dom'
import { AtMentions } from '@/components/at-mentions'
import './index.scss'

function Home() {
  const history = useHistory()
  return (
    <div className='home'>
      <div>@编辑器demo:</div>
      <AtMentions />
      <div
        className='button'
        onClick={() => {
          history.push('detail')
        }}
      >
        跳转详情页
      </div>
    </div>
  )
}

export default Home
