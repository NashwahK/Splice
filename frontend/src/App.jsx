import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Quiz from './pages/Quiz'
import Input from './pages/Input'

function App() {
  return(
    <Router>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/quiz" element={<Quiz />}/>
        <Route path="/input" element={<Input />}/>
      </Routes>
    </Router>
  )
}

export default App;