import React from "react"
import ReactMarkdown from "react-markdown";
import Layout from "../../components/layout"
import { fetchAPI } from "../../lib/api"
import Collapsible from 'react-collapsible';


const Visit = ({ global, visit, festival, programmeLoc }) => {

  let programmeLocations = programmeLoc.attributes.location_item;

  return (
    <section className="festival-wrapper">
      <Layout global={global} festival={festival}>
        <section className="article visit">
          <div className="content">
            <div className="wrapper">
              {visit.map((item, i) => {
                return(
                  <>
                  {item.locations &&
                    <>
                      {item.locations.data.map((loc, j) => {
                        let locInfo =  programmeLocations?.filter((item) => item.title == loc.attributes.title);
                        return(
                          <div className="locations">
                            <h2>{loc.attributes.title} {loc.attributes.subtitle && <> – {loc.attributes.subtitle} </>}</h2>
                            <h2>{loc.attributes.location}</h2>
                            <ReactMarkdown className="opening-times" children={locInfo[0]?.opening_times}/>
                            <ReactMarkdown className="additional-info"
                              children={loc.attributes.additional_info} 
                            />
                          </div>
                        )
                      })}
                    </>
                  }

                  {item.embed &&
                    <div className="map">
                      <div dangerouslySetInnerHTML={{__html: item.embed}}/>
                    </div>
                  }
                  {item.text &&
                    <div className="text-block">
                      <ReactMarkdown 
                        children={item.text} 
                      />
                    </div>
                  }
                  {item.__component == "biennial.collapsible" &&
                    <div className="collapsible visit">
                      <Collapsible trigger={item.title} open={item.open == true && item.open}>
                        <div className={'text-block ' + item.size} key={'textcol'+i}>
                          <ReactMarkdown 
                            children={item.text_block} 
                          />
                        </div>
                      </Collapsible>
                    </div>
                  }
                </>
                )
              })}
            </div>
          </div>
        </section>
      </Layout>
    </section>
  )
}


export async function getServerSideProps() {
  const params = {
		slug: "biennial-2024"
	}
  // Run API calls in parallel
  const [festivalRes, visitRes, globalRes, programmeLoc] = await Promise.all([
    fetchAPI(`/biennials?filters[slug][$eq]=${params.slug}&populate[prefooter][populate]=*`),
    fetchAPI(`/biennials?filters[slug][$eq]=${params.slug}&populate[visit][populate]=*`),
    fetchAPI("/global?populate[prefooter][populate]=*&populate[socials][populate]=*&populate[image][populate]=*&populate[footer_links][populate]=*&populate[favicon][populate]=*", { populate: "*" }),
    fetchAPI(`/programme-pages?&populate[0]=location_item`),
  ])


  return {
    props: {
      festival: festivalRes.data[0],
      visit: visitRes.data[0].attributes.visit,
      global: globalRes.data,
      programmeLoc: programmeLoc.data[0]
    }
  }
}

export default Visit
