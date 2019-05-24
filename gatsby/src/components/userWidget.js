import React from "react";

const UserWidget = () => (
  <div
    dangerouslySetInnerHTML={{ __html: `
            <link rel="stylesheet" href="userWidget/styles.css">
<extstats-user-config></extstats-user-config>
<script src="userWidget/runtime.js" type="text/javascript"></script>
<script src="userWidget/polyfills.js" type="text/javascript"></script>
<script src="userWidget/main.js" type="text/javascript"></script>
` }} />
);

export default UserWidget;
