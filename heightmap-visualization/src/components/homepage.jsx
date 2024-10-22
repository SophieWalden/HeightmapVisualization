import "../App.css"
import { Animator, ScrollContainer, ScrollPage, batch, Fade, FadeIn, FadeOut, Move, MoveIn, MoveOut, Sticky, StickyIn, StickyOut, Zoom, ZoomIn, ZoomOut } from "react-scroll-motion";


function Homepage(props){
    const FadeUp = batch(Fade(), Move(0, 600), Sticky());
    
    return (
        <div id="homepage-container">
            <ScrollContainer>
                <ScrollPage  className="scroll-page">
                    <Animator animation={batch(Fade(), Sticky(), MoveOut(0, -600))}>
                        <div id="title-page">
                            <iframe
                                width="100%"
                                height="100%"
                                src="https://www.youtube.com/embed/hXD8itTKdY0?autoplay=1&loop=1&playlist=hXD8itTKdY0&controls=0&showinfo=0&rel=0&mute=1" 
                                frameBorder="0"
                                allow="autoplay; encrypted-media"
                                allowFullScreen
                                style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                zIndex: -1,
                                }}
                            />
                            <h2>Pathfinding from Drone Footage</h2>
                            <h3>By Dyllon Dunton and Sophie Walden</h3>
                        
                    </div>
            
                    </Animator>
                </ScrollPage>
                <ScrollPage>
                    <Animator animation={FadeUp}>
                    <div className="scroll-container">
                        <h3>Find Drone Footage</h3>
                        <iframe
                                width="40%"
                                height="40%"
                                src="https://www.youtube.com/embed/oRyTeo2b-2A?autoplay=1&loop=1&playlist=oRyTeo2b-2A&controls=0&showinfo=0&rel=0&mute=1" 
                                frameBorder="0"
                                allow="autoplay; encrypted-media"
                                allowFullScreen
                                style={{
        
                                objectFit: 'cover',
                                zIndex: -1,
                                }}
                            />
                    </div>
                    </Animator>
                </ScrollPage>
                <ScrollPage>
                    <Animator animation={FadeUp}>
                    <div className="scroll-container">
                        <img src="https://i.imgur.com/nnfMOtD.png"></img>
                        <h3>Create Heightmaps</h3>
        
                    </div>
                    </Animator>
                </ScrollPage>
                <ScrollPage>
                    <Animator animation={FadeUp}>
                    <div className="scroll-container">
                        <h3>Run a Pathfinding Algorithim</h3>
                        <img src="https://i.imgur.com/8nyCmF3.png"></img>
                    </div>
                    </Animator>
                </ScrollPage>
                <ScrollPage>
                    <Animator animation={FadeUp}>
                    <button onClick={() => props.setTab("explore")} className="button-30">Explore The Footage</button>
                    </Animator>
                </ScrollPage>
                </ScrollContainer>
        </div>
    )
}

export default Homepage;