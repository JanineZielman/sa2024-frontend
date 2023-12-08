import Layout from "../../components/layout"
import { fetchAPI } from "../../lib/api"
import LazyLoad from 'react-lazyload';
import Image from '../../components/image'
import Moment from 'moment';


const Programme = ({ global, festival, programme}) => {
  return (
    <section className="festival-wrapper template-programme">
      <Layout global={global} festival={festival}>
        <div className="title-wrapper">
          <h1 className="page-title">Programme</h1>
        </div>
        <div className="discover">
          <div className="discover-container programme-container">
            {programme.attributes.programme_item.map((pro_item, i) => {
                let item = pro_item.programme_item.data;

                let dates = item.attributes.WhenWhere.sort((a,b)=>new Date(a.date).getTime()-new Date(b.date).getTime());
                let start_date = new Date(dates[0]?.date.split('/').reverse().join('/'));
                let end_date = new Date(dates[dates.length - 1]?.date.split('/').reverse().join('/'));

                return (
                  <div className={`discover-item`}>
                    <LazyLoad height={600}>
                      <div className="item-wrapper">
                        <a href={`programme/${item.attributes.slug}`} key={'discover'+i}>

                          
                          <div className="image">
                            <div className="image-inner">
                              {item.attributes.cover_image?.data &&
                                <Image 
                                  image={item.attributes.cover_image?.data?.attributes} layout='fill' objectFit='cover'
                                  sizes="10vw"

                                  />
                              }
                            </div>
                          </div>

                          {dates.length > 0 && 
                            <div className="when">
                              <span className="black-label">
                              { (Moment(start_date).format('MMM') == Moment(end_date).format('MMM') && dates.length > 1) ?
                                <>
                                  {Moment(start_date).format('D')}{dates.length > 1 && <>–{Moment(end_date).format('D MMM')}</>}
                                </>
                              : 
                                <>
                                  {Moment(start_date).format('D MMM')}   {dates.length > 1 && <><br />–{Moment(end_date).format('D MMM')}</>}
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
		slug: "biennial-2024"
	}

  // Run API calls in parallel
  const [festivalRes, programmePageRes, globalRes] = await Promise.all([
    fetchAPI(`/biennials?filters[slug][$eq]=${params.slug}&populate[prefooter][populate]=*`),
    fetchAPI(`/programme-pages?
    &populate[0]=programme_item.programme_item
    &populate[1]=programme_item.programme_item.cover_image
    &populate[2]=programme_item.programme_item.biennial_tags
    &populate[3]=programme_item.programme_item.locations
    &populate[4]=programme_item.programme_item.WhenWhere
    `),
    fetchAPI("/global?populate[prefooter][populate]=*&populate[socials][populate]=*&populate[image][populate]=*&populate[footer_links][populate]=*&populate[favicon][populate]=*", { populate: "*" }),
  ])

  return {
    props: {
      festival: festivalRes.data[0],
      global: globalRes.data,
      programme: programmePageRes.data[0]
    }
  }
}

export default Programme