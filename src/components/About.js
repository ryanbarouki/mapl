import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 2rem;
`;

function About() {
  return (
    <Container>
      <h2>About Mapl</h2>
      <p>I'm a PhD student who likes to make web games!</p>
      <p>The game was inspired by geoguessr, timeguessr and a picture frame of a redacted map of Hadrian's wall
        my friend passed around at a party.</p>
      <p>I want to keep the game free but map APIs are not free so I may need to put ads on it at some point!</p>
      <p>Alternatively you could donate directly: </p>
      <a href='https://ko-fi.com/O4O0C01UZ' target='_blank' rel="noreferrer">
        <img height='36' style={{ border: "0px", height: "36px" }}
          src='https://storage.ko-fi.com/cdn/kofi2.png?v=3' border='0'
          alt='Buy Me a Coffee at ko-fi.com' />
      </a>
    </Container>
  );
}

export default About;
