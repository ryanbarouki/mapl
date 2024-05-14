import styled, { css } from 'styled-components';
import { Main } from './components/Main';
// import maplLogo from '../maplLogo.svg';
import { Link } from 'react-router-dom';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Logo = styled.img`
  height: 3rem;
  pointer-events: none;
  margin-top: 1rem;
`;

const IconStyle = css`
  color: #FC8B9D;
  margin-top: 10px;
`;

const Home = styled(HomeIcon)`
  ${IconStyle}
`;

const Stats = styled(LeaderboardIcon)`
  ${IconStyle}
`;

const Info = styled(InfoIcon)`
  ${IconStyle}
`;

const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

function App() {

  return (
    <Container>
      <Link to="/" style={{ textDecoration: "none" }}>
      </Link>
      <IconContainer>
        <Link to="/" style={{ textDecoration: "none" }}>
          <Home />
        </Link>
        <Link to="/about" style={{ textDecoration: "none" }}>
          <Stats />
        </Link>
        <Link to="/privacy" style={{ textDecoration: "none" }}>
          <Info />
        </Link>
      </IconContainer>
      <Main></Main>
    </Container>
  );
}

export default App;
