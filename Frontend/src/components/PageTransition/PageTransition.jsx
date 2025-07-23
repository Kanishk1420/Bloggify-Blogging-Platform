import { motion } from "framer-motion";
import PropTypes from "prop-types";

// Different transition variants
const pageVariants = {
  initial: {
    opacity: 0
  },
  in: {
    opacity: 1
  },
  out: {
    opacity: 0
  }
};

const slideVariants = {
  initial: {
    opacity: 0,
    x: -300
  },
  in: {
    opacity: 1,
    x: 0
  },
  out: {
    opacity: 0,
    x: 300
  }
};

const fadeInUpVariants = {
  initial: {
    opacity: 0,
    y: 30
  },
  in: {
    opacity: 1,
    y: 0
  },
  out: {
    opacity: 0,
    y: -30
  }
};

const scaleVariants = {
  initial: {
    opacity: 0,
    scale: 0.9
  },
  in: {
    opacity: 1,
    scale: 1
  },
  out: {
    opacity: 0,
    scale: 1.1
  }
};

const PageTransition = ({ children, type = "fade" }) => {
  let variants;
  
  switch (type) {
    case "slide":
      variants = slideVariants;
      break;
    case "fadeInUp":
      variants = fadeInUpVariants;
      break;
    case "scale":
      variants = scaleVariants;
      break;
    default:
      variants = pageVariants;
  }

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={variants}
      transition={{ 
        type: "tween",
        ease: "easeInOut", 
        duration: 0.4
      }}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
};

PageTransition.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.oneOf(["fade", "slide", "fadeInUp", "scale"])
};

export default PageTransition;