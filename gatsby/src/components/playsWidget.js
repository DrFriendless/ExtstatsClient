import React from "react";

const PlaysWidget = () => (
  <div
    dangerouslySetInnerHTML={{ __html: `
            <link rel="stylesheet" href="playsWidget/styles.css">
<plays-widget></plays-widget>
<script src="playsWidget/runtime.js" type="text/javascript"></script>
<script src="playsWidget/polyfills.js" type="text/javascript"></script>
<script src="playsWidget/main.js" type="text/javascript"></script>
` }} />
);

export default PlaysWidget;
