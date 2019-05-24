import React from "react";

const AdminWidget = () => (
  <div
    dangerouslySetInnerHTML={{ __html: `
            <link rel="stylesheet" href="adminWidget/styles.css">
<extstats-admin></extstats-admin>
<script src="adminWidget/runtime.js" type="text/javascript"></script>
<script src="adminWidget/polyfills.js" type="text/javascript"></script>
<script src="adminWidget/main.js" type="text/javascript"></script>
` }} />
);

export default AdminWidget;
