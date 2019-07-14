import React from "react";
import { Link } from "react-router-dom";

import Routes from "../../utils/routes";

import mainLogo from "../../assets/images/ICON.png"
import CheeseburgerMenu from "cheeseburger-menu";
import HamburgerMenu from "react-hamburger-menu";

import "./Header.scss";

class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isMobile: false,

      menuOpen: false
    };
  }

  componentDidMount() {
    window.addEventListener("resize", this.resize.bind(this));
    this.resize();
  }

  resize() {
    if (window.innerWidth <= 800) {
      this.setState({ isMobile: true });
    } else {
      this.setState({ isMobile: false });
    }
  }

  render() {
    if (!this.props.logged) {
      return null;
    }

    if (this.state.isMobile) {
      return this.renderMobile();
    } else {
      return this.renderWeb();
    }
  }

  renderWeb() {
    return (
      <div className="header">
        <div className="header-abs-item logo left">
          <Link className="header-item" to={Routes.login}>
            <img src={mainLogo} alt="SLC" />
          </Link>
        </div>
        <div className="header-menu">
          <Link className="header-item" to={Routes.contacts} title="contatos">
            Contatos
          </Link>
        </div>
        <div className="header-abs-item header-menu right leave">
          <div onClick={this.props.onUserLogout} className="header-item">
            Sair
          </div>
        </div>
      </div>
    );
  }

  openMenu() {
    this.setState({ menuOpen: true });
  }

  closeMenu() {
    this.setState({ menuOpen: false });
  }

  renderMobile() {
    return (
      <div className="header" style={{ justifyContent: "space-around" }}>
        <div className="header-abs-item logo" style={{ position: "relative" }}>
          <Link className="header-item" to={Routes.login}>
            <img src={mainLogo} alt="Bob" />
          </Link>
        </div>
        <CheeseburgerMenu
          isOpen={this.state.menuOpen}
          closeCallback={this.closeMenu.bind(this)}
        >
          <div className="mobile-menu">
            <Link
              className="menu-item"
              to={Routes.contacts}
              onClick={this.closeMenu}
            >
              Contatos
            </Link>
            <Link className="menu-item" onClick={this.props.onUserLogout}>
              Sair
            </Link>
          </div>
        </CheeseburgerMenu>

        <HamburgerMenu
          isOpen={this.state.menuOpen}
          menuClicked={this.openMenu.bind(this)}
          width={30}
          height={24}
          strokeWidth={3}
          rotate={0}
          color="white"
          borderRadius={0}
          animationDuration={0.5}
        />
      </div>
    );
  }
}

export default Header;
