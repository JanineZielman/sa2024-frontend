import React, {useEffect, useState} from "react"

import ReactMarkdown from "react-markdown";
import Layout from "../../components/layout"
import Image from "../../components/image"
import { fetchAPI } from "../../lib/api"
import InfiniteScroll from 'react-infinite-scroll-component';
import Search from "../../components/search"
import LazyLoad from 'react-lazyload';

const Artists = ({ festival, global, items, numberOfPosts, params }) => {

  const [posts, setPosts] = useState(items);
  const [hasMore, setHasMore] = useState(true);

  const getMorePosts = async () => {
    const res = await fetchAPI(
      `/community-items?filters[biennials][slug][$eq]=${params.slug}&sort[0]=name&pagination[start]=${posts.length}&populate=*`
    );
    const newPosts = await res.data;
    setPosts((posts) => [...posts, ...newPosts]);
  };

  useEffect(() => {
    setHasMore(numberOfPosts > posts.length ? true : false);
  }, [posts]);
  
  return (
    <section className="festival-wrapper template-artists">
      <div className="title">
        <h1 className="page-title">Artists</h1>
      </div>
      <Layout  global={global} festival={festival}>
        <div className="discover">
          <div className="wrapper intro">
            <ReactMarkdown 
              children={festival.attributes.ArtistsIntro} 
            />
          </div>
          <div className="filter">
            <Search params={`artists`}/>
          </div>
          <div className="discover-container">
            <InfiniteScroll
              dataLength={posts.length}
              next={getMorePosts}
              hasMore={hasMore}
              loader={<h4>Loading...</h4>}
            >
              {posts.map((item, i) => {
                console.log(item.attributes.cover_image.data.attributes.formats);
                return (
                  <div className="discover-item artist-item">
                    <div className="item-wrapper">
                      <a href={'artists/' + item.attributes.slug} key={'agenda'+i}>
                        <div className="image">
                            <img 
                              src={"https://cms.sonicacts.com/public"+item.attributes.cover_image.data.attributes.formats.small?.url}
                            />
                        </div>
                        <div className="info">
                          {item.attributes.name} 
                          {/* <div>{item.attributes.job_description}</div>  */}
                        </div>
                      </a>
                    </div>
                  </div>
                )
              })}
            </InfiniteScroll>
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
  const [festivalRes, globalRes] = await Promise.all([
		fetchAPI(`/biennials?filters[slug][$eq]=${params.slug}&populate[prefooter][populate]=*`),
    fetchAPI("/global?populate[prefooter][populate]=*&populate[socials][populate]=*&populate[image][populate]=*&populate[footer_links][populate]=*&populate[favicon][populate]=*", { populate: "*" }),
  ])

  const items = await fetchAPI(`/community-items?filters[biennials][slug][$eq]=${params.slug}&sort[0]=slug&populate=*`);

	const totalItems = 
    await fetchAPI( `/community-items?filters[biennials][slug][$eq]=${params.slug}&sort[0]=slug`
  );

  const numberOfPosts = totalItems.meta.pagination.total;

  return {
    props: {
			festival: festivalRes.data[0],
      items: items.data,
      numberOfPosts: +numberOfPosts,
      global: globalRes.data,
      params: params,
    }
  }
}

export default Artists
