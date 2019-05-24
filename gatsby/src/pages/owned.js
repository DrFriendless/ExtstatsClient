import React from "react";

import Layout from "../components/layout";
import SEO from "../components/seo";
import ExtstatsNavbar from "../components/navbar/extstatsNavbar";
import OwnedCollectionWidget from "../components/ownedCollectionWidget";
import LoginButton from "../components/login/loginButton";

function OwnedPage(props) {
  return (<Layout>
      <SEO title="Owned Games" keywords={[`board`, `games`, `statistics`, `collection`]}/>
      <ExtstatsNavbar/>
      <LoginButton/>
      <h1>Your Owned Games</h1>
      <OwnedCollectionWidget/>
    </Layout>
  );
}

export default OwnedPage;
