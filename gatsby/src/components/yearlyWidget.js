import React from "react";

const YearlyWidget = () => (
    <div
dangerouslySetInnerHTML={{ __html: `
            <link rel="stylesheet" href="yearlyWidget/styles.css">
<yearly-widget></yearly-widget>
<script src="yearlyWidget/runtime.js" type="text/javascript"></script>
<script src="yearlyWidget/polyfills.js" type="text/javascript"></script>
<script src="yearlyWidget/main.js" type="text/javascript"></script>
` }} />
);

export default YearlyWidget;
