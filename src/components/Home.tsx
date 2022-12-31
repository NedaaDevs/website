import { FC } from "react";
import LandingPage from "../components/LandingPage";
import Divider from "../components/Divider";
import Header from "../components/Header";
import Logo from "../components/Logo";
import About from "../components/About";
// import Canvas from "../components/Canvas";

interface Props {}

const Home: FC<Props> = () => {
  return (
    <div className={`bg-background grid gap-y-16 overflow-hidden`}>
      <div className={`relative bg-background`}>
        <div className="max-w-7xl mx-auto">
          <div
            className={`relative z-10 pb-8 bg-background sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32`}
          >
            <Header />
            <LandingPage />
            <Divider />
          </div>
        </div>
      </div>
      <Logo />

      <>
        {/* <Canvas /> */}
        <About />
      </>
    </div>
  );
};

export default Home;
