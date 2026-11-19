import { Link, NavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Main } from './components/Main';
import HowToPlay from './components/HowToPlay';
import Home from './components/Home';
import Footer from './components/Footer';

export default function App() {
  const [openHowTo, setOpenHowTo] = useState(false);
  const { pathname } = useLocation();

  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="site-header-inner">
          <Link to="/" aria-label="Mapl / Where on Earth?! home" className="mapl-wordmark">
            <span className="mapl-logo-tile" aria-hidden="true"><span /></span>
            <span className="mapl-logo-text">
              Mapl <span className="mapl-logo-subtitle">/ Where on Earth?!</span>
            </span>
          </Link>
          <nav className="site-nav" aria-label="Main navigation">
            <NavLink to="/daily">Daily</NavLink>
            <NavLink to="/play">Random</NavLink>
            <NavLink to="/about">About</NavLink>
            <button onClick={() => setOpenHowTo(true)}>How to play</button>
          </nav>
        </div>
      </header>
      <HowToPlay isOpen={openHowTo} onClose={() => setOpenHowTo(false)} />
      {pathname === '/' ? <Home /> : <Main />}
      {!['/daily', '/play'].includes(pathname) && <Footer />}
    </div>
  );
}
