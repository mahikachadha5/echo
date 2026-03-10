import { useState, useRef } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'motion/react';
import './Header.css';

const Header = ({ children }) => {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const prevScrollY = useRef(0);

  useMotionValueEvent(scrollY, 'change', (current) => {
    const previous = prevScrollY.current;
    if (current > previous && current > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
    prevScrollY.current = current;
  });

  return (
    <motion.header
      className="header"
      animate={{ y: hidden ? '-100%' : '0%', opacity: hidden ? 0 : 1 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <span className="logo-name">echo</span>
      {children}
    </motion.header>
  );
};

export default Header;
