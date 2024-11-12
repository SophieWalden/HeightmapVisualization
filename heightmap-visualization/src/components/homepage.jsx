import { useEffect } from "react";
import "../App.css"
import { Animator, ScrollContainer, ScrollPage, batch, Fade, FadeIn, FadeOut, Move, MoveIn, MoveOut, Sticky, StickyIn, StickyOut, Zoom, ZoomIn, ZoomOut } from "react-scroll-motion";


function Homepage(props){
    const FadeUp = batch(Fade(), Move(0, 600), Sticky());
    
    useEffect(() => {


    }, [props.finishLoading]);

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
                        
                            <div className={`${props.finishLoading ? '' : 'hiddenDivT'}`}><div className="arrow animated bounce"></div></div>
                    </div>
            
                    </Animator>
                </ScrollPage>
                <ScrollPage>
                    <Animator animation={FadeUp}>
                    <div className="scroll-container">
                        <div className="scroll-text">
                            <h3>Find Drone Footage</h3>
                            <p className="scroll-descriptions">Drone footage is gathered from YouTube. Here we prioritize clean top down scrolling footage of scenes with a lot of depth</p>
                        </div> 
                        

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

                        <div className="scroll-text">
                            <h3>Create Heightmaps</h3>
                            <p className="scroll-descriptions">The drone footage is stitched into a single image. This image is run through the machine learning model ZoeDepth to get a relative depth map</p>
                        </div>
                    </div>
                    </Animator>
                </ScrollPage>
                <ScrollPage>
                    <Animator animation={FadeUp}>
                    <div className="scroll-container">
                        <div className="scroll-text">
                            <h3>Run Pathfinding Algorithim</h3>
                            <p className="scroll-descriptions">An A* pathfinding algorithim is ran on the depth map to plot an estimated route for a rover to take throughout the drone footage</p>
                        </div> 
                        <img id="pathfinding-image" src="https://i.imgur.com/8nyCmF3.png"></img>
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