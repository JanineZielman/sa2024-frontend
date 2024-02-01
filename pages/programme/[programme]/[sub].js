import { fetchAPI } from "../../../lib/api"
import React, { useEffect, useState } from "react"
import Layout from "../../../components/layout"
import BiennialArticle from "../../../components/biennial-article"
import LazyLoad from 'react-lazyload';
import Image from "../../../components/image"
import Moment from "moment";

const SubProgrammeItem = ({page, global, relations, params, sub, festival, programmeLoc}) => {

  console.log(relations)

  let programmeLocations = programmeLoc.attributes.location_item;

  const [subItems, setSubItems] = useState();

  useEffect(() => {

    if (page.attributes.hide_when_where != true){
      setSubItems(sub.sort((a, b) => {
        if (a.attributes.title.toLowerCase() < b.attributes.title.toLowerCase()) {
          return -1;
        }
        if (a.attributes.title.toLowerCase() > b.attributes.title.toLowerCase()) {
          return 1;
        }
        return 0;
      }))
    } else {
      setSubItems(sub.sort(function(a,b){
        let date1 = new Date(`${a.attributes.WhenWhere[0]?.date.split('/').reverse().join('-')}T${a.attributes.WhenWhere[0]?.start_time}Z`);
        let date2 = new Date(`${b.attributes.WhenWhere[0]?.date.split('/').reverse().join('-')}T${b.attributes.WhenWhere[0]?.start_time}Z`);
        return date1 - date2

      }));
    }

    relations.attributes.community_items.data.sort((a, b) => {
      if (a.attributes.slug.toLowerCase() < b.attributes.slug.toLowerCase()) {
        return -1;
      }
      if (a.attributes.slug.toLowerCase() > b.attributes.slug.toLowerCase()) {
        return 1;
      }
      return 0;
    })

  }, [subItems])

  return (  
    <section className={`festival-wrapper ${params.programme}`}>
      <Layout global={global} festival={festival}>
        <BiennialArticle page={page} relations={relations} programmeLocations={programmeLocations} />
        {subItems?.length > 0 && 
          <> 
            <div className="discover sub">
              <div className="subtitle">
                {relations.attributes.sub_programmes_title &&
                  <h1>{relations.attributes.sub_programmes_title}</h1>
                }
              </div>
              <div className="discover-container programme-container sub-programme-container">
                <div className="day-programme">
                  <div className="discover-container programme-container sub-programme-container">
                    {subItems.map((item, i) => {
                      let dates = item.attributes.WhenWhere?.sort((a,b)=>new Date(a.date).getTime()-new Date(b.date).getTime());
                      let start_date = new Date(dates?.[0]?.date.split('/').reverse().join('/'));
                      let end_date = new Date(dates?.[dates?.length - 1]?.date.split('/').reverse().join('/'));
                      return(
                        <>
                          <div className={`discover-item`}>
                            <div className="location-wrapper">
                              {item.attributes.locations?.data?.map((loc,i) => {
                                return(
                                  <div>{loc.attributes.title}</div>
                                )
                              })}
                            </div>
                            <LazyLoad height={600}>
                              <div className="item-wrapper">
                                <a href={item.attributes.slug} key={'discover'+i}>
                                  <div className="image">
                                    {item.attributes.WhenWhere[0] && page.attributes.hide_when_where == true &&
                                      <div className="info-overlay">
                                        <div className="date">
                                          { (Moment(start_date).format('MMM') == Moment(end_date).format('MMM') && dates.length > 1) ?
                                            <>
                                              {Moment(start_date).format('D')}{dates.length > 1 && <>–{Moment(end_date).format('D MMM')}</>}
                                            </>
                                          : 
                                            <>
                                              {Moment(start_date).format('D MMM')}   {dates.length > 1 && <>– {Moment(end_date).format('D MMM')}</>}
                                            </>
                                          }
                                        </div>
                                        <div className="times">
                                          <div className="time">
                                            <span>{item.attributes.WhenWhere[0].start_time}{item.attributes.WhenWhere[0].end_time && `—${item.attributes.WhenWhere[0].end_time}`}</span>
                                          </div>
                                        </div>
                                      </div>
                                    }
                                    <div className="image-inner">
                                      {item.attributes.cover_image?.data &&
                                        <Image image={item.attributes.cover_image?.data?.attributes} layout='fill' objectFit='cover'/>
                                      }
                                      
                                    </div>
                                  </div>

                                  <div className="category-title-wrapper">
                                    <div className="title">{item.attributes.title}</div>
                                  </div>
                                </a>
                              </div>
                            </LazyLoad>
                          </div>
                        </>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </>
        }

        {relations.attributes.community_items.data.length > 0 &&
          <div className="discover artists">
            <div className="subtitle">
              <h1>Artists</h1>
            </div>
            <div className="discover-container programme-container sub-programme-container">
              <div className="day-programme">
                <div className="discover-container programme-container sub-programme-container">
                  <div className="items-wrapper">
                    {relations.attributes.community_items.data.map((item, i) => {
                      return(
                        <div className="discover-item artist-item">
                          <LazyLoad height={600}>
                            <div className="item-wrapper">
                              <a href={'/artists/'+item.attributes.slug} key={'discover'+i}>
                                <div className="image">
                                  <div className="image-inner">
                                    {item.attributes.cover_image?.data &&
                                      <Image image={item.attributes.cover_image?.data?.attributes} layout='fill' objectFit='cover'/>
                                    }
                                  </div>
                                </div>

                                <div className="category-title-wrapper">
                                  <div className="title">{item.attributes.name}</div>
                                </div>
                              </a>
                            </div>
                          </LazyLoad>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
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
    await fetchAPI( `/programme-items?filters[slug][$eq]=${params.sub}${preview ? "&publicationState=preview" : '&publicationState=live'}&populate[content][populate]=*`
  );

  const pageRel = 
    await fetchAPI( `/programme-items?filters[slug][$eq]=${params.sub}${preview ? "&publicationState=preview" : '&publicationState=live'}&populate[content][populate]=*&populate[cover_image][populate]=*&populate[main_programme_items][populate]=*&populate[locations][populate]=*&populate[sub_programme_items][populate]=*&populate[biennial_tags][populate]=*&populate[WhenWhere][populate]=*&populate[community_items][populate]=*`
  );

  const subRes = 
    await fetchAPI( `/programme-items?filters[biennial][slug][$eq]=${biennial.slug}&filters[main_programme_items][slug][$eq]=${params.sub}${preview ? "&publicationState=preview" : '&publicationState=live'}&populate=*`
  );
  

  const [globalRes, festivalRes, programmeLoc] = await Promise.all([
    fetchAPI("/global?populate[prefooter][populate]=*&populate[socials][populate]=*&populate[image][populate]=*&populate[footer_links][populate]=*&populate[favicon][populate]=*", { populate: "*" }),
    fetchAPI(`/biennials?filters[slug][$eq]=${biennial.slug}&populate[prefooter][populate]=*`),
    fetchAPI(`/programme-pages?filters[slug][$eq]=programme-2024&populate[location_item][populate]=*`),
  ])

  return {
    props: { 
      page: pageRes.data[0], 
      global: globalRes.data, 
      relations: pageRel.data[0],
			params: params, 
      festival: festivalRes.data[0],
      sub: subRes.data,
      programmeLoc: programmeLoc.data[0]
    },
  };
}

export default SubProgrammeItem
