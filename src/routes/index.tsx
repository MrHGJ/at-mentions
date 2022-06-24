import React from 'react'
import { Route, Switch, HashRouter } from 'react-router-dom'
import Home from '@/views/home'

const CoreRouter = () => {
  return (
    <HashRouter>
      <Switch>
        <Route exact path='/' component={Home} />
      </Switch>
    </HashRouter>
  )
}

export default CoreRouter
