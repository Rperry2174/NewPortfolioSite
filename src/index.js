import ReactDOM from 'react-dom'
import React, { useState, useEffect } from 'react'
// A React renderer for Three-js: https://github.com/drcmda/react-three-fiber
import { Canvas } from 'react-three-fiber'
// A React x-platform animation library: https://github.com/react-spring/react-spring
import { useTransition, useSpring, a } from 'react-spring/three'
import { svgs, colors, deg, doubleSide } from './resources/helpers'
import './resources/cards.css'

/** This component renders a shape */
function Shape({ shape, rotation, position, color, opacity, index }) {
  return (
    <a.mesh rotation={rotation} position={position.interpolate((x, y, z) => [x, y, z + -index * 50])}>
      <a.meshPhongMaterial attach="material" color={color} opacity={opacity} side={doubleSide} depthWrite={false} transparent />
      <shapeBufferGeometry attach="geometry" args={[shape]} />
    </a.mesh>
  )
}

/** This component sets up a background plane and transitions a group of shapes */
function Scene() {
  const [page, setPage] = useState(0)
  const [shapes, setShapes] = useState([])
  // Switches scenes every 4 seconds
  useEffect(() => void setInterval(() => setPage(i => (i + 1) % svgs.length), 4500), [])
  // Converts current SVG into mesh-shapes: https://threejs.org/docs/index.html#examples/loaders/SVGLoader
  useEffect(() => void svgs[page].then(setShapes), [page])
  // This spring controls the background color animation
  const { color } = useSpring({ color: colors[page] })
  // This one is like a transition group, but instead of handling div's it mounts/unmounts meshes in a fancy way
  const transitions = useTransition(shapes, item => item.shape.uuid, {
    from: { rotation: [-0.2, 0.9, 0], position: [0, 50, -200], opacity: 0 },
    enter: { rotation: [0, 0, 0], position: [0, 0, 0], opacity: 1 },
    leave: { rotation: [0.2, -0.9, 0], position: [0, -400, 200], opacity: 0 },
    config: { mass: 30, tension: 800, friction: 190, precision: 0.0001 },
    ...{ order: ['leave', 'enter', 'update'], trail: 15, lazy: true, unique: true, reset: true }
  })
  return (
    <>
      <mesh scale={[20000, 20000, 1]} rotation={[0, deg(-20), 0]}>
        <planeGeometry attach="geometry" args={[1, 1]} />
        <a.meshPhongMaterial attach="material" color={color} depthTest={false} />
      </mesh>
      <group position={[1600, -700, page]} rotation={[0, deg(180), 0]}>
        {transitions.map(({ item, key, props }) => (
          <Shape key={key} {...item} {...props} />
        ))}
      </group>
    </>
  )
}

function Card() {
  var articles = {
    'article': {
      "color": "FEC006",
      "title": "Snow in Turkey Brings Travel Woes",
      "thumbnail": "",
      "category": "News",
      "excerpt": "Heavy snowstorm in Turkey creates havoc as hundreds of villages left without power, and hundreds of roads closed",
      "date": new Date()
    },
    'article-1': {
      "color": "2196F3",
      "title": "Landslide Leaving Thousands Homeless",
      "thumbnail": "",
      "category": "News",
      "excerpt": "An aburt landslide in the Silcon Valley has left thousands homeless and on the streets.",
      "date": new Date()
    },
    'article-2': {
      "color": "FE5621",
      "title": "Hail the size of baseballs in New York",
      "thumbnail": "",
      "category": "News",
      "excerpt": "A rare and unexpected event occurred today as hail the size of snowball hits New York citizens.",
      "date": new Date()
    },
    'article-3': {
      "color": "673AB7",
      "title": "Earthquake destorying San Fransisco",
      "thumbnail": "",
      "category": "News",
      "excerpt": "A massive earthquake just hit San Fransisco leaving behind a giant crater.",
      "date": new Date()
    }
  }

  var styles = {
    backgroundColor: '#' + 'ff0000'
  };

  return (
    <div className="app">
      <div className="container">
        <div className="column">
          <article className="article">
            <h3 className="article__category">category</h3>
            <img
              class="preview"
              src="https://ryaperry-bucket.s3-us-west-2.amazonaws.com/professional_preview.png"
            >
            </img>
            <h2 className="article__title">title</h2>
            <p className="article__excerpt">exerpt</p>
          </article>
        </div>
      </div>
    </div>
  )
};

/** Main component */
function App() {
  return (
    <div class="main">
      <div class="landing">
        <Canvas invalidateFrameloop camera={{ fov: 90, position: [0, 0, 1800], rotation: [0, deg(-20), deg(180)], near: 0.1, far: 20000 }}>
          <ambientLight intensity={0.5} />
          <spotLight intensity={0.5} position={[300, 300, 4000]} />
          <Scene />
        </Canvas>
        <span class="header">HI, <br/>I'M RYAN</span>
      </div>
      <div class="resumes">
        <div class="previewContainer">
          <img
            class="preview"
            src="https://ryaperry-bucket.s3-us-west-2.amazonaws.com/professional_preview.png"
          >
          </img>
          <span class="caption">
            <p>Professional Resume</p>
          </span>
        </div>
        <div class="previewContainer">
          <img
            class="preview"
            src="https://ryaperry-bucket.s3-us-west-2.amazonaws.com/graphic_preview.png"
          >
          </img>
          <span class="caption">
            <p>Graphic Resume</p>
          </span>
        </div>
      </div>
      <div class="blog">
        <Card></Card>
      </div>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
