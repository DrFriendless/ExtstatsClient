import React from "react";

import Layout from "../components/layout";
import SEO from "../components/seo";
import ExtstatsNavbar from "../components/navbar/extstatsNavbar";
import SelectorsTestWidget from "../components/selectorsTestWidget";
import LoginButton from "../components/login/loginButton";

function SelectorsPage(props) {
  return (<Layout>
      <SEO title="Rankings" keywords={[`board`, `games`, `statistics`]}/>
      <ExtstatsNavbar/>
      <h1>Selector Test</h1>
      <SelectorsTestWidget/>
    </Layout>
  );
}

export default SelectorsPage;
