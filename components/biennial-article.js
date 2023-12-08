import ReactMarkdown from "react-markdown";
import React, {useEffect, useState} from "react"
import Moment from 'moment';
import Image from "./image"
import LazyLoad from 'react-lazyload';
import Collapsible from "./collapsible";
import Modal from 'react-modal';

const Article = ({page, relations}) => {
	useEffect(() => {
    var text = document.getElementsByClassName('text-block');
		for (let i = 0; i < text.length; i++) { 
			var links = text[i].getElementsByTagName('a');
			for (let j = 0; j < links.length; j++) { 
				if (links[j].href.includes('#footnotes') != true) {
					links[j].setAttribute('target', '_blank');
				} else {
					links[j].classList.add('footnote')
				}
				if (links[j].href.includes('.pdf') == true) {
					links[j].href = 'https://cms.sonicacts.com/uploads/' + links[j].href.substring(links[j].href.lastIndexOf("/") + 1)
				}
			}
		}
  }, []);

	const modalStyles = {
    overlay: {
      backgroundColor: 'transparent',
    },
  };

	const [show, setShow] = useState(false);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	console.log(relations.attributes)

  return (   
		<section className="article biennial-article">
			<>
				{relations?.attributes?.authors?.data &&
					<div className="authors">
						{relations.attributes.authors.data.map((author, i) => {
							return(
								<a className="author" href={`/artists/${author.attributes.slug}`}>

									<div className="image">
										<img 
										src={"https://cms.sonicacts.com/public"+author.attributes.cover_image.data.attributes.formats.small?.url}
										/>
									</div>
									<div className="info">
										{author.attributes.name} 
									</div>

								</a>
							)
						})}
					</div>
				}
				{page.attributes.title &&
					<div className="title-wrapper">
						{relations.attributes.biennial_tags?.data && 
							<div className="category">
								{relations.attributes.biennial_tags.data.map((tag, i) => {
									return(
										<a href={'/search/'+tag.attributes.slug} key={'search'+i}>
											{tag.attributes.title}
										</a>
									)
								})}
							</div>
						}
						<h1 className="page-title">{page.attributes.title}</h1>
					</div>
				}
				{page.attributes.name &&
					<div className="title-wrapper">
						<h1 className="page-title">{page.attributes.name}</h1>
						<div className="subtitle">{page.attributes.job_description}</div>
					</div>
				}
				<div className="content">
					<div className={`wrapper ${page.attributes.slug}`}>
						<>
						{page.attributes.content?.map((item, i) => {							
							return (
								<div key={`content${i}`} className={`${page.attributes.slug}-block`}>
									{item.image?.data &&
										<LazyLoad height={600}>
											{item.image_caption ?
												<div className="columns" key={'column'+i}>
													<div className={`image ${page.attributes.slug}`}>
														<Image image={item.image.data.attributes} placeholder="blur" blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8VQ8AAnkBewKPWHQAAAAASUVORK5CYII="/>
													</div>
													<div className="caption">
														<ReactMarkdown 
															children={item.image_caption} 
														/>
													</div>
												</div>
												:
												<div className={`image ${item.size} ${page.attributes.slug}`}>
													<Image image={item.image.data.attributes} placeholder="blur" blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8VQ8AAnkBewKPWHQAAAAASUVORK5CYII="/>
												</div>
											}
										</LazyLoad>
									}
									{item.sidenote && 
										<div className={'sidenote ' + item.size}>
											<ReactMarkdown 
												children={item.sidenote} 
											/>
										</div>
									}
									{item.text_block &&
										<div className={'text-block ' + item.size} key={'text'+i}>
										
											<ReactMarkdown 
												children={item.text_block} 
											/>
										</div>
									}
									{item.url &&
										<div className={`iframe-wrapper ${item.sound}`}  key={'url'+i}>
											<iframe className="iframe" src={item.url.match(/\bhttps?:\/\/\S+/gi)[0]} frameBorder="0"/>
										</div>
									}
									{item.__component == 'basic.collapsible' &&
										<div className="collapsible about">
											<Collapsible trigger={item.title} open={item.open == true && item.open}>
												<div className={'text-block ' + item.text?.size} key={'textcol'+i}>
													<ReactMarkdown 
														children={item.text?.text_block} 
													/>
												</div>
											</Collapsible>
										</div>
									}
								</div>
							)
						})}
						{relations?.attributes?.footnotes &&
							<div className="footnotes" id="footnotes">
								<ReactMarkdown 
									children={relations?.attributes?.footnotes?.footnotes} 
								/>
							</div>
						}
						</>
					</div>

					<div className="sidebar">
						<span>Locations</span>

						{relations?.attributes?.locations?.data?.map((loc, j) => {
							return(
								<div className="location">
									<a href={`/visit`}>
										{loc.attributes.title} {loc.attributes.subtitle && <> – {loc.attributes.subtitle} </>}
										
									</a>
								</div>
							)
						})}
	
						{relations.attributes.ticket_link &&
							<>
							<br/>
							<span>Tickets</span>
							<div style={{'cursor': "pointer"}}>
								{relations.attributes.embed == true ?
									<>
										<div className="ticket" onClick={handleShow}>
											<div className="ticket-content">
												<p>{relations.attributes.price}</p>
											</div>
										</div>
										
										<Modal  isOpen={show} onHide={handleClose} className={`ticket-modal`} ariaHideApp={false} style={modalStyles}>
											<div onClick={handleClose} className="close">
												<svg width="36" height="34" viewBox="0 0 36 34" fill="none" xmlns="http://www.w3.org/2000/svg">
													<line x1="1" y1="-1" x2="44.6296" y2="-1" transform="matrix(0.715187 0.698933 -0.715187 0.698933 1.5 2)" stroke="black" strokeWidth="2" strokeLinecap="square"/>
													<line x1="1" y1="-1" x2="44.6296" y2="-1" transform="matrix(0.715187 -0.698933 0.715187 0.698933 1.5 34)" stroke="black" strokeWidth="2" strokeLinecap="square"/>
												</svg>
											</div>
											<iframe width="100%" height="100%" src={relations.attributes.ticket_link} style={{'aspect-ratio': '1/1', 'border': 'none'}}/>
										</Modal>
									</>
									:
									<a href={relations.attributes.ticket_link} target="_blank">
										<div className="ticket-content">
											<p>{relations.attributes.price}</p>
										</div>
									</a>
								}
							</div>
							</>
						}

						{relations.attributes.registration_link &&
							<a href={relations.attributes.registration_link} className="sidebar-tickets">
								<span>Register</span>
								<div>
									{relations.attributes.registration_label && relations.attributes.registration_label}
								</div>
							</a>
						}

						{relations.attributes.main_programmes?.data[0] &&
							<div className="program-side-wrapper">
								<span>Programmes</span>
								{relations.attributes.main_programmes.data.map((programme, i) => {
									return(
										<div className="program-side">
											<h2>{programme.attributes.title}</h2>
											{programme.attributes.start_date &&
												<div className="date">{Moment(programme.attributes.start_date).format('D MMM')} {programme.attributes.end_date && <> – {Moment(programme.attributes.end_date).format('D MMM')} </>}</div>
											}
											{programme.attributes.start_time &&
												<div className="date">
													{programme.attributes.start_time?.substring(0, 5)} {programme.attributes.end_time && `– ${programme.attributes.end_time?.substring(0, 5)}`}
												</div>
											}
											<a className="view" href={`/programme/${programme.attributes.slug}`}>View programme</a>
										</div>
									)
								})}
								
							</div>
						}
						
					</div>
				</div>
			</>
		</section>
  )
}


export default Article
