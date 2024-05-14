import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 2rem;
`;

function CookiePolicy() {
  return (
    <Container>
      <h2>Cookie Policy</h2>
      <p>This website uses cookies to ensure you get the best experience on our website.</p>
      <h3>What are Cookies?</h3>
      <p>Cookies are small pieces of data stored on your computer or mobile device. They are used to remember preferences, analyze website usage, and personalize content and ads.</p>
      <h3>How We Use Cookies</h3>
      <p>We use cookies for various purposes including:</p>
      <ul>
        <li>Remembering your preferences.</li>
        <li>Analyzing website traffic and usage patterns.</li>
        <li>Personalizing content and ads.</li>
      </ul>
      <h3>Managing Cookies</h3>
      <p>You can control and/or delete cookies as you wish. You can delete all cookies that are already on your computer and you can set most browsers to prevent them from being placed. If you do this, however, you may have to manually adjust some preferences every time you visit a site and some services and functionalities may not work.</p>
    </Container>
  );
}

export default CookiePolicy;
