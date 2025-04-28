import { useState, useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Link as ScrollLink, animateScroll as scroll } from 'react-scroll';
import { motion } from 'framer-motion';
import { FiMenu, FiX } from 'react-icons/fi';
import Logo from './Logo';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (location.pathname === '/admin-dashboard' || location.pathname === '/tutor-dashboard') {
    return null;
  }

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: 'about' },
    { name: 'Programs', path: 'programs' },
    { name: 'Impact', path: 'impact' },
    { name: 'Contact', path: 'contact' },
    { name: 'Admin', path: '/admin', special: true },
    { name: 'Tutor', path: '/tutor', special: true }
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
      <div className="container-custom">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <RouterLink to="/" className="relative z-10" onClick={closeMenu}>
            <Logo />
          </RouterLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navLinks.map((link) => (
              !link.special ? (
                location.pathname === '/' ? (
                  <ScrollLink
                    key={link.name}
                    to={link.path}
                    smooth={true}
                    duration={500}
                    offset={-70}
                    className="px-3 py-2 text-sm font-medium rounded-md cursor-pointer text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors"
                    onClick={closeMenu}
                  >
                    {link.name}
                  </ScrollLink>
                ) : (
                  <RouterLink
                    key={link.name}
                    to={`/#${link.path}`}
                    className="px-3 py-2 text-sm font-medium rounded-md transition-colors text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                    onClick={closeMenu}
                  >
                    {link.name}
                  </RouterLink>
                )
              ) : null
            ))}

            {/* Admin and Tutor Buttons */}
            <div className="ml-6 flex items-center space-x-2">
              {navLinks
                .filter(link => link.special)
                .map((link) => (
                  <RouterLink
                    key={link.name}
                    to={link.path}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      link.name === 'Admin'
                        ? 'bg-secondary-600 text-white hover:bg-secondary-700'
                        : 'bg-primary-600 text-white hover:bg-primary-700'
                    }`}
                    onClick={closeMenu}
                  >
                    {link.name}
                  </RouterLink>
                ))
              }
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-50 focus:outline-none"
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="md:hidden bg-white shadow-lg absolute top-full left-0 right-0 overflow-hidden"
        >
          <div className="px-4 pt-2 pb-4 space-y-1">
            {navLinks.map((link) => (
              !link.special ? (
                location.pathname === '/' ? (
                  <ScrollLink
                    key={link.name}
                    to={link.path}
                    smooth={true}
                    duration={500}
                    offset={-70}
                    className="block px-3 py-2 text-base font-medium rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-50 cursor-pointer"
                    onClick={() => { closeMenu(); }}
                  >
                    {link.name}
                  </ScrollLink>
                ) : (
                  <RouterLink
                    key={link.name}
                    to={`/#${link.path}`}
                    className="block px-3 py-2 text-base font-medium rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                    onClick={closeMenu}
                  >
                    {link.name}
                  </RouterLink>
                )
              ) : null
            ))}

            {/* Special links for Admin and Tutor */}
            {navLinks.filter(link => link.special).map((link) => (
              <RouterLink
                key={link.name}
                to={link.path}
                className={`block px-4 py-2 text-sm font-medium rounded-md ${
                  link.name === 'Admin'
                    ? 'bg-secondary-600 text-white hover:bg-secondary-700'
                    : 'bg-primary-600 text-white hover:bg-primary-700'
                }`}
                onClick={closeMenu}
              >
                {link.name}
              </RouterLink>
            ))}
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
