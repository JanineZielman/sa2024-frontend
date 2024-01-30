import React, {useState, useEffect} from "react"
import ReactMarkdown from "react-markdown";
import Layout from "../../components/layout"
import { fetchAPI } from "../../lib/api"


const Visit = ({ global, festival, programmeLoc }) => {

  let programmeLocations = programmeLoc.attributes.location_item;

  console.log(festival)

  useEffect(() => {
    setTimeout(function(){

      // Mapbox access token
      mapboxgl.accessToken = 'pk.eyJ1Ijoic29uaWNhY3RzIiwiYSI6ImNscTZmOTd6NTBwOXMya251YnVjNG4xcDYifQ._mX8dAapy0UIkcHEzMUI3g';

      // Initialize Mapbox map
      const map = new mapboxgl.Map({
          container: 'map',
          style: 'mapbox://styles/sonicacts/clq6p605f002i01pj80v0gh9o',
          center: [4.899, 52.36], // Center map (default location)
          zoom: 12.3 // Set default zoom level
      });

      var keycolors = ["#ff820a", "#ffbbf1", "#EEE", "#6c4b34", "#58de60"]; //orange pink white brown green

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
            color: keycolors[i%5],
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
            <div className="info-wrapper">
              {festival.attributes.visit.map((item, i) => {
                return(
                  <ReactMarkdown children={item.text} />
                )
              })}
            </div>
            <div className="wrapper">
              <div className="locations">
                {programmeLocations.map((item, i) => {
                  return(
                    <div className="location" data-gps={item.location.data.attributes.gps}>
                      <h2>{item.location.data.attributes.title} {item.location.data.attributes.subtitle && <span> – {item.location.data.attributes.subtitle} </span>}</h2>
                      <h3>{item.location.data.attributes.location}</h3>
                      <ReactMarkdown className="opening-times" children={item.opening_times}/>
                      <ReactMarkdown className="additional-info"
                        children={item.location.data.attributes.additional_info} 
                      />
                    </div>
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
  const [festivalRes, globalRes, programmeLoc] = await Promise.all([
    fetchAPI(`/biennials?filters[slug][$eq]=${params.slug}&populate[prefooter][populate]=*&populate[visit][populate]=*`),
    fetchAPI("/global?populate[prefooter][populate]=*&populate[socials][populate]=*&populate[image][populate]=*&populate[footer_links][populate]=*&populate[favicon][populate]=*", { populate: "*" }),
    fetchAPI(`/programme-pages?filters[slug][$eq]=programme-2024&populate[location_item][populate]=*`),
  ])


  return {
    props: {
      festival: festivalRes.data[0],
      global: globalRes.data,
      programmeLoc: programmeLoc.data[0]
    }
  }
}

export default Visit
