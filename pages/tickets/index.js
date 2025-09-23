import { BIENNIAL_SLUG } from "../../lib/constants"
import React, { useState } from "react"
import ReactMarkdown from "react-markdown";
import Layout from "../../components/layout"
import { fetchAPI } from "../../lib/api"
import Modal from 'react-modal';


const Tickets = ({global, tickets, festival, params }) => {
  const [openTicketId, setOpenTicketId] = useState(null);

  const modalStyles = {
    overlay: {
      backgroundColor: 'transparent',
    },
  };

  const getTicketKey = (ticket, index) => ticket?.id ?? `${ticket?.__component || 'ticket'}-${index}`;

  const openModal = (ticketId) => setOpenTicketId(ticketId);
  const closeModal = () => setOpenTicketId(null);

  return (
    <section className="festival-wrapper tickets">
      <Layout page={params} global={global} festival={festival}>
          <div className="title-wrapper">
            <h1 className="page-title">Tickets</h1>
          </div>
          <div className="info-wrapper">
            {tickets.map((ticket, i) => {
              if (ticket.__component !== 'biennial.info') {
                return null;
              }

              const key = getTicketKey(ticket, i);

              return (
                <div key={key} className="ticket-info">
                  <ReactMarkdown children={ticket.text} />
                </div>
              );
            })}
          </div>
          <div className="tickets-container">
            {tickets.map((ticket, i) => {
              const key = getTicketKey(ticket, i);

              if (ticket.__component === 'biennial.ticket') {
                const baseClasses = ['ticket'];
                if (!ticket?.link) {
                  baseClasses.push('available-soon');
                }
                if (ticket?.price === 'SOLD OUT') {
                  baseClasses.push('sold-out');
                }
                if (ticket?.title) {
                  baseClasses.push(ticket.title.replace(/\s/g, ''));
                }

                const className = baseClasses.join(' ');
                const programmeSlug = ticket.programme_item?.data?.attributes?.slug;
                const isModalOpen = openTicketId === key;

                return (
                  <React.Fragment key={key}>
                    <div className={className}>
                      <div className="ticket-content">
                        <h3>
                          {ticket.title} <br/>
                          <ReactMarkdown children={ticket.subtitle} />
                          {programmeSlug && <a href={`/programme/${programmeSlug}`}>Find out more</a>}
                        </h3>

                        {ticket.embed ? (
                          <div className="price" onClick={() => openModal(key)}>
                            <span>Buy tickets</span>
                            <ReactMarkdown children={ticket.price} />
                          </div>
                        ) : programmeSlug ? (
                          <a className="price" href={ticket.link} target="_blank" rel="noreferrer">
                            <span>Buy tickets</span>
                            <ReactMarkdown children={ticket.price} />
                          </a>
                        ) : (
                          <a className="price" href={ticket.link} target="_blank" rel="noreferrer">
                            <ReactMarkdown children={ticket.price} />
                          </a>
                        )}
                      </div>
                    </div>

                    {ticket.embed && (
                      <Modal
                        isOpen={isModalOpen}
                        onRequestClose={closeModal}
                        className={`ticket-modal`}
                        ariaHideApp={false}
                        style={modalStyles}
                      >
                        <div onClick={closeModal} className="close">
                          <svg width="36" height="34" viewBox="0 0 36 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <line x1="1" y1="-1" x2="44.6296" y2="-1" transform="matrix(0.715187 0.698933 -0.715187 0.698933 1.5 2)" stroke="black" strokeWidth="2" strokeLinecap="square"/>
                            <line x1="1" y1="-1" x2="44.6296" y2="-1" transform="matrix(0.715187 -0.698933 0.715187 0.698933 1.5 34)" stroke="black" strokeWidth="2" strokeLinecap="square"/>
                          </svg>
                        </div>
                        <iframe width="100%" height="100%" src={ticket.link} style={{ aspectRatio: '1 / 1', border: 'none' }} />
                      </Modal>
                    )}
                  </React.Fragment>
                );
              }

              if (ticket.__component === 'biennial.donate') {
                return (
                  <a key={key} className={`ticket donate`} href={ticket.link} target="_blank" rel="noreferrer">
                    <div className="ticket-content">
                      <h3>{ticket.title}</h3>
                    </div>
                  </a>
                );
              }

              return null;
            })}
          </div>

      </Layout>
    </section>
  )
}

export async function getServerSideProps() {
  const params = {
		slug: BIENNIAL_SLUG
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
