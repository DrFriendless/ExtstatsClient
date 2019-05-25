import React from "react";

import Layout from "../components/layout";
import SEO from "../components/seo";
import ExtstatsNavbar from "../components/navbar/extstatsNavbar";
import UserWidget from "../components/userWidget";
import PageTitle from "../components/pageTitle"

function UserPage(props) {
  return (<Layout>
      <SEO title="User Page" keywords={[`board`, `games`, `statistics`]}/>
      <ExtstatsNavbar/>
      <PageTitle title="User Page"/>
      <UserWidget/>
    </Layout>
  );
}

export default UserPage;
