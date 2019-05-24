import React from "react";

const UserCollectionWidget = () => (
  <div
    dangerouslySetInnerHTML={{ __html: `
            <link rel="stylesheet" href="userCollection/styles.css">
<user-collection></user-collection>
<script src="userCollection/runtime.js" type="text/javascript"></script>
<script src="userCollection/polyfills.js" type="text/javascript"></script>
<script src="userCollection/main.js" type="text/javascript"></script>
` }} />
);

export default UserCollectionWidget;
