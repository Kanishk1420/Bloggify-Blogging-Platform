import logo from '../../assets/Bloggify white.png'
import { useSelector } from 'react-redux'

const Footer = () => {
  const { theme } = useSelector((state) => state.theme)
  
  return (
    <footer className="relative w-full mt-auto">
      {/* Simple Curved Edge SVG - Modified to be less pronounced */}
      <div className="absolute top-0 left-0 w-full overflow-hidden" style={{ transform: 'translateY(-95%)' }}>
        <svg 
          preserveAspectRatio="none" 
          viewBox="0 0 1440 100" 
          xmlns="http://www.w3.org/2000/svg" 
          className="w-full h-[40px] md:h-[70px]"
        >
          {/* Less pronounced curved path */}
          <path 
            d="M0,100 L1440,100 L1440,60 C1080,85 360,85 0,60 L0,100 Z" 
            fill={theme ? "#09090b" : "#000000"}
            fillOpacity="1"
          ></path>
        </svg>
      </div>
      
      {/* Footer Content - Updated with new logo styling */}
      <div className={`${theme ? "bg-zinc-950" : "bg-black"} w-full`}>
        <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:py-12 lg:py-16">
          <div className="flex flex-col items-center">
            <div className="flex justify-center mb-2">
              {/* Updated logo styling to match example images */}
              <img 
                src={logo} 
                alt="Bloggify" 
                className="md:h-16 w-auto object-contain" 
              />
            </div>

            <p className="mx-auto mt-6 max-w-md text-center leading-relaxed text-gray-500 text-sm sm:text-base px-4">
              Bloggify is a blog platform for developers to post amazing blogs and connect with other developers. Additionally, users can access real-time analytics to engage more effectively.
            </p>
            
            <ul className="mt-6 sm:mt-8 flex justify-center gap-4 md:gap-6">
              <li>
                <a
                  href="https://x.com/SushmaLal125823"
                  rel="noreferrer"
                  target="_blank"
                  className="text-gray-700 transition hover:text-gray-700/75"
                >
                  <span className="sr-only">Twitter</span>
                  <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </li>

              <li>
                <a
                  href="https://github.com/Kanishk1420"
                  rel="noreferrer"
                  target="_blank"
                  className="text-gray-700 transition hover:text-gray-700/75"
                >
                  <span className="sr-only">GitHub</span>
                  <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </li>

              {/* Added LinkedIn Icon */}
              <li>
                <a
                  href="https://www.linkedin.com/in/kanishk-gupta-3ab129303/"
                  rel="noreferrer"
                  target="_blank"
                  className="text-gray-700 transition hover:text-gray-700/75"
                >
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z" />
                  </svg>
                </a>
              </li>
            </ul>
            
            <p className="text-slate-500 font-semibold text-center mt-4 text-xs sm:text-sm">&copy; Bloggify {new Date().getFullYear()}</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
