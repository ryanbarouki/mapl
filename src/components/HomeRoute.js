import { Routes, Route } from 'react-router-dom';
import Home from './Home';

export const HomeRoute = () => {
  return (
    <Routes>
      <Route exact path='/' element={<Home />}></Route>
    </Routes>
  );
}
