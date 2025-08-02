import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BsSearch } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import MobileMenu from "../MobileNav/MobileMenu.jsx";
import { TfiPencilAlt } from "react-icons/tfi";
import avatar from "../../assets/avatar.jpg";
import darkLogo from "../../assets/Bloggify white.png";
import lightLogo from "../../assets/Bloggify.png";
import { BsMoonStarsFill } from "react-icons/bs";
import { MdSunny } from "react-icons/md";
import { toggleDarkMode } from "../../slices/Theme.js";

const Navbar = () => {
  const [search, setSearch] = useState("");
  const [menuState, setMenuState] = useState("closed");
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const { theme } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const profilePhoto = userInfo?.user?.profilePhoto?.url;
  const menuRef = useRef(null);

  // Select the appropriate logo based on theme
  const currentLogo = theme ? darkLogo : lightLogo;

  const toggleNav = () => {
    if (menuState === "closed" || menuState === "closing") {
      setMenuState("opening");
    } else {
      setMenuState("closing");
    }
  };

  const handleSearch = () => {
    if (search.trim() !== "") {
      // Add timestamp to force refresh of component when searching
      const timestamp = new Date().getTime();

      if (path === "/finduser") {
        navigate(`/finduser?search=${search}&t=${timestamp}`);
      } else {
        navigate(`/?search=${search}&t=${timestamp}`);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleTheme = () => {
    dispatch(toggleDarkMode());
  };

  const handleInputChange = (e) => {
    setSearch(e.target.value);
  };

  const path = useLocation().pathname;

  // Animation state handler
  useEffect(() => {
    let timeoutId;

    if (menuState === "opening") {
      timeoutId = setTimeout(() => setMenuState("open"), 300);
    } else if (menuState === "closing") {
      timeoutId = setTimeout(() => setMenuState("closed"), 300);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [menuState]);

  // Outside click handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close the dropdown if clicked outside
      if (
        (menuState === "open" || menuState === "opening") &&
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setMenuState("closing");
      }
    };

    // Add event listener when the dropdown is open
    if (menuState === "open" || menuState === "opening") {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuState]);

  // Redirect to login if not authenticated and trying to access a protected route
  useEffect(() => {
    if (
      !userInfo &&
      !["/", "/login", "/register", "/reset-password"].includes(path)
    ) {
      navigate("/");
    }
  }, [userInfo, path, navigate]);

  return (
    <>
      <div
        className={`flex items-center justify-between px-4 md:px-[100px] lg:px-[200px] py-4 ${
          theme ? "bg-zinc-950 text-white" : "bg-white"
        }`}
      >
        {/* Logo - Left side with conditional rendering */}
        <div className="flex-shrink-0">
          <Link to="/home">
            <img
              src={currentLogo}
              className="h-10 w-auto object-contain"
              alt="Bloggify Logo"
            />
          </Link>
        </div>

        {/* Desktop Search Bar - with more distinct styling */}
        {(["/", "/dashboard", "/finduser"].includes(path) ||
          (path.includes("/profile") && !path.includes("/edit"))) && (
          <div className="flex-grow max-w-lg mx-4 hidden sm:flex justify-center items-center">
            <div className="relative w-full">
              <div
                className={`absolute left-4 top-1/2 transform -translate-y-1/2 z-10`}
              >
                <BsSearch
                  size={18}
                  onClick={handleSearch}
                  className={`cursor-pointer ${
                    theme ? "text-blue-400" : "text-blue-600"
                  }`}
                />
              </div>
              <input
                type="text"
                placeholder={
                  path === "/finduser" ? "Search users..." : "Search..."
                }
                className={`w-full py-2.5 pl-12 pr-4 outline-none transition-all duration-300 text-base
                                    ${
                                      theme
                                        ? "bg-zinc-800 border-2 border-blue-900 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 rounded-xl"
                                        : "bg-gray-50 border-2 border-gray-300 text-gray-800 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-400 rounded-xl"
                                    }`}
                value={search}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
              />
            </div>
          </div>
        )}

        {/* Mobile Search Bar - matching more distinct style */}
        {(["/", "/dashboard", "/finduser"].includes(path) ||
          (path.includes("/profile") && !path.includes("/edit"))) && (
          <div className="flex sm:hidden flex-grow mx-2">
            <div className="relative w-full">
              <div
                className={`absolute left-3.5 top-1/2 transform -translate-y-1/2 z-10`}
              >
                <BsSearch
                  size={16}
                  onClick={handleSearch}
                  className={`cursor-pointer ${
                    theme ? "text-blue-400" : "text-blue-600"
                  }`}
                />
              </div>
              <input
                type="text"
                placeholder="Search"
                className={`w-full py-2 pl-10 pr-4 outline-none transition-all duration-300 text-sm
                                    ${
                                      theme
                                        ? "bg-zinc-800 border-2 border-blue-900 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 rounded-xl"
                                        : "bg-gray-50 border-2 border-gray-300 text-gray-800 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-400 rounded-xl"
                                    }`}
                value={search}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
              />
            </div>
          </div>
        )}

        {/* Right side controls with proper spacing */}
        <div className="flex items-center space-x-2 md:space-x-4">
          {userInfo && (
            <>
              {/* Write button with theme-aware styling */}
              <Link
                to="/write"
                className={`flex items-center gap-1 sm:gap-2 cursor-pointer ${
                  theme ? "text-white" : "color-[#1576D8]"
                }`}
              >
                <TfiPencilAlt size={16} />
                <span className="hidden md:inline">Write</span>
              </Link>

              {/* Theme Toggle Button */}
              <button
                onClick={handleTheme}
                className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full"
              >
                {theme ? (
                  <BsMoonStarsFill className="text-white" />
                ) : (
                  <MdSunny className="text-[#1576D8]" />
                )}
              </button>

              {/* Profile Menu */}
              <div ref={menuRef} className="relative">
                <button
                  onClick={toggleNav}
                  className="flex items-center justify-center"
                >
                  <img
                    src={profilePhoto || avatar}
                    className="w-10 h-10 rounded-full object-cover"
                    alt="Profile"
                  />
                </button>

                <div
                  className={`absolute right-0 mt-2 z-50 transform transition-all duration-300 origin-top-right
    ${
      menuState === "closed"
        ? "opacity-0 scale-95 pointer-events-none"
        : menuState === "open"
        ? "opacity-100 scale-100"
        : menuState === "opening"
        ? "opacity-100 scale-100"
        : "opacity-0 scale-95"
    }
  `}
                >
                  {(menuState === "open" ||
                    menuState === "opening" ||
                    menuState === "closing") && <MobileMenu />}
                </div>
              </div>
            </>
          )}

          {!userInfo && (
            <div className="flex space-x-4">
              <h3 className={theme ? "text-white" : "text-[#1576D8]"}>
                <Link to="/login">Login</Link>
              </h3>
              <h3 className={theme ? "text-white" : "text-[#1576D8]"}>
                <Link to="/register">Register</Link>
              </h3>
            </div>
          )}
        </div>
      </div>

      <div
        className={`border-b-2 w-full ${theme ? "border-slate-800" : ""}`}
      ></div>
    </>
  );
};

export default Navbar;
