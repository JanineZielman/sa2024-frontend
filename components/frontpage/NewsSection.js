import { useEffect, useMemo, useRef, useState } from 'react';
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

const NewsItem = ({ item }) => {
  const contentBlocks = item?.attributes?.content ?? [];
  const footnotes = item?.attributes?.footnotes?.footnotes;

  let firstTextBlock = null;
  const additionalBlocks = [];
  let textSeen = false;

  contentBlocks.forEach((block) => {
    if (block?.__component === 'basic.text' && block?.text_block) {
      if (!textSeen) {
        textSeen = true;
        firstTextBlock = block;
      } else {
        additionalBlocks.push(block);
      }
      return;
    }

    additionalBlocks.push(block);
  });

  const hasExpandableContent = additionalBlocks.length > 0 || Boolean(footnotes);

  const [expansionState, setExpansionState] = useState(
    hasExpandableContent ? 'collapsed' : 'open',
  );
  const timeoutRef = useRef();

  useEffect(() => {
    setExpansionState(hasExpandableContent ? 'collapsed' : 'open');
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [hasExpandableContent]);

  const handleExpand = () => {
    if (!hasExpandableContent) {
      return;
    }

    if (expansionState !== 'collapsed') {
      return;
    }

    setExpansionState('opening');
    timeoutRef.current = setTimeout(() => {
      setExpansionState('open');
    }, 2000);
  };

  const handleKeyDown = (event) => {
    if (!hasExpandableContent) {
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleExpand();
    }
  };

  const biennialCoverImage = item?.attributes?.biennial_cover_image?.data?.attributes;
  const fallbackCoverImage = item?.attributes?.cover_image?.data?.attributes;
  const imageUrl = selectImage(biennialCoverImage) || selectImage(fallbackCoverImage);
  const imageAlt =
    biennialCoverImage?.alternativeText || fallbackCoverImage?.alternativeText || item?.attributes?.title || 'News image';

  return (
    <article className={`news-item${expansionState === 'open' ? ' open' : ''}`}>
      {imageUrl && (
        <div className="news-image">
          <img src={imageUrl} alt={imageAlt} loading="lazy" />
        </div>
      )}

      <div className="news-content">
        <div className="news-headline-wrapper">
          <h2
            className="news-headline"
            role={hasExpandableContent ? 'button' : undefined}
            tabIndex={hasExpandableContent ? 0 : undefined}
            onClick={handleExpand}
            onKeyDown={handleKeyDown}
            dangerouslySetInnerHTML={{ __html: item?.attributes?.title || '' }}
          />
          <div className="news-date">{item?.attributes?.date}</div>
        </div>

        <MarkdownBlock>{firstTextBlock?.text_block}</MarkdownBlock>

        {hasExpandableContent && (
          <div
            className={`news-text${expansionState === 'opening' ? ' opening' : ''}${expansionState === 'open' ? ' open' : ''}`}
          >
            {additionalBlocks.map((block, index) => {
              if (!block) {
                return null;
              }

              if (block.__component === 'basic.text') {
                return <MarkdownBlock key={`${item.id}-text-${index}`}>{block.text_block}</MarkdownBlock>;
              }

              if (block.__component === 'basic.image') {
                const attributes = block?.image?.data?.attributes;
                const blockImageUrl = selectImage(attributes);
                if (!blockImageUrl) {
                  return null;
                }

                const blockImageAlt = attributes?.alternativeText || '';
                return (
                  <img
                    key={`${item.id}-image-${index}`}
                    src={blockImageUrl}
                    alt={blockImageAlt}
                    loading="lazy"
                  />
                );
              }

              if (block.__component === 'basic.embed') {
                return (
                  <div
                    key={`${item.id}-embed-${index}`}
                    className="news-embed"
                    dangerouslySetInnerHTML={{ __html: block?.url || '' }}
                  />
                );
              }

              return null;
            })}

            {footnotes && <MarkdownBlock>{footnotes}</MarkdownBlock>}
          </div>
        )}

        {hasExpandableContent && expansionState === 'collapsed' && (
          <div className="read-more read-more-news">
            <div className="read-more-inner" role="button" tabIndex={0} onClick={handleExpand} onKeyDown={handleKeyDown}>
              read more
            </div>
          </div>
        )}
      </div>
    </article>
  );
};

const NewsSection = ({ biennialSlug = BIENNIAL_SLUG }) => {
  const [newsItems, setNewsItems] = useState([]);
  const [status, setStatus] = useState('loading');

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

  const content = useMemo(() => {
    if (status === 'error') {
      return <p>Failed to load news. Please try again later.</p>;
    }

    if (status === 'loading') {
      return <p>Loading news…</p>;
    }

    if (!newsItems.length) {
      return <p>No news items available yet.</p>;
    }

    return newsItems.map((item) => <NewsItem key={item.id} item={item} />);
  }, [newsItems, status]);

  return <div id="news-container">{content}</div>;
};

export default NewsSection;
