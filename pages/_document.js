import Document, { Html, Head, Main, NextScript } from "next/document"
import slugify from 'slugify';

class MyDocument extends Document {
  render() {
    // Extract the page path and generate a slug
    const pathName = this.props.__NEXT_DATA__.page;
    const slug = "slug-" + slugify(pathName);

    return (
      <Html>
        <Head>
          {/* eslint-disable-next-line */}
          <link rel="canonical" href="https://sonicacts.com/" />

          <script async src="https://unpkg.com/es-module-shims@1.6.3/dist/es-module-shims.js"></script>
          <script type="text/javascript" src="//s3.amazonaws.com/downloads.mailchimp.com/js/mc-validate.js"></script>

          <script src='https://api.mapbox.com/mapbox-gl-js/v2.9.1/mapbox-gl.js'></script>
          <link href='https://api.mapbox.com/mapbox-gl-js/v2.9.1/mapbox-gl.css' rel='stylesheet' />
          
          <script
            type="importmap"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                imports: {
                  three: './assets/js/build/three.module.js',
                  'three/addons/': './assets/js/jsm/'
                }
              })
            }}
          />
          
          <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js" />
          <script
            async
            src="https://cdn.jsdelivr.net/npm/uikit@3.2.3/dist/js/uikit-icons.min.js"
          />   
          <script async src="https://cdnjs.cloudflare.com/ajax/libs/jquery/1.8.3/jquery.min.js"/>
          <script async src="//npmcdn.com/isotope-layout@3/dist/isotope.pkgd.js"/>
          <script
            async
            src="https://www.googletagmanager.com/gtag/js?id=G-L6M1VKE89V"
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-L6M1VKE89V', { 'anonymize_ip': true });
              `,
            }}
          />
           <script
            async
            src="https://www.googletagmanager.com/gtag/js?id=GTM-N67ZLWP"
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'GTM-N67ZLWP', { 'anonymize_ip': true });
              `,
            }}
          />

          {/* Favicons to do */}

          <meta property="og:title" content="Sonic Acts Biennial 2026 🫠 Melted for Love" />
          <meta property="og:description" content="Celebrating 30 years of cutting-edge experiments in sound, moving image and contemporary theory 🟢 2 Feb - 24 Mar 2024" />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://2026.sonicacts.com" />
          {/* OG image to do */}

        </Head>
        <body className={slug}>

          <header id="main-header">
            <section class="minimal-nav">
              <ul class="group-1">
                <li><a href="/news" className={`${slug.includes('news') ? 'active' : ''}`}>News</a></li>
                <li><a href="/artists" className={`${slug.includes('artists') ? 'active' : ''}`}>Artists</a></li>
                <li><a href="/tickets" className={`${slug.includes('tickets') ? 'active' : ''}`}>Tickets</a></li>
                <li><a href="/visit" className={`${slug.includes('visit') ? 'active' : ''}`}>Visit</a></li>
              </ul>
              <ul>
                <li><a href="/programme" className={`${slug.includes('programme') ? 'active' : ''}`}>Programme</a></li>
                <li><a href="/timetable" className={`${slug.includes('timetable') ? 'active' : ''}`}>Timetable</a></li>
                <li><a href="/about" className={`${slug.includes('information') ? 'active' : ''}`}>Information</a></li>
              </ul>
            </section>
          </header>
          
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
