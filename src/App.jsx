import React, {useEffect} from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import vertexShader from '../shaders/vertex.glsl?raw'
import fragmentShader from '../shaders/fragment.glsl?raw'
import atmosphereVertexShader from '../shaders/atmosphereVertex.glsl?raw'
import atmosphereFragmentShader from '../shaders/atmosphereFragment.glsl?raw'
import './App.css'
import { Float32BufferAttribute } from 'three'

const App = () => {

  useEffect( () => {
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      75,
      innerWidth / innerHeight,
      0.1,
      1000
    )
    const renderer =  new THREE.WebGLRenderer({
      antialias: true,
    })
    renderer.setSize(innerWidth, innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    document.body.appendChild(renderer.domElement) 
    
    // create a sphere
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(5, 50, 50), 
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          globeTexture: {
            value: new THREE.TextureLoader().load('../img/globe.jpeg')
          }
        }
      })
    )
    // add sphere to scene
    scene.add(sphere)
    
    // add atmosphere
    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(5, 50, 50),
      new THREE.ShaderMaterial({
        vertexShader: atmosphereVertexShader,
        fragmentShader: atmosphereFragmentShader,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide
      })
    )
    atmosphere.scale.set(1.1, 1.1, 1.1)
    scene.add (atmosphere)
    
    const group = new THREE.Group()
    group.add(sphere)
    scene.add(group)

    // background star
    const starGeometry = new THREE.BufferGeometry()
    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff
    })
    const starVertices = []
    for (let i = 0; i < 10000; i++) {
      const x = (Math.random() - 0.5) * 2000
      const y = (Math.random() - 0.5) * 2000
      const z = -Math.random() * 3000
      starVertices.push(x, y, z)
    }
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3))
    const stars = new THREE.Points(starGeometry, starMaterial)
    scene.add(stars)

    camera.position.z = 15

    const mouse = {
      x: undefined,
      y: undefined
    }

    // animate function
    function animate() {
      requestAnimationFrame(animate)
      renderer.render(scene, camera)
      sphere.rotation.y += 0.002
      gsap.to(group.rotation, {
        x: -mouse.y * 0.3,
        y: mouse.x * 0.5,
        duration: 2
      })
    }
    animate() 
    addEventListener('mousemove', () => {
      mouse.x = (event.clientX / innerWidth)   * 2 - 1
      mouse.y = -(event.clientY / innerHeight) * 2 + 1
    })

  })


  return(
    <div />
  )
}

export default App
