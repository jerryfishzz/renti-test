import React, { useEffect } from 'react'
import logo from './logo.svg'
import './App.css'
import SignIn from './pages/SignIn'

function App() {
  // useEffect(() => {
  //   const fetchData = async () => {
  //     const response = await fetch('/accounts/1')
  //     console.log(response)
  //     const data = await response.json()
  //     console.log(data)
  //   }
  //   fetchData()
  // }, [])

  return (
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.tsx</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>
    <SignIn />
  )
}

export default App
