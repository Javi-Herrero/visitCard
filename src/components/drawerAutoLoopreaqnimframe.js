import React, { useEffect, useRef } from "react"
import { mapRange, sizeInit } from "../utils/utils"


const font = new FontFace('myFont', "url(https://fonts.gstatic.com/s/zendots/v10/XRXX3ICfm00IGoesQdaDRs4.woff2)")
document.fonts.add(font)
font.load()
document.fonts.ready.then(
    () => {
        console.log('font was loaded')
    },
    (err) => {
        console.log('font wasnt loaded')
    })


const DrawerAL = ({ context, bigDot, vertices, height, width, params, changeCursor, cursorText, bgText, changeBg, dimensions }) => {
    let isMobile = navigator.maxTouchPoints > 0 ? true : false
    const linesColor = 'rgba(190, 255, 250, 0.25)'
    const textColor = 'rgba(200, 200, 205, 1)'
    let mouseCoords
    let innerWidth = window.innerWidth
    let innerHeight = window.innerHeight
    cursorText.isAboutClicked ? mouseCoords = { X: -width * .5, Y: height * .5 } : mouseCoords = { X: innerWidth * .5, Y: innerHeight * .5 }
    let preMouseCoords = 0
    let isMouseMoving = false
    const clickToChangeState = () => {

        changeCursor({
            title: '',
            text: isMobile ? 'Tap = back' : 'Click = back',
            text2: '',
            alfa: 0.01,
            position: 'source-over',
            texPositionOffset: {
                text: {

                    X: -60.5,
                    Y: 4,
                    color: 'rgba(255, 255, 255, .85)'
                },
                text2: {

                },

            },
            isAboutClicked: true
        })
        changeBg({
            txt1: 'This site is part of my portfolio & it aims to describe ',
            txt2: 'what I like the most as a Front-end developer:',
            txt3: 'Creativity & rousing user experience.',

            position: 'destination-over',
        })
        clickListener()
    }
    const idlePointer = () => {

        changeCursor({
            title: 'JAVI HERRERO',
            text: 'Front-end',
            text2: 'developer',
            position: 'source-over',
            alfa: 0.1,
            texPositionOffset: {
                text: {
                    X: - 55,
                    Y: 25,
                    color: 'rgba(0, 0, 0, .85)'
                },
                text2: {
                    X: - 55,
                    Y: 45,

                },

            },
            isAboutClicked: false
        })
        changeBg({
            txt1: '',
            txt2: '',
            txt3: '',

            position: 'destination-over',
        })

    }





    const getMouse = (e) => {
        mouseCoords = {
            X: (e.pageX),
            Y: (e.pageY)
        }

        const speed = 2.5
        loop(context, speed, mouseCoords, bgText)
        bigDots(context, mouseCoords, cursorText)
        pointerText(context, mouseCoords, cursorText)
    }

    const pointerText = (context, coords, cursorText) => {
        isMobile ? coords = { X: innerWidth * .5, Y: innerHeight * .5 } : coords = coords
        context.globalCompositeOperation = cursorText.position
        context.font = '36px "myFont"'

        context.strokeStyle = 'rgba(190, 255, 250, 0.5)'
        context.strokeText(cursorText.title, coords.X - 172, coords.Y)
        context.fillStyle = 'rgba(0, 0, 0, 1)'
        context.fillText(cursorText.title, coords.X - 175, coords.Y)
        context.font = '18px "myFont"'
        context.fillStyle = cursorText.texPositionOffset.text.color
        context.fillText(cursorText.text, coords.X + cursorText.texPositionOffset.text.X, coords.Y + cursorText.texPositionOffset.text.Y)
        context.fillText(cursorText.text2, coords.X + cursorText.texPositionOffset.text2.X, coords.Y + cursorText.texPositionOffset.text2.Y)


    }
    useEffect(() => {

        window.addEventListener('mousemove', getMouse)
        return () => {
            window.removeEventListener('mousemove', getMouse)
        }
    }, [context, cursorText, dimensions])



    const clickListener = () => {
        console.log('listener is added')

        window.addEventListener('click', clickToBack)
    }
    const clickToBack = (e) => {
        if (e.path[0].id === 'canvas') {
            window.removeEventListener('click', clickToBack)
            idlePointer()
            console.log('listener removed')
        }
    }

    const requestRef = useRef()

    const animate = () => {

        if (preMouseCoords !== 0) {
            preMouseCoords === mouseCoords.X ? isMouseMoving = false : isMouseMoving = true
        }
        if (isMouseMoving === false) {

            loop(context, 1.5, mouseCoords, bgText)
            bigDots(context, mouseCoords, cursorText)
            pointerText(context, mouseCoords, cursorText)
        }
        preMouseCoords = mouseCoords.X


        requestRef.current = requestAnimationFrame(animate);
    }



    useEffect(() => {
        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current);

    }, [context, cursorText, dimensions])

    const bigDots = (context, coords, cursorText) => {
        isMobile ? coords = { X: innerWidth * .5, Y: innerHeight * .5 } : coords = coords
        bigDot.forEach(agent => {
            agent.update()
            agent.draw(context, coords, cursorText.alfa)
        })
    }

    const loop = (context, dir, coords, bgText) => {
        context.reset()
        vertices.forEach(agent => {
            agent.update(dir)
            agent.draw(context)
            agent.bounce(width, height, coords)
            let sizeDif = params.Maxsize - sizeInit
            if (sizeDif !== 0) {
                vertices.forEach(agent => {
                    agent.resize(params.Maxsize)
                })
                sizeInit = params.Maxsize
            }
        })
        for (var i = 0; i < vertices.length; i++) {
            const agent = vertices[i]

            for (var j = i + 1; j < vertices.length; j++) {
                const other = vertices[j]
                const dist = agent.pos.getDistance(other.pos)
                let thresDist = params.thresDist

                if (dist > thresDist) continue

                context.lineWidth = mapRange(dist, 0, thresDist, params.maxLineWidth, 0.03)
                context.strokeStyle = linesColor
                context.beginPath()
                context.moveTo(agent.pos.x, agent.pos.y)
                context.lineTo(other.pos.x, other.pos.y)
                context.stroke()
            }
        }
        context.globalCompositeOperation = bgText.position
        if (innerWidth <= 960) {
            context.font = '16px "myFont"'
            context.fillStyle = textColor
            context.fillText(bgText.txt1, innerWidth * .15, innerHeight * .25, innerWidth * .75)
            context.fillText(bgText.txt2, innerWidth * .15, innerHeight * .3, innerWidth * .75)
            context.fillText(bgText.txt3, innerWidth * .15, innerHeight * .35, innerWidth * .75)

        } else {
            context.font = '24px "myFont"'
            context.fillStyle = textColor
            context.fillText(bgText.txt1, innerWidth * .25, innerHeight * .25, innerWidth * .75)
            context.fillText(bgText.txt2, innerWidth * .25, innerHeight * .3, innerWidth * .75)
            context.fillText(bgText.txt3, innerWidth * .25, innerHeight * .35, innerWidth * .75)

        }
    }


    window.addEventListener("resize", (event) => {
        innerWidth = event.target.innerWidth
        innerHeight = event.target.innerHeight

    });

    const onCvClick = () => {
        fetch("CV_Javier.pdf").then(response => {
            response.blob().then(blob => {
                const fileURL = window.URL.createObjectURL(blob);

                let link = document.createElement('a');
                link.href = fileURL;
                link.download = "CV_Javier.pdf";
                link.click();
            })
        })
    }


    return (
        <>
            <link
                rel="stylesheet"
                href="https://fonts.googleapis.com/css2?family=Zen+Dots" />
            <nav>
                <ul>
                    <li><a id='CV' href="./CV_Javier.pdf" target='_blank' onClick={onCvClick}  >CV</a></li>
                    <li> <button type="button" id='About' onClick={clickToChangeState} >About</button ></li>
                    <li> <a id='More' href="https://reactapp-example.netlify.app/" target='blank'>More</a></li>
                </ul>
            </nav >
        </>
    )
}
export default DrawerAL