import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 2rem;
  overflow: scroll;
  font-family: BRShape;
`;

function PrivacyPolicy() {
  return (
    <Container>
      <h1>Privacy Policy for Mapl</h1>
      <p><strong>Last Updated: 16/05/2024</strong></p>

      <p>Welcome to Mapl (“we”, “our”, “us”). We are committed to protecting and respecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use Mapl (the "Service"). By using the Service, you agree to the collection and use of information in accordance with this policy.</p>

      <h2>1. Information We Collect</h2>

      <p>We may collect and process the following types of information:</p>

      <h3>a. Non-Personal Information</h3>

      <p>We collect information that your browser sends whenever you visit our Service ("Log Data"). This Log Data may include information such as your computer’s Internet Protocol ("IP") address, browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, and other statistics.</p>

      <h3>b. Google Analytics</h3>

      <p>We use Google Analytics to monitor and analyze the use of our Service. Google Analytics collects information such as how often users visit the Service, what pages they visit, and what other sites they used prior to coming to our Service. We use the information we get from Google Analytics to maintain and improve the Service.</p>

      <h3>c. Map APIs</h3>

      <p>Our Service integrates with several map APIs to provide location-based data. By using these features, you are also bound by the privacy policies of the respective map service providers.</p>

      <h2>2. Use of Information</h2>

      <p>We use the collected data for various purposes:</p>
      <ul>
        <li>To provide and maintain our Service</li>
        <li>To notify you about changes to our Service</li>
        <li>To allow you to participate in interactive features of our Service when you choose to do so</li>
        <li>To provide customer support</li>
        <li>To gather analysis or valuable information so that we can improve our Service</li>
        <li>To monitor the usage of our Service</li>
        <li>To detect, prevent, and address technical issues</li>
      </ul>

      <h2>3. Sharing of Information</h2>

      <p>We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties except as described in this policy. We may share your information with:</p>

      <h3>a. Service Providers</h3>

      <p>We may employ third-party companies and individuals to facilitate our Service, to provide the Service on our behalf, to perform Service-related services, or to assist us in analyzing how our Service is used.</p>

      <h3>b. Legal Requirements</h3>

      <p>We may disclose your Personal Information if required to do so by law or in response to valid requests by public authorities.</p>

      <h2>4. Data Security</h2>

      <p>We take reasonable precautions to protect your information. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee its absolute security.</p>

      <h2>5. Your Data Protection Rights</h2>

      <p>Depending on your location, you may have the following rights regarding your personal data:</p>
      <ul>
        <li>The right to access – You have the right to request copies of your personal data.</li>
        <li>The right to rectification – You have the right to request that we correct any information you believe is inaccurate or complete information you believe is incomplete.</li>
        <li>The right to erasure – You have the right to request that we erase your personal data, under certain conditions.</li>
        <li>The right to restrict processing – You have the right to request that we restrict the processing of your personal data, under certain conditions.</li>
        <li>The right to object to processing – You have the right to object to our processing of your personal data, under certain conditions.</li>
        <li>The right to data portability – You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.</li>
      </ul>

      <h2>6. Links to Other Sites</h2>

      <p>Our Service may contain links to other sites that are not operated by us. If you click on a third-party link, you will be directed to that third party’s site. We strongly advise you to review the Privacy Policy of every site you visit.</p>

      <h2>7. Changes to This Privacy Policy</h2>

      <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page with a new "Last Updated" date. We encourage you to review this Privacy Policy periodically for any changes.</p>

      <h2>8. Contact Us</h2>

      <p>If you have any questions about this Privacy Policy, please contact us at:</p>
      <ul>
        <li>Email: mapl.enquiries@gmail.com</li>
      </ul>

      <p>By using the Service, you acknowledge that you have read and understand this Privacy Policy and agree to be bound by it.</p>
    </Container>
  );
}

export default PrivacyPolicy;
