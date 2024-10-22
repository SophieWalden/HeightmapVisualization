import { useState, useEffect, useRef } from 'react';
import './App.css';

import Explore from './components/explore';
import Homepage from './components/homepage';


function App() {
  const [tab, setTab] = useState("homepage")

  return (
    <div id="site-content">
      
      <div className={`${tab=="explore"?"":"hidden"}`}>
        <Explore />
      </div>
      <div className={`${tab=="homepage"?"":"hidden"}`} id="homepage">
        <Homepage setTab={setTab} />
        </div>
    </div>
  );
}

export default App;
