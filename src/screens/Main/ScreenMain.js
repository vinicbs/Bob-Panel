import React from 'react';

import mainLogo from '../../assets/images/LOGO.png';
import './ScreenMain.scss'


class ScreenMain extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            error: 0
        };
    }

    render() {
        return (
            <div className="main-component">
                <div className="logo-container">
                    <img src={mainLogo} alt="botao do bem" />
                </div>
            </div>
        )
    }
}

export default ScreenMain;