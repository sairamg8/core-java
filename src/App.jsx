import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Layout from './components/Layout'
import Home from './pages/Home'
import StepPage from './pages/StepPage'
import InterviewQuestionsPage from './pages/InterviewQuestionsPage'

export default function App() {
  const [dark, setDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
    }
    return false
  })

  useEffect(() => {
    const root = document.documentElement
    if (dark) {
      root.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [dark])

  return (
    <BrowserRouter>
      <Layout dark={dark} setDark={setDark}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/step/:number" element={<StepPage />} />
          <Route path="/interview/:type" element={<InterviewQuestionsPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
