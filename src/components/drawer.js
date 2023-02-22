import React, { useEffect } from "react";
import { mapRange, sizeInit } from "../utils/utils";
import '../style/drawer.css'


const Drawer = ({ context, bigDot, vertices, height, width, params }) => {


    let mouseCoords = { X: 0, Y: 0 }

    let info = {
        title: 'JAVI HERRERO',
        text: 'Front-end developer',
        position: 'source-over',
        alfa: 0.15,
        texPositionOffset: { X: - 118, Y: 25 }
    }
    let infoAlt = {
        txt1: '',
        txt2: '',
        txt3: '',
        txt4: '',
        txt5: ''
    }

    const aboutPointer = () => {
        info.title = ''
        info.text = 'click = back'
        info.alfa = 0.01
        info.position = 'source-over'
        info.texPositionOffset = { X: -60.5, Y: 4 }
        infoAlt = {
            txt1: 'This site is part of my portfolio',
            txt2: '&',
            txt3: 'aims to describe what I like the most',
            txt4: 'as a front-end developer:',
            txt5: ' Creativity and impactful user interactions. ',
            position: 'destination-over',
        }
    }

    const getMouse = (e) => {

        mouseCoords = {
            // X: ((e.clientX) * .5 + width * .15),
            // Y: ((e.clientY) * .5 + height * .25)
            X: (mapRange(e.pageX, 0, window.screen.width, 0, width)),
            Y: (mapRange(e.pageY, 0, window.screen.height, 0, height))
        }


        const speed = 4
        loop(context, speed, mouseCoords, infoAlt)
        bigDots(context, mouseCoords, info)
        pointerText(context, mouseCoords, info)

    }



    useEffect(() => {

        window.addEventListener('mousemove', getMouse)

        return () => {
            window.removeEventListener('mousemove', getMouse);
        };
    }, [context]);

    const bigDots = (context, coords, info) => {

        bigDot.forEach(agent => {
            agent.update()
            agent.draw(context, coords, info.alfa);

        });
    }


    const loop = (context, dir, coords, info) => {
        context.reset();
        vertices.forEach(agent => {
            agent.update(dir)
            agent.draw(context);
            agent.bounce(width, height, coords)
            let sizeDif = params.Maxsize - sizeInit;
            if (sizeDif != 0) {
                vertices.forEach(agent => {
                    agent.resize(params.Maxsize);
                });
                sizeInit = params.Maxsize;
            };
        });
        for (var i = 0; i < vertices.length; i++) {
            const agent = vertices[i];

            for (var j = i + 1; j < vertices.length; j++) {
                const other = vertices[j];
                const dist = agent.pos.getDistance(other.pos);
                let thresDist = params.thresDist;

                if (dist > thresDist) continue;

                context.lineWidth = mapRange(dist, 0, thresDist, params.maxLineWidth, 0.03);
                context.strokeStyle = 'rgba(190, 255, 250, 0.5)';
                context.beginPath();
                context.moveTo(agent.pos.x, agent.pos.y);
                context.lineTo(other.pos.x, other.pos.y);
                context.stroke();

            }
        }
        context.globalCompositeOperation = info.position
        context.font = '36px "myFont"'
        context.fillText(infoAlt.txt1, 150, 100)
        context.fillText(infoAlt.txt2, 450, 200)
        context.fillText(infoAlt.txt3, 15, 300)
        context.fillText(infoAlt.txt4, 350, 350)
        context.fillText(infoAlt.txt5, 2, 500)

        //requestAnimationFrame(loop)

    }
    let preMouseCoords = 0
    let isMouseMoving = false
    setInterval((() => {
        if (preMouseCoords !== 0) {
            preMouseCoords === mouseCoords.X ? isMouseMoving = false : isMouseMoving = true
        }
        if (isMouseMoving === false) {

            //requestAnimationFrame(loop(context, 4, mouseCoords, infoAlt))
        }
        preMouseCoords = mouseCoords.X
    }), 250)

    const font = new FontFace('myFont', "url(https://fonts.gstatic.com/s/zendots/v10/XRXX3ICfm00IGoesQdaDRs4.woff2)")
    document.fonts.add(font)
    font.load()
    document.fonts.ready.then(

        () => {

            console.log('font was loaded')

        },
        (err) => {
            console.log('font wasnt loaded')
        }
    )
    const pointerText = (context, coords, info) => {
        context.globalCompositeOperation = info.position
        context.font = '36px "myFont"'
        //context.fillStyle = 'white'
        context.strokeStyle = 'rgba(190, 255, 250, 0.5)'
        context.strokeText(info.title, coords.X - 172, coords.Y)
        context.fillText(info.title, coords.X - 175, coords.Y)
        context.font = '18px "myFont"'
        context.fillText(info.text, coords.X + info.texPositionOffset.X, coords.Y + info.texPositionOffset.Y)

    }


    return (
        <>
            <link
                rel="stylesheet"
                href="https://fonts.googleapis.com/css2?family=Zen+Dots" />
            <nav>
                <ul>
                    <li><a href="CV_Javier.pdf" download >CV</a></li>
                    <li> <a href="#" onClick={aboutPointer}>About</a></li>
                    <li> <a href="https://realstatevueapp.netlify.app/" target='blank'>More</a></li>
                </ul>
            </nav >
        </>
    )
}
export default Drawer