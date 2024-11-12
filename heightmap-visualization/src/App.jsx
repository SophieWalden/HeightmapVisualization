import { useState, useEffect, useRef } from 'react';
import './App.css';

import Explore from './components/explore';
import Homepage from './components/homepage';


function App() {
  const [tab, setTab] = useState("homepage");
  const [finishLoading, setFinishLoading] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    scrollToTop()
  }, [tab])

  return (
    <div id="site-content">
      <div className={`${tab=="explore"?"":"hidden"} explore-container`}>
        <Explore setFinishLoading={setFinishLoading} />
      </div>
      <div className={`${tab=="homepage"?"":"hidden"} homepage-container`} id="homepage" >
        <Homepage finishLoading={finishLoading} setTab={setTab} />
        </div>
    </div>
  );
}

export default App;
