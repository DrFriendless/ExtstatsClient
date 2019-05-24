import React from "react";

import Layout from "../components/layout";
import SEO from "../components/seo";
import ExtstatsNavbar from "../components/navbar/extstatsNavbar";
import MonthlyWidget from "../components/monthlyWidget";
import LoginButton from "../components/login/loginButton";

function MonthlyPage(props) {
  return (<Layout>
      <SEO title="Plays by Month" keywords={[`board`, `games`, `statistics`, `plays`, `monthly`]}/>
      <ExtstatsNavbar/>
      <LoginButton/>
      <h1>Your Plays by Month</h1>
      <MonthlyWidget/>
    </Layout>
  );
}

export default MonthlyPage;
