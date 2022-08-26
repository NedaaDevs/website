import { motion } from "framer-motion";

import config from "../config/index.json";
const GooglePlayButton = () => {
  const { links } = config;
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
        onClick={() => window.open(links.apps.android, "_blank")}
      >
        <div className="mr-3">
          <motion.img
            width="30"
            whileTap={{
              scale: 0.9,
              x: -10,
              y: -10,
              transition: { duration: 0.5 },
            }}
            src={config.icons.android}
            alt="apk"
          ></motion.img>
        </div>
        <div>
          <div className="text-xs">Download APK</div>
          <div className="text-xl font-semibold font-sans -mt-1">Android</div>
        </div>
      </motion.button>
    </>
  );
};

export default GooglePlayButton;
