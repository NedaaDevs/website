import { useState } from "react";
import { useLocation } from "react-router-dom";

import { Switch } from "@headlessui/react";

import strings from "../Localization/Translations";
import config from "../config/index.json";

import Header from "./Header";
import About from "./About";

type Direction = "ltr" | "rtl";

export default function PrivacyPolicy() {
  const url = useLocation().search;
  let defaultLanguage = new URLSearchParams(url).get("lang") || "en";
  if (defaultLanguage !== "en" && defaultLanguage !== "ar") {
    defaultLanguage = "en";
  }
  const defaultTextDirection = defaultLanguage === "en" ? "ltr" : "rtl";

  const [language, setLanguage] = useState(defaultLanguage);
  const [textDirection, setTextDirection] =
    useState<Direction>(defaultTextDirection);
  const styles: React.CSSProperties = {
    direction: textDirection,
  };
  // set the strings localization
  strings.setLanguage(language);

  const { supportEmail } = config.details;

  const onlanguagechange = () => {
    const newLanguage = language === "en" ? "ar" : "en";
    setLanguage(newLanguage);
    setTextDirection(newLanguage === "en" ? "ltr" : "rtl");
    strings.setLanguage(newLanguage);
  };

  return (
    <div
      className={`relative bg-background grid gap-y-16 overflow-hidden ${textDirection}`}
      style={styles}
    >
      <div className={`relative bg-background`}>
        <div className="max-w-7xl mx-auto content-center">
          <div
            className={`relative z-10 pb-8 bg-background sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32`}
          >
            <Header />
          </div>
          <div className="flex justify-center w-full">
            <div className="bg-tranparent">
              <Switch
                checked={language === "en" ? true : false}
                onChange={() => onlanguagechange()}
              >
                <span
                  style={{ direction: "ltr" }}
                  className="rounded shadow mb-4 p-2 h-20 w-56 flex items-center"
                >
                  <span
                    className={`items-center flex justify-center text-white h-full w-1/2 rounded transition duration-300 ease-in-out transform ${
                      language === "en"
                        ? "bg-tertiary"
                        : "bg-tertiary translate-x-full"
                    }`}
                  >
                    {language === "en" ? "عربي" : "English"}
                  </span>
                </span>
              </Switch>
            </div>
          </div>
          <div className="max-w-full content-center p-4">
            <h4
              className={`text-4xl font-normal leading-normal mt-0 mb-2 text-center`}
            >
              {strings.nedaaPrivacyPolicy}
            </h4>
            <p className="text-base font-light leading-relaxed mt-0 mb-4">
              {strings.nedaaPrivacyPolicyContent}
            </p>
            <h4 className="text-4xl font-normal leading-normal mt-0 mb-2 text-center">
              {strings.logFiles}
            </h4>
            <p className="text-base font-light leading-relaxed mt-0 mb-4">
              {strings.logFilesContent}
            </p>
            <h4 className="text-4xl font-normal leading-normal mt-0 mb-2 text-center">
              {strings.consent}
            </h4>
            <p className="text-base font-light leading-relaxed mt-0 mb-4">
              {strings.consentContent}
            </p>
            <h4 className="text-4xl font-normal leading-normal mt-0 mb-2 text-center">
              {strings.contactUs}
            </h4>
            <p className="text-base font-light leading-relaxed mt-0 mb-4">
              {strings.contactUsContent}
              <span> </span>
              <a
                rel="noreferrer"
                target="_blank"
                href="mailto:support@nedaa.dev"
                className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
              >
                {supportEmail}
              </a>
              .
            </p>

            <p className="text-base font-bold leading-relaxed mt-0 mb-4">
              * {strings.policyEffectiveDate}
            </p>
          </div>
          <About />
        </div>
      </div>
    </div>
  );
}
