import React from "react";

const OwnedCollectionWidget = () => (
  <div
    dangerouslySetInnerHTML={{ __html: `
            <link rel="stylesheet" href="ownedCollection/styles.css">
<owned-collection></owned-collection>
<script src="ownedCollection/runtime.js" type="text/javascript"></script>
<script src="ownedCollection/polyfills.js" type="text/javascript"></script>
<script src="ownedCollection/main.js" type="text/javascript"></script>
` }} />
);

export default OwnedCollectionWidget;
