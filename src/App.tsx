import React from 'react'
import './App.css'
import { requestData } from './lib/data'
import Table from './components/table'

function App() {

  return (
    <main>
      <div className='container'>
        <h1>Investor App</h1>
        <div className='table-container'>
          <h2>Investor Table</h2>
          <Table requestData={requestData} />
        </div>
      </div>
    </main>
  )
}

export default App
