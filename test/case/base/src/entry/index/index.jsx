import '@babel/polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import { IndexDBStorage } from '../../../../../../'
import logoIcon from './images/logo.png'
import './index.css'

var App = (
  <div className='dm-box'>
    <img src={logoIcon} />
    <h1 className='dm-title'>hello plugin </h1>
    <p className='dm-info'>demo only</p>
  </div>
)

var dbStorage = new IndexDBStorage({
  name: 'testdb'
})

dbStorage.setItem('12345', {
  a: 1,
  b: {
    c: 2
  }
}).then(function () {
  dbStorage.getItem('12345').then(function (d) {
    console.log('===', d)
  })
})

ReactDOM.render(App, document.querySelector('#app'))
