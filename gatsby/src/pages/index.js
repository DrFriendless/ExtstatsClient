import React from "react";

import Layout from "../components/layout";
import SEO from "../components/seo";
import FAQWidget from "../components/faqWidget";
import ExtstatsNavbar from "../components/navbar/extstatsNavbar";
import PageTitleWithLogin from "../components/pageTitleWithLogin";

function IndexPage(props) {
  return (<Layout>
      <SEO title="Home" keywords={[`board`, `games`, `statistics`]}/>
      <ExtstatsNavbar/>
      <PageTitleWithLogin title="Welcome to Extended Stats"/>
      <FAQWidget/>
    </Layout>
  );
}

export default IndexPage;
