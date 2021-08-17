export default function getSVGData(type) {
  const svgData = new Map();

  /* To add new SVG follow below pattern
      svgData.set('svgName, {
        svg: `svg element to draw the required shape`,
        scaleX: shrink the svg horizontally,
        scaleY: shrink the svg vertically,
        left: pixel value to place text element horizontally(it is used in SVGEditor.js),
        top: pixel value to place text element vertically(it is used in SVGEditor.js),
      })
  */
  svgData.set('Humidity', {
    svg: `<?xml version="1.0" encoding="iso-8859-1"?>
    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
       viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve">
    <path style="fill:#84DBFF;" d="M438.4,329.6C438.4,430.933,356.267,512,256,512S73.6,430.933,73.6,329.6S256,0,256,0
      S438.4,229.333,438.4,329.6z"/>
    <path style="fill:#FFFFFF;" d="M256,464c-73.6,0-134.4-59.733-134.4-134.4c0-8.533,7.467-16,16-16s16,7.467,16,16
      c0,56.533,45.867,102.4,102.4,102.4c8.533,0,16,7.467,16,16S264.533,464,256,464z"/></svg>`,
    scaleX: 0.1,
    scaleY: 0.1,
    left: 17,
    top: 20
  })

    .set('Temperature', {
      svg: `<svg height="464pt" viewBox="0 0 464 464.03564" width="464pt" xmlns="http://www.w3.org/2000/svg">
      <path d="m256.019531 318.398438v-286.398438c0-17.671875-14.328125-32-32-32-17.675781 0-32 14.328125-32 32v286.398438c.023438 5.328124-2.644531 10.308593-7.097656 13.234374-20.433594 13.171876-32.816406 35.789063-32.902344 60.101563.25 38.847656 30.960938 70.652344 69.773438 72.265625 32.261719 1.015625 61.253906-19.578125 70.917969-50.371094 9.664062-30.796875-2.363282-64.261718-29.421876-81.859375-4.53125-2.9375-7.269531-7.96875-7.269531-13.371093zm0 0" fill="#d0ecf4"/>
      <g fill="#29485a"><path d="m352.019531 48h-64c-4.421875 0-8-3.582031-8-8s3.578125-8 8-8h64c4.417969 0 8 3.582031 8 8s-3.582031 8-8 8zm0 0"/><path d="m320.019531 80h-32c-4.421875 0-8-3.582031-8-8s3.578125-8 8-8h32c4.417969 0 8 3.582031 8 8s-3.582031 8-8 8zm0 0"/><path d="m352.019531 112h-64c-4.421875 0-8-3.582031-8-8s3.578125-8 8-8h64c4.417969 0 8 3.582031 8 8s-3.582031 8-8 8zm0 0"/><path d="m320.019531 144h-32c-4.421875 0-8-3.582031-8-8s3.578125-8 8-8h32c4.417969 0 8 3.582031 8 8s-3.582031 8-8 8zm0 0"/></g><path d="m231.859375 352.800781c.066406-.265625.121094-.53125.160156-.800781v-120c0-4.417969-3.582031-8-8-8-4.421875 0-8 3.582031-8 8v120c.035157.269531.089844.535156.160157.800781-20.167969 4.03125-33.992188 22.695313-31.96875 43.164063 2.027343 20.464844 19.242187 36.058594 39.808593 36.058594 20.5625 0 37.777344-15.59375 39.804688-36.058594 2.023437-20.46875-11.800781-39.132813-31.964844-43.164063zm0 0" fill="#ed1c24"/></svg>`,
      scaleX: 0.15,
      scaleY: 0.12,
      left: 37,
      top: 73
    })

    .set('Greendot', {
      svg: `<svg aria-hidden="true" data-prefix="fas" data-icon="circle" class="svg-inline--fa fa-circle fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="green" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8z"></path></svg>`,
      scaleX: 0.05,
      scaleY: 0.05,
      left: 9,
      top: 5
    })

    .set('Smokedetectorred', {
      svg: `<?xml version="1.0" encoding="iso-8859-1"?>
      <!-- Generator: Adobe Illustrator 19.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
      <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
         viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve">
      <path style="fill:#D5DCED;" d="M85.333,331.852v18.963c24.901,22.081,91.806,37.926,170.667,37.926s145.766-15.845,170.667-37.926
        v-18.963H85.333z"/>
      <path style="fill:#C7CFE2;" d="M341.333,379.259c-78.86,0-145.766-15.845-170.667-37.926v-9.481H85.333v18.963
        c24.901,22.081,91.806,37.926,170.667,37.926c37.398,0,72.034-3.596,100.85-9.698C351.733,379.179,346.564,379.259,341.333,379.259z
        "/>
      <path style="fill:#E4EAF8;" d="M436.148,350.815H75.852c-10.473,0-18.963-8.489-18.963-18.963v-28.444h398.222v28.444
        C455.111,342.324,446.62,350.815,436.148,350.815z"/>
      <path style="fill:#D5DCED;" d="M170.667,331.852v-28.444H56.889v28.444c0,10.472,8.491,18.963,18.963,18.963H189.63
        C179.156,350.815,170.667,342.324,170.667,331.852z"/>
      <polygon style="fill:#AFB9D2;" points="502.519,237.037 9.481,237.037 56.889,312.889 455.111,312.889 "/>
      <polygon style="fill:#959CB5;" points="256,237.037 9.481,237.037 56.889,312.889 256,312.889 "/>
      <polygon style="fill:#464655;" points="483.556,237.037 28.444,237.037 75.852,312.889 436.148,312.889 "/>
      <path style="fill:#E4EAF8;" d="M502.519,256H9.481C4.245,256,0,251.755,0,246.519V132.741c0-5.236,4.245-9.481,9.481-9.481h493.037
        c5.236,0,9.481,4.245,9.481,9.481v113.778C512,251.755,507.755,256,502.519,256z"/>
      <circle style="fill:#FF5050;" cx="256" cy="189.63" r="28.444"/>
      <path style="fill:#C84146;" d="M270.222,203.852c-15.71,0-28.444-12.735-28.444-28.444c0-4.168,0.946-8.098,2.558-11.665
        c-9.877,4.46-16.78,14.345-16.78,25.887c0,15.71,12.735,28.444,28.444,28.444c11.541,0,21.427-6.903,25.887-16.78
        C278.319,202.905,274.391,203.852,270.222,203.852z"/>
      <path style="fill:#D5DCED;" d="M132.741,246.519V132.741c0-5.236,4.245-9.481,9.481-9.481H9.481c-5.236,0-9.481,4.245-9.481,9.481
        v113.778C0,251.755,4.245,256,9.481,256h132.741C136.985,256,132.741,251.755,132.741,246.519z"/>
      <g>
        <rect x="75.852" y="256" style="fill:#959CB5;" width="18.963" height="56.889"/>
        <rect x="113.778" y="256" style="fill:#959CB5;" width="18.963" height="56.889"/>
        <rect x="151.704" y="256" style="fill:#959CB5;" width="18.963" height="56.889"/>
      </g>
      <g>
        <rect x="189.63" y="256" style="fill:#AFB9D2;" width="18.963" height="56.889"/>
        <rect x="227.556" y="256" style="fill:#AFB9D2;" width="18.963" height="56.889"/>
        <rect x="265.481" y="256" style="fill:#AFB9D2;" width="18.963" height="56.889"/>
        <rect x="303.407" y="256" style="fill:#AFB9D2;" width="18.963" height="56.889"/>
        <rect x="341.333" y="256" style="fill:#AFB9D2;" width="18.963" height="56.889"/>
        <rect x="379.259" y="256" style="fill:#AFB9D2;" width="18.963" height="56.889"/>
        <rect x="417.185" y="256" style="fill:#AFB9D2;" width="18.963" height="56.889"/>
      </g>
      <g>
      </g>
      <g>
      </g>
      <g>
      </g>
      <g>
      </g>
      <g>
      </g>
      <g>
      </g>
      <g>
      </g>
      <g>
      </g>
      <g>
      </g>
      <g>
      </g>
      <g>
      </g>
      <g>
      </g>
      <g>
      </g>
      <g>
      </g>
      <g>
      </g>
      </svg>
      `,
      scaleX: 0.15,
      scaleY: 0.15,
      left: 190,
      top: 5
    })
    .set('Smokedetectorgreen', {
      svg: `<?xml version="1.0" encoding="iso-8859-1"?>
      <!-- Generator: Adobe Illustrator 19.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
      <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
         viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve">
      <path style="fill:#D5DCED;" d="M85.333,331.852v18.963c24.901,22.081,91.806,37.926,170.667,37.926s145.766-15.845,170.667-37.926
        v-18.963H85.333z"/>
      <path style="fill:#C7CFE2;" d="M341.333,379.259c-78.86,0-145.766-15.845-170.667-37.926v-9.481H85.333v18.963
        c24.901,22.081,91.806,37.926,170.667,37.926c37.398,0,72.034-3.596,100.85-9.698C351.733,379.179,346.564,379.259,341.333,379.259z
        "/>
      <path style="fill:#E4EAF8;" d="M436.148,350.815H75.852c-10.473,0-18.963-8.489-18.963-18.963v-28.444h398.222v28.444
        C455.111,342.324,446.62,350.815,436.148,350.815z"/>
      <path style="fill:#D5DCED;" d="M170.667,331.852v-28.444H56.889v28.444c0,10.472,8.491,18.963,18.963,18.963H189.63
        C179.156,350.815,170.667,342.324,170.667,331.852z"/>
      <polygon style="fill:#AFB9D2;" points="502.519,237.037 9.481,237.037 56.889,312.889 455.111,312.889 "/>
      <polygon style="fill:#959CB5;" points="256,237.037 9.481,237.037 56.889,312.889 256,312.889 "/>
      <polygon style="fill:#464655;" points="483.556,237.037 28.444,237.037 75.852,312.889 436.148,312.889 "/>
      <path style="fill:#E4EAF8;" d="M502.519,256H9.481C4.245,256,0,251.755,0,246.519V132.741c0-5.236,4.245-9.481,9.481-9.481h493.037
        c5.236,0,9.481,4.245,9.481,9.481v113.778C512,251.755,507.755,256,502.519,256z"/>
      <circle style="fill:#16DA23;" cx="256" cy="189.63" r="28.444"/>
      <path style="fill:#35853B;" d="M270.222,203.852c-15.71,0-28.444-12.735-28.444-28.444c0-4.168,0.946-8.098,2.558-11.665
        c-9.877,4.46-16.78,14.345-16.78,25.887c0,15.71,12.735,28.444,28.444,28.444c11.541,0,21.427-6.903,25.887-16.78
        C278.319,202.905,274.391,203.852,270.222,203.852z"/>
      <path style="fill:#D5DCED;" d="M132.741,246.519V132.741c0-5.236,4.245-9.481,9.481-9.481H9.481c-5.236,0-9.481,4.245-9.481,9.481
        v113.778C0,251.755,4.245,256,9.481,256h132.741C136.985,256,132.741,251.755,132.741,246.519z"/>
      <g>
        <rect x="75.852" y="256" style="fill:#959CB5;" width="18.963" height="56.889"/>
        <rect x="113.778" y="256" style="fill:#959CB5;" width="18.963" height="56.889"/>
        <rect x="151.704" y="256" style="fill:#959CB5;" width="18.963" height="56.889"/>
      </g>
      <g>
        <rect x="189.63" y="256" style="fill:#AFB9D2;" width="18.963" height="56.889"/>
        <rect x="227.556" y="256" style="fill:#AFB9D2;" width="18.963" height="56.889"/>
        <rect x="265.481" y="256" style="fill:#AFB9D2;" width="18.963" height="56.889"/>
        <rect x="303.407" y="256" style="fill:#AFB9D2;" width="18.963" height="56.889"/>
        <rect x="341.333" y="256" style="fill:#AFB9D2;" width="18.963" height="56.889"/>
        <rect x="379.259" y="256" style="fill:#AFB9D2;" width="18.963" height="56.889"/>
        <rect x="417.185" y="256" style="fill:#AFB9D2;" width="18.963" height="56.889"/>
      </g>
      <g>
      </g>
      <g>
      </g>
      <g>
      </g>
      <g>
      </g>
      <g>
      </g>
      <g>
      </g>
      <g>
      </g>
      <g>
      </g>
      <g>
      </g>
      <g>
      </g>
      <g>
      </g>
      <g>
      </g>
      <g>
      </g>
      <g>
      </g>
      <g>
      </g>
      </svg>      
      `,
      scaleX: 0.15,
      scaleY: 0.15,
      left: 34,
      top: 5
    })
  return svgData.get(type);
}