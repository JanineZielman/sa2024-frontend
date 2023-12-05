import Layout from "../../components/layout"
import { fetchAPI } from "../../lib/api"
import LazyLoad from 'react-lazyload';
import Image from '../../components/image'
import Moment from 'moment';


const Programme = ({ global, items, params, festival}) => {
  
  return (
    <section className="festival-wrapper template-programme">
      <Layout global={global} festival={festival}>
        <div className="title-wrapper">
          <h1 className="page-title">Programme</h1>
        </div>
        <div className="discover">
          <div className="discover-container programme-container">
            {items.map((item, i) => {
                return (
                  <div className={`discover-item`}>
                    <LazyLoad height={600}>
                      <div className="item-wrapper">
                        <a href={`programme/${item.attributes.slug}`} key={'discover'+i}>

                          
                          <div className="image">
                            <div className="image-inner first">
                              {item.attributes.cover_image?.data &&
                                <Image image={item.attributes.cover_image?.data?.attributes} layout='fill' objectFit='cover'/>
                              }
                            </div>
                            <div className="image-inner second">
                              {item.attributes.cover_image?.data &&
                                <Image image={item.attributes.cover_image?.data?.attributes} layout='fill' objectFit='cover'/>
                              }
                            </div>
                          </div>

                          {item.attributes.start_date && 
                            <div className="when">
                              <span className="black-label">
                              {Moment(item.attributes.start_date).format('MMM') == Moment(item.attributes.end_date).format('MMM') ?
                                <>
                                  {Moment(item.attributes.start_date).format('D')}{item.attributes.end_date && <>–{Moment(item.attributes.end_date).format('D MMM')}</>}
                                </>
                              : 
                                <>
                                  {Moment(item.attributes.start_date).format('D MMM')}{item.attributes.end_date && <><br />–{Moment(item.attributes.end_date).format('D MMM')}</>}
                                </>
                              }
                              </span>
                            </div>
                          }

                            {item.attributes.biennial_tags?.data && 
                              <div className="location-wrapper">

                                <span className="locations">
                                  {item.attributes.locations.data[0] && 
                                    <>
                                        {item.attributes.locations.data.map((loc, j) => {
                                          return(
                                            <span className="location">{(j ? ', ' : '') + loc.attributes.title}</span>
                                          )
                                        })}
                                    </>
                                  }
                                </span>

                              </div>
                            }

                          <div className="category-title-wrapper">
                            <span className="category">
                            {item.attributes.biennial_tags.data.slice(0,1).map((tag, i) => {
                              return(
                                <div className="category" key={'search'+i}>
                                  {tag.attributes.title} 
                                </div>
                              )
                            })}
                            </span>
                            <div className="title">
                              {item.attributes.title}
                            </div>
                          </div>
                        </a>
                      </div>
                    </LazyLoad>
                  </div>
                )
              })}
              <div className="divider"></div>
          </div>
        </div>
      </Layout>
    </section>
  )
}

export async function getServerSideProps() {
  const params = {
		slug: "biennial-2022"
	}

  // Run API calls in parallel
  const [festivalRes, itemRes, globalRes] = await Promise.all([
    fetchAPI(`/biennials?filters[slug][$eq]=${params.slug}&populate[prefooter][populate]=*`),
    fetchAPI(`/programmes?filters[biennial][slug][$eq]=${params.slug}&pagination[limit]=${100}&filters[main][$eq]=true&sort[0]=order%3Adesc&sort[1]=start_date%3Aasc&populate=*`),
    fetchAPI("/global?populate[prefooter][populate]=*&populate[socials][populate]=*&populate[image][populate]=*&populate[footer_links][populate]=*&populate[favicon][populate]=*", { populate: "*" }),
  ])

  return {
    props: {
      festival: festivalRes.data[0],
      items: itemRes.data,
      global: globalRes.data,
			params: params,
    }
  }
}

export default Programme