import { motion } from "framer-motion";

import config from "../config/index.json";
const GooglePlayButton = () => {
  const { details } = config;
  const screenSize = window.innerWidth;
  const buttonWidth = screenSize < 980 ? "w-full" : "w-48";
  return (
    <>
      <motion.button
        initial={{ y: "-1000", opacity: 0 }}
        animate={{ opacity: 1, y: 0, x: 0, transition: { delay: 0.5 } }}
        transition={{ type: "spring", duration: 0.5, delay: 0.2 }}
        whileHover={{ scale: 1.1, transition: { duration: 0.5 } }}
        whileTap={{ scale: 0.9, transition: { duration: 0.5 } }}
        type="button"
        className={`flex  mt-3 ${buttonWidth} h-14 bg-transparent text-black border border-black rounded-xl items-center justify-center`}
      >
        <div className="mr-3">
          <motion.svg
            viewBox="30 336.7 120.9 129.2"
            width="30"
            whileTap={{
              scale: 0.7,
              x: -10,
              y: -10,
              transition: { duration: 0.5 },
            }}
          >
            <path
              fill="#FFD400"
              d="M119.2,421.2c15.3-8.4,27-14.8,28-15.3c3.2-1.7,6.5-6.2,0-9.7  c-2.1-1.1-13.4-7.3-28-15.3l-20.1,20.2L119.2,421.2z"
            ></path>
            <path
              fill="#FF3333"
              d="M99.1,401.1l-64.2,64.7c1.5,0.2,3.2-0.2,5.2-1.3  c4.2-2.3,48.8-26.7,79.1-43.3L99.1,401.1L99.1,401.1z"
            ></path>
            <path
              fill="#48FF48"
              d="M99.1,401.1l20.1-20.2c0,0-74.6-40.7-79.1-43.1  c-1.7-1-3.6-1.3-5.3-1L99.1,401.1z"
            ></path>
            <path
              fill="#3BCCFF"
              d="M99.1,401.1l-64.3-64.3c-2.6,0.6-4.8,2.9-4.8,7.6  c0,7.5,0,107.5,0,113.8c0,4.3,1.7,7.4,4.9,7.7L99.1,401.1z"
            ></path>
          </motion.svg>
        </div>
        <div>
          <div className="text-xs">GET IT ON</div>
          <div className="text-xl font-semibold font-sans -mt-1">
            <a href={details.androidDownload.href} target="_blank">
            {details.androidDownload.text}
            </a>
          </div>
        </div>
      </motion.button>
    </>
  );
};

export default GooglePlayButton;
