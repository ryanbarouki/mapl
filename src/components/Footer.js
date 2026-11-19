import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer site-width">
      <Link to="/privacy">Privacy policy</Link>
      <a href="mailto:mapl.enquiries@gmail.com">Contact</a>
    </footer>
  );
}
