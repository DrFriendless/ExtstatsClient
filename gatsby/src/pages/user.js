import React from "react";

import Layout from "../components/layout";
import SEO from "../components/seo";
import ExtstatsNavbar from "../components/navbar/extstatsNavbar";
import UserWidget from "../components/userWidget";
import LoginButton from "../components/login/loginButton";

function UserPage(props) {
  return (<Layout>
      <SEO title="Rankings" keywords={[`board`, `games`, `statistics`]}/>
      <ExtstatsNavbar/>
      <h1>Selector Test</h1>
      <UserWidget/>
    </Layout>
  );
}

export default UserPage;
