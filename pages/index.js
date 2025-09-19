import Layout from "../components/layout";
import { fetchAPI } from "../lib/api";
import { BIENNIAL_SLUG } from "../lib/constants";
import FrontpageLanding from "../components/frontpage/FrontpageLanding";
import NewsSection from "../components/frontpage/NewsSection";

const Festival = ({ global, festival }) => (
  <section className="festival-home">
    <Layout global={global} festival={festival}>
      <FrontpageLanding />
      <NewsSection />
    </Layout>
  </section>
);

export async function getServerSideProps() {
  const biennial = { slug: BIENNIAL_SLUG };

  const [festivalRes, globalRes] = await Promise.all([
    fetchAPI(`/biennials?filters[slug][$eq]=${biennial.slug}&populate[prefooter][populate]=*`),
    fetchAPI(
      "/global?populate[prefooter][populate]=*&populate[socials][populate]=*&populate[image][populate]=*&populate[footer_links][populate]=*&populate[favicon][populate]=*",
      { populate: "*" },
    ),
  ]);

  return {
    props: {
      festival: festivalRes.data[0],
      global: globalRes.data,
    },
  };
}

export default Festival;
