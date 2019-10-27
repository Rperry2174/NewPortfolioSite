import ReactDOM from 'react-dom'
import React, { useState, useEffect } from 'react'
// A React renderer for Three-js: https://github.com/drcmda/react-three-fiber
import { Canvas } from 'react-three-fiber'
// A React x-platform animation library: https://github.com/react-spring/react-spring
import { useTransition, useSpring, a } from 'react-spring/three'
import { svgs, colors, deg, doubleSide } from './resources/helpers'
import './resources/cards.css'
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';

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

class Button extends React.Component {
  render() {
    return (
      <button className="button button-primary">
        <i className="fa fa-chevron-right"></i> Find out more
      </button>
    )
  }
}

class CardHeader extends React.Component {
  render() {
    const { image } = this.props;
    var style = {
        backgroundImage: 'url(' + image + ')',
    };
    return (
      <header style={style} id={this.props.prefix + '-header'} className="card-header">
      </header>
    )
  }
}


class CardBody extends React.Component {
  render() {
    return (
      <div className="card-body" id={this.props.prefix + '-body'}>
        <h2 id={this.props.prefix + '-title'}>{this.props.title}</h2>
      </div>
    )
  }
}

class Card extends React.Component {
  render() {
    return (
        <article className="card-container" id={this.props.prefix + '-container'}>
          <a className="card-link" href={this.props.href}>
            <div className="card" id={this.props.prefix + '-card'}>
              <CardHeader image={this.props.image} prefix={this.props.prefix}/>
              <CardBody title={this.props.title} prefix={this.props.prefix}/>
            </div>
          </a>
        </article>
    )
  }
}

/** Main component */
function App() {

  var graphicCard =
    <Card
      title="Graphic Resume"
      image="https://ryaperry-bucket.s3-us-west-2.amazonaws.com/preview_graphic.02.png"
      href="/graphic-resume"
      prefix="graphic"
    ></Card>

  var professionalCard =
    <Card
      title="Professional Resume"
      image="https://ryaperry-bucket.s3-us-west-2.amazonaws.com/preview_professional.02.png"
      href="/professional-resume"
      prefix="professional"
    ></Card>

  var card0;
  var card1;
  if (Math.random() < 0.5) {
    card0 = graphicCard;
    card1 = professionalCard;
  } else {
    card0 = professionalCard;
    card1 = graphicCard;
  }

  return (
    <div className="main">
      <div className="landing">
        <Canvas invalidateFrameloop camera={{ fov: 90, position: [0, 0, 1800], rotation: [0, deg(-20), deg(180)], near: 0.1, far: 20000 }}>
          <ambientLight intensity={0.5} />
          <spotLight intensity={0.5} position={[300, 300, 4000]} />
          <Scene />
        </Canvas>
        <span className="header">HI, <br/>I'M RYAN</span>
      </div>
      <div className="resume-container">
        <div className="resumes">
          <h1 className="choose-resume">
          Choose a Resume
          </h1>
          { card0 }
          { card1 }
        </div>
      </div>
      <div className="resume-container">
        <div className="resumes">
          <h1 className="choose-resume">
          Blog
          </h1>

          <blockquote class="embedly-card" id="snaplens">
            <h4>
              <a href="https://medium.com/better-marketing/how-to-make-a-joker-snapchat-lens-in-5-steps-1e4f248599e4">How To Make a "Joker" Snapchat Lens in 5 Steps</a>
            </h4>
            <p>And the case for why Snapchat lenses will become a bigger part of marketing strategies</p>
          </blockquote>

          <blockquote class="embedly-card" id="jon-snow">
            <h4>
              <a href="https://medium.com/better-programming/i-a-b-tested-resume-formats-which-jon-snow-gets-hired-cd206f62d15a">I A/B Tested Resume Formats: Which Jon Snow Gets Hired?</a>
            </h4>
            <p>Does colorful and graphic beat plain and professional?</p>
          </blockquote>

          <blockquote class="embedly-card" id="bootcamp-reflection">
            <h4><a href="https://medium.com/better-programming/2-years-later-was-my-bootcamp-worth-it-ab65de0e06e2">Two Years Later... Was My Coding Bootcamp Worth It?</a></h4>
              <p>My personal experience of learning to code in a bootcamp</p>
          </blockquote>
        </div>
      </div>
    </div>
  )
}

function ProfessionalResume() {
  return(
    <iframe
      src="http://docs.google.com/gview?url=https://ryaperry-bucket.s3-us-west-2.amazonaws.com/professional_resume.11.pdf&embedded=true"
      style={{ width: "100%", height:"100%", style:"border: none;"}}>
    </iframe>
  )
}

function GraphicResume() {
  return(
    <iframe
      src="http://docs.google.com/gview?url=https://ryaperry-bucket.s3-us-west-2.amazonaws.com/resume_37.pdf&embedded=true"
      style={{ width: "100%", height:"100%", style:"border: none;"}}>
    </iframe>
  )
}

const NoMatch = () => (
    <div>
        <h2>Whoops</h2>
        <p>Sorry but {window.location.pathname} didn’t match any pages</p>
    </div>
);

function FinalApp() {
  return(
    <Router>
      <Switch>
        <Route exact path="/" component={App}></Route>
        <Route exact path="/professional-resume" component={ProfessionalResume}></Route>
        <Route exact path="/graphic-resume" component={GraphicResume}></Route>
        <Route component={NoMatch} />
      </Switch>
    </Router>
  )
}

ReactDOM.render(<FinalApp />, document.getElementById('root'))
