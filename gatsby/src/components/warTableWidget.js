import React from "react";

const WarTableWidget = () => (
  <div
    dangerouslySetInnerHTML={{ __html: `
            <link rel="stylesheet" href="warTable/styles.css">
<war-table></war-table>
<script src="warTable/runtime.js" type="text/javascript"></script>
<script src="warTable/polyfills.js" type="text/javascript"></script>
<script src="warTable/main.js" type="text/javascript"></script>
` }} />
);

export default WarTableWidget;
