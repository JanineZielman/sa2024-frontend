import React, { useEffect, useState } from "react"
import { fetchAPI } from "../../lib/api"
import Layout from "../../components/layout"
import BiennialArticle from "../../components/biennial-article"
import LazyLoad from 'react-lazyload';
import Image from "../../components/image"
import Moment from 'moment';
import Collapsible from "../../components/collapsible";

const ProgrammeItem = ({page, global, relations, params, sub, festival, programmeLoc}) => {

  let programmeLocations = programmeLoc.attributes.location_item

  const [dates, setDates] = useState([]);
  const [locations, setLocations] = useState([]);

  function removeusingSet(arr) {
    let outputArray = Array.from(new Set(arr))
    return outputArray
  }

  useEffect(() => {
    let list = []
    let list2 = []
    for (let i = 0; i < sub.length; i++) {
      for (let j = 0; j < sub[i].attributes.WhenWhere?.length; j++) {
        list.push(sub[i].attributes.WhenWhere[j]?.date);
        list.sort(function (a, b) {
          return a.localeCompare(b);
        });
      }
    }
    for (let i = 0; i < sub.length; i++) {
      for (let j = 0; j < sub[i].attributes.locations.data?.length; j++) {
        list2.push(sub[i].attributes.locations.data[j].attributes.title);
      }
    }

    setDates(removeusingSet(list))
    setLocations(removeusingSet(list2))

    sub.sort(function (a, b) {
      return a.attributes.WhenWhere[0]?.start_time?.localeCompare(b.attributes.WhenWhere[0]?.start_time);
    });

  }, [])


  return (  
    <section className={`festival-wrapper ${params.programme}`}>
      <Layout global={global} festival={festival}>
        <BiennialArticle page={page} relations={relations} programmeLocations={programmeLocations} />
        {sub[0] && 
          <>
            <div className="discover sub">
              <div className="filter">
                {relations.attributes.sub_programmes_title &&
                  <h1>{relations.attributes.sub_programmes_title}</h1>
                }
              </div>
              <div className="discover-container programme-container sub-programme-container">
                {dates.length > 2 ?
                  <>
                    {dates.map((date, j) => {
                      return(
                        <div className="day-programme">
                          <div className="collapsible">
                            <Collapsible trigger={Moment(date).format('D MMM')} open={true}>
                              <div className="discover-container programme-container sub-programme-container">
                                {locations.map((loc, l) => {
                                  return(
                                    <>
                                      {sub.filter(el2 => el2.attributes.locations.data[0]?.attributes.title === `${loc}`).map((item, i) => {
                                        let allDates = [];
                                        let repeatedEvent = 0;
                                        for (let j = 0; j < item.attributes.WhenWhere?.length; j++) {
                                          repeatedEvent = j;
                                          allDates.push(item.attributes.WhenWhere[j]?.date);
                                        }
                                        
                                        return(
                                          <>
                                            {allDates.includes(date) &&
                                            <div className={`discover-item`}>
                                              {i == 0 &&
                                                <div className="loc-item">{loc}</div>
                                              }
                                              <div className="item-wrapper">
                                                <a href={page?.attributes.slug+'/'+item.attributes.slug} key={'discover'+i}>
                                                  <div className="image">
                                                    {item.attributes.cover_image?.data &&
                                                      <Image image={item.attributes.cover_image?.data?.attributes} layout='fill' objectFit='cover'/>
                                                    }
                                                    <div className="info-overlay">
                                                      {item.attributes.WhenWhere[0] && 
                                                        <>
                                                          <div className="times">
                                                              <div className="time">
                                                                <span>{item.attributes.WhenWhere[repeatedEvent].start_time} {item.attributes.WhenWhere[repeatedEvent].end_time && `— ${item.attributes.WhenWhere[repeatedEvent].end_time}`}</span>
                                                              </div>
                                                          </div>
                                                        </>
                                                      }
                                                    </div>
                                                  </div>
                                                  {item.attributes.biennial_tags?.data && 
                                                    <div className="category">
                                                      {item.attributes.biennial_tags.data.slice(0,1).map((tag, i) => {
                                                        return(
                                                          <a href={'/search/'+tag.attributes.slug} key={'search'+i}>
                                                            {tag.attributes.title}
                                                          </a>
                                                        )
                                                      })}
                                                    </div>
                                                  }
                                                  <div className="title-wrapper">
                                                    <div className="authors">
                                                      {item.attributes?.authors?.data &&
                                                        item.attributes.authors.data.map((author, i) => {
                                                          return( 
                                                            <div className="author">{author.attributes.name}</div>
                                                          )
                                                        })
                                                      }
                                                    </div>
                                                    <div className="title">{item.attributes.title}</div>
                                                  </div>
                                                </a>
                                              </div>
                                            </div>
                                            }
                                          </>
                                        )
                                      })}
                                    </>
                                  )
                                })}
                              </div>
                            </Collapsible>
                          </div>
                        </div>
                      )
                    })}
                  </>
                :
                  <>
                    <div className="day-programme">
                      <div className="discover-container programme-container sub-programme-container">
                        {locations.map((loc, l) => {
                          return(
                            <>
                              {sub.filter(el2 => el2.attributes.locations.data[0]?.attributes.title === `${loc}`).map((item, i) => {
                                return(
                                  <>
                                    <div className={`discover-item`}>
                                      {i == 0 &&
                                        <div className="loc-item">{loc}</div>
                                      }
                                      <LazyLoad height={600}>
                                        <div className="item-wrapper">
                                          <a href={page?.attributes.slug+'/'+item.attributes.slug} key={'discover'+i}>
                                            <div className="image">
                                              {item.attributes.cover_image?.data &&
                                                <Image image={item.attributes.cover_image?.data?.attributes} layout='fill' objectFit='cover'/>
                                              }
                                              <div className="info-overlay">
                                                {item.attributes.WhenWhere[0] && 
                                                  <>
                                                    <div className="times">
                                                      <div className="time">
                                                        <span>{item.attributes.WhenWhere[0].start_time} {item.attributes.WhenWhere[0].end_time && `— ${item.attributes.WhenWhere[0].end_time}`}</span>
                                                      </div>
                                                    </div>
                                                  </>
                                                }
                                              </div>
                                            </div>
                                            {item.attributes.biennial_tags?.data && 
                                              <div className="category">
                                                {item.attributes.biennial_tags.data.slice(0,1).map((tag, i) => {
                                                  return(
                                                    <a href={'/search/'+tag.attributes.slug} key={'search'+i}>
                                                      {tag.attributes.title}
                                                    </a>
                                                  )
                                                })}
                                              </div>
                                            }
                                            <div className="title-wrapper">
                                              <div className="authors">
                                                {item.attributes?.authors?.data &&
                                                  item.attributes.authors.data.map((author, i) => {
                                                    return( 
                                                      <div className="author">{author.attributes.name}</div>
                                                    )
                                                  })
                                                }
                                              </div>
                                              <div className="title">{item.attributes.title}</div>
                                            </div>
                                          </a>
                                        </div>
                                      </LazyLoad>
                                    </div>
                                  </>
                                )
                              })}
                            </>
                          )
                        })}
                      </div>
                    </div>
                  </>
                }
              </div>
            </div>
          </>
        }
      </Layout>
    </section> 
  )
}


export async function getServerSideProps({params, query}) {
  const biennial = {
		slug: "biennial-2024"
	}
  
  const preview = query.preview
  const pageRes = 
    await fetchAPI( `/programme-items?filters[slug][$eq]=${params.programme}${preview ? "&publicationState=preview" : '&publicationState=live'}&populate[content][populate]=*`
  );

  const pageRel = 
    await fetchAPI( `/programme-items?filters[slug][$eq]=${params.programme}${preview ? "&publicationState=preview" : '&publicationState=live'}&populate[content][populate]=*&populate[cover_image][populate]=*&populate[main_programmes][populate]=*&populate[locations][populate]=*&populate[sub_programme_items][populate]=*&populate[biennial_tags][populate]=*&populate[WhenWhere][populate]=*&populate[authors][populate]=*&populate[community_items][populate]=*`
  );

  const subRes = 
  await fetchAPI( `/programme-items?&filters[main_programme_items][slug][$contains]=${params.programme}&pagination[limit]=${100}&populate[biennial][populate]=*&populate[main_programme_items][populate]=*&populate[WhenWhere][populate]=*&populate[locations][populate]=*&populate[cover_image][populate]=*&populate[biennial_tags][populate]=*&populate=*`
);
  

  const [globalRes, categoryRes, festivalRes, programmeLoc] = await Promise.all([
    fetchAPI("/global?populate[prefooter][populate]=*&populate[socials][populate]=*&populate[image][populate]=*&populate[footer_links][populate]=*&populate[favicon][populate]=*", { populate: "*" }),
    fetchAPI(`/biennial-tags?filters[biennials][slug][$eq]=${biennial.slug}&populate=*`),
    fetchAPI(`/biennials?filters[slug][$eq]=${biennial.slug}&populate[prefooter][populate]=*`),
    fetchAPI(`/programme-pages?&populate[0]=location_item`),
  ])

  return {
    props: {  
      page: pageRes.data[0], 
      global: globalRes.data, 
      relations: pageRel.data[0],
      sub: subRes.data,
			params: params, 
      categories: categoryRes.data,
      festival: festivalRes.data[0],
      programmeLoc: programmeLoc.data[0]
    },
  };
}

export default ProgrammeItem
