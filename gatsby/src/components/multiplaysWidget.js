import React from "react";

const MultiPlaysWidget = () => (
  <div
    dangerouslySetInnerHTML={{ __html: `
            <link rel="stylesheet" href="multiplaysWidget/styles.css">
<multiplays-widget></multiplays-widget>
<script src="multiplaysWidget/runtime.js" type="text/javascript"></script>
<script src="multiplaysWidget/polyfills.js" type="text/javascript"></script>
<script src="multiplaysWidget/main.js" type="text/javascript"></script>
` }} />
);

export default MultiPlaysWidget;
