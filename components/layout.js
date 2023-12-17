import Nav from "./nav"
import Head from 'next/head'
import React, {useEffect, useState} from "react"
import Image from "./image"
import ReactMarkdown from "react-markdown";
import * as THREE from 'three';
import NewsletterSubscribe from "../components/NewsletterSubscribe";
import Modal from 'react-modal';



const Layout = ({ children, festival}) => {

  const [loading, setLoading] = useState(true);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const modalStyles = {
    overlay: {
      backgroundColor: 'transparent',
    },
  };

  useEffect(() => {
    setTimeout(function() {
       setLoading(false)

       $(".normal-image").each(function(){

        console.log("normal");
        
        let container, stats, loader;
        let camera, scene, renderer;
        let mesh;
        let directionalLight, pointLight, ambientLight;

        let mouseX = 0;
        let mouseY = 0;

        let targetX = 0;
        let targetY = 0;

        const windowHalfX = window.innerWidth / 2;
        const windowHalfY = window.innerHeight / 2;

        const wrapper = $(this);
        const video = $(this).find('video')[0];
        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load($(this).find("img").attr("src"));
        texture.encoding = THREE.sRGBEncoding;

        init();

        fpsInterval = 1000 / fps;
        then = Date.now();
        startTime = then;

        animate();

        function init() {

          console.log("init");

          const threeWapper = $("<div class='three-normal'></div>");
          threeWapper.hide();

          setTimeout(function(){
            threeWapper.fadeIn("slow");
          }, 2000);

          wrapper.append(threeWapper);

          container = threeWapper[0];

          camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 1000 );
          camera.position.z = 12;

          scene = new THREE.Scene();

          // LIGHTS

          ambientLight = new THREE.AmbientLight( 0xFFFFFF, 0.8);
          scene.add( ambientLight );

          //pointLight = new THREE.PointLight( 0xffffff, 10 );
          //pointLight.position.set( 0, 0, 6 );
          //scene.add( pointLight );

          directionalLight = new THREE.DirectionalLight( 0xffffff, 4.5 );
          directionalLight.position.set( 1, - 0.5, - 1 );
          scene.add( directionalLight );

          const normalMap = new THREE.VideoTexture( video );

          let material = new THREE.MeshStandardMaterial( {
            fog: false,
            map: texture,
            //specular: 0xFFFFFF, //Specular color of the material. Default is a Color set to 0x111111 (very dark grey).
            //shininess: 1000,  //How shiny the .specular highlight is; a higher value gives a sharper highlight. Default is 30.
            normalMap: normalMap,
            normalScale: new THREE.Vector2( 1, 1 ),
            //normalMapType: THREE.ObjectSpaceNormalMap,
          } );

          mesh = new THREE.Mesh(
            new THREE.PlaneGeometry(26, 14),
            material
          );

          scene.add( mesh );

          scene.background = null;

          renderer = new THREE.WebGLRenderer({
              //antialias: true,
              alpha: true
          });

          //renderer.setClearAlpha( 0 );
          //renderer.setClearColor( 0x000000, 0 ); // the default
          //renderer.outputColorSpace = THREE.SRGBColorSpace; // optional with post-processing

          renderer.setSize( window.innerWidth, window.innerHeight );
          container.appendChild( renderer.domElement );

          //stats = new Stats();
          //container.appendChild( stats.dom );
          ////wrapper.append(stats.dom);

          document.addEventListener( 'mousemove', onDocumentMouseMove );
          window.addEventListener( 'resize', onWindowResize );
        }

        function onWindowResize() {

          const width = window.innerWidth;
          const height = window.innerHeight;

          camera.aspect = width / height;
          camera.updateProjectionMatrix();

          renderer.setSize( width, height );
        }

        function onDocumentMouseMove( event ) {
          mouseX = ( event.clientX - windowHalfX );
          mouseY = ( event.clientY - windowHalfY );
        }

        var stop = false;
        var frameCount = 0;
        var $results = $("#results");
        var fps, fpsInterval, startTime, now, then, elapsed;

        fpsInterval = 30;

        function animate() {
          requestAnimationFrame( animate );

          // calc elapsed time since last loop
          now = Date.now();
          elapsed = now - then;

          // if enough time has elapsed, draw the next frame

          if (elapsed > fpsInterval) {

            // Get ready for next frame by setting then=now, but also adjust for your
            // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
            then = now - (elapsed % fpsInterval);

            // Put your drawing code here
            render();
            //stats.update();
          }
        }

        function render() {

          targetX = mouseX * .001;
          targetY = -1 * mouseY * .002;

          //console.log(mouseX, targetX, mouseY, targetY);

          if ( mesh ) {

            mesh.rotation.y = 0.2 * ( targetX - mesh.rotation.y );
            mesh.rotation.x = 0.2 * ( targetY - mesh.rotation.x );

            directionalLight.position.set( 1.5,  targetY, 1);
          }

          renderer.render( scene, camera );
        }

      });


      var closer = $("<div class='closer'>x</div>");

      closer.click(function(){
          $(this).closest(".closer-target").hide();
      });

      $("#imprint-content").addClass("closer-target").append(closer.clone(true));

      $("#imprint-link").click(function(e){
        e.preventDefault();
        $("#imprint-content").show();
      });  

      var scrollTop = 0;
      var randomNumber = Math.random();

      console.log(randomNumber);

      function setColoredBG() {
        if (randomNumber > 0.7) {
          console.log("case 1");

          $(".colored-bg-01").css({
            "transform":"translateY(" + Math.min(scrollTop * 0.5, 300) + "px scale(" + Math.min(scrollTop / 2000 + 0.5, 5) + ")",
            "background-color" : "#58de60",
            "box-shadow": "0px 0px 2rem 2rem #58de60"
          })

          $(".colored-bg-02").css({
            "transform":"translateY(" + (-1 * scrollTop * 0.5) + "px) scale(" + Math.max(-1 *scrollTop / 2000 + 0.5, 0.5) + ")",
          })
        }

        if (randomNumber <= 0.7 && randomNumber > 0.3) {
          console.log("case 2");
          $(".colored-bg-01").css({
            "transform":"translateY(" + -1 * Math.min(scrollTop * 0.5, 300) + "px)"
          })

          $(".colored-bg-02").css({
            "transform":"translateY(" + (scrollTop * 0.5) + "px) scale(" + Math.min(scrollTop / 2000 + 0.5, 5) + ")",
          })
        }

        if (randomNumber <= 0.3) {
          console.log("case 3");
          $(".colored-bg-01").css({
            "transform":"translateY(" + Math.min(scrollTop * 0.5, 300) + "px)"
          })

          $(".colored-bg-02").css({
            "transform":"translateY(" + (-1 * scrollTop * 0.5) + "px))",
          })
        }
      }

      setColoredBG();
      setTimeout(function(){
        setColoredBG();
      }, 10);

      $(window).scroll(function() {

        console.log($(window).scrollTop());

        scrollTop = $(window).scrollTop();

        $("#title-1-sonic, #title-1-sonic-mobile").css({
            "transform":"translate(-50%, calc(-50% - " + scrollTop * 0.4 + "px))"
        })

        $("#title-2-acts, #title-2-acts-mobile").css({
            "transform":"translate(-50%, calc(-50% - " + scrollTop * 0.8 + "px))"
        })


        $("#svg-biennial").css({
            "transform":"translateY(" + scrollTop * 0.4 + "px)"
        })

        $("#svg-2024").css({
            "transform":"translateY(" + scrollTop * 0.8 + "px)"
        })


        $("#svg-bottom-table").css({
            "transform":"translateY(" + scrollTop * 0.5 + "px)"
        })

        $("#background-1, #normal-01").css({
            "opacity": 1 - scrollTop/120
        })

        $("#background-bottom").css({
            "transform":"translateY(" + -1 * Math.min(scrollTop, $(window).width()*0.4) + "px)"
        })

        setColoredBG();

        var maxScroll = $(window).width() * 0.1;
        var maxScale = $(window).width() * 0.17; //how small it gets, the smaller the number the smaller

        if (
            scrollTop > ($("#intro-wrapper").outerHeight() + $("#curatorial-statement").outerHeight() - $(window).height())
            || scrollTop < $(window).height()/2
        ) {
            $(".background-layer-1").fadeOut();
        } else {

            $(".background-layer-1").fadeIn();
        }
      })


    }, 100);



  }, []);
  
  return(
    <>


    <div id="b-2024" class="hide-at-pageload visible">
            <div id="b-2024-inner">
                <div id="svg-biennial">
                  <svg version="1.1" id="Ebene_1" x="0px" y="0px" viewBox="0 0 5055.6 523.9">

                  <g id="bottom-biennial">
                    <path id="bottom-biennial-3" class="st321408h124" d="M1314.9,160.2V498 M1271.8,498c-1-13-2.1-25-2.1-46.2V333.2c0-50.1-30.3-70.3-80-70.3
                      c-42.1,0-72.9,22.2-85.7,41.9 M1261.8,355.9c0,0-37.7-2.9-65.4-2.9c-52.3,0-101.1,23.1-101.1,74.7c0,48.7,25.4,74.2,81.6,74.2
                      s88.4-28.9,88.4-28.9 M1064,232.1v-71.9 M1064,498V267.2 M655.1,266.7V498 M815.7,498V332.3c0-40.5-26.9-68.9-80.8-68.9
                      c-15.8,0-34.7,5.5-50.7,14.1l-24.1,17.7 M421.2,381.9h198.3c0,0,0.5-10.1,0-15.4c-5.1-64.1-42.6-103.1-101.1-103.1
                      c-63.1,0-106.2,47.2-106.2,119.5c0,71.8,42.6,119.9,106.2,119.9 M518.4,502.8c50.3,0,88.8-30.8,99-80 M378.4,232.1v-71.9
                      M378.4,498V267.2 M73.6,306.4h188.6c29.5,0,60.8-25.7,60.8-69c0-44.6-34.8-76.6-96.4-76.6h-153V498H206
                      c75.9,0,129.3-32.8,129.3-105c0-48-29.4-86.6-73.1-86.6"></path>
                    <line id="bottom-biennial-2" class="st321408h124" x1="857.9" y1="266.7" x2="857.9" y2="498"></line>
                    <path id="bottom-biennial-1" class="st321408h124" d="M1018.5,498V332.3c0-40.5-26.9-68.9-80.8-68.9c-15.8,0-34.7,5.5-50.7,14.1l-24.1,17.7"></path>
                  </g>
                  </svg>

              </div>


              <div id="svg-2024">

                  <svg version="1.1" id="Ebene_1" x="0px" y="0px" viewBox="0 0 5055.6 523.9">
                  <g id="bottom-2024">
                    <path id="bottom-2024-2" class="st012308912h3" d="M4970.2,495.5V168h-23.3l-159.6,239.5l11,17.8h233.4 M4421.9,502.8
                      c76.4,0,131.9-59.7,131.9-168.6c0-107.9-50.8-168.6-131.9-168.6c-81.6,0-132.9,60.7-132.9,168.6
                      C4289,443,4344.9,502.8,4421.9,502.8 M4018.5,266.3c10.3-58.3,60.3-100.7,123.6-100.7c88.8,0,114.4,53.9,114.4,96.8
                      c0,53.5-35.9,61.4-131.3,99.2s-102.4,67.1-119.3,117.7L4020,498h236"></path>
                    <path id="bottom-2024-1" class="st012308912h3" d="M4586.5,266.3c10.3-58.3,60.3-100.7,123.6-100.7c88.8,0,114.4,43.9,114.4,86.8
                      c0,53.5-35.9,71.4-131.3,109.2s-102.4,67.1-119.3,117.7L4588,498h236"></path>
                  </g>
                  </svg>
                                
              </div>

              <div id="svg-bottom-table">

                  <svg version="1.1" id="Ebene_1" x="0px" y="0px" viewBox="0 0 5055.6 523.9">

                  <g id="bottom-biennial-table">
                    <line id="bottom-biennial-table-6" class="st1as9213h" x1="21.2" y1="56.5" x2="5031.7" y2="56.5"></line>
                    <line id="bottom-biennial-table-5" class="st21203912jh3" x1="21.2" y1="524.2" x2="21.2" y2="56.5"></line>
                    <line id="bottom-biennial-table-4" class="st1as9213h" x1="837.8" y1="524.2" x2="837.8" y2="56.5"></line>
                    <line id="bottom-biennial-table-3" class="st1as9213h" x1="4042.7" y1="524.2" x2="4042.7" y2="56.5"></line>
                    <line id="bottom-biennial-table-2" class="st1as9213h" x1="5031.7" y1="524.2" x2="5031.7" y2="56.5"></line>
                    <line id="bottom-biennial-table-1" class="st1as9213h" x1="21.2" y1="377.7" x2="4042.7" y2="377.7"></line>
                  </g>
                  </svg>


              </div>
          </div>
    </div>

    <div className="colored-bg-01"></div>
    <div className="colored-bg-02"></div>

    <div id="social-homelink">

      <div id="social-homelink-inner">
        <div class="social-channel">
            <a href="https://www.instagram.com/sonicacts" target="_blank" class="social-item">
                
                <svg id="Layer_2" viewBox="0 0 48.39 48.39"><g id="design"><g><path d="M29.86,12.65h-11.33c-3.23,0-5.85,2.62-5.85,5.85v11.33c0,3.23,2.62,5.85,5.85,5.85h11.33c3.23,0,5.85-2.63,5.85-5.85v-11.33c0-3.23-2.63-5.85-5.85-5.85Zm-5.55,18.5c-3.85,0-6.99-3.13-6.99-6.99s3.13-6.99,6.99-6.99,6.99,3.13,6.99,6.99-3.13,6.99-6.99,6.99Zm7.39-12.78c-.92,0-1.66-.74-1.66-1.66s.74-1.66,1.66-1.66,1.66,.74,1.66,1.66-.74,1.66-1.66,1.66Z"></path><path d="M24.31,19.69c-2.47,0-4.48,2.01-4.48,4.47s2.01,4.48,4.48,4.48,4.47-2.01,4.47-4.48-2.01-4.47-4.47-4.47Z"></path><path d="M24.19,0C10.83,0,0,10.83,0,24.19s10.83,24.19,24.19,24.19,24.19-10.83,24.19-24.19S37.56,0,24.19,0Zm14.18,29.82c0,4.7-3.82,8.52-8.52,8.52h-11.33c-4.7,0-8.52-3.82-8.52-8.52v-11.33c0-4.7,3.82-8.52,8.52-8.52h11.33c4.7,0,8.52,3.82,8.52,8.52v11.33Z"></path></g></g>
                    
                </svg>
            </a>

            <a href="https://t.me/sonicacts" target="_blank" class="social-item">
                
                <svg id="Layer_2" viewBox="0 0 48.39 48.4"><g id="design"><path d="M24.19,0c13.36,0,24.19,10.84,24.19,24.2,0,13.36-10.84,24.2-24.19,24.2C10.82,48.4-.02,37.53,0,24.15,.02,10.82,10.86,0,24.19,0Zm-.33,31.87c.18,.13,.33,.22,.47,.33,1.82,1.34,3.63,2.69,5.46,4.02,1.08,.79,1.98,.44,2.3-.85,.01-.05,.02-.1,.03-.14,1.23-5.78,2.46-11.56,3.68-17.35,.16-.76,.3-1.54,.29-2.3,0-.74-.65-1.13-1.38-.98-.21,.04-.41,.11-.6,.19-5.24,2.02-10.48,4.04-15.72,6.07-2.53,.98-5.06,1.95-7.58,2.94-.45,.18-.97,.41-.93,1,.04,.56,.59,.69,1.03,.83,1.81,.58,3.63,1.13,5.43,1.7,.31,.1,.54,.07,.81-.1,1.82-1.16,3.65-2.31,5.48-3.46,2.61-1.64,5.22-3.29,7.84-4.93,.31-.2,.62-.42,1.14-.19-.18,.2-.31,.39-.47,.54-3.53,3.2-7.06,6.4-10.61,9.58-.28,.25-.4,.52-.42,.88-.05,.99-.13,1.98-.2,2.97-.06,.87-.11,1.74-.16,2.61,.52,.07,.83-.18,1.13-.47,.98-.95,1.97-1.89,2.99-2.88Z"></path></g>
                    
                </svg>
            </a>
            
            <a href="https://www.youtube.com/channel/UCOt0sGccfLogAmEJyOxRINQ" target="_blank" class="social-item">
                <svg fill="#000000" version="1.1" id="Capa_1" width="800px" height="800px" viewBox="0 0 97.75 97.75">
                  <g>
                    <g>
                      <path d="M39.969,59.587c7.334-3.803,14.604-7.571,21.941-11.376c-7.359-3.84-14.627-7.63-21.941-11.447
                        C39.969,44.398,39.969,51.954,39.969,59.587z"></path>
                      <path d="M48.875,0C21.883,0,0,21.882,0,48.875S21.883,97.75,48.875,97.75S97.75,75.868,97.75,48.875S75.867,0,48.875,0z
                        M82.176,65.189c-0.846,3.67-3.848,6.377-7.461,6.78c-8.557,0.957-17.217,0.962-25.842,0.957c-8.625,0.005-17.287,0-25.846-0.957
                        c-3.613-0.403-6.613-3.11-7.457-6.78c-1.203-5.228-1.203-10.933-1.203-16.314s0.014-11.088,1.217-16.314
                        c0.844-3.67,3.844-6.378,7.457-6.782c8.559-0.956,17.221-0.961,25.846-0.956c8.623-0.005,17.285,0,25.841,0.956
                        c3.615,0.404,6.617,3.111,7.461,6.782c1.203,5.227,1.193,10.933,1.193,16.314S83.379,59.962,82.176,65.189z"></path>
                    </g>
                  </g>
                </svg>
            </a>
        </div>

        <div class="newsletter" onClick={handleShow}>
            Newsletter
        </div>
      </div>
      
      <div id="sa-logo">
          <a href="https://sonicacts.com/">
                <svg version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 200 200">
                  <g id="sa-logo-svg">
                    <path d="M100,0C44.77,0,0,44.77,0,100c0,55.23,44.77,100,100,100c55.23,0,100-44.77,100-100C200,44.77,155.23,0,100,0z
          M79.79,111.94c-3.45,0.87-6.96,1.31-10.52,1.31c-9,0-16.23-2.2-21.67-6.6c-5.58-4.61-8.97-11.2-10.15-19.79
          c-0.35-2.65-0.52-5.02-0.52-7.12h2.09c0,0.91,0.14,3.18,0.42,6.8c1.19,8.17,4.36,14.31,9.53,18.42c5.09,4.12,11.86,6.18,20.31,6.18
          c3.42,0,6.77-0.42,10.05-1.26c3.28-0.84,6.18-1.99,8.69-3.45c6.98-4.26,10.47-10.29,10.47-18.11c0-3.91-0.99-7.38-2.95-10.41h-2.18
          c2.23,2.95,3.35,6.42,3.35,10.41c0,3.49-0.82,6.63-2.46,9.42c-1.64,2.79-4.03,5.17-7.17,7.12c-2.37,1.4-5.11,2.48-8.22,3.25
          c-3.11,0.77-6.3,1.15-9.58,1.15c-4.12,0-7.68-0.49-10.68-1.47c-3-0.91-5.83-2.37-8.48-4.4c-2.44-1.95-4.43-4.4-5.97-7.33
          c-1.54-3.07-2.51-6.39-2.93-9.94c-0.21-1.6-0.31-3.73-0.31-6.39h2.09c0,2.65,0.1,4.68,0.31,6.07c0.84,6.98,3.56,12.28,8.17,15.91
          c2.16,1.75,4.75,3.11,7.75,4.08c2.93,0.91,6.28,1.36,10.05,1.36c3.14,0,6.16-0.37,9.06-1.1c2.9-0.73,5.46-1.76,7.69-3.09
          c2.79-1.67,4.92-3.75,6.39-6.23c1.47-2.48,2.2-5.29,2.2-8.43c0-3.28-0.84-6.11-2.51-8.48c-0.48-0.67-1-1.31-1.57-1.93h-2.63
          c3.15,2.74,4.72,6.21,4.72,10.41c0,2.79-0.65,5.29-1.94,7.48c-1.29,2.2-3.19,4.03-5.71,5.5c-2.02,1.26-4.41,2.23-7.17,2.93
          c-2.76,0.7-5.6,1.05-8.53,1.05c-6.98,0-12.53-1.64-16.64-4.92c-4.26-3.49-6.74-8.51-7.43-15.07c-0.14-0.98-0.21-2.83-0.21-5.55
          h2.09c0,2.03,0.07,3.8,0.21,5.34c0.63,6,2.86,10.54,6.7,13.61c3.77,3,8.86,4.5,15.28,4.5c2.72,0,5.36-0.31,7.9-0.94
          c2.55-0.63,4.8-1.53,6.75-2.72c4.4-2.65,6.6-6.39,6.6-11.2c0-4.19-1.88-7.54-5.65-10.05c-0.19-0.12-0.38-0.24-0.57-0.36H80.3
          c1.28,0.54,2.38,1.11,3.3,1.72c3.42,2.16,5.13,5.06,5.13,8.69c0,2.09-0.49,3.94-1.47,5.55c-0.91,1.54-2.34,2.9-4.29,4.08
          c-1.75,1.12-3.82,1.95-6.23,2.51c-2.41,0.56-4.9,0.84-7.48,0.84c-12.42,0-19.16-5.58-20.2-16.75c-0.07-0.56-0.1-2.16-0.1-4.82h2.09
          c0,2.58,0.03,4.12,0.1,4.61c0.42,5.1,2.16,8.86,5.23,11.31c3,2.37,7.29,3.56,12.88,3.56c5.16,0,9.39-1.01,12.67-3.04
          c3.14-1.88,4.71-4.5,4.71-7.85c0-2.86-1.36-5.16-4.08-6.91c-2.1-1.3-5.09-2.47-8.99-3.5h6.38c-2.35-0.97-5.29-1.83-8.8-2.57
          l-8.9-2.09c-5.93-1.47-10.64-3.66-14.13-6.59c-4.68-3.84-7.01-8.79-7.01-14.87c0-3.42,0.8-6.49,2.41-9.21
          c1.6-2.72,3.94-4.95,7.01-6.7c2.3-1.32,4.95-2.36,7.96-3.09c3-0.73,6.14-1.1,9.42-1.1c7.54,0,13.78,1.75,18.74,5.23
          c3.07,2.16,5.51,4.66,7.33,7.48c1.81,2.83,2.93,5.91,3.35,9.26c0.28,2.37,0.42,4.54,0.42,6.49h-2.09c0-1.88-0.14-3.94-0.42-6.18
          c-0.42-3.49-1.55-6.49-3.4-9c-1.85-2.51-3.96-4.61-6.33-6.28c-4.68-3.28-10.54-4.92-17.59-4.92c-3.07,0-6.04,0.35-8.9,1.05
          c-2.86,0.7-5.34,1.64-7.43,2.83c-5.58,3.35-8.37,8.06-8.37,14.13c0,5.37,2.09,9.81,6.28,13.29c3.21,2.79,7.64,4.82,13.29,6.07
          l8.9,2.09c5.75,1.32,10.05,2.87,12.91,4.67h3.14c-0.5-0.42-1.03-0.83-1.6-1.21c-3.42-2.23-8.1-3.98-14.03-5.23l-8.9-2.09
          c-5.23-1.26-9.42-3.17-12.56-5.76c-3.7-3.14-5.55-7.08-5.55-11.83c0-2.65,0.66-5.06,1.99-7.22c1.32-2.16,3.14-3.91,5.44-5.23
          c4.12-2.37,9.25-3.56,15.39-3.56c6.77,0,12.28,1.5,16.54,4.5c2.23,1.54,4.2,3.49,5.91,5.86c1.71,2.37,2.74,5.2,3.09,8.48
          c0.21,2.72,0.31,4.57,0.31,5.55h-2.09c0-0.63-0.1-2.41-0.31-5.34c-0.56-5.23-3.28-9.53-8.17-12.88c-3.84-2.72-8.93-4.08-15.28-4.08
          c-5.79,0-10.57,1.08-14.34,3.25c-4.26,2.58-6.39,6.14-6.39,10.68c0,4.05,1.6,7.47,4.82,10.26c2.72,2.3,6.6,4.05,11.62,5.23
          l8.9,2.09c3,0.7,5.71,1.47,8.11,2.3c2.41,0.84,4.62,1.92,6.65,3.25c1.35,0.91,2.52,1.91,3.5,2.99h2.37
          c-1.5-1.94-3.49-3.67-5.97-5.19c-3.56-2.16-8.31-3.87-14.24-5.13l-8.9-2.09c-4.68-1.19-8.27-2.83-10.78-4.92
          c-2.79-2.3-4.19-5.23-4.19-8.79c0-3.84,1.81-6.84,5.44-9c3.42-2.02,7.89-3.04,13.4-3.04c5.86,0,10.61,1.26,14.24,3.77
          c4.4,3.07,6.87,7.05,7.43,11.93c0.07,0.84,0.1,2.41,0.1,4.71h-2.09c0-2.23-0.04-3.77-0.1-4.61c-0.42-4.12-2.58-7.57-6.49-10.36
          c-3.42-2.23-7.78-3.35-13.09-3.35c-5.17,0-9.28,0.91-12.35,2.72c-2.93,1.75-4.4,4.15-4.4,7.22c0,2.79,1.15,5.2,3.45,7.22
          c2.16,1.88,5.48,3.35,9.94,4.4l8.9,2.09c5.79,1.19,10.71,3,14.76,5.44c3.26,1.99,5.76,4.31,7.49,6.97h2.44
          c1.61,2.91,2.42,6.38,2.42,10.41c0,4.26-0.98,8.08-2.93,11.46c-1.95,3.39-4.82,6.19-8.58,8.43
          C86.33,109.83,83.24,111.07,79.79,111.94z M148.38,159.74l-8.37-21.46h-30.15l-8.37,21.46h-2.2l9.11-23.55h33.08l9.21,23.55H148.38
          z M152.57,159.74l-9.84-25.33h-35.7l-9.84,25.33h-2.3l14.65-37.58h-1.93L93,159.74h-2.3l14.61-37.58h1.98l14.6-37.58h5.55
          l14.76,37.58h-2.09l14.75,37.58H152.57z M156.96,159.74l-14.71-37.58h1.98L128.7,82.48h-7.96l-15.43,39.68h-2.24l16.2-41.77h10.89
          l16.31,41.77h-2.03l14.72,37.58H156.96z"></path>
        <polygon points="139.96,122.16 126.08,86.67 123.36,86.67 109.58,122.16 111.65,122.16 124.72,88.55 137.87,122.16 135.92,122.16 
          139.17,130.43 110.69,130.43 113.89,122.16 115.86,122.16 124.72,99.34 133.67,122.16 131.45,122.16 124.72,105.09 118.08,122.16 
          116.12,122.16 113.73,128.33 136.13,128.33 133.7,122.16 135.65,122.16 124.72,94.31 113.87,122.16 111.82,122.16 107.87,132.31 
          141.89,132.31 137.91,122.16"></polygon>
              </g>
            </svg>
          </a>
      </div>
    </div>

    <div id="table-top" class="table hide-at-pageload visible">
      <div class="table-wrapper">
        <div class="table-row">
          <div class="table-col table-col-left">
                  <span class="table-item">Paradiso</span><span class="table-item">Muziekgebouw</span>
              </div>
              <div class="table-col table-col-right">
                  <span class="table-item"></span><span class="table-item">BIMHUIS</span>
              </div>
          </div>
          <div class="table-row">
              <div class="table-col table-col-left">
              EYE FILMMUSEUM
              </div>
              <div class="table-col table-col-right">
                  <span class="table-item">STEDELIJK MUSEUM</span><span class="table-item">W139</span>
              </div>
          </div>
          <div class="table-row">
              <div class="table-col table-col-left">
                  <span class="table-item">LOOIERSGRACHT 60</span>
                  <span class="table-item">&nbsp;</span>
              </div>
              <div class="table-col table-col-right">
                  <span class="table-item">ZONE2SOURCE</span><span class="table-item">OUDE KERK</span>
              </div>
          </div>
          <div class="table-row">
              <div class="table-col table-col-left">
                  <span class="table-item">GARAGE NOORD&nbsp;&nbsp;KANAAL40</span>
              </div>
              <div class="table-col table-col-right">
              <span class="table-item">OT301 </span><span class="table-item">Het HEM </span><span class="table-item">AND MORE</span>
              </div>
          </div>
      </div>
  </div>

    <div id="writing">
      <div id="character-01" class="character">
          <svg id="uuid-b1c833a3-0512-4877-8dc5-f092e6541fd2" viewBox="0 0 41.01 73.55">
            <path class="uuid-6590461a-5f48-48f2-83d8-bc23cc1e4639" d="M28.53,6.5l-.16-.04s.08,.02,.12,.04c.04,0,.09,.02,.13,.03l-.09-.02Z"></path><path class="uuid-6590461a-5f48-48f2-83d8-bc23cc1e4639" d="M38.23,10.01c2.6-.69,1.75-4.87-.69-5.15-2.28,.05-4.2,.14-6.55,.99-.85,.28-1.61,.98-2.51,.64-3.43-.78-6.92-1.26-10.4-1.74-.64-6.7-6.48-2.96-9.35-.1-2.4,2.95-3.21,6.82-4.88,10.18-1.78,3.87-3.44,11.38-2.67,15.55,1.74,4.83,4.64,9.41,9.32,11.87,1.99,2.54,5.58,2.92,7.75,5.36-1.67,2.67-5.92,1.27-8.31,4.57-1.53,1.84-1.64,4.98,.34,6.54,2.2,1.17,4.9,1.06,7.3,1.67,2.31,.25,3.72-1.87,3.94-3.93,1.05-1.92,2.12-3.87,3.45-5.6,4.69,.68,9.77-6.02,11.63-9.77,.69-2.28-.3-5.12-2.75-5.8-2.31-.49-4.4,1.48-6.51,2.23-2.12,1.34-2.74,4.1-4.48,5.86-2.81-3.14-6.82-4.49-9.87-7.17-2.1-1.29-4.3-2.98-5.06-5.41,.35,0,.71-.07,1.03-.25,.53-.29,.91-.77,1.12-1.32h0c.31-.85,.67-1.85,1.66-2.06,3.75,3.36,6.69-1.38,11.09,3.56,1.73,.92,3.6,.08,4.97-1.06,4-1.36,6.97-5.26,6.83-9.54,2.49-1.58,5.28-3.86,4.38-7.22-.04-1.08-1.44-1.9-.77-2.91Zm-3.61,2.8c-2.56,.7-4.82,2.83-5.48,5.43-.34,1.28,.13,2.82-.99,3.78-1.79,1.39-3.98,2.02-5.49,3.84-6.08-.7-9.05-8.97-15.12-3.54,.64-4.01,2.89-7.57,4.27-11.37,5.52-.09,11.05,1.26,16.45,2.3,2.79,.72,4.43-1.94,6.66-2.94-.23,.81-.32,1.65-.32,2.49Z"></path><path class="uuid-6590461a-5f48-48f2-83d8-bc23cc1e4639" d="M22.03,63.47c-1.85-.96-4.24-1.27-5.97,.11-1.96,1.69-4.61,4.52-2.73,7.16,1.07,1.56,3.1,1.13,4.3-.03,1.99,1.03,3.93-.24,5.92-.52,2.56-1.2,4.94-3.57,6.1-6.17,.76-6.36-5.61-5-7.62-.56Z"></path></svg>
      </div>
      <div id="character-02" class="character">
          <svg id="uuid-06d0f966-aea6-459a-859a-2065e96c6a99" viewBox="0 0 56.7 67.15">
            <path class="uuid-b0b2b062-46f2-4156-8b3e-e107e8f15195" d="M53.87,25.92c-.99-2.8-3.71-3.46-6.09-3.33-4.94,.98-2.4-2.99-5.7-4.69-3.29-.42-10.79-.26-10.93,4.93-.73,.46-1.53,.76-2.33,1-4.01-2.02-8.13,.82-12.06,1.66,.54-2,1.44-3.86,2.44-5.59,4.24,.13,8.29-.99,12.48-1.47,7.16-.04,4.95-8,5.32-13.6-.63-8.12-8.82-1.09-12.14,.85-4.19,2.73-8.4,5.99-10.82,10.93-2.32-.01-4.64-.22-6.95-.31-.76,.11-1.18,1.18-1.07,1.97,.71,2.9,4.35,1.4,6.32,2.01-4.22,12.72,1.31,15.42,11.05,10.89,1.45-1.09,3.08-1.48,4.63-2.32,.96-.72,1.82-1.58,2.98-1.87,1.34-.38,2.88,.12,4.08-.88,1.47-.03,2.9-.65,4.37-.75,.9,3.04,3.99,3.18,5.8,1.14,2.25-.95,5.07-.85,5.84,2.21,.46,.74,1.24,1.07,2.01,1.09,.46,4.11-2.77,6.46-4.83,9.15-.44,.14-.86,.34-1.23,.68-.26,.24-.49,.5-.72,.76-1.29-5-6.07-3.03-8.69-.68-.82-5.14-6.56-4.14-8.66-.66-.61-4-4.44-3.65-6.87-2.12-3.07,1.41-6.07,2.95-8.76,5.19-2.33-2.59-6.17-3.51-9.34-3.31-5.02,1.32-2.96,7.72,.66,9.6-.12,4.95,2.97,7.49,6.09,3.29,1.15,1.49,2.92,1.99,4.44,2.82,1.07,4.09,1.18,10.79,5.75,11.66,1.47-.04,2.27-1.68,3.53-2.34,1.76-1.7,3.5-5.66,1.71-7.93-1.41-.97-2.77,.7-4.14,1.31-.7,.17-1.45,.27-1.99,.89-.83-3.4-.71-7.49-3.39-9.82,1.81-1.52,3.83-2.57,5.91-3.48-.1,3.81,3.22,7.2,5.85,3.66,1.54-1.51,.83-4.95,3.35-5.11-.76,1.26-1.56,2.48-2.39,3.67-1.86,2.56,.27,7.71,3.3,5.96,1-.57,1.41-1.9,2.24-2.71,1.79-1.69,3.89-2.84,5.84-4.23,.11,2.65-.34,6.21,1.95,7.81,2,1.26,3.86-1.04,4.62-3.01,2.03-5.39,3.42-3.81,4.36-10.14,2.75-3.03,6.24-11.7,2.21-14.8ZM22.77,15.88c3.21-2.85,6.99-4.68,10.21-7.54,.04,1.86,.38,3.68,.61,5.51-1.79,1.24-3.99,.7-6,1.19-1.66,.36-3.25,1.1-4.97,.97,.05-.05,.1-.09,.15-.14Z"></path></svg>
      </div>
      <div id="character-03" class="character">
          <svg id="uuid-7eb237d7-c0f5-4f03-93fb-cb0d39abb13a" viewBox="0 0 67.85 52.28">
            <path class="uuid-88529e8a-2dde-4d6f-89a8-d1f4d9c51930" d="M54.51,13.74c.11-.05,.22-.1,.33-.15-.12,.05-.21,.09-.31,.14,0,0-.02,0-.03,.01,0,0,0,0,0,0Z"></path><path class="uuid-88529e8a-2dde-4d6f-89a8-d1f4d9c51930" d="M64.55,15.65c.88-4.54,4.67-12.35-1.55-14.62-3.41-.46-4.29,3.75-7.05,4.9-9.68,5.13-17.88,12.49-27.63,17.49,.08-6.65-7.36-5.53-11.07-2.37-9.22-3.5-11.11,7.53-3.56,7.84,.55,1.02,1.55,1.58,2.59,1.69-2.79,1.87-5.28,4.2-6.36,7.43-.34,.17-.71,.26-1.08,.33-6.34-6.05-11.91,6.34-3.78,8.05,.34,.78,.68,1.56,1.02,2.34,.49,1.11,1.38,2.07,2.64,2.29,2.86,.46,4.65-2.91,3.8-5.32,6.5-3.45,.86-8.86,8.07-13.46,.27-.23,.43-.53,.51-.86,1.45,.76,3.52,.47,5.24,.19,4.99-.89,10.98,.86,15.21-2.42,0,0,0,0,0,0,1.51,1.94,3.23,4.05,5.81,4.52,2.32,.46,4.14-1.05,5.84-2.35,4.42-3.11,13.08-4.14,12.7-10.92-.09-1.69-1.71-3.06-1.36-4.74Zm-16.37,9.56c-1.8-2.04-3.59-4.72-6.56-5.04,4.11-2.37,8.34-4.44,12.69-6.35-.01,0-.03,.01-.04,.02-.1,.05-.2,.09-.3,.13,.2-.09,.38-.17,.56-.25,1.15-.5,2.3-1.02,3.45-1.54-.63,2.54-1.05,5.26,.02,7.75-3.29,1.71-6.88,2.95-9.82,5.27Z"></path></svg>
      </div>
      <div id="character-04" class="character">
          <svg id="uuid-a510a216-a807-4440-b1e7-6404a62e96a3" viewBox="0 0 54.88 47.2">
            <path class="uuid-215db198-64f2-4bde-8978-a068bdb72790" d="M49.29,14.34c-3.95,.92-8.11,1.12-11.96,2.39-2.51,1.23-1.85,4.15-1.5,6.38,.16,2.41-.65,4.77-.58,7.19-2.85,2.71-9.16,9.68-13.32,8.1-3.08-2.18-6.36-3.94-9.8-5.48-2.56-2.21-5.3-4.17-7.76-6.54,.63-4.36-.22-9.12,1.76-13.15,.37-.75,.71-1.47,1.08-2.11,.34,1.13,1.11,2.15,2.27,2.6,.07,1.68-.06,3.76,1.49,4.85-.48,1.17-.23,2.69,.81,3.47,3.45,1.81,4.99-3.89,6.42-6.07,2.47,.87,4.85-.02,7.3,.01,6.17,.55,5.83-5.44,2.18-8.68,1.23-2.2-.47-5.69-3.24-4.91-1.45-1.74-4.24-2.07-5.17,.37-1.84-.68-2.65,1.34-3.08,2.76-.95-1.25-2.27-1.75-3.46-1.56-.05-.05-.1-.11-.15-.17C8.24,.45,3.64,4.91,2.07,8.99c-1.59,2.6-1.12,5.67-.43,8.45,1.07,3.46-.28,7.13,.44,10.5,2.54,2.84,5.21,5.72,7.97,8.39,2.37,1.88,5.45,2.72,7.42,5.14,5.21,6.92,10.98,2.49,16.26-1.67-.4,1.99-.4,4.9,2.11,5.4,4.41,.23,3.45-7.39,4.91-10.3,1.43-.67,1.81-2.34,2.61-3.57,1-1.22,2.36-2.13,3.61-3.09,.66-.47,1.51-.15,2.24-.43,1.89-.66,2.44-3.27,1.47-4.89,3.55-2.26,4.04-9.12-1.39-8.59Z"></path></svg>
      </div>
      <div id="character-05" class="character">
          <svg id="uuid-d19d3269-b5fc-49cf-8b20-90329a826d5f" viewBox="0 0 63.56 35.89">
            <path class="uuid-502c1b12-c759-4bd7-9f86-ea80a5842130" d="M18.8,24.38c-2.08-.13-4,.9-6.03,1.17-3.41,.1-6.92-.72-10.2,.6-2.07,.57-3.06,3.77-.82,4.77,1.96,.2,3.98-.35,6.03,.16,.68,1.52,2.02,2.91,3.39,3.8,1.77,.66,3.23-1.29,3.09-2.92,2.46-.13,5.44-.17,7.2-2.15,1.59-2.13-.12-5.25-2.67-5.42Z"></path><path class="uuid-502c1b12-c759-4bd7-9f86-ea80a5842130" d="M61.38,21.7h0c-2.1-1.04-4.21,.76-6.29,.94-.12,.02-.25,.03-.37,.05,.31-2.24-.18-5.25-.64-6.57-1.24-3.74-3.32-7.36-6.11-10.15C45.04,1.15,41.47,.48,36.15,.89c-5.18-.35-6.69,1.84-10.84,3.99-4.33,2.16-8.57,4.73-11.57,8.61-9.46,10.45-.63,12.57-1.73,8.03,3.15-5.07,7.6-9.64,13.26-11.85,4.27-2.61,9.39-4.14,14.37-2.87,2.09-.04,3.26,1.26,4.33,2.9,1.9,1.96,3.46,4.15,4.62,6.64,1.16,1.97,.91,4.35,1.46,6.47-1.73-.04-3.45-.03-5.07,.53-3.53,1.55-1.1,7.9,2.46,5.47,.37-.01,.74,0,1.11,.01-.03,1.35,.24,2.79,1.17,3.82,2.88,2.45,4.7-1.38,4.66-3.97,1.77,0,3.45-.46,5.07-1.15,.9-.14,1.9-.23,2.53-.98,1.3-1.35,1.11-3.92-.58-4.86Z"></path></svg>
      </div>

    </div>

    <section className={`container ${festival?.attributes?.radio ? 'topbanner' : ''}`}>
      <>
      <Nav festival={festival}/>
        {loading ?
          <div className="loader"></div>
          :
          <>
            <div className={`loader ${loading}`}></div>
            {children}
          </>
        }
      </>
    </section>
    <footer className="footer">
    {festival && festival.attributes.prefooter ?
        <div className="prefooter">
          <div className="text-block medium">
            <p className="visually-hidden">{festival.attributes.prefooter.title}</p>
            <div className="logos">
              {festival.attributes.prefooter.logos.data.map((logo, i) => {
                let logoId = "logo-id-" + logo.id;
                return(
                  <div className="logo" id={logoId}>
                    <Image image={logo.attributes}/>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="text-block small">
            <ReactMarkdown 
              children={festival.attributes.prefooter.text} 
            />
          </div>
        </div>
        :
        <div className="prefooter prefooter-portal">
          <div className="text-block medium">
            <p className="visually-hidden">{festival?.attributes.prefooter?.title}</p>
            <div className="logos">
              {festival?.attributes.prefooter?.logos.data.map((logo, i) => {
                return(
                  <div className="logo">
                    <Image image={logo.attributes}/>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      }



      <div id="imprint-content" class="closer-target">
        <div class="imprint-inner">
          <p>
              <a href="https://www.knoth-renner.com/" target="_blank">Knoth &amp; Renner</a> teamed up with <a href="https://www.instagram.com/aeni.kaiser/" target="_blank">Anja Kaiser</a> for the identity and concept of this website, working with Janine Zielman on its development.
          </p>
          
          <p>
          Based on a deep appreciation for technology and its visual echo, the Berlin based design studio Knoth &amp; Renner work on the intersection of digital culture and graphic design.
          </p>
          <p>
          Anja Kaiser is a graphic designer and artist based in Leipzig. In her practice, she embraces the relational strategies of ‘dirty typography’ - disrupting, expanding, and joining forces between graphics and typography. 
          </p>
          <p>
              Typeface: Coda by <a href="https://annacairns.com/" target="_blank">Anna Cairns</a>
          </p>
          <p>
              Sonic Acts is responsible for all content published on this website.
          </p>
        </div>    
      </div>



      <div id="imprint-menu">  

        <div id="imprint-link" class="imprint-item">
          <a href="/about">Imprint</a>
        </div>
        <div class="imprint-item">
          <a href="https://sonicacts.com/policy" target="_blank">Privacy Policy</a>
        </div>
        <div class="imprint-item">
          <a href="https://sonicacts.com/cookies" target="_blank">Cookies</a>
        </div>
  
      </div>
    </footer>

    <Modal  isOpen={show} onHide={handleClose} className={`mail-modal`} ariaHideApp={false} style={modalStyles}>
        <div onClick={handleClose} className="close">
          <svg width="36" height="34" viewBox="0 0 36 34" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="1" y1="-1" x2="44.6296" y2="-1" transform="matrix(0.715187 0.698933 -0.715187 0.698933 1.5 2)" stroke="black" strokeWidth="2" strokeLinecap="square"/>
            <line x1="1" y1="-1" x2="44.6296" y2="-1" transform="matrix(0.715187 -0.698933 0.715187 0.698933 1.5 34)" stroke="black" strokeWidth="2" strokeLinecap="square"/>
          </svg>
        </div>
        <NewsletterSubscribe/>
      </Modal>
    </>
  )
}

export default Layout
