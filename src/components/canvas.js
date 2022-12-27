import React, { useLayoutEffect } from "react";
import PropTypes from "prop-types";
import { randomRange, Agent, staticAgent, amtInit } from "../utils/utils";




const Canvas = ({ height, width, contextToDraw, agentsToDraw, agentsToDrawSmall, resizeMe }) => {

    const canvas = React.useRef()


    React.useEffect(() => {
        const context = canvas.current.getContext('2d')

        const bigDot = []
        for (var i = 0; i < 28; i++) {
            const x = randomRange(0, width)
            const y = randomRange(0, height)
            bigDot.push(new staticAgent(x, y))
        }
        const vertices = [];
        for (var i = 0; i < amtInit; i++) {
            const x = randomRange(10, width)
            const y = randomRange(10, height)
            vertices.push(new Agent(x, y))
        }
        context.fillStyle = 'white'
        context.fillRect(0, 0, width, height)

        function handleContext() {
            contextToDraw(context)
            agentsToDrawSmall(vertices)
            agentsToDraw(bigDot)
        }
        handleContext()

    }, [])




    return (<>
        <canvas
            ref={canvas}
            id="canvas"
            height={height}
            width={width}
        ></canvas>
    </>
    )
}

Canvas.propTypes = {
    draw: PropTypes.func,
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired
};
export default Canvas

