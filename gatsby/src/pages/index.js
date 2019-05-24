import React from "react";

import Layout from "../components/layout";
import SEO from "../components/seo";
import FAQWidget from "../components/faqWidget";
import ExtstatsNavbar from "../components/navbar/extstatsNavbar";
import LoginButton from "../components/login/loginButton";

function IndexPage(props) {
  return (<Layout>
      <SEO title="Home" keywords={[`board`, `games`, `statistics`]}/>
      <ExtstatsNavbar/>
      <LoginButton/>
      <h1>Welcome to Extended Stats</h1>
      <FAQWidget/>
    </Layout>
  );
}

export default IndexPage;
