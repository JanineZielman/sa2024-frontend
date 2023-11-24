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
            src="https://www.googletagmanager.com/gtag/js?id=G-7W61454VLF"
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-7W61454VLF', { 'anonymize_ip': true });
              `,
            }}
          />

          <link rel="apple-touch-icon" sizes="180x180" href="/assets/favicon/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/assets/favicon/favicon-16x16.png" />
          <link rel="manifest" href="/assets/favicon/site.webmanifest" />
          <link rel="mask-icon" href="/assets/favicon/safari-pinned-tab.svg" color="#5bbad5" />
          <meta name="msapplication-TileColor" content="#da532c" />
          <meta name="theme-color" content="#ffffff" />

        </Head>
        <body className={slug}>

          <div id="small-logo">
            <a href="/">
              <svg viewBox="0 0 884.17 190.55">
                <g id="uuid-4e905d36-81e9-4306-a530-1142fa44a9db"><path class="uuid-4c84452d-7097-4022-a1de-bfb3db769bbe" d="M391.74,128.09c0-35.69,24.44-57.62,55.37-57.62,26.32,0,45.64,13.93,52.81,37.77l-.54,.25c-7.1-23.85-26.23-38.03-52.27-38.03-30.63,0-54.81,21.93-54.81,57.62s19.54,57.62,54.81,57.62c23.65,0,43.81-14.02,51.25-33.86l.54,.26c-7.52,19.84-27.26,33.61-51.79,33.61-34.91,0-55.37-22.73-55.37-57.62Z"/><polyline class="uuid-4c84452d-7097-4022-a1de-bfb3db769bbe" points="307.99 94.63 307.99 6.3 313.9 6.3 361.49 94.63 367.52 94.63 367.52 6.3"/><line class="uuid-4c84452d-7097-4022-a1de-bfb3db769bbe" x1="380.73" y1="94.61" x2="380.73" y2="6.3"/><g><path class="uuid-4c84452d-7097-4022-a1de-bfb3db769bbe" d="M223.61,29.1c-41.31,0-73.96,29.87-73.96,78.48s29.22,78.44,73.96,78.44c-44.29,0-73.21-30.95-73.21-78.44S182.7,29.1,223.61,29.1Z"/><path class="uuid-4c84452d-7097-4022-a1de-bfb3db769bbe" d="M223.64,29.1c40.92,0,73.23,29.87,73.23,78.46s-28.94,78.46-73.23,78.46c44.75,0,73.96-30.95,73.96-78.46S264.96,29.1,223.64,29.1Z"/><path class="uuid-4c84452d-7097-4022-a1de-bfb3db769bbe" d="M5.37,107.98l-.66,.17c7.94,35.39,29.23,53.33,66.09,55.11-36.48-1.78-57.56-19.89-65.42-55.28Z"/><path class="uuid-4c84452d-7097-4022-a1de-bfb3db769bbe" d="M86.19,81.07l-14.91-1.96,14.76,1.96c23.65,3.18,50.96,9.7,50.96,38.06,0,22.91-22.51,44.26-59.95,44.28h.03c37.84,0,60.58-21.37,60.58-44.28,0-28.36-27.58-34.88-51.48-38.06Z"/><path class="uuid-4c84452d-7097-4022-a1de-bfb3db769bbe" d="M77.02,163.41h.03c-2.14,0-4.2-.05-6.24-.15,2.02,.1,4.09,.15,6.21,.15Z"/><path class="uuid-4c84452d-7097-4022-a1de-bfb3db769bbe" d="M67.36,6.66c.93-.03,1.85-.04,2.78-.04-.93,0-1.86,.02-2.78,.04Z"/><path class="uuid-4c84452d-7097-4022-a1de-bfb3db769bbe" d="M60.79,7.19s.02,0,.04,0c-.01,0-.02,0-.04,0Z"/><path class="uuid-4c84452d-7097-4022-a1de-bfb3db769bbe" d="M64.26,6.81c.08,0,.16-.01,.24-.02-.08,0-.16,.01-.24,.02Z"/><path class="uuid-4c84452d-7097-4022-a1de-bfb3db769bbe" d="M66.87,6.68c.16,0,.33-.02,.49-.02-.16,0-.33,.01-.49,.02Z"/><path class="uuid-4c84452d-7097-4022-a1de-bfb3db769bbe" d="M60.83,7.19c.79-.09,1.58-.17,2.38-.23-.8,.07-1.59,.15-2.38,.23Z"/><path class="uuid-4c84452d-7097-4022-a1de-bfb3db769bbe" d="M64.5,6.79c.79-.05,1.58-.08,2.37-.11-.79,.03-1.58,.06-2.37,.11Z"/><path class="uuid-4c84452d-7097-4022-a1de-bfb3db769bbe" d="M63.21,6.95c.23-.02,.45-.03,.68-.05-.23,.02-.46,.03-.68,.05Z"/><path class="uuid-4c84452d-7097-4022-a1de-bfb3db769bbe" d="M66.31,78.73l4.96,.66-4.92-.66c-19.19-2.24-50.5-11.01-50.5-35.02C15.86,21.95,36.95,9.87,60.79,7.19c-11.77,1.3-22.89,4.83-31.18,10.65,8.99-6.54,21.47-10.2,34.65-11.04-25.78,1.6-48.96,13.78-48.96,36.91s31.61,32.78,51.02,35.02Z"/><path class="uuid-4c84452d-7097-4022-a1de-bfb3db769bbe" d="M67.1,6.71c.44-.02,.88-.04,1.31-.05-.44,.01-.88,.04-1.31,.05Z"/><path class="uuid-4c84452d-7097-4022-a1de-bfb3db769bbe" d="M68.42,6.66c.91-.03,1.82-.04,2.73-.04-.91,0-1.82,.01-2.73,.04Z"/><path class="uuid-4c84452d-7097-4022-a1de-bfb3db769bbe" d="M63.89,6.9c.62-.05,1.25-.09,1.87-.13-.63,.04-1.25,.08-1.87,.13Z"/><path class="uuid-4c84452d-7097-4022-a1de-bfb3db769bbe" d="M65.76,6.77c.45-.03,.89-.04,1.34-.06-.45,.02-.89,.04-1.34,.06Z"/><path class="uuid-4c84452d-7097-4022-a1de-bfb3db769bbe" d="M131.86,44.28l.61-.17c-3.12-9.19-7.45-17.11-18.23-25.44-9.79-7.44-24.22-11.87-43.25-12.11,18.84,.24,33.14,4.67,42.83,12.11,10.68,8.33,14.96,16.42,18.03,25.61Z"/></g></g><g id="uuid-514d37b2-1dd5-4146-ba34-2555850c3f28"><path class="uuid-1b36f86d-6d74-44e6-b3b4-37d62bac4ab9" d="M749.27,115.63c-10.71,29.76-35.46,45.14-65.18,44.86-43.81,0-71.52-38.08-70.21-81.23-.39-42.82,33.01-75.29,70.85-75.29,28.76,0,57.39,16.97,65.88,50.51l-1.14,.37c-8.32-33.53-36.6-50.88-64.79-50.88-37.08,0-70.04,32.47-69.66,75.29-1.29,43.16,26.1,81.23,69.03,81.23,29.13,.29,53.61-15.72,64.09-45.48l1.13,.62Z"/><path class="uuid-1b36f86d-6d74-44e6-b3b4-37d62bac4ab9" d="M761.04,74.12v111.19m45.09-111.19h-90.18"/><path class="uuid-9d9bc929-5ee4-43c3-9eb8-663d32bb7904" d="M806.12,89.22l-.37,.1c4.45,19.82,16.37,29.86,37.01,30.86-20.43-1-32.24-11.14-36.64-30.96"/><path class="uuid-1b36f86d-6d74-44e6-b3b4-37d62bac4ab9" d="M806.12,89.22l-.37,.1c4.45,19.82,16.37,29.86,37.01,30.86-20.43-1-32.24-11.14-36.64-30.96Z"/><path class="uuid-9d9bc929-5ee4-43c3-9eb8-663d32bb7904" d="M851.37,74.15l-8.35-1.1,8.27,1.1c13.25,1.78,28.54,5.43,28.54,21.32,0,12.83-12.6,24.78-33.57,24.79-1.2,0-2.35-.03-3.49-.09,1.13,.06,2.29,.09,3.48,.09h.04c21.19,0,33.93-11.97,33.93-24.79,0-15.88-15.45-19.53-28.83-21.32"/><path class="uuid-1b36f86d-6d74-44e6-b3b4-37d62bac4ab9" d="M851.37,74.15l-8.35-1.1,8.27,1.1c13.25,1.78,28.54,5.43,28.54,21.32,0,12.83-12.6,24.78-33.57,24.79-1.2,0-2.35-.03-3.49-.09,1.13,.06,2.29,.09,3.48,.09h.04c21.19,0,33.93-11.97,33.93-24.79,0-15.88-15.45-19.53-28.83-21.32Z"/><path class="uuid-9d9bc929-5ee4-43c3-9eb8-663d32bb7904" d="M811.99,53.23c0-13.94,14.87-20.78,30.4-20.78-15.69,0-30.72,6.84-30.72,20.78s17.7,18.36,28.57,19.61l2.78,.37-2.75-.37c-10.75-1.25-28.28-6.17-28.28-19.61"/><path class="uuid-1b36f86d-6d74-44e6-b3b4-37d62bac4ab9" d="M811.99,53.23c0-13.94,14.87-20.78,30.4-20.78-15.69,0-30.72,6.84-30.72,20.78s17.7,18.36,28.57,19.61l2.78,.37-2.75-.37c-10.75-1.25-28.28-6.17-28.28-19.61Z"/><path class="uuid-9d9bc929-5ee4-43c3-9eb8-663d32bb7904" d="M842.39,32.46c.31,0,.62,0,.92,0-.3,0-.62,0-.92,0"/><path class="uuid-1b36f86d-6d74-44e6-b3b4-37d62bac4ab9" d="M842.39,32.46c.31,0,.62,0,.92,0-.3,0-.62,0-.92,0Z"/><path class="uuid-9d9bc929-5ee4-43c3-9eb8-663d32bb7904" d="M867.09,39.2c-5.48-4.17-13.12-6.6-23.78-6.74,10.55,.13,18.11,2.57,23.54,6.74,5.98,4.66,8.38,9.19,10.1,14.34l.34-.1c-1.75-5.15-4.17-9.58-10.21-14.25"/><path class="uuid-1b36f86d-6d74-44e6-b3b4-37d62bac4ab9" d="M867.09,39.2c-5.48-4.17-13.12-6.6-23.78-6.74,10.55,.13,18.11,2.57,23.54,6.74,5.98,4.66,8.38,9.19,10.1,14.34l.34-.1c-1.75-5.15-4.17-9.58-10.21-14.25Z"/><path class="uuid-1b36f86d-6d74-44e6-b3b4-37d62bac4ab9" d="M531.7,134.82h78.65m20.92,50.64l-57.4-156.02h-5.3l-58.22,156.02"/></g>
              </svg>
            </a>
          </div>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
