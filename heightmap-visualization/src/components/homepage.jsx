import "../App.css"
import { Animator, ScrollContainer, ScrollPage, batch, Fade, FadeIn, FadeOut, Move, MoveIn, MoveOut, Sticky, StickyIn, StickyOut, Zoom, ZoomIn, ZoomOut } from "react-scroll-motion";


function Homepage(props){
    const FadeUp = batch(Fade(), Move(0, 600), Sticky());
    
    return (
        <div id="homepage-container">
            <ScrollContainer className="scroll-container">
                <ScrollPage  className="scroll-page">
                    <Animator animation={batch(Fade(), Sticky(), MoveOut(0, -600))}>
                        <div id="title-page">
                            <video
                                width="100%"
                                height="100%"
                                loop     
                                muted   
                                disablePictureInPicture 
                                autoPlay 
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    zIndex: -1,
                                }}
                                >
                                <source src="https://i.imgur.com/k8NObB1.mp4" type="video/mp4" />
                            Your browser does not support the video tag.
                            </video>

                            <h2>Pathfinding from Drone Footage</h2>
                            <h3>By Dyllon Dunton and Sophie Walden</h3>
                        
                    </div>
            
                    </Animator>
                </ScrollPage>
                <ScrollPage>
                    <Animator animation={FadeUp}>
                    <div className="scroll-container">
                        <h3>Find Drone Footage</h3>
                        <video
                                width="40%"
                                height="auto"
                                loop     
                                muted   
                                autoPlay 
                                disablePictureInPicture 
                                style={{
                                    zIndex: -1,
                                    borderRadius: "10px"
                                }}
                                >
                                <source src="https://i.imgur.com/18TVwlP.mp4" type="video/mp4" />
                            Your browser does not support the video tag.
                            </video>
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