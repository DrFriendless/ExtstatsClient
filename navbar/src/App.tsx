import React, { Component } from 'react';
import './App.css';
import { Menu } from './Menu';
import { SubMenu } from './model';

class ExtstatsNavbar extends Component {
    private bggMenu: SubMenu = { name: 'BGG', style: "nav-bgg", items: [
            { link: "https://boardgamegeek.com/guild/2938", name: "Guild" },
            { link: "https://www.boardgamegeek.com/microbadge/6964", name: "Microbadge" },
            { link: "https://www.boardgamegeek.com/microbadge/33991", name: "Friends" }
        ]};
    private devMenu: SubMenu = { name: 'Developer', style: 'nav-github', items: [
        { link: "https://github.com/DrFriendless/ExtendedStatsServerless", name: "GitHub"},
        { link: "https://github.com/DrFriendless/ExtendedStatsServerless/blob/master/misc/Dev%20Doco.pdf", name: "Dev Doc" }
      ]};

  render() {
    return (
        <div role="navigation" className="extstats-navbar">
          <a href="/"><img src="/img/go.png" height="28px"/></a>
          <a className="navbar-button nav-wartable" href="/wartable.html">War Table</a>
          <a className="navbar-button nav-ranking" href="/rankings.html">Rankings</a>
          <a className="navbar-button nav-blog" href="http://blog.drfriendless.com">Blog</a>
          <a className="navbar-button nav-dataprot" href="/dataprotection.html">Privacy</a>
          <Menu name={this.bggMenu.name} items={this.bggMenu.items} style={this.bggMenu.style}/>
          <Menu name={this.devMenu.name} items={this.devMenu.items} style={this.devMenu.style}/>
          <a className="navbar-button nav-patreon" href="https://www.patreon.com/drfriendless">Patreon</a>
        </div>
    );
  }
}

export default ExtstatsNavbar;
