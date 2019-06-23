import React from "react";

const UpdatesWidget = () => (
  <div
    dangerouslySetInnerHTML={{ __html: `
            <link rel="stylesheet" href="updatesWidget/styles.css">
<extstats-updates></extstats-updates>
<script src="updatesWidget/runtime.js" type="text/javascript"></script>
<script src="updatesWidget/polyfills.js" type="text/javascript"></script>
<script src="updatesWidget/main.js" type="text/javascript"></script>
` }} />
);

export default UpdatesWidget;
