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
  height: 100%;
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
  align-items: center;
`;

const Bar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  height: 70px;
  gap: 1rem;
`;

const NavItem = styled.div`
  text-align: center;
  cursor: pointer;
  font-family: BRShape;
  color: black;
  &:hover {
    color: var(--primary-highlight);
  }
`;

function App() {
  const [openHowTo, setOpenHowTo] = useState(false);

  return (
    <Container>
      <HowToPlay isOpen={openHowTo}
        onClose={() => setOpenHowTo(false)}
      />
      <Bar>
        <Link to="/" style={{ textDecoration: "none" }}>
          <Logo src={maplLogo} />
        </Link>
        <IconContainer>
          <Link to="/play" style={{ textDecoration: "none" }}>
            <NavItem>
              Play
            </NavItem>
          </Link>
          <Link to="/about" style={{ textDecoration: "none" }}>
            <NavItem>
              About
            </NavItem>
          </Link>
          <NavItem onClick={() => setOpenHowTo(true)}>How to Play</NavItem>
        </IconContainer>
      </Bar>
      <Main></Main>
    </Container>
  );
}

export default App;
