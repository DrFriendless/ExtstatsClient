import React from "react";

import Layout from "../components/layout";
import SEO from "../components/seo";
import ExtstatsNavbar from "../components/navbar/extstatsNavbar";
import GeekWidget from "../components/geekWidget";
import LoginButton from "../components/login/loginButton";

function GeekPage(props) {
  return (<Layout>
      <SEO title="Geek Home" keywords={[`board`, `games`, `statistics`]}/>
      <ExtstatsNavbar/>
      <LoginButton/>
      <h1>Geek Home</h1>
      <GeekWidget/>
    </Layout>
  );
}

export default GeekPage;
