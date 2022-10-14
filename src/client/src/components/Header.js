import { Link } from 'react-router-dom';
import { useLocation } from "react-router-dom";

export default function Header() {
    //assigning location variable
    const location = useLocation();
    //destructuring pathname from location
    const { pathname } = location;
    //Javascript split method to get the name of the path in array
    const splitLocation = pathname.split("/");
    const handleActiveLinkClassName = (linkName) => splitLocation[1] === linkName ? "app-header-nav-item active" : "app-header-nav-item";
    return <div className="app-header">
        <div className="app-header-wrap">
            <div className="app-header-title">
                <a href={"/"} className="app-header-title-link"><h2>Anti Gaspi</h2></a>
            </div>
            <nav className="app-header-nav">
                <div className={handleActiveLinkClassName('create-offer')}>
                    <Link to={"/create-offer"} className="app-header-nav-item-link">
                        <div className="app-header-nav-item-inside-link">Déclarer</div>
                    </Link>
                </div>
                <div className={handleActiveLinkClassName('offers')}>
                    <Link to={"/offers"} className="app-header-nav-item-link">
                        <div className="app-header-nav-item-inside-link">Annonces</div>
                    </Link>
                </div>
                <div className={handleActiveLinkClassName('about')}>
                    <Link to={"/about"} className="app-header-nav-item-link">
                        <div className="app-header-nav-item-inside-link">À propos</div>
                    </Link>
                </div>
            </nav>
        </div>
    </div>
}