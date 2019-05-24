import React from "react";

const SelectorsTestWidget = () => (
  <div
    dangerouslySetInnerHTML={{ __html: `
            <link rel="stylesheet" href="selectorTest/styles.css">
<extstats-selector-test></extstats-selector-test>
<script src="selectorTest/runtime.js" type="text/javascript"></script>
<script src="selectorTest/polyfills.js" type="text/javascript"></script>
<script src="selectorTest/main.js" type="text/javascript"></script>
` }} />
);

export default SelectorsTestWidget;
