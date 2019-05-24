import React from "react";

const MonthlyWidget = () => (
  <div
    dangerouslySetInnerHTML={{ __html: `
            <link rel="stylesheet" href="monthlyWidget/styles.css">
<monthly-plays></monthly-plays>
<script src="monthlyWidget/runtime.js" type="text/javascript"></script>
<script src="monthlyWidget/polyfills.js" type="text/javascript"></script>
<script src="monthlyWidget/main.js" type="text/javascript"></script>
` }} />
);

export default MonthlyWidget;
