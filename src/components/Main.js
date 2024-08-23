import { Routes, Route } from 'react-router-dom';
import About from './About';
import CookiePolicy from './CookiePolicy';
import PrivacyPolicy from './PrivacyPolicy';
import { DailyPlay, NormalPlay } from './PlayModes';

export const Main = () => {
  return (
    <Routes>
      {/* <Route exact path='/' element={<Home />}></Route> */}
      <Route exact path='/play' element={<NormalPlay />}></Route>
      <Route exact path='/daily' element={<DailyPlay />}></Route>
      <Route exact path='/about' element={<About />}></Route>
      <Route exact path='/cookies' element={<CookiePolicy />}></Route>
      <Route exact path='/privacy' element={<PrivacyPolicy />}></Route>
    </Routes>
  );
}
