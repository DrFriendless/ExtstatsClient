import React from "react"

const FAQWidget = () => (
  <div
    dangerouslySetInnerHTML={{ __html: `
            <link rel="stylesheet" href="FAQWidget/styles.css">
<extstats-faq></extstats-faq>
<script src="FAQWidget/runtime.js" type="text/javascript"></script>
<script src="FAQWidget/polyfills.js" type="text/javascript"></script>
<script src="FAQWidget/main.js" type="text/javascript"></script>
` }} />
);

export default FAQWidget;
