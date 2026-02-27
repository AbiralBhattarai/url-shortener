import { useState } from 'react'
import './App.css'
import NavBar from './components/NavBar/NavBar'
import HomePage from './pages/HomePage'
import UrlsList from './components/UrlsList/UrlsList'

function App() {
  const [activeView, setActiveView] = useState('create')

  return (
    <>
      <NavBar activeView={activeView} onViewChange={setActiveView} />
      <div className="app-content">
        {activeView === 'create' && <HomePage />}
        {activeView === 'list' && <UrlsList />}
      </div>
    </>
  )
}

export default App