import React from "react";

import Layout from "../components/layout";
import SEO from "../components/seo";
import ExtstatsNavbar from "../components/navbar/extstatsNavbar";
import LoginButton from "../components/login/loginButton";
import UserCollectionWidget from "../components/userCollectionWidget";

function CollectionPage(props) {
  return (<Layout>
      <SEO title="Rated Games" keywords={[`board`, `games`, `statistics`, `collection`]}/>
      <ExtstatsNavbar/>
      <LoginButton/>
      <h1>Your Rated Games</h1>
      <UserCollectionWidget/>
    </Layout>
  );
}

export default CollectionPage;
