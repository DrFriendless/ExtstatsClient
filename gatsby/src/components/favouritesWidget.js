import React from "react";

const FavouritesWidget = () => (
  <div
    dangerouslySetInnerHTML={{ __html: `
            <link rel="stylesheet" href="favouritesWidget/styles.css">
<extstats-favourites></extstats-favourites>
<script src="favouritesWidget/runtime.js" type="text/javascript"></script>
<script src="favouritesWidget/polyfills.js" type="text/javascript"></script>
<script src="favouritesWidget/main.js" type="text/javascript"></script>
` }} />
);

export default FavouritesWidget;
