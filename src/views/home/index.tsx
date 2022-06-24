import React from 'react'
import { useHistory } from 'react-router-dom'
import { AtMentions } from '@/components/at-mentions'
import './index.scss'

function Home() {
  return (
    <div className='home'>
      <div className='home__title'>@编辑器demo:</div>
      <AtMentions className='home__at' minHeight={200} />
    </div>
  )
}

export default Home
