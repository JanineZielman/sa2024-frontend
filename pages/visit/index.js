import React, {useState, useEffect} from "react"
import ReactMarkdown from "react-markdown";
import Layout from "../../components/layout"
import { fetchAPI } from "../../lib/api"
import Collapsible from 'react-collapsible';


const Visit = ({ global, visit, festival, programmeLoc }) => {

  let programmeLocations = programmeLoc.attributes.location_item;

  

  useEffect(() => {
    setTimeout(function(){

      // Mapbox access token
      mapboxgl.accessToken = 'pk.eyJ1Ijoic29uaWNhY3RzIiwiYSI6ImNscTZmOTd6NTBwOXMya251YnVjNG4xcDYifQ._mX8dAapy0UIkcHEzMUI3g';

      // Initialize Mapbox map
      const map = new mapboxgl.Map({
          container: 'map',
          style: 'mapbox://styles/sonicacts/clq6fv6z5001q01qwc6eahkpe',
          center: [4.899, 52.36], // Center map (default location)
          zoom: 12.3 // Set default zoom level
      });

      var keycolors = ["#58de60", "#ff820a", "#ffbbf1", "#FFFFFF"]; //green, orange, pink

      let lastPopup = null; // To keep track of the current open popup

      // Loop through each div with class "location"
      $('.location').each(function(i) {
          // Get the GPS data from the data-gps attribute
          const gpsData = $(this).data('gps');
          
          // Split the GPS data into latitude and longitude
          const [longitude, latitude] = gpsData.split(',').map(parseFloat);

          // Popup content
          const popupContent = `
            <h2>${$(this).find('h2').text()}</h2>
            <h3>${$(this).find('h3').text()}</h3>
            <div class="opening-times">${$(this).find('.opening-times').html()}</div>
            <div class="additional-info">${$(this).find('.additional-info').html()}</div>
          `;

          // Create a popup for each location
          const popup = new mapboxgl.Popup({ offset: 25 })
            .setHTML(popupContent);
            
          // Set marker options.
          const marker = new mapboxgl.Marker({
            color: keycolors[i%3],
            })
            .setLngLat([latitude, longitude])
            .setPopup(popup) // sets a popup on this marker
            .addTo(map);

          // Event listener for click
          $(this).find("h2").click(function() {

            if (lastPopup) {
              lastPopup.remove();
            }
  
            // Center the map on the marker's location
            //map.flyTo({
            //  center: [latitude, longitude]
            //  });

            // Open the popup at the marker's location
            setTimeout(function(){
              popup.setLngLat([latitude, longitude]).addTo(map);
            }, 100);

            lastPopup = popup;
          });
        
          // Event listener for hover effect
          $(this).hover(
            function() {
                marker.getElement().classList.add('hovered-marker');
            },
            function() {
                marker.getElement().classList.remove('hovered-marker');
            }
          );
      });

    }, 100)

  }, []); // Empty dependency array means this effect will run once after the initial render

  return (
    <section className="festival-wrapper">
      <Layout global={global} festival={festival}>
        <section className="article visit">
          <div className="content">
            <div className="wrapper">
              <div className="locations">
                {visit.map((item, i) => {
                  return(
                    <>
                    {item.locations &&
                      <>
                        {item.locations.data.map((loc, j) => {
                          let locInfo =  programmeLocations?.filter((item) => item.title == loc.attributes.title);
                          return(
                            <div className="location" data-gps={loc.attributes.gps}>
                              <h2>{loc.attributes.title} {loc.attributes.subtitle && <span> – {loc.attributes.subtitle} </span>}</h2>
                              <h3>{loc.attributes.location}</h3>
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
              <div id="map"></div>
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
