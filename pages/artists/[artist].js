import { fetchAPI } from "../../lib/api"
import Layout from "../../components/layout"
import BiennialArticle from "../../components/biennial-article"
import LazyLoad from 'react-lazyload';
import Moment from 'moment';
import Image from "../../components/image"

const CommunityItem = ({params, page, global, relations, programmes, festival}) => {

  page.attributes.slug = `community`


  return (  
    <section className="festival-wrapper template-single-artist">
      <Layout global={global} festival={festival}>
        <BiennialArticle page={page} relations={relations} params={params}/>
        <div className="discover sub">
          <div className="subtitle">
            <h2>Programmes</h2>
          </div>
          <div className="discover-container programme-container">
            {programmes.data.map((item, i) => {
              let tags = "";
              for (let i = 0; i < item.attributes.biennial_tags.data.length; i++) {
                tags += `${item.attributes.biennial_tags.data[i].attributes.slug} `;
              }
              
              {item.attributes.cover_image}

              return(
                <div className={`discover-item`}>
                  <div className="item-wrapper">
                    <a href={'/programme/' +item.attributes.slug} key={'discover'+i}>
                      <div className="image">
                        {item.attributes.WhenWhere[0] && page.attributes.hide_when_where == true &&
                          <div className="info-overlay">
                            <div>
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
                                <span>{item.attributes.WhenWhere[0].start_time} {item.attributes.WhenWhere[0].end_time && `— ${item.attributes.WhenWhere[0].end_time}`}</span>
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
                </div>
              )
            })}
          </div>
        </div>
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
    await fetchAPI( `/community-items?filters[slug][$eq]=${params.artist}${preview ? "&publicationState=preview" : '&publicationState=live'}&populate[content][populate]=*`
  );

  const pageRel = 
    await fetchAPI( `/community-items?filters[slug][$eq]=${params.artist}${preview ? "&publicationState=preview" : '&publicationState=live'}&populate=*`
  );
  
  const programmesRes = 
    await fetchAPI( `/community-items?filters[slug][$eq]=${params.artist}${preview ? "&publicationState=preview" : '&publicationState=live'}&populate[programme_items][populate]=*`
  );

  

  const [festivalRes, globalRes] = await Promise.all([
    fetchAPI(`/biennials?filters[slug][$eq]=${biennial.slug}&populate[prefooter][populate]=*`),
    fetchAPI("/global?populate[prefooter][populate]=*&populate[socials][populate]=*&populate[image][populate]=*&populate[footer_links][populate]=*&populate[favicon][populate]=*", { populate: "*" }),
  ])

  return {
    props: { 
      festival: festivalRes.data[0],
      page: pageRes.data[0], 
      global: globalRes.data, 
      relations: pageRel.data[0], 
      programmes: programmesRes.data[0].attributes.programme_items,
      params: params,
    },
  };
}


export default CommunityItem
