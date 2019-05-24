import React from "react";

import Layout from "../components/layout";
import SEO from "../components/seo";
import ExtstatsNavbar from "../components/navbar/extstatsNavbar";
import MultiPlaysWidget from "../components/multiplaysWidget";
import LoginButton from "../components/login/loginButton";

function MultiPlaysPage(props) {
  return (<Layout>
      <SEO title="Comparative Plays" keywords={[`board`, `games`, `statistics`, `plays`]}/>
      <ExtstatsNavbar/>
      <LoginButton/>
      <h1>Comparative Plays</h1>
      <MultiPlaysWidget/>
    </Layout>
  );
}

export default MultiPlaysPage;
