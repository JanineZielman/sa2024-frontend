import { getStrapiMedia } from "../lib/media"
import NextImage from "next/image"

const Image = ({ image, layout, objectFit, sizes  }) => {
  if (!image) {
    return null;
  }

  const { name, alternativeText, width, height, formats = {} } = image;

  const pickFormatForWidth = (requestedWidth) => {
    const availableFormats = Object.values(formats || {}).filter(Boolean);

    if (!availableFormats.length || !requestedWidth) {
      return image;
    }

    const sortedFormats = [...availableFormats].sort((a, b) => a.width - b.width);
    const matchingFormat = sortedFormats.find((format) => format.width >= requestedWidth);

    return matchingFormat || sortedFormats[sortedFormats.length - 1] || image;
  };

  const buildSrc = (format) => {
    const target = format?.url ? format : image;

    if (!target?.url) {
      return '';
    }

    return getStrapiMedia(target);
  };

  const defaultFormat = pickFormatForWidth(width);
  const src = buildSrc(defaultFormat);
  const isSvg = image?.mime === 'image/svg+xml' || src?.toLowerCase().endsWith('.svg');

  const resolvedAlt = alternativeText
    ? `Sonic Acts ${alternativeText}`
    : `Sonic Acts ${name}`;

  if (!src) {
    return null;
  }

  const baseProps = {
    layout,
    objectFit,
    src,
    alt: resolvedAlt,
    sizes,
    className: "img",
  };

  if (isSvg) {
    baseProps.unoptimized = true;
  }

  if (layout === 'fill') {
    return <NextImage {...baseProps} />;
  }

  return (
    <NextImage
      {...baseProps}
      width={width || defaultFormat.width || 300}
      height={height || defaultFormat.height || 300}
    />
  );
};

export default Image
