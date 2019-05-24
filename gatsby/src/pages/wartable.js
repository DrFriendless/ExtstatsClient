import React from "react";

import Layout from "../components/layout";
import SEO from "../components/seo";
import WarTableWidget from "../components/warTableWidget";
import ExtstatsNavbar from "../components/navbar/extstatsNavbar";
import LoginButton from "../components/login/loginButton";

function WarTablePage(props) {
  return (<Layout>
      <SEO title="War Table" keywords={[`board`, `games`, `statistics`]}/>
      <ExtstatsNavbar/>
      <LoginButton/>
      <h1>The War Table</h1>
      <WarTableWidget/>
    </Layout>
  );
}

export default WarTablePage;
