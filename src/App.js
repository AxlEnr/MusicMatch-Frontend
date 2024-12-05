import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignInSide from '../src/pages/homeLogin';
import Profile from './pages/Profile';
import Showprofile from './pages/Showprofile';
import Callback from './pages/callback';
import Principal from './pages/principal';  // Importación añadida

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Routes>
            <Route path="" element={<SignInSide />} />
            <Route path="/callback" element={<Callback />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/showprofile" element={<Showprofile />} />
            <Route path="/principal" element={<Principal />} />  {/* Nueva ruta */}
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
