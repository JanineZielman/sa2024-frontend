import { getStrapiMedia } from "../lib/media"
import NextImage from "next/image"

const Image = ({ image, layout, objectFit, sizes  }) => {
  const { name, alternativeText, width, height } = image

  const loader = ({ width, quality }) => {
    return `${getStrapiMedia(image.formats?.medium ? image.formats.medium : image)}`
  }

  let imgUrl = image.formats?.medium ? image.formats.medium : image;

  return (
    <>
    {imgUrl.url?.startsWith("/") &&
    <>
    {layout == 'fill' ?
      <NextImage
        loader={loader}
        layout={layout}
        objectFit={objectFit}
        src={getStrapiMedia(imgUrl)}
        alt={`Sonic Acts ${alternativeText}` || `Sonic Acts ${name}`}
        sizes={sizes}
        className="img"
      />
    :
     <NextImage
        loader={loader}
        layout={layout}
        width={width || 300} 
        height={height || 300}
        objectFit={objectFit}
        src={getStrapiMedia(imgUrl)}
        alt={`Sonic Acts ${alternativeText}` || `Sonic Acts ${name}`}
        sizes={sizes}
        className="img"
      />
    }
    </>
    }
    </>
  )
}

export default Image
