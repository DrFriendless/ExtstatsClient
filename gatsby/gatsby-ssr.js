/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/ssr-apis/
 */

// we don't want any of Gatsby's preload rubbish.
exports.onPreRenderHTML = ({ pathname, getPostBodyComponents, replacePostBodyComponents, getHeadComponents, replaceHeadComponents }) => {
  const newHeadComponents = getHeadComponents().filter(hc =>
    hc.type !== 'link' ||
    !hc.props ||
    hc.props.rel !== 'preload'
  );
  replaceHeadComponents(newHeadComponents);
  const newBodyComponents = getPostBodyComponents().filter(bc => bc.type !== 'script');
  replacePostBodyComponents(newBodyComponents);
};