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
      `/community-items?filters[biennials][slug][$eq]=${params.slug}&sort[0]=slug:asc&pagination[start]=${posts.length}&pagination[limit]=100 
      &populate=*`
    );
    const newPosts = await res.data;

    //console.log(res.data);

    setPosts((posts) => [...posts, ...newPosts]);
  };

  useEffect(() => {
    setHasMore(numberOfPosts > posts.length ? true : false);
  }, [posts]);
  
  return (
    <section className="festival-wrapper template-artists">
      <div className="title-wrapper">
        <h1 className="page-title">Artists</h1>
      </div>
      <Layout  global={global} festival={festival}>
        <div className="discover">
          <div className="wrapper intro">
            <ReactMarkdown 
              children={festival.attributes.ArtistsIntro} 
            />
          </div>
          <div className="discover-container">
            <InfiniteScroll
              dataLength={posts.length}
              next={getMorePosts}
              hasMore={hasMore}
              loader={<h4>Loading...</h4>}
              className={`items-wrapper`}
            >
              {posts.map((item, i) => {
                //console.log(item.attributes.cover_image.data.attributes.formats);
                return (
                  <div className="discover-item artist-item">
                    <div className="item-wrapper">
                      <a href={'artists/' + item.attributes.slug} key={'agenda'+i}>
                        <div className="image">
                            <img 
                              src={"https://cms.sonicacts.com/public"+item.attributes.cover_image.data?.attributes.formats.small?.url}
                            />
                        </div>
                        <div className="title">
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

  const items = await fetchAPI(`/community-items?filters[biennials][slug][$eq]=${params.slug}&sort[0]=slug:asc&pagination[limit]=100 
  &populate=*`);

	const totalItems = 
    await fetchAPI( `/community-items?filters[biennials][slug][$eq]=${params.slug}&sort[0]=slug:asc&pagination[limit]=100`);

  //console.log("items items items items ");
  //console.log(items);

  // Sorting the items array by the slug property in a case-insensitive manner
  items.data.sort((a, b) => {
    const slugA = a.attributes.slug.toLowerCase();
    const slugB = b.attributes.slug.toLowerCase();

    if (slugA < slugB) {
        return -1;
    }
    if (slugA > slugB) {
        return 1;
    }
    return 0;
  });

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
