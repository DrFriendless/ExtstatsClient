import PropTypes from "prop-types";
import React from "react";
import PageTitle from "./pageTitle"
import LoginButton from "./login/loginButton";

const pageTitleWithLoginStyle = {

};

const PageTitleWithLogin = ({ title }) => (
  <div style={pageTitleWithLoginStyle}>
    <LoginButton/>
    <PageTitle title={title}/>
  </div>
);

PageTitleWithLogin.propTypes = {
  title: PropTypes.string,
};

PageTitleWithLogin.defaultProps = {
  siteTitle: ``,
};

export default PageTitleWithLogin;
