import React from 'react'
import { Route, Switch, HashRouter } from 'react-router-dom'
import Detail from '@/views/detail'
import Home from '@/views/home'

const CoreRouter = () => {
  return (
    <HashRouter>
      <Switch>
        <Route exact path='/' component={Home} />
        <Route exact path='/detail' component={Detail} />
      </Switch>
    </HashRouter>
  )
}

export default CoreRouter
