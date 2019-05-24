import React from "react";

const GeekWidget = () => (
  <div
    dangerouslySetInnerHTML={{ __html: `
            <link rel="stylesheet" href="geekWidget/styles.css">
<extstats-geek></extstats-geek>
<script src="geekWidget/runtime.js" type="text/javascript"></script>
<script src="geekWidget/polyfills.js" type="text/javascript"></script>
<script src="geekWidget/main.js" type="text/javascript"></script>
` }} />
);

export default GeekWidget;
