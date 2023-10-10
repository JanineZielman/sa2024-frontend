import React, {useState, useEffect} from "react"
import Layout from "../components/layout"
import { fetchAPI } from "../lib/api"
import Hero from "./hero"

const Festival = ({ global, page, params, programmes, artists, news }) => {
	const [loading, setLoading] = useState(true);

	useEffect(() => {
    setTimeout(function() {
       setLoading(false)
    }, 100);
  }, []);


  return (
		<>
			<section className="festival-home">
				<Layout  global={global} festival={page}>
					{loading ?
						<div className="loader"></div>
						:
						<div className="content-wrapper">
							<Hero slug={params.slug} programmes={programmes} artists={artists} news={news}/>
							<br/>
						</div>
				}
				</Layout>
			</section>
		</>
  )
}

export async function getServerSideProps() {
	const params = {
		slug: "biennial-2022"
	}

	const totalItems = 
    await fetchAPI( `/community-items?filters[biennials][slug][$eq]=${params.slug}&sort[0]=slug`
  );

	const number = Math.floor(Math.random() * (totalItems.meta.pagination.total - 6));

  // Run API calls in parallel
  const [pageRes, globalRes, programmeRes, artistsRes, newsRes] = await Promise.all([
		fetchAPI(`/biennials?filters[slug][$eq]=${params.slug}&populate[prefooter][populate]=*`),
    fetchAPI("/global?populate[prefooter][populate]=*&populate[socials][populate]=*&populate[image][populate]=*&populate[footer_links][populate]=*&populate[favicon][populate]=*", { populate: "*" }),
		fetchAPI(`/programmes?filters[biennial][slug][$eq]=${params.slug}&filters[main][$eq]=true&sort[0]=order%3Adesc&sort[1]=start_date%3Aasc&pagination[limit]=${4}&populate=*`),
		fetchAPI(`/community-items?filters[biennials][slug][$eq]=${params.slug}&pagination[start]=${number}&pagination[limit]=${6}&populate=*`),
		fetchAPI(`/news-items?filters[biennials][slug][$eq]=${params.slug}&sort[0]=date%3Adesc&pagination[limit]=${4}&populate=*`),
  ])

  return {
    props: {
      page: pageRes.data[0],
      global: globalRes.data,
			params: params,
			programmes: programmeRes.data,
			artists: artistsRes.data,
			news: newsRes.data,
    }
  }
}

export default Festival
