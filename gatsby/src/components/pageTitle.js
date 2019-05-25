import PropTypes from "prop-types";
import React from "react";

const pageTitleStyle = {
  marginBottom: 40,
  marginTop: 20
};

const PageTitle = ({ title }) => (
  <h1 style={pageTitleStyle}>{title}</h1>
);

PageTitle.propTypes = {
  title: PropTypes.string,
};

PageTitle.defaultProps = {
  siteTitle: ``,
};

export default PageTitle;
