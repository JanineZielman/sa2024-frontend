import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import ReactMarkdown from 'react-markdown';

import { BIENNIAL_SLUG } from '../../lib/constants';
import { fetchAPI } from '../../lib/api';
import { getStrapiMedia } from '../../lib/media';

const NEWS_QUERY = (slug) =>
  `/news-items?filters[biennials][slug][$eq]=${slug}&sort[0]=date%3Adesc&populate[content][populate]=*&populate[biennial_cover_image][populate]=*&populate[cover_image][populate]=*&populate[footnotes][populate]=*`;

const supportsViewTransition =
  typeof document !== 'undefined' && typeof document.startViewTransition === 'function';

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

const NewsSection = ({ biennialSlug = BIENNIAL_SLUG }) => {
  const router = useRouter();
  const [newsItems, setNewsItems] = useState([]);
  const [status, setStatus] = useState('loading');
  const [activeNews, setActiveNews] = useState(null);
  const closeButtonRef = useRef(null);
  const overlayRef = useRef(null);
  const overlayHeadlineRef = useRef(null);
  const cardRefs = useRef(new Map());
  const headlineRefs = useRef(new Map());

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

  useEffect(() => {
    return () => {
      document.documentElement.classList.remove('news-overlay-open');
      document.body.classList.remove('news-overlay-open');
    };
  }, []);

  const closeOverlayClasses = useCallback(() => {
    document.documentElement.classList.remove('news-overlay-open');
    document.body.classList.remove('news-overlay-open');
  }, []);

  const openOverlayClasses = useCallback(() => {
    document.documentElement.classList.add('news-overlay-open');
    document.body.classList.add('news-overlay-open');
  }, []);

  const enrichedNews = useMemo(
    () =>
      newsItems.map((item, index) => {
        const biennialCoverImage = item?.attributes?.biennial_cover_image?.data?.attributes;
        const fallbackCoverImage = item?.attributes?.cover_image?.data?.attributes;
        const imageUrl = selectImage(biennialCoverImage) || selectImage(fallbackCoverImage);
        const imageAlt =
          biennialCoverImage?.alternativeText || fallbackCoverImage?.alternativeText || item?.attributes?.title || 'News image';

        return {
          item,
          column: index % 2 === 0 ? 'left' : 'right',
          imageUrl,
          imageAlt,
          content: extractContent(item),
          slug: item?.attributes?.slug,
        };
      }),
    [newsItems],
  );

  const handleClose = useCallback(
    (shouldUpdateQuery = true) => {
      const performClose = () => {
        setActiveNews(null);
        closeOverlayClasses();

        if (shouldUpdateQuery) {
          const { news: _news, ...rest } = router.query;
          const nextQuery = { ...rest };
          router.push({ pathname: router.pathname, query: nextQuery }, undefined, {
            shallow: true,
            scroll: false,
          });
        }
      };

      if (supportsViewTransition) {
        document.startViewTransition(() => {
          performClose();
        });
      } else {
        performClose();
      }
    },
    [closeOverlayClasses, router],
  );

  const handleOpen = useCallback(
    (news, { shouldUpdateQuery = true } = {}) => {
      const cardEl = cardRefs.current.get(news.item.id);
      const cardRect = cardEl?.getBoundingClientRect();
      const cardTop = cardRect?.top ?? 0;
      const cardHeight = cardRect?.height ?? 0;
      const cardOverflowAboveViewport = Math.max(0, -cardTop);

      const headlineEl = headlineRefs.current.get(news.item.id);
      const headlineRect = headlineEl?.getBoundingClientRect();
      const anchorTop = headlineRect?.top ?? cardTop;
      const anchorHeight = headlineRect?.height ?? 0;

      console.log('[news-overlay] before open', {
        id: news.item.id,
        slug: news.item?.attributes?.slug,
        cardTop,
        cardHeight,
        scrollY: window.scrollY,
        cardDocumentTop: window.scrollY + cardTop,
        viewportHeight: window.innerHeight,
        cardOverflowAboveViewport,
        anchorTop,
        anchorHeight,
      });

      const performOpen = () => {
        setActiveNews({
          ...news,
          cardTop,
          cardHeight,
          anchorTop,
          anchorHeight,
        });
        openOverlayClasses();

        if (shouldUpdateQuery) {
          const slug = news.item?.attributes?.slug;
          const currentSlugParam = router.query.news;
          const currentSlug = Array.isArray(currentSlugParam)
            ? currentSlugParam[0]
            : currentSlugParam;

          if (slug && currentSlug !== slug) {
            const nextQuery = { ...router.query, news: slug };
            router.push({ pathname: router.pathname, query: nextQuery }, undefined, {
              shallow: true,
              scroll: false,
            });
          }
        }
      };

      if (supportsViewTransition) {
        document.startViewTransition(() => {
          performOpen();
        });
      } else {
        performOpen();
      }
    },
    [openOverlayClasses, router],
  );

  useEffect(() => {
    if (!activeNews) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeNews, handleClose]);

  useEffect(() => {
    if (activeNews && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [activeNews]);

  useEffect(() => {
    if (status !== 'ready') {
      return;
    }

    const queryValue = router.query.news;
    const slugFromQuery = Array.isArray(queryValue) ? queryValue[0] : queryValue;

    if (slugFromQuery) {
      const target = enrichedNews.find(
        (news) => news.item?.attributes?.slug === slugFromQuery,
      );

      if (target && (!activeNews || activeNews.item.attributes.slug !== slugFromQuery)) {
        handleOpen(target, { shouldUpdateQuery: false });
      }
    } else if (!slugFromQuery && activeNews) {
      handleClose(false);
    }
  }, [activeNews, enrichedNews, handleClose, handleOpen, router.query.news, status]);

  useEffect(() => {
    if (!activeNews) {
      return undefined;
    }

    const overlay = overlayRef.current;
    const headline = overlayHeadlineRef.current;
    if (!overlay || !headline) {
      return undefined;
    }

    const { cardTop = 0, cardHeight = 0, anchorTop = cardTop, anchorHeight = 0 } = activeNews;

    const adjustScroll = () => {
      const overlayStyles = getComputedStyle(overlay);
      const paddingTop = parseFloat(overlayStyles.paddingTop || '0');
      const paddingBottom = parseFloat(overlayStyles.paddingBottom || '0');
      const viewportHeight = window.innerHeight;

      const overlayRect = overlay.getBoundingClientRect();
      const headlineOffset = headline.offsetTop;
      const headlineHeight = headline.offsetHeight;
      const maxScroll = Math.max(0, overlay.scrollHeight - overlay.clientHeight);

      const overlayMinViewportTop = overlayRect.top;
      const overlayMaxViewportTop = overlayRect.bottom - headlineHeight;
      const desiredViewportTop = Math.min(
        Math.max(anchorTop, overlayMinViewportTop),
        overlayMaxViewportTop,
      );

      const headlineViewportTop = headline.getBoundingClientRect().top;
      const delta = headlineViewportTop - desiredViewportTop;
      const calculatedScrollTop = Math.max(
        0,
        Math.min(overlay.scrollTop + delta, maxScroll),
      );

      overlay.scrollTop = calculatedScrollTop;

      const headlineViewportTopAfter = headline.getBoundingClientRect().top;
      const headlineDocumentTop = window.scrollY + headlineViewportTopAfter;
      const residualDelta = headlineViewportTopAfter - desiredViewportTop;

      if (Math.abs(residualDelta) > 0.5) {
        const adjustedScrollTop = Math.max(
          0,
          Math.min(overlay.scrollTop + residualDelta, maxScroll),
        );
        overlay.scrollTop = adjustedScrollTop;

        console.log('[news-overlay] follow-up adjustment', {
          id: activeNews.item.id,
          residualDelta,
          desiredViewportTop,
          adjustedScrollTop,
        });
      }

      console.log('[news-overlay] after open', {
        id: activeNews.item.id,
        cardTop,
        cardHeight,
        paddingTop,
        paddingBottom,
        viewportHeight,
        headlineOffset,
        headlineHeight,
        desiredViewportTop,
        maxScroll,
        calculatedScrollTop,
        headlineViewportTop: headlineViewportTopAfter,
        headlineDocumentTop,
        anchorTop,
        anchorHeight,
        delta,
        residualDelta,
      });
    };

    const raf = requestAnimationFrame(adjustScroll);

    return () => cancelAnimationFrame(raf);
  }, [activeNews]);

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

    return enrichedNews.map((news) => {
      const {
        item,
        column,
        imageUrl,
        imageAlt,
        content,
      } = news;

      const transitionId = `news-${item.id}`;
      const isActive = activeNews?.item.id === item.id;
      const enableCardTransition = supportsViewTransition && !isActive;

      const openNews = () => handleOpen(news);

      const firstAdditionalText = content.additionalBlocks.find(
        (block) => block?.__component === 'basic.text',
      );

      const excerptMarkdown = content.leadBlock?.text_block || firstAdditionalText?.text_block;

      return (
        <article
          key={item.id}
          className={`news-card news-card--${column}`}
          ref={(el) => {
            if (el) {
              cardRefs.current.set(item.id, el);
            } else {
              cardRefs.current.delete(item.id);
            }
          }}
        >
          {imageUrl && (
            <button type="button" className="news-card__image" onClick={openNews}>
              <img
                src={imageUrl}
                alt={imageAlt}
                loading="lazy"
                style={{ viewTransitionName: enableCardTransition ? `${transitionId}-image` : undefined }}
              />
            </button>
          )}

          <div className="news-card__header">
            <h3 className="news-card__title">
              <button type="button" onClick={openNews}>
                <span
                  style={{ viewTransitionName: enableCardTransition ? `${transitionId}-title` : undefined }}
                  dangerouslySetInnerHTML={{ __html: item?.attributes?.title || '' }}
                  ref={(el) => {
                    if (el) {
                      headlineRefs.current.set(item.id, el);
                    } else {
                      headlineRefs.current.delete(item.id);
                    }
                  }}
                />
              </button>
            </h3>

            <div className="news-card__date">{item?.attributes?.date}</div>
          </div>

          {excerptMarkdown && (
            <div className="news-card__excerpt">
              <MarkdownBlock>{excerptMarkdown}</MarkdownBlock>
            </div>
          )}

          <div className="read-more read-more-news">
            <button type="button" className="read-more-inner" onClick={openNews}>
              read more
            </button>
          </div>
        </article>
      );
    });
  }, [activeNews, enrichedNews, handleOpen, status]);

  return (
    <>
      <div id="news-container">{content}</div>

      {activeNews && (
        <>
          <button type="button" className="news-overlay-backdrop" onClick={handleClose} aria-label="Close news" />
          <aside
            className={`news-overlay news-overlay--${activeNews.column}`}
            role="dialog"
            aria-modal="true"
            aria-live="polite"
            aria-labelledby={`news-${activeNews.item.id}-overlay-title`}
            ref={overlayRef}
          >
            <button
              type="button"
              className="news-overlay__close"
              onClick={handleClose}
              ref={closeButtonRef}
            >
              <span className="visually-hidden">close</span>
            </button>

            {activeNews.imageUrl && (
              <div className="news-overlay__image">
                <img
                  src={activeNews.imageUrl}
                  alt={activeNews.imageAlt}
                  loading="lazy"
                  style={{ viewTransitionName: `news-${activeNews.item.id}-image` }}
                />
              </div>
            )}

            <h3
              className="news-overlay__headline"
              id={`news-${activeNews.item.id}-overlay-title`}
              ref={overlayHeadlineRef}
            >
              <span
                style={{ viewTransitionName: `news-${activeNews.item.id}-title` }}
                dangerouslySetInnerHTML={{ __html: activeNews.item.attributes.title || '' }}
              />
            </h3>

            <div className="news-overlay__date">{activeNews.item.attributes.date}</div>

            <div className="news-overlay__body">
              <MarkdownBlock>{activeNews.content.leadBlock?.text_block}</MarkdownBlock>

              {activeNews.content.additionalBlocks.map((block, index) =>
                renderBlock(block, `${activeNews.item.id}-additional-${index}`),
              )}

              {activeNews.content.footnotes && (
                <div className="news-overlay__footnotes">
                  <MarkdownBlock>{activeNews.content.footnotes}</MarkdownBlock>
                </div>
              )}
            </div>
          </aside>
        </>
      )}
    </>
  );
};

export default NewsSection;
