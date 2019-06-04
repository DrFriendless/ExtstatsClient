import React, { Component } from 'react';
import './extstatsNavbar.css';
import { Menu } from './Menu';
import { SubMenu } from './model';

class ExtstatsNavbar extends Component {
  private bggMenu: SubMenu = { name: 'BGG', style: "nav-bgg", link: "", items: [
      { link: "https://boardgamegeek.com/guild/2938", name: "Guild" },
      { link: "https://www.boardgamegeek.com/microbadge/6964", name: "Microbadge" },
      { link: "https://www.boardgamegeek.com/microbadge/33991", name: "Friends" }
    ]};
  private devMenu: SubMenu = { name: 'Developer', style: 'nav-github', link: "", items: [
      { link: "https://github.com/DrFriendless/ExtendedStatsServerless", name: "GitHub"},
      { link: "https://github.com/DrFriendless/ExtendedStatsServerless/blob/master/misc/Dev%20Doco.pdf", name: "Dev Doc" },
      { link: "admin.html", name: "Admin" }
    ]};
  private blogMenu: SubMenu = { name: 'Blog', style: 'nav-blog', link: "http://blog.drfriendless.com", items: [
      { link: "http://blog.drfriendless.com/2018/09/08/welcome-to-new-users/", name: "Welcome"},
      { link: "http://blog.drfriendless.com/2018/08/12/what-use-are-users/", name: "Logins"},
    ]};

  render() {
    return (
      <div role="navigation" className="extstats-navbar">
        <a href="/"><img src={'img/go.png'}  height="28px"/></a>
        <a className="navbar-button nav-wartable" href="/wartable.html">War Table</a>
        <a className="navbar-button nav-ranking" href="/rankings.html">Rankings</a>
        <Menu {...this.blogMenu}/>
        <a className="navbar-button nav-dataprot" href="/dataprotection.html">Privacy</a>
        <Menu {...this.bggMenu}/>
        <Menu {...this.devMenu}/>
        <a className="navbar-button nav-patreon" href="https://www.patreon.com/drfriendless">Patreon</a>
      </div>
    );
  }
}

export default ExtstatsNavbar;
