import { useState, useEffect, useRef } from 'react';
import './App.css';

import Explore from './components/explore';
import Homepage from './components/homepage';


function App() {
  const [tab, setTab] = useState("homepage");
  const [finishLoading, setFinishLoading] = useState(false);
  const [fade, setFade] = useState("");

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    setFade("fade-out");
    const timeout = setTimeout(() => {
      setFade("fade-in");
      scrollToTop();
    }, 2500); 

    return () => clearTimeout(timeout);
  }, [tab])

  return (
    <div id="site-content">
      <div className={`${tab=="explore"?"":"hidden"} explore-container ${tab === "explore" ? fade : ""}`}>
        <Explore setFinishLoading={setFinishLoading} />
      </div>
      <div className={`${tab=="homepage"?"":"hiddenDiv"} homepage-container`} id="homepage" >
        <Homepage finishLoading={finishLoading} setTab={setTab} />
        </div>
    </div>
  );
}

export default App;
