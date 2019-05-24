import React from "react";

import Layout from "../components/layout";
import SEO from "../components/seo";
import ExtstatsNavbar from "../components/navbar/extstatsNavbar";

function DataProtectionPage(props) {
  return (<Layout>
      <SEO title="Data Policy" keywords={[`board`, `games`, `statistics`, `privacy`]}/>
      <ExtstatsNavbar/>
      <a name="privacyes"><h2>The Extended Stats Privacy Policy</h2></a>
      <p>
        Extended Stats gathers publically available data from boardgamegeek.com, including data about specific users of that site.
        If you are a user of boardgamegeek.com and you no longer wish Extended Stats to gather your data, please send a private message to Friendless on boardgamegeek.com and request that your data no longer be gathered.
        When you are removed from <a href="https://pastebin.com/REGME8sF">the list of BoardGameGeek.com users</a>, all data in the Extended Stats database regarding that user will be deleted.
      </p>
      <a name="privacydf"><h2>The DrFriendless.com Privacy Policy</h2></a>
      <p>
        If you create an account on drfriendless.com, DrFriendless also holds data about you as a user of drfriendless.com.
        (something about a user page which doesn't exist yet)
      </p>
      <a name="gdpr"><h2>General Data Protection Regulations</h2></a>
      <p>

      </p>
    </Layout>
  );
}

export default DataProtectionPage;
