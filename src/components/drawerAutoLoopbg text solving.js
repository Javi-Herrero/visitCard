import React, { useEffect } from "react"
import { mapRange, sizeInit } from "../utils/utils"
import '../style/drawer.css'

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



const DrawerAL = ({ context, bigDot, vertices, height, width, params, changeCursor, infoCursor }) => {

    let mouseCoords = { X: width * .5, Y: height * .5 }
    let preMouseCoords = 0
    let isMouseMoving = false
    const clickAbout = () => {

        changeCursor({
            title: '',
            text: 'click = back',
            alfa: 0.01,
            position: 'source-over',
            texPositionOffset: { X: -60.5, Y: 4 },
            isAboutClicked: true
        })
    }

    /* let info = {
        title: 'JAVI HERRERO',
        text: 'Front-end developer',
        position: 'source-over',
        alfa: 0.15,
        texPositionOffset: { X: - 118, Y: 25 },
        isAboutClicked: false
    }
    let infoAlt = {
        txt1: '',
        txt2: '',
        txt3: '',
        txt4: '',
        txt5: ''
    }


    const idlePointer = () => {
        info = {
            title: 'JAVI HERRERO',
            text: 'Front-end developer',
            position: 'source-over',
            alfa: 0.15,
            texPositionOffset: { X: - 118, Y: 25 },
            isAboutClicked: false
        }
        infoAlt = {
            txt1: '',
            txt2: '',
            txt3: '',
            txt4: '',
            txt5: ''
        }
    }
    const aboutPointer = () => {
         info = {
            title: '',
            text: 'click = back',
            alfa: 0.01,
            position: 'source-over',
            texPositionOffset: { X: -60.5, Y: 4 },
            isAboutClicked: true
        }
        infoAlt = {
            txt1: 'This site is part of my portfolio',
            txt2: '&',
            txt3: 'it aims to describe what I like the most',
            txt4: 'as a front-end developer:',
            txt5: ' Creativity and impactful user interactions. ',
            position: 'destination-over',
        } 
        clickListener()
    } */

    const getMouse = (e) => {
        // if (e.clientX >= dimensions.)
        mouseCoords = {
            //X: (mapRange(e.clientX, 0, window.innerWidth, 0, dimensions.X)),
            // Y: (mapRange(e.clientY, 0, window.innerHeight, 0, dimensions.Y))
            X: (e.pageX),
            Y: (e.pageY)
        }

        const speed = 2.5
        loop(context, speed, mouseCoords, infoAlt)
        bigDots(context, mouseCoords, info)
        pointerText(context, mouseCoords, info)
    }

    const pointerText = (context, coords, info) => {
        context.globalCompositeOperation = info.position
        context.font = '36px "myFont"'

        context.strokeStyle = 'rgba(190, 255, 250, 0.5)'
        context.strokeText(info.title, coords.X - 172, coords.Y)
        context.fillText(info.title, coords.X - 175, coords.Y)
        context.font = '18px "myFont"'
        context.fillText(info.text, coords.X + info.texPositionOffset.X, coords.Y + info.texPositionOffset.Y)
    }
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
    ///aqui hay que fine tunear cuando quero el loop y que quiero que vea

    useEffect(() => {

        setInterval((() => {
            if (preMouseCoords !== 0) {
                preMouseCoords === mouseCoords.X ? isMouseMoving = false : isMouseMoving = true
            }
            if (isMouseMoving === false && context != '') {

                loop(context, 1.5, mouseCoords, infoCursor)
                bigDots(context, mouseCoords, info)
                pointerText(context, mouseCoords, info)
            }
            preMouseCoords = mouseCoords.X
        }), 30)
        //console.log(infoAlt)

    }, [context, infoCursor])

    useEffect(() => {

        window.addEventListener('mousemove', getMouse)
        return () => {
            window.removeEventListener('mousemove', getMouse)
        }
    }, [context])




    const bigDots = (context, coords, info) => {
        bigDot.forEach(agent => {
            agent.update()
            agent.draw(context, coords, info.alfa)
        })
    }

    const loop = (context, dir, coords, info) => {
        context.reset()
        vertices.forEach(agent => {
            agent.update(dir)
            agent.draw(context)
            agent.bounce(width, height, coords)
            let sizeDif = params.Maxsize - sizeInit
            if (sizeDif != 0) {
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
                context.strokeStyle = 'rgba(190, 255, 250, 0.5)'
                context.beginPath()
                context.moveTo(agent.pos.x, agent.pos.y)
                context.lineTo(other.pos.x, other.pos.y)
                context.stroke()
            }
        }
        context.globalCompositeOperation = info.position
        context.font = '36px "myFont"'
        context.fillText(infoAlt.txt1, 150, 100)
        context.fillText(infoAlt.txt2, 450, 200)
        context.fillText(infoAlt.txt3, 15, 300)
        context.fillText(infoAlt.txt4, 350, 350)
        context.fillText(infoAlt.txt5, 2, 500)
    }




    return (

        <>
            <link
                rel="stylesheet"
                href="https://fonts.googleapis.com/css2?family=Zen+Dots" />
            <nav>
                <ul>
                    <li><a href="./CV_Javier.pdf" download >CV</a></li>
                    <li> <a href="#" onClick={clickAbout} >About</a></li>
                    <li> <a href="https://reactapp-example.netlify.app/" target='blank'>More</a></li>
                </ul>
            </nav >

        </>
    )
}
export default DrawerAL