import ReactMarkdown from "react-markdown";
import React, {useEffect, useState} from "react"
import Moment from 'moment';
import Image from "./image"
import LazyLoad from 'react-lazyload';
import Collapsible from "./collapsible";
import Modal from 'react-modal';

const Article = ({page, relations, programmeLocations}) => {

	// let dates = relations.attributes.WhenWhere?.sort((a,b)=>new Date(a.date).getTime()-new Date(b.date).getTime());
	let dates = relations.attributes.WhenWhere;
	let start_date = new Date(dates?.[0]?.date.split('/').reverse().join('/'));
	let end_date = new Date(dates?.[dates?.length - 1]?.date.split('/').reverse().join('/'));

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

  return (   
		<section className="article biennial-article">
			<>
				{page.attributes.title &&
					<div className="title-wrapper">
						{relations.attributes.main_programme_items.data[0]?.attributes.title &&
							<div className="category">
								<a href={`/programme/${relations.attributes.main_programme_items.data[0].attributes.slug}`}>{relations.attributes.main_programme_items.data[0].attributes.title}</a>
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

					{(relations?.attributes?.locations?.data || dates?.length > 0) &&
						<div className="sidebar">

							<div className="sidebar-content">
								{page.attributes.hide_when_where != true && !page.attributes.custom_when_where?.length > 0 ?
									<div className="when-wrapper">
										{dates?.length > 0 &&
											<div className="when">
												<span>
												{ (Moment(start_date).format('MMM') == Moment(end_date).format('MMM') && dates.length > 1) ?
													<>
														{Moment(start_date).format('D')}{dates.length > 1 && <>–{Moment(end_date).format('D MMM')}</>}
													</>
												: 
													<>
														{Moment(start_date).format('D MMM')}   {dates.length > 1 && <>– {Moment(end_date).format('D MMM')}</>}
													</>
												}
												</span>
											</div>
										}
										{relations.attributes.WhenWhere?.length == 1 &&
											<div className="time">
												<span>{relations.attributes.WhenWhere[0].start_time}{relations.attributes.WhenWhere[0].end_time && `–${relations.attributes.WhenWhere[0].end_time}`}</span>
											</div>
										}
									</div>
									:
									<div className="when-wrapper">
										<ReactMarkdown
											className="when"
											children={page.attributes.custom_when_where} 
										/>
									</div>
								}

								{relations?.attributes?.locations?.data.length > 0 &&
									<div className="locations-wrapper">
										<h3>{`Location${relations?.attributes?.locations?.data.length > 1 ? 's' : ''}`}</h3>
										{relations?.attributes?.locations?.data?.map((loc, j) => {
											let locInfo =  programmeLocations?.filter((item) => item.title == loc.attributes.title);
											return(
												<div className="location">
													{
													    loc.attributes.title.startsWith("Online") ? (
																loc.attributes.link ?
																	<a target="_blank" href={loc.attributes.link}>
																		<h4>{loc.attributes.title} {loc.attributes.subtitle && <> – {loc.attributes.subtitle} </>}</h4>
																		{relations?.attributes.hide_opening_times != true &&
																			<ReactMarkdown children={locInfo[0]?.opening_times}/>
																		}
																		<ReactMarkdown 
																			children={loc.attributes.additional_info} 
																		/>
																	</a>
																:
																<div>
																	<h4>{loc.attributes.title} {loc.attributes.subtitle && <> – {loc.attributes.subtitle} </>}</h4>
																	{relations?.attributes.hide_opening_times != true &&
																		<ReactMarkdown children={locInfo[0]?.opening_times}/>
																	}
																	<ReactMarkdown 
																		children={loc.attributes.additional_info} 
																	/>
																</div>
														) : (
															<a href={`/visit`}>
																<h4>{loc.attributes.title} {loc.attributes.subtitle && <> – {loc.attributes.subtitle} </>}</h4>
																{relations?.attributes.hide_opening_times != true &&
																	<ReactMarkdown className="opening-times" children={locInfo[0]?.opening_times}/>
																}
																{loc.attributes.floorplan?.data?.attributes.url && <a className="floorplan" target="_blank" href={'https://cms.sonicacts.com' + loc.attributes.floorplan?.data?.attributes.url}>Floorplan</a>}
																<ReactMarkdown 
																	className="additional-info"
																	children={loc.attributes.additional_info} 
																/>
															</a>
														)
													}
												</div>
											)
										})}
									</div>
								}

								{relations.attributes.registration_link &&
									<a href={relations.attributes.registration_link} className="register-wrapper">
										<div>
											{relations.attributes.registration_label && relations.attributes.registration_label}
										</div>
									</a>
								}
							</div>
		
							{relations.attributes.ticket_link ?
								<div className="tickets-wrapper">

										{relations.attributes.embed == true ?
											<>
												<div className={`ticket ${relations?.attributes?.ticket_link ? '' : 'available-soon' } ${relations?.attributes?.price == 'SOLD OUT' && 'sold-out'} ${relations.attributes?.title?.replace(/\s|:/g, '')}`} onClick={handleShow}>

													<h3>Tickets</h3>

													<div className="ticket-content">
														<ReactMarkdown children={relations.attributes.price}/>
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
											<a href={relations.attributes.ticket_link} className={`ticket ${relations?.attributes?.ticket_link ? '' : 'available-soon' } ${relations.attributes?.title?.replace(/\s|:/g, '')}`} target="_blank">
												<h3>Tickets</h3>
												<div className="ticket-content">
													<ReactMarkdown children={relations.attributes.price}/>
												</div>
											</a>
										}

								</div>
								:
								<div className="free-tickets">
									<div className="ticket-content">
										<ReactMarkdown children={relations.attributes.price}/>
									</div>
								</div>
							}
							

							
						</div>
					}
				</div>
			</>
		</section>
  )
}


export default Article
