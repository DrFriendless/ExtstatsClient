import React from "react";

import Layout from "../components/layout";
import SEO from "../components/seo";
import ExtstatsNavbar from "../components/navbar/extstatsNavbar";
import PlaysWidget from "../components/playsWidget";
import LoginButton from "../components/login/loginButton";

function PlaysPage(props) {
  return (<Layout>
      <SEO title="Plays" keywords={[`board`, `games`, `statistics`, `plays`]}/>
      <ExtstatsNavbar/>
      <LoginButton/>
      <h1>Your Plays</h1>
      <PlaysWidget/>
    </Layout>
  );
}

export default PlaysPage;
