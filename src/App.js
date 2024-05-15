import styled, { css } from 'styled-components';
import { Main } from './components/Main';
import maplLogo from './mapl_logo.svg';
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

const Bar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
`;

function App() {

  return (
    <Container>
      <Link to="/" style={{ textDecoration: "none" }}>
      </Link>
      <Bar>
        <Logo src={maplLogo} />
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
      </Bar>
      <Main></Main>
    </Container>
  );
}

export default App;
