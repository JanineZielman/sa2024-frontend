import React from "react"
import Layout from "../../components/layout"
import { fetchAPI } from "../../lib/api"
import Landing from "../../components/landing"
import ReactMarkdown from "react-markdown";

const About = ({ global, page}) => {
  return (
		<>
		<section className="festival-wrapper about-page">
			<Layout  global={global} festival={page}>
				<div className="intro-text">
          <h1>Information</h1>
					<div><ReactMarkdown children={page.attributes.sidebar}/></div>
					<div><p>{page.attributes.IntroText}</p></div>
				</div>
        
        <div className="content-wrapper">
          <Landing page={page}/>
        </div>
			</Layout>
		</section>
				</>
  )
}

export async function getServerSideProps() {
  const params = {
		slug: "biennial-2024"
	}
  // Run API calls in parallel
  const [pageRes, globalRes] = await Promise.all([
		fetchAPI(`/biennials?filters[slug][$eq]=${params.slug}&populate[content][populate]=*&populate[prefooter][populate]=*`),
    fetchAPI("/global?populate[prefooter][populate]=*&populate[socials][populate]=*&populate[image][populate]=*&populate[footer_links][populate]=*&populate[favicon][populate]=*", { populate: "*" }),
  ])

  return {
    props: {
      page: pageRes.data[0],
      global: globalRes.data
    }
  }
}

export default About
