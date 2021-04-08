import * as THREE from 'three'
import flatten from 'lodash-es/flatten'
import { SVGLoader as loader } from './SVGLoader'
import './styles.css'

const doubleSide = THREE.DoubleSide
const deg = THREE.Math.degToRad
const colors = ['#21242d', '#ea5158', '#0d4663', '#ffbcb7', '#2d4a3e', '#8bd8d2']
const svgs = ['night', 'city', 'tubes', 'woods', 'beach']
  // .map(name => `https://raw.githubusercontent.com/drcmda/react-three-fiber/master/examples/src/resources/images/svg/${name}.svg`)
  // .map(name => `./${name}.svg`)
  .map(name => `https://raw.githubusercontent.com/Rperry2174/NewPortfolioSite/master/src/resources/${name}.svg`)
  .map(
    url =>
      new Promise(resolve =>
        new loader().load(url, shapes =>
          resolve(flatten(shapes.map((group, index) => group.toShapes(true).map(shape => ({ shape, color: group.color, index })))))
        )
      )
  )

export { svgs, colors, deg, doubleSide }
