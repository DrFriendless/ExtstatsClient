import React from "react";

import Layout from "../components/layout";
import SEO from "../components/seo";
import ExtstatsNavbar from "../components/navbar/extstatsNavbar";
import UserCollectionWidget from "../components/userCollectionWidget";
import PageTitleWithLogin from "../components/pageTitleWithLogin";

function CollectionPage(props) {
  return (<Layout>
      <SEO title="Rated Games" keywords={[`board`, `games`, `statistics`, `collection`]}/>
      <ExtstatsNavbar/>
      <PageTitleWithLogin title="Your Rated Games"/>
      <UserCollectionWidget/>
    </Layout>
  );
}

export default CollectionPage;
