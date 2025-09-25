import { useCallback, useEffect, useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';

import { BIENNIAL_SLUG } from '../../lib/constants';
import { fetchAPI } from '../../lib/api';
import { getStrapiMedia } from '../../lib/media';

const NEWS_QUERY = (slug) =>
  `/news-items?filters[biennials][slug][$eq]=${slug}&sort[0]=date%3Adesc&populate[content][populate]=*&populate[biennial_cover_image][populate]=*&populate[cover_image][populate]=*&populate[footnotes][populate]=*`;

function selectImage(attributes) {
  if (!attributes) {
    return null;
  }

  const { formats, url } = attributes;

  if (formats?.large) {
    return getStrapiMedia(formats.large);
  }

  if (formats?.medium) {
    return getStrapiMedia(formats.medium);
  }

  if (formats?.small) {
    return getStrapiMedia(formats.small);
  }

  if (url) {
    return getStrapiMedia(attributes);
  }

  return null;
}

const MarkdownBlock = ({ children }) => {
  if (!children) {
    return null;
  }

  return <ReactMarkdown>{children}</ReactMarkdown>;
};

const extractContent = (item) => {
  const contentBlocks = item?.attributes?.content ?? [];
  const additionalBlocks = [];
  let leadBlock = null;
  let textSeen = false;

  contentBlocks.forEach((block) => {
    if (block?.__component === 'basic.text' && block?.text_block) {
      if (!textSeen) {
        textSeen = true;
        leadBlock = block;
      } else {
        additionalBlocks.push(block);
      }
      return;
    }

    additionalBlocks.push(block);
  });

  return {
    leadBlock,
    additionalBlocks,
    footnotes: item?.attributes?.footnotes?.footnotes ?? null,
  };
};

const renderBlock = (block, key) => {
  if (!block) {
    return null;
  }

  if (block.__component === 'basic.text') {
    return <MarkdownBlock key={key}>{block.text_block}</MarkdownBlock>;
  }

  if (block.__component === 'basic.image') {
    const attributes = block?.image?.data?.attributes;
    const blockImageUrl = selectImage(attributes);
    if (!blockImageUrl) {
      return null;
    }

    const blockImageAlt = attributes?.alternativeText || '';
    return <img key={key} src={blockImageUrl} alt={blockImageAlt} loading="lazy" />;
  }

  if (block.__component === 'basic.embed') {
    return <div key={key} className="news-embed" dangerouslySetInnerHTML={{ __html: block?.url || '' }} />;
  }

  return null;
};

const COLUMN_CLASS_NAMES = ['first', 'second', 'third'];

const NewsSection = ({ biennialSlug = BIENNIAL_SLUG }) => {
  const [newsItems, setNewsItems] = useState([]);
  const [status, setStatus] = useState('loading');
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadNews = async () => {
      setStatus('loading');
      try {
        const response = await fetchAPI(NEWS_QUERY(biennialSlug));
        if (!isMounted) {
          return;
        }

        setNewsItems(response?.data ?? []);
        setStatus('ready');
      } catch (error) {
        if (!isMounted) {
          return;
        }

        console.error('Failed to load frontpage news', error);
        setStatus('error');
      }
    };

    loadNews();

    return () => {
      isMounted = false;
    };
  }, [biennialSlug]);

  const enrichedNews = useMemo(
    () =>
      newsItems.map((item, index) => {
        const biennialCoverImage = item?.attributes?.biennial_cover_image?.data?.attributes;
        const fallbackCoverImage = item?.attributes?.cover_image?.data?.attributes;
        const imageUrl = selectImage(biennialCoverImage) || selectImage(fallbackCoverImage);
        const imageAlt =
          biennialCoverImage?.alternativeText || fallbackCoverImage?.alternativeText || item?.attributes?.title || 'News image';

        const columnIndex = index % COLUMN_CLASS_NAMES.length;

        return {
          item,
          columnIndex,
          column: COLUMN_CLASS_NAMES[columnIndex],
          imageUrl,
          imageAlt,
          content: extractContent(item),
        };
      }),
    [newsItems],
  );

  const columns = useMemo(() => {
    const buckets = Array.from({ length: COLUMN_CLASS_NAMES.length }, () => []);
    enrichedNews.forEach((news) => {
      buckets[news.columnIndex].push(news);
    });
    return buckets;
  }, [enrichedNews]);

  const handleToggle = useCallback((newsId) => {
    setExpandedId((current) => (current === newsId ? null : newsId));
  }, []);

  const content = useMemo(() => {
    if (status === 'error') {
      return <p>Failed to load news. Please try again later.</p>;
    }

    if (status === 'loading') {
      return <p>Loading news…</p>;
    }

    if (!enrichedNews.length) {
      return <p>No news items available yet.</p>;
    }

    return (
      <div className="news-columns">
        {columns.map((columnItems, columnIndex) => (
          <div
            key={`news-column-${columnIndex}`}
            className={`news-column news-column--${COLUMN_CLASS_NAMES[columnIndex]}`}
          >
            {columnItems.map((news) => {
              const { item, imageUrl, imageAlt, content: articleContent } = news;
              const newsId = item.id;
              const isExpanded = expandedId === newsId;

              const firstAdditionalTextIndex = articleContent.additionalBlocks.findIndex(
                (block) => block?.__component === 'basic.text' && block?.text_block,
              );
              const firstAdditionalText =
                firstAdditionalTextIndex >= 0
                  ? articleContent.additionalBlocks[firstAdditionalTextIndex]
                  : null;

              const excerptMarkdown =
                articleContent.leadBlock?.text_block || firstAdditionalText?.text_block;

              const excerptFromAdditional = !articleContent.leadBlock && !!firstAdditionalText;
              const expandedAdditionalBlocks = excerptFromAdditional
                ? articleContent.additionalBlocks.filter((_, index) => index !== firstAdditionalTextIndex)
                : articleContent.additionalBlocks;

              const toggle = () => handleToggle(newsId);

              return (
                <article
                  key={newsId}
                  className={`news-card${isExpanded ? ' news-card--expanded' : ''}`}
                >
                  {imageUrl && (
                    <button type="button" className="news-card__image" onClick={toggle}>
                      <img src={imageUrl} alt={imageAlt} loading="lazy" />
                    </button>
                  )}

                  <div className="news-card__header">
                    <h3 className="news-card__title">
                      <button type="button" onClick={toggle}>
                        <span dangerouslySetInnerHTML={{ __html: item?.attributes?.title || '' }} />
                      </button>
                    </h3>

                    <div className="news-card__date">{item?.attributes?.date}</div>
                  </div>

                  {excerptMarkdown && (
                    <div className={`news-card__excerpt${isExpanded ? ' news-card__excerpt--hidden' : ''}`}>
                      <MarkdownBlock>{excerptMarkdown}</MarkdownBlock>
                    </div>
                  )}

                  <div className="read-more read-more-news">
                    <button type="button" className="read-more-inner" onClick={toggle}>
                      {isExpanded ? 'close' : 'read more'}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="news-card__expanded">
                      {articleContent.leadBlock?.text_block && (
                        <div className="news-card__expanded-lead">
                          <MarkdownBlock>{articleContent.leadBlock.text_block}</MarkdownBlock>
                        </div>
                      )}

                      {!articleContent.leadBlock && excerptMarkdown && (
                        <div className="news-card__expanded-lead">
                          <MarkdownBlock>{excerptMarkdown}</MarkdownBlock>
                        </div>
                      )}

                      {expandedAdditionalBlocks.map((block, index) =>
                        renderBlock(block, `${newsId}-additional-${index}`),
                      )}

                      {articleContent.footnotes && (
                        <div className="news-card__footnotes">
                          <MarkdownBlock>{articleContent.footnotes}</MarkdownBlock>
                        </div>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        ))}
      </div>
    );
  }, [columns, enrichedNews, expandedId, handleToggle, status]);

  return <div id="news-container">{content}</div>;
};

export default NewsSection;
