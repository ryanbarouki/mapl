import styled, { css } from 'styled-components';
import { Main } from './components/Main';
import maplLogo from './mapl_logo.svg';
import { Link } from 'react-router-dom';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import HowToPlay from './components/HowToPlay';
import { useState } from 'react';

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Logo = styled.img`
  height: 3rem;
  pointer-events: none;
`;

const IconStyle = css`
  color: var(--primary-highlight);
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

const NavItem = styled.div`
  cursor: pointer;
`;

function App() {
  const [openHowTo, setOpenHowTo] = useState(false);

  return (
    <Container>
      <HowToPlay isOpen={openHowTo}
        onClose={() => setOpenHowTo(false)}
      />
      <Link to="/" style={{ textDecoration: "none" }}>
      </Link>
      <Bar>
        <Logo src={maplLogo} />
        <IconContainer>
          <Link to="/" style={{ textDecoration: "none" }}>
            Play
          </Link>
          <Link to="/about" style={{ textDecoration: "none" }}>
            About
          </Link>
          <NavItem onClick={() => setOpenHowTo(true)}>How to Play</NavItem>
        </IconContainer>
      </Bar>
      <Main></Main>
    </Container>
  );
}

export default App;
