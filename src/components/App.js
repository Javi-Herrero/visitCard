import React, { useEffect, useState } from "react"
import '../style/App.css'
import Canvas from './canvas'
import { params } from "../utils/utils";

import DrawerAL from "./drawerAutoLoopreaqnimframe"










function App() {
  const [context, setContext] = useState('')
  const [bigDot, setbigDot] = useState([])
  const [vertices, setvertices] = useState([])
  const [coords, setCoords] = useState()
  const [dimensions, setDimensions] = useState({
    height: 900,
    width: 1600
  })

  const [infoCursor, setCursor] = useState({
    title: 'JAVI HERRERO',
    text: 'Front-end',
    text2: 'developer',
    position: 'source-over',
    alfa: 0.1,
    texPositionOffset: {
      text: {
        X: - 55,
        Y: 25,
        color: 'rgba(0, 0, 0, 1)'
      },
      text2: {
        X: - 55,
        Y: 45
      },

    },
    isAboutClicked: false
  })
  const [infoBg, setInfoBg] = useState({
    txt1: '',
    txt2: '',
    txt3: '',

  })



  const [canvas, setCanvas] = useState(
    <Canvas
      //resizeMe={setDimensions}
      params={params}
      contextToDraw={setContext}
      agentsToDraw={setbigDot}
      agentsToDrawSmall={setvertices}
      height={dimensions.height}
      width={dimensions.width}
      coords={coords}
    />)

  return (
    <>
      {canvas}
      <DrawerAL
        removeCanvas={setCanvas}
        cursorText={infoCursor}
        changeCursor={setCursor}
        bgText={infoBg}
        changeBg={setInfoBg}
        dimensions={dimensions}
        params={params}
        height={dimensions.height}
        width={dimensions.width}
        context={context}
        bigDot={bigDot}
        vertices={vertices}
        coords={setCoords}
      />
    </>
  )
}
export default App;