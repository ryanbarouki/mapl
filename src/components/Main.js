import { Routes, Route } from 'react-router-dom';
import Play from './Play';
import About from './About';
import CookiePolicy from './CookiePolicy';
import PrivacyPolicy from './PrivacyPolicy';
import Home from './Home';

export const Main = () => {
  return (
    <Routes>
      {/* <Route exact path='/' element={<Home />}></Route> */}
      <Route exact path='/play' element={<Play daily={false} />}></Route>
      <Route exact path='/daily' element={<Play daily={true} />}></Route>
      <Route exact path='/about' element={<About />}></Route>
      <Route exact path='/cookies' element={<CookiePolicy />}></Route>
      <Route exact path='/privacy' element={<PrivacyPolicy />}></Route>
    </Routes>
  );
}
