import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';

const MainLayout = ({ children, hideNavbar = false, hideFooter = false }) => {
  const { theme } = useSelector((state) => state.theme);
  
  return (
    <div className={`flex flex-col min-h-screen ${theme ? "bg-zinc-950 text-white" : "bg-white"}`}>
      {!hideNavbar && <Navbar />}
      <main className="flex-grow">
        {children}
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node,
  hideNavbar: PropTypes.bool,
  hideFooter: PropTypes.bool,
};

export default MainLayout;