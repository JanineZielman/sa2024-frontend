import { BIENNIAL_SLUG } from "../../lib/constants"
import React, {useEffect, useState} from "react"
import Layout from "../../components/layout"
import { fetchAPI } from "../../lib/api"
import Moment from 'moment'


const Timetable = ({ global, festival, programmes, locRes}) => {
  const [loading, setLoading] = useState(true);

  const normalizeDate = (dateStr) => {
    if (!dateStr) {
      return null;
    }

    if (dateStr instanceof Date) {
      return dateStr.toISOString().split('T')[0];
    }

    if (typeof dateStr !== 'string') {
      return null;
    }

    const trimmed = dateStr.trim();

    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      return trimmed;
    }

    if (/^\d{4}\/\d{2}\/\d{2}$/.test(trimmed)) {
      return trimmed.replace(/\//g, '-');
    }

    const tokens = trimmed.split('/');
    if (tokens.length === 3) {
      const [first, second, third] = tokens;
      if (third.length === 4) {
        const day = first.padStart(2, '0');
        const month = second.padStart(2, '0');
        return `${third}-${month}-${day}`;
      }
      if (first.length === 4) {
        const month = second.padStart(2, '0');
        const day = third.padStart(2, '0');
        return `${first}-${month}-${day}`;
      }
    }

    return trimmed;
  };

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

  useEffect(() => {
    setTimeout(function() {
      let days = document.getElementsByClassName('timetable-locations');
      for (let i = 0; i<days.length; i=i+1){
        if (days[i].getElementsByClassName('loc-text').length < 1){
          days[i].classList.add('hide');
        }
      }
    }, 2000);
  }, [])

  useEffect(() => {
    const currentDate = Moment(new Date()).format('ddd-D-MMM');
    setTimeout(function() {
      $("body, html").animate({
        scrollTop: 200
      });
    }, 1000);
    setTimeout(function() {
      document.getElementById(currentDate)?.scrollIntoView({
        behavior: 'smooth'
      });
    }, 2000);
  }, [])

  useEffect(()=>{
    for (let j = 0; j<document.getElementsByClassName('timetable-row').length; j=j+1){
      if(document.getElementsByClassName('timetable-row')[j].children.length == 0){
        document.getElementsByClassName('timetable-row')[j].remove()
      }
    }
  })
  
  return (
    <>
    
    <div className="timetable"></div>
    
    {loading ?
      <div className="loader"></div>
      :
      <section className="festival-wrapper">
        <Layout  global={global} festival={festival}>
          <div className="title-wrapper">
            <h1 className="page-title">Timetable</h1>
          </div>
          <div className="timetable-links">
            {festival.attributes.timetable.map((item, i) => {
              const linkKey = item.id || `${item.label || 'timetable'}-${i}`;
              return(
                <a key={linkKey} className="timetable-link" href={item.url}>{item.label}</a>
              )
            })}
          </div>
          <div className="timetable">
            
             
                {dates.map((day, i) => {
                  let number = 0;
                  let end = 24;
                  let list = [];
                  let list2 = [];
                  let timeWidth = 24;
                  programmes.forEach((programme) => {
                    const items = programme.attributes.WhenWhere.filter((when) => {
                      const normalized = normalizeDate(when.date);
                      if (!normalized) {
                        return false;
                      }
                      return Moment(normalized).format('DD MM') === Moment(day).format('DD MM');
                    });
                    if(items[0]?.start_time){
                      list.push(items[0].start_time.slice(0,2))
                    }
                    if(items[0]?.end_time){
                      if(Number(items[0].end_time.slice(0,2)) < 7){
                        list2.push(24 + Number(items[0].end_time.slice(0,2)))
                      } else{
                        list2.push(items[0].end_time.slice(0,2))
                      }
                    }            
                  });
                  if (list.sort()[0]){
                    number = list.sort()[0] - 7
                  }
                  if (list2.sort()[0]){
                    end = Number(list2.sort().reverse()[0]) - 6
                    timeWidth = Number(list2.sort().reverse()[0]) -  Number(list.sort()[0])
                  }
                  
                  const dayKey = `${Moment(day).format('YYYY-MM-DD')}-${i}`;

                  return(
                    <div className="timetable-locations-outer-wrapper" key={dayKey}>
                      <div className="timetable-locations" id={`${Moment(day).format('ddd-D-MMM')}`}>
                        <div className="day timetable-wrapper" style={{'--width': timeWidth * 12 + 12 + 'rem'}}>
                          <div className={`timetable-row`}>
                            <h1 className="date">{Moment(day).format('ddd D MMM')}</h1>
                          </div>
                          <div key={`times${i}`} className="timetable-times" style={{'--width': timeWidth * 12 + 12 + 'rem'}}>
                            {times.slice(number, end).map((time, i) => {
                              return(
                                <div key={`time${i}`} className="time-block">
                                  <div className="time">{time}</div>
                                </div>
                              )
                            })}
                          </div>
                          {locRes.map((loc, j) => {
                            return(
                              <div className={`timetable-row ${loc.attributes.slug}`} key={loc.id || `location-${j}`}>
                                {loc.attributes.programme_items.data.map((prog, k) => {
                                  const fullProgItem = programmes.filter(fullProg => fullProg.attributes.slug == prog.attributes.slug)[0];
                                  const items = fullProgItem.attributes.WhenWhere.filter((when) => {
                                    const normalized = normalizeDate(when.date);
                                    if (!normalized) {
                                      return false;
                                    }
                                    return Moment(normalized).format('DD MM') === Moment(day).format('DD MM');
                                  });
                                  return(
                                    <React.Fragment key={prog.id || `${loc.id || loc.attributes.slug}-programme-${k}`}>
                                    {items?.map((item, l) => {
                                      const startTime = parseFloat(item.start_time?.substring(0, 2)) + parseFloat(item.start_time?.substring(3, 5) / 60);
                                      const endTime = parseFloat(item.end_time?.substring(0, 2)) + parseFloat(item.end_time?.substring(3, 5) / 60);
                                      return(
                                        <React.Fragment key={`${prog.id || prog.attributes.slug}-instance-${l}`}>
                                          { loc.attributes.title == item.location.data?.attributes.title  &&
                                            <div className={`location ${loc.attributes.sub ? 'sub' : ''} ${l}`} key={`${prog.id || prog.attributes.slug}-location-${l}`}>
                                              <p className="loc-text">{loc.attributes.title}</p>
                                            </div>
                                          }
                                          { loc.attributes.title == item.location.data?.attributes.title &&
                                            <div key={`${prog.id || prog.attributes.slug}-programme-${l}`} id="programme_wrapper" className={`programme-wrapper`}>
                                              <a href={`/programme/${prog.attributes.slug}`} className={`programme ${prog.attributes.hide_in_timetable ? 'hide' : '' }`} style={{'--margin': ((startTime - 7 - number) * 12 + 11) + 'rem',  '--width':  ( (endTime <= 6 ? 24 : 0) +  ( endTime  - startTime ) ) * 12  + 'rem'}}>
                                                <div className="inner-programme">
                                                  <div className="inner-wrapper">
                                                    <div className="time">
                                                      {item.start_time}–{item.end_time}
                                                    </div>
                                                    <div className="title-artist-wrapper">
                                                      <div className="title">
                                                        {prog.attributes.title}
                                                      </div>
                                                      {prog.attributes.hide_artists_in_timetable != true &&
                                                        <div className="artists">
                                                          {fullProgItem.attributes.community_items.data.map((com, k) => {
                                                            return(
                                                              <div key={`${prog.id || prog.attributes.slug}-artist-${k}`}>{com.attributes.name}</div>
                                                            )
                                                          })}
                                                        </div>
                                                      } 
                                                    </div>
                                                  </div>
                                                </div>
                                              </a>
                                            </div>
                                          } 
                                        </React.Fragment>                       
                                      )
                                    })}
                                    </React.Fragment>
                                  )
                                })}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  )
                })}
        
           
          </div>
        </Layout>
      </section>
    }
    </>
  )
}

export async function getServerSideProps() {
  const params = {
		slug: BIENNIAL_SLUG
	}
  
  // Run API calls in parallel
  const [festivalRes, globalRes, programmeRes, locRes] = await Promise.all([
    fetchAPI(`/biennials?filters[slug][$eq]=${params.slug}&populate[prefooter][populate]=*&populate[timetable][populate]=*`),
    fetchAPI("/global?populate[prefooter][populate]=*&populate[socials][populate]=*&populate[image][populate]=*&populate[footer_links][populate]=*&populate[favicon][populate]=*", { populate: "*" }),
	  fetchAPI(`/programme-items?filters[biennial][slug][$eq]=${params.slug}&populate[WhenWhere][populate]=*&populate[WhenWhere][location][populate]=*&populate[community_items][populate]=*&pagination[limit]=${100}`),
    fetchAPI(`/locations?filters[biennial][slug][$eq]=${params.slug}&populate[programme_items][populate]=*&sort[0]=title:asc&pagination[limit]=${100}`),
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
