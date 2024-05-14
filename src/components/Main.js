import { Routes, Route } from 'react-router-dom';
import Play from './Play';
import About from './About';
import CookiePolicy from './CookiePolicy';
import PrivacyPolicy from './PrivacyPolicy';

export const Main = () => {
  return (
    <Routes>
      <Route exact path='/' element={<Play />}></Route>
      <Route exact path='/about' element={<About />}></Route>
      <Route exact path='/cookies' element={<CookiePolicy />}></Route>
      <Route exact path='/privacy' element={<PrivacyPolicy />}></Route>
    </Routes>
  );
}