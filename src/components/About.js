import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 2rem;
  font-family: BRShape;
`;

function About() {
  return (
    <Container>
      <h2>About Mapl</h2>
      <p>I'm a PhD student who likes to make web games!</p>
      <p>Mapl was inspired by <a href='https://www.geoguessr.com/'>geoguessr</a>, <a href="https://timeguessr.com/">timeguessr</a> and a picture frame of a redacted map of Hadrian's wall
        my friend passed around at a party.</p>
      <p>I'd love to hear your feedback at mapl.enquiries@gmail.com</p>
      <p>Or you could contribute directly over on <a href='https://github.com/ryanbarouki/mapl'>GitHub</a></p>
      <p>Please help keep Mapl free: </p>
      <a href='https://ko-fi.com/O4O0C01UZ' target='_blank' rel="noreferrer">
        <img height='36' style={{ border: "0px", height: "36px" }}
          src='https://storage.ko-fi.com/cdn/kofi2.png?v=3' border='0'
          alt='Buy Me a Coffee at ko-fi.com' />
      </a>
    </Container>
  );
}

export default About;
