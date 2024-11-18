import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Importa React Router
import SignInSide from '../src/pages/homeLogin';  // Página de login
import Callback from './pages/callback';  // Página para manejar el callback de Spotify
import Profile from './pages/Profile';  // Página de creacion perfil del usuario
import Showprofile from './pages/Showprofile'; // Pagina del perfil del usuario

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Routes>
            {/* Ruta para la página de login */}
            <Route path="/" element={<SignInSide />} />
            {/* Ruta para la página de Callback (Spotify redirige aquí después del login) */}
            <Route path="/callback" element={<Callback />} />
            {/* Ruta para mostrar el perfil del usuario después de logearse */}
            <Route path="/profile" element={<Profile />} />

            <Route path="/showprofile" element={<Showprofile />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
