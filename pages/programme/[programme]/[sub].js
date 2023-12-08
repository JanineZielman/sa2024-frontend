import { fetchAPI } from "../../../lib/api"
import Layout from "../../../components/layout"
import BiennialArticle from "../../../components/biennial-article"
import LazyLoad from 'react-lazyload';
import Image from "../../../components/image"
import Moment from 'moment';

const SubProgrammeItem = ({page, global, relations, params, festival, sub}) => {

  return (  
    <section className="festival-wrapper programme-sub">
      <Layout global={global} festival={festival}>
        <BiennialArticle page={page} relations={relations} params={params}/>
        {sub[0] && 
          <>
            <div className="discover sub">
              <div className="filter">
                {relations.attributes.sub_programmes_title &&
                  <h1>{relations.attributes.sub_programmes_title}</h1>
                }
              </div>
              <div className="discover-container programme-container sub2-programme-container">
                {sub.map((item, i) => {
                  let tags = "";
                  for (let i = 0; i < item.attributes.biennial_tags.data.length; i++) {
                    tags += `${item.attributes.biennial_tags.data[i].attributes.slug} `;
                  }
                  return(
                      <div className={`discover-item ${tags}`}>
                      <LazyLoad height={600}>
                        <div className="item-wrapper">
                          <a href={`/programme/${params.programme}/${item.attributes.slug}`} key={'discover'+i}>
                            <div className="image">
                              {item.attributes.cover_image?.data &&
                                <Image image={item.attributes.cover_image?.data?.attributes} layout='fill' objectFit='cover'/>
                              }
                              <div className="info-overlay">
                                {item.attributes.locations.data[0] && 
                                  <>
                                    <span>Locations:</span>
                                    <div className="locations">
                                      {item.attributes.locations.data.map((loc, j) => {
                                        return(
                                          <div className="location">
                                            <span>{loc.attributes.title}</span>
                                          </div>
                                        )
                                      })}
                                    </div>
                                  </>
                                }
                              </div>
                            </div>
                            {item.attributes.biennial_tags?.data && 
                              <div className="category">
                                {item.attributes.biennial_tags.data.map((tag, i) => {
                                  return(
                                    <a href={'/search/'+tag.attributes.slug} key={'search'+i}>
                                      {tag.attributes.title}
                                    </a>
                                  )
                                })}
                              </div>
                            }
                            {relations.attributes.sub_programmes_show_times == true ? 
                              <>
                                {item.attributes.start_time &&
                                  <div className="when">
                                    {item.attributes.start_time?.substring(0, 5)} {item.attributes.end_time && `– ${item.attributes.end_time?.substring(0, 5)}`}
                                  </div>
                                }
                              </>
                              :
                              <>
                                {item.attributes.start_date && 
                                  <div className="when">
                                    {Moment(item.attributes.start_date).format('MMM') == Moment(item.attributes.end_date).format('MMM') ?
                                      <>
                                        {Moment(item.attributes.start_date).format('D')} {item.attributes.end_date && <>– {Moment(item.attributes.end_date).format('D MMM')}</>}
                                      </>
                                    : 
                                      <>
                                        {Moment(item.attributes.start_date).format('D MMM')} {item.attributes.end_date && <>– {Moment(item.attributes.end_date).format('D MMM')}</>}
                                      </>
                                    }
                                  </div>
                                }
                              </>
                            }
                            
                            <div className="title">
                              {item.attributes.title}
                            </div>
                            {item.attributes?.authors?.data &&
                              <div className="tags">
                                {item.attributes.authors.data.map((author, i) => {
                                  return(
                                    <a className="author" href={`/artists/${author.attributes.slug}`}>
                                      {author.attributes.name}
                                    </a>
                                  )
                                })}
                              </div>
                            }
                          </a>
                        </div>
                      </LazyLoad>
                    </div>
                  )
                })}
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
    await fetchAPI( `/programme-items?filters[slug][$eq]=${params.sub}${preview ? "&publicationState=preview" : '&publicationState=live'}&populate[content][populate]=*`
  );

  const pageRel = 
    await fetchAPI( `/programme-items?filters[slug][$eq]=${params.sub}${preview ? "&publicationState=preview" : '&publicationState=live'}&populate[content][populate]=*&populate[cover_image][populate]=*&populate[main_programmes][populate]=*&populate[locations][populate]=*&populate[sub_programme_items][populate]=*&populate[biennial_tags][populate]=*&populate[WhenWhere][populate]=*&populate[authors][populate]=*&populate[community_items][populate]=*`
  );

  const subRes = 
    await fetchAPI( `/programme-items?filters[biennial][slug][$eq]=${biennial.slug}&filters[main_programme_items][slug][$eq]=${params.sub}${preview ? "&publicationState=preview" : '&publicationState=live'}&populate=*`
  );
  

  const [globalRes, festivalRes] = await Promise.all([
    fetchAPI("/global?populate[prefooter][populate]=*&populate[socials][populate]=*&populate[image][populate]=*&populate[footer_links][populate]=*&populate[favicon][populate]=*", { populate: "*" }),
    fetchAPI(`/biennials?filters[slug][$eq]=${biennial.slug}&populate[prefooter][populate]=*`),
  ])

  return {
    props: { 
      page: pageRes.data[0], 
      global: globalRes.data, 
      relations: pageRel.data[0],
			params: params, 
      festival: festivalRes.data[0],
      sub: subRes.data,
    },
  };
}

export default SubProgrammeItem
