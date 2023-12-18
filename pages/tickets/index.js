import React, {useEffect, useState} from "react"
import ReactMarkdown from "react-markdown";
import Layout from "../../components/layout"
import { fetchAPI } from "../../lib/api"
import Modal from 'react-modal';


const Tickets = ({global, tickets, festival, params }) => {

  const modalStyles = {
    overlay: {
      backgroundColor: 'transparent',
    },
  };

  console.log(tickets)

  return (
    <section className="festival-wrapper tickets">
      <Layout page={params} global={global} festival={festival}>
          <div className="title-wrapper">
            <h1 className="page-title">Tickets</h1>
          </div>
          <div className="info-wrapper">
            {tickets.map((ticket, i) =>{
              return(
                ticket.__component == 'biennial.info' &&
                  <div className="ticket-info">
                    <ReactMarkdown 
                      children={ticket.text} 
                    />
                  </div>
              )
            })}
          </div>
          <div className="tickets-container">
            {tickets.map((ticket, i) =>{
              const [show, setShow] = useState(false);

              const handleClose = () => setShow(false);
              const handleShow = () => setShow(true);

              return(
                <>
                {ticket.__component == 'biennial.ticket' &&
                <>
                  {ticket.embed ?
                    <>
                    <div className={`ticket ${ticket.link ? '' : 'available-soon' } ${ticket.title.replace(/\s/g, '')}`}>
                        <div className="ticket-content">
                          <h3>
                            {ticket.title} <br/>
                            <ReactMarkdown children={ticket.subtitle}/>
                            <a href={`/programme/${ticket.programme_item.data?.attributes.slug}`}>Find out more</a>
                          </h3>
                          
                          <div className="price" onClick={handleShow}>
                            <span>Buy tickets</span>
                            <ReactMarkdown children={ticket.price}/>
                          </div>
                        </div>
                      </div>
                      
                      <Modal  isOpen={show} onHide={handleClose} className={`ticket-modal`} ariaHideApp={false} style={modalStyles}>
                        <div onClick={handleClose} className="close">
                          <svg width="36" height="34" viewBox="0 0 36 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <line x1="1" y1="-1" x2="44.6296" y2="-1" transform="matrix(0.715187 0.698933 -0.715187 0.698933 1.5 2)" stroke="black" strokeWidth="2" strokeLinecap="square"/>
                            <line x1="1" y1="-1" x2="44.6296" y2="-1" transform="matrix(0.715187 -0.698933 0.715187 0.698933 1.5 34)" stroke="black" strokeWidth="2" strokeLinecap="square"/>
                          </svg>
                        </div>
                        <iframe width="100%" height="100%" src={ticket.link} style={{'aspect-ratio': '1/1', 'border': 'none'}}/>
                      </Modal>
                    </>
                    :
                    <div className={`ticket ${ticket.link ? '' : 'available-soon' } ${ticket.title.replace(/\s/g, '')}`}>
                      <div className="ticket-content">
                        <h3>
                          {ticket.title} <br/>
                          <ReactMarkdown children={ticket.subtitle}/>
                          <a href={`/programme/${ticket.programme_item.data?.attributes.slug}`}>Find out more</a>
                        </h3>
                        
                        <a className="price" href={ticket.link} target="_blank">
                          <span>Buy tickets</span>
                          <ReactMarkdown children={ticket.price}/>
                        </a>
                      </div>
                    </div>
                  }
                </>
                }
                {ticket.__component == 'biennial.donate' &&
                  <a className={`ticket donate`} href={ticket.link} target="_blank">
                    <div className="ticket-content">
                      <h3>{ticket.title}</h3>
                    </div>
                  </a>
                }
                </>
              )
            })}
          </div>

      </Layout>
    </section>
  )
}

export async function getServerSideProps() {
  const params = {
		slug: "biennial-2024"
	}

  // Run API calls in parallel
  const [festivalRes, ticketsRes, globalRes] = await Promise.all([
    fetchAPI(`/biennials?filters[slug][$eq]=${params.slug}&populate[prefooter][populate]=*`),
    fetchAPI(`/biennials?filters[slug][$eq]=${params.slug}&populate[tickets][populate]=*`),
    fetchAPI("/global?populate[prefooter][populate]=*&populate[socials][populate]=*&populate[image][populate]=*&populate[footer_links][populate]=*&populate[favicon][populate]=*", { populate: "*" }),
  ])


  return {
    props: {
      festival: festivalRes.data[0],
      tickets: ticketsRes.data[0].attributes.tickets,
      global: globalRes.data,
      params: params,
    }
  }
}

export default Tickets
