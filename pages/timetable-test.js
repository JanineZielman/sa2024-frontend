import React, {useEffect, useState} from "react"
import Layout from "../components/layout"
import { fetchAPI } from "../lib/api"
import Moment from 'moment'


const Timetable = ({ global, festival, programmes, locRes}) => {

	const [currentDate, setCurrentDate] = useState('2024-02-02');
  const [loading, setLoading] = useState(true);

  function getDates (startDate, endDate) {
    const dates = []
    let currentDate = startDate
    const addDays = function (days) {
      const date = new Date(this.valueOf())
      date.setDate(date.getDate() + days)
      return date
    }
    while (currentDate <= endDate) {
      dates.push(currentDate)
      currentDate = addDays.call(currentDate, 1)
    }
    return dates
  }
  
  // Usage
  const dates = getDates(new Date('2024-02-02'), new Date('2024-03-24'))
  

	const times = [
    '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00'
  ]

	useEffect(() => {
    setTimeout(function() {
      setLoading(false)
    }, 1000);
	}, [])
  
  return (
    <>
    
    <div class="timetable"></div>
    
    {loading ?
      <div className="loader"></div>
      :
      <section className="festival-wrapper">
        <Layout  global={global} festival={festival}>
          <div className="timetable">
            <div className="timetable-locations">
              <div className="timetable-wrapper">		
                {dates.map((day, i) => {
                  return(
                    <div className="day">
                      <h1>{Moment(day).format('ddd D MMM')}</h1>
                      {locRes.map((loc, j) => {
                        return(
                          <div className="timetable-row">
                            {/* <div className="location">
                              {loc.attributes.title}
                            </div> */}
                            {loc.attributes.programme_items.data.map((prog, k) => {
                              let fullProgItem = programmes.filter(fullProg => fullProg.attributes.slug == prog.attributes.slug)[0];
                              let items = fullProgItem.attributes.WhenWhere.filter(when => Moment(when.date.split('/').reverse().join('/')).format('DD MM') == Moment(day).format('DD MM'));
                              return(
                                <>
                                 {items?.map((item, l) => {
                                  return(
                                    <>
                                    {l == 0 && k == 0 &&
                                      <div className="location">
                                        <p>{loc.attributes.title}</p>
                                      </div>
                                    }
                                    { loc.attributes.title == item.location.data?.attributes.title &&
                                      <div className="title" style={{'marginRight': '24px'}}>
                                        {prog.attributes.title} {item.start_time}–{item.end_time}
                                      </div>
                                    }  
                                    </>                        
                                  )
                                })}
                                </>
                              )
                            })}
                          </div>
                        )
                      })}
                     
                        {/* {programmes.map((item, j) => {
                          // console.log(item)
                          let items = item.attributes.WhenWhere.filter(when => Moment(when.date.split('/').reverse().join('/')).format('DD MM') == Moment(day).format('DD MM'));
                          return(
                            <>
                              {items.map((loc, k) => {
                                console.log(document.getElementsByClassName(`${Moment(day).format('DD-MM')}${loc.location.data?.attributes.title}`))
                                return(
                                  <div className="timetable-row">
                                    <div className={`location ${Moment(day).format('DD-MM')}${loc.location.data?.attributes.title} `}>
                                      <p>{loc.location.data?.attributes.title} </p>
                                    </div>  
                                    <div className="title">{item.attributes.title}</div>
                                  </div>                             
                                )
                              })}
                            </>
                          )
                        })} */}
             
                      <br/>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </Layout>
      </section>
    }
    </>
  )
}

export async function getServerSideProps() {
  const params = {
		slug: "biennial-2024"
	}
  
  // Run API calls in parallel
  const [festivalRes, globalRes, programmeRes, locRes] = await Promise.all([
    fetchAPI(`/biennials?filters[slug][$eq]=${params.slug}&populate[prefooter][populate]=*`),
    fetchAPI("/global?populate[prefooter][populate]=*&populate[socials][populate]=*&populate[image][populate]=*&populate[footer_links][populate]=*&populate[favicon][populate]=*", { populate: "*" }),
	  fetchAPI(`/programme-items?filters[biennial][slug][$eq]=${params.slug}&populate[WhenWhere][populate]=*&populate[WhenWhere][location][populate]=*&pagination[limit]=${100}`),
    fetchAPI(`/locations?filters[biennial][slug][$eq]=${params.slug}&populate[programme_items][populate]=*`),
  ])

	

  return {
    props: {
      festival: festivalRes.data[0],
      global: globalRes.data,
	    programmes: programmeRes.data,
      locRes: locRes.data
    }
  }
}

export default Timetable
