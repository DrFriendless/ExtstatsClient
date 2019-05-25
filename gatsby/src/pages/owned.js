import React from "react";

import Layout from "../components/layout";
import SEO from "../components/seo";
import ExtstatsNavbar from "../components/navbar/extstatsNavbar";
import OwnedCollectionWidget from "../components/ownedCollectionWidget";
import PageTitleWithLogin from "../components/pageTitleWithLogin"

function OwnedPage(props) {
  return (<Layout>
      <SEO title="Owned Games" keywords={[`board`, `games`, `statistics`, `collection`]}/>
      <ExtstatsNavbar/>
      <PageTitleWithLogin title="Your Owned Games"/>
      <OwnedCollectionWidget/>
    </Layout>
  );
}

export default OwnedPage;
