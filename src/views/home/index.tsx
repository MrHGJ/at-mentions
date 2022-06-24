import React from 'react'
import { useHistory } from 'react-router-dom'
import './index.scss'

function Home() {
  const history = useHistory()
  return (
    <div className='home'>
      这是首页
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
