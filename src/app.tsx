import React from 'react'
import { Router } from 'react-router'
import './app.scss'
import { createBrowserHistory } from 'history'
import CoreRouter from './routes'
export const history = createBrowserHistory()
function App() {
  return (
    <Router history={history}>
      <CoreRouter />
    </Router>
  )
}

export default App
