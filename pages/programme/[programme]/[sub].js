import { fetchAPI } from "../../../lib/api"
import React, { useEffect } from "react"
import Layout from "../../../components/layout"
import BiennialArticle from "../../../components/biennial-article"
import LazyLoad from 'react-lazyload';
import Image from "../../../components/image"
import Moment from "moment";

const SubProgrammeItem = ({page, global, relations, params, festival, sub, programmeLoc}) => {

  let programmeLocations = programmeLoc.attributes.location_item

  useEffect(() => {
    relations.attributes.community_items.data.sort((a, b) => {
      if (a.attributes.slug.toLowerCase() < b.attributes.slug.toLowerCase()) {
        return -1;
      }
      if (a.attributes.slug.toLowerCase() > b.attributes.slug.toLowerCase()) {
        return 1;
      }
      return 0;
    })
  }, [])

  return (  
    <section className="festival-wrapper programme-sub">
      <Layout global={global} festival={festival}>
        <BiennialArticle page={page} relations={relations} programmeLocations={programmeLocations}/>
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
    fetchAPI(`/programme-pages?&populate[0]=location_item`),
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
