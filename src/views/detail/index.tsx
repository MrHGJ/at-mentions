import React from 'react'
import { useHistory } from 'react-router-dom'
import './index.scss'

function Detail() {
  const history = useHistory()
  return (
    <div className='detail'>
      这是详情页
      <div
        className='button'
        onClick={() => {
          history.goBack()
        }}
      >
        回到首页
      </div>
    </div>
  )
}

export default Detail
