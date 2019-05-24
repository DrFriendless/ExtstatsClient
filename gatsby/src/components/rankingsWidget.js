import React from "react";

const RankingsWidget = () => (
  <div
    dangerouslySetInnerHTML={{ __html: `
            <link rel="stylesheet" href="rankingTable/styles.css">
<ranking-table></ranking-table>
<script src="rankingTable/runtime.js" type="text/javascript"></script>
<script src="rankingTable/polyfills.js" type="text/javascript"></script>
<script src="rankingTable/main.js" type="text/javascript"></script>
` }} />
);

export default RankingsWidget;
