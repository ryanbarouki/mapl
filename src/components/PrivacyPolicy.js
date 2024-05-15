import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 2rem;
  overflow: scroll;
`;

function PrivacyPolicy() {
  return (
    <Container>
      <h2>Privacy Policy</h2>
      <p>Thank you for visiting our website. Your privacy is important to us. This Privacy Policy outlines how we collect, use, and safeguard your information when you visit our website.</p>

      <h3>Information We Collect:</h3>
      <p>
        <strong>Google Analytics:</strong> We use Google Analytics to gather information about how visitors engage with our website. This includes data such as your IP address, browser type, pages visited, and time spent on each page. Google Analytics does not provide us with personally identifiable information.
      </p>
      <p>
        <strong>Mapbox:</strong> We utilize Mapbox to display interactive maps on our website. Mapbox may collect information such as your IP address and location data when you interact with the maps. However, we do not have access to personally identifiable information collected by Mapbox.
      </p>

      <h3>How We Use Your Information:</h3>
      <p>The information collected through Google Analytics and Mapbox is used to improve the functionality and content of our website. This helps us understand how visitors interact with our site and allows us to make enhancements to provide a better user experience.</p>

      <h3>Data Security:</h3>
      <p>We take appropriate measures to ensure the security of the information collected through Google Analytics and Mapbox. We do not sell, trade, or otherwise transfer your information to third parties.</p>

      <h3>Third-Party Links:</h3>
      <p>Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these third-party sites. We encourage you to review the privacy policies of these websites before providing any personal information.</p>

      <h3>Changes to This Policy:</h3>
      <p>We reserve the right to update or change this Privacy Policy at any time. Any changes will be posted on this page, and the effective date will be updated accordingly.</p>

      <h3>Contact Us:</h3>
      <p>If you have any questions or concerns about our Privacy Policy, please contact us at mapl.enquiries@gmail.com.</p>

      <p>This Privacy Policy was last updated on 14/05/2024.</p>
    </Container>
  );
}

export default PrivacyPolicy;
