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
                  const number = 0;
                  return(
                    <div className="day">
                      <h1 className="date">{Moment(day).format('ddd D MMM')}</h1>
                      <div key={`times${i}`} className="timetable-times">
                        {times.map((time, i) => {
                          return(
                            <div key={`time${i}`} className="time-block">
                              <div className="time">{time}</div>
                            </div>
                          )
                        })}
                      </div>
                      {locRes.map((loc, j) => {
                        return(
                          <div className="timetable-row">
                            {loc.attributes.programme_items.data.map((prog, k) => {
                              let fullProgItem = programmes.filter(fullProg => fullProg.attributes.slug == prog.attributes.slug)[0];
                              let items = fullProgItem.attributes.WhenWhere.filter(when => Moment(when.date.split('/').reverse().join('/')).format('DD MM') == Moment(day).format('DD MM'));
                              return(
                                <>
                                 {items?.map((item, l) => {
                                  const startTime = parseFloat(item.start_time?.substring(0, 2)) + parseFloat(item.start_time?.substring(3, 5) / 60);
                                  const endTime = parseFloat(item.end_time?.substring(0, 2)) + parseFloat(item.end_time?.substring(3, 5) / 60);
                                  return(
                                    <>
                                    {l == 0 && k == 0 &&
                                      <div className="location">
                                        <p>{loc.attributes.title}</p>
                                      </div>
                                    }
                                    { loc.attributes.title == item.location.data?.attributes.title &&
                                      <div id="programme_wrapper" className={`programme-wrapper`}>
                                        <div 
                                        className={`programme`} 
                                        style={{'--margin': ((startTime - 7 - number) * 200 + 250) + 'px',  '--width':  ( (endTime <= 6 ? 24 : 0) +  ( endTime  - startTime ) ) * 200 - 8 + 'px'}}
                                        >
                                          <div className="title" style={{'marginRight': '24px'}}>
                                            {prog.attributes.title} {item.start_time}–{item.end_time}
                                          </div>
                                        </div>
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
