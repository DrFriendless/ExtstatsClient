import { SubMenu } from './model';
import React from 'react';

export function Menu(props: SubMenu) {
    return <div className="navbar-menu">
        <a className={"navbar-button " + props.style} href={props.link}>{props.name}</a>
        <div className="navbar-dropdown">
            {
                props.items.map(item =>
                    <a className={"navbar-button " + props.style} href={item.link}>
                        {item.name}
                    </a>)
            }
        </div>
    </div>;
}

const GEEK_SUB_MENUS = [
    { id: "geekcollection", style: "geek-collection", name: "Collection" },
    { id: "geekowned", style: "geek-owned", name: "Owned Games" },
    { id: "geekfavourites", style: "geek-favourites", name: "Favourites" },
    { id: "geekplays", style: "geek-plays", name: "Plays" },
    { id: "geekmonthly", style: "geek-monthly", name: "By Month" },
    { id: "geekyearly", style: "geek-yearly", name: "By Year" },
    { id: "geekcomparative", style: "geek-comparative", name: "Compare" },
    { id: "geekupdates", style: "geek-updates", name: "Updates" },
];

export function GeekMenu() {
    return <div id="geekmenu" className="navbar-menu">
        <a id="geeklink" className={"navbar-button geekmenu-button"}>Home</a>
        <div className="navbar-dropdown">
            {
                GEEK_SUB_MENUS.map(item =>
                    <a id={item.id} className={"navbar-button " + item.style}>
                        {item.name}
                    </a>)
            }
        </div>
        <div dangerouslySetInnerHTML={{ __html: `
<script type="text/javascript">
function showHideGeekButton() {
    const geek = getQueryVariable("geek");
    if (geek) {
        document.getElementById("geekmenu").classList.remove("hidden");
        document.getElementById("geeklink").setAttribute("href", "/geek.html?geek=" + geek);
        document.getElementById("geekcollection").setAttribute("href", "/collection.html?geek=" + geek);
        document.getElementById("geekowned").setAttribute("href", "/owned.html?geek=" + geek);
        document.getElementById("geekfavourites").setAttribute("href", "/favourites.html?geek=" + geek);
        document.getElementById("geekplays").setAttribute("href", "/plays.html?geek=" + geek);
        document.getElementById("geekmonthly").setAttribute("href", "/monthly.html?geek=" + geek);
        document.getElementById("geekyearly").setAttribute("href", "/yearly.html?geek=" + geek);
        document.getElementById("geekcomparative").setAttribute("href", "/multiplays.html?geek=" + geek);
        document.getElementById("geekupdates").setAttribute("href", "/updates.html?geek=" + geek);
    } else {
        document.getElementById("geekmenu").classList.add("hidden");
    }
}

function getQueryVariable(variable) {
    const query = window.location.search.substring(1);
    const vars = query.split("&");
    for (let i=0; i<vars.length; i++) {
        const pair = vars[i].split("=");
        if (pair[0] === variable) return pair[1];
    }
    return false;
}

window.addEventListener("load", () => {
  showHideGeekButton();
});
</script>
` }} />
    </div>;
}
