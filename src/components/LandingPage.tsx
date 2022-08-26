import React from "react";
// import GooglePlayButton from "./GooglePlayButton";
// import AppStoreButton from "./AppStoreButton";
import TestFlightButton from "./TestFlightButton";
import config from "../config/index.json";
import ApkButton from "./ApkButton";

const MainPage = () => {
  const { details } = config;
  return (
    <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
      <div className="sm:text-center lg:text-left">
        <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
          <span className="block xl:inline">{details.title}</span>{" "}
          <span className={`block text-primary xl:inline`}>
            {details.subtitle}
          </span>
        </h1>
        <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
          {details.description}
        </p>
        <br />
        <small>
          The app still in beta version please report any bugs, Thanks.
        </small>
        <br />
        <small>
          {" "}
          لا يزال  التطبيق في الإصدار التجريبي ، يرجى الإبلاغ عن أي أخطاء ،
          شكرًا.
        </small>
        <br />
        <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
          <div className="mt-3 sm:mt-0 sm:ml-3">
            <TestFlightButton />
          </div>
          <div className="mt-3 sm:mt-0 sm:ml-3">
            <ApkButton />
          </div>
          {/* <AppStoreButton /> */}

          {/* <div className="mt-3 sm:mt-0 sm:ml-3">
            <GooglePlayButton />
          </div> */}
        </div>
      </div>
    </main>
  );
};

export default MainPage;
