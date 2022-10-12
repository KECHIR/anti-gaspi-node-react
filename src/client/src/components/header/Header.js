import './Header.css';

function Header () {
    return (
        <div className='app-header'>
              <div key ="header" className="flex justify-between">
              <a key="logoLink"  href="/">
                <img key="logo" ></img>
            </a>
            <ul>
                <li> Déclarer </li>
                <li> Annonces </li>
                <li> A propos </li>
            </ul>
        </div>
        </div>
    );
}

export default Header;