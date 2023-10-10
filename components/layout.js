import Nav from "./nav"
import Head from 'next/head'
import React, {useEffect, useState} from "react"
import Image from "./image"
import ReactMarkdown from "react-markdown";

const Layout = ({ children, global, festival}) => {

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(function() {
       setLoading(false)
    }, 100);
  }, []);
  
  return(
    <>
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
            <p>{festival.attributes.prefooter.title}</p>
            <div className="logos">
              {festival.attributes.prefooter.logos.data.map((logo, i) => {
                return(
                  <div className="logo">
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
            <p>{global.attributes.prefooter.title}</p>
            <div className="logos">
              {global.attributes.prefooter.logos.data.map((logo, i) => {
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
      {global.attributes.footer_links.map((link, i) => {
        return (
          <a href={'/'+link.slug} key={'link'+i} className="menu-link">
            {link.title}
          </a>
        )
      })}
    </footer>
    </>
  )
}

export default Layout
