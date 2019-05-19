import React, { Component } from 'react';

const bggMenu = { name: 'BGG', style: "nav-bgg", items: [
    { link: "https://boardgamegeek.com/guild/2938", name: "Guild" },
    { link: "https://www.boardgamegeek.com/microbadge/6964", name: "Microbadge" },
    { link: "https://www.boardgamegeek.com/microbadge/33991", name: "Friends" }
  ]};
const devMenu = { name: 'Developer', style: 'nav-github', items: [
    { link: "https://github.com/DrFriendless/ExtendedStatsServerless", name: "GitHub"},
    { link: "https://github.com/DrFriendless/ExtendedStatsServerless/blob/master/misc/Dev%20Doco.pdf", name: "Dev Doc" }
  ]};

function NavbarButton(props) {
  return (
    <a className={"navbar-button " + props.style} href={props.link}>{props.name}
      <style jsx>{`
.navbar-button {
  border: 2px transparent solid;
  margin: 2px;
  height: 28px;
  width: 90px;
  font-size: 16px;
  line-height: 24px;
  text-decoration: none;
  display: inline-block;
  text-align: center;
}
.navbar-button:hover {
  border: 2px black solid;
}
.nav-wartable {
  background-color: #673fb4;
  color: white;
}
.nav-ranking {
  background-color: #e62565;
  color: white;
}
.nav-blog {
  background-color: #fc5830;
  color: black;
}
.nav-dataprot {
  background-color: #fdc02f;
  color: black;
}
.nav-patreon {
  background-color: #8cc152;
  color: white;
}
.nav-bgg {
  background-color: #fee94e;
  color: black;
}
.nav-github {
  background-color: #cdda49;
  color: black;
}
      `}</style>
    </a>
  );
}

class ExtstatsNavbar extends Component {
  render() {
    return (
      <div role="navigation" className="extstats-navbar">
        <a href="/"><img src="/img/go.png" height="28px"/></a>
        <NavbarButton style={"nav-wartable"} link={"/wartable.html"} name={"War Table"}/>
        <NavbarButton style={"nav-ranking"} link={"/rankings.html"} name={"Rankings"}/>
        <NavbarButton style={"nav-blog"} link={"http://blog.drfriendless.com"} name={"Blog"}/>
        <NavbarButton style={"nav-dataprot"} link={"/dataprotection.html"} name={"Privacy"}/>
        <Menu name={bggMenu.name} items={bggMenu.items} style={bggMenu.style}/>
        <Menu name={devMenu.name} items={devMenu.items} style={devMenu.style}/>
        <NavbarButton style={"nav-patreon"} link={"https://www.patreon.com/drfriendless"} name={"Patreon"}/>
        <style jsx>{`
.extstats-navbar {
  margin: 4px 0;
  display: flex;
}
.extstats-navbar .navbar-button {
  border: 2px transparent solid;
  margin: 2px;
  height: 28px;
  width: 90px;
  font-size: 16px;
  line-height: 24px;
  text-decoration: none;
  display: inline-block;
  text-align: center;
}
.extstats-navbar .navbar-button:hover {
  border: 2px black solid;
}
.extstats-navbar .navbar-menu {
  display: inline-block;
  position: relative;
}
      `}</style>
      </div>
    );
  }
}

function Menu(props) {
  return <div className="navbar-menu">
    <NavbarButton style={props.style} name={props.name}/>
    <div className="navbar-dropdown">
      {
        props.items.map(item =>
          <NavbarButton style={props.style} link={item.link} name={item.name}/>
        )
      }
    </div>
    <style jsx>{`
.navbar-menu .navbar-dropdown {
  display: none;
  z-index: 1;
  flex-direction: column;
  position: absolute;
}
.navbar-menu:hover .navbar-dropdown {
  display: flex;
}
.navbar-button {
  border: 2px transparent solid;
  margin: 2px;
  height: 28px;
  width: 90px;
  font-size: 16px;
  line-height: 24px;
  text-decoration: none;
  display: inline-block;
  text-align: center;
}
      `}</style>
  </div>;
}

export default ExtstatsNavbar;
