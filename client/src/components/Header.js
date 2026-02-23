import './Header.css';

const Header = ({ children, showPoweredBy = false }) => (
  <header className="header">
      <span className="logo-name">echo</span>
    {children}
  </header>
);

export default Header;
