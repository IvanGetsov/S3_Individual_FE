  import { useState } from 'react'
  import './App.css'
  import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
  import NavBar from './components/Navbar'
  import HomePage from './Pages/HomePage'
  import ProfilePage from './Pages/ProfilePage'
  import LoginPage from './Pages/LoginPage'
  import RegisterPage from './Pages/RegisterPage'
  import AdvertsPage from './Pages/AdvertsPage';
  import UserAdvertsPage from './Pages/UserAdvertsPage';
  import AdvertDetailPage from './Pages/AdvertDetailedPage';
  import ChatPage from './Pages/ChatPage';
  import FirstMessagePage from './Pages/FirstMessagePage'
  import ChatListPage from './Pages/ChatListPage';



  function App() {
    const [count, setCount] = useState(0)

    return (
      <>
        <div className="App">
        <Router>
          <NavBar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/Login" element={<LoginPage />} />
            <Route path="/Register" element={<RegisterPage />} />
            <Route path="/adverts" element={<AdvertsPage />} />
            <Route path="/userAdverts" element={<UserAdvertsPage />} />
            <Route path="/adverts/:advertId" element={<AdvertDetailPage />} />
            <Route path="/chat/:chatId" element={<ChatPage/>} />
            <Route path="/firstMessage" element={<FirstMessagePage/>} />
            <Route path="/chats" element={<ChatListPage />} />
          </Routes>
        </Router>
      </div>
      </>
    )
  }

  export default App
