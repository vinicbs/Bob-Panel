import React from 'react';
import Api from '../../utils/api';
import Routes from '../../utils/routes'
import Utils from '../../utils/utils'

import { Redirect } from 'react-router-dom';
import { Button } from 'react-bootstrap'
import { BounceLoader } from 'react-spinners';
import { ToastContainer, toast } from 'react-toastify';
import ReactPhoneInput from 'react-phone-input-2'

import mainLogo from '../../assets/images/bob-blue-logo.png';
import './ScreenAuth.scss'
import 'react-toastify/dist/ReactToastify.css';
import 'react-phone-input-2/dist/style.css'


class ScreenAuth extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            register: false,

            email: '',
            password: '',
            name: '',
            phone: '',
            country: 'BRA',

            confirmPassword: '',
            error: 0
        };
    }

    onFormSubmit = async (event) => {
        event.preventDefault();

        let user = null;
        if (!this.state.email || !this.state.password) { return; }

        this.setState({ loading: true });
        try {
            user = await Api.login(this.state.email, this.state.password);
            if (Utils.checkForErrors(this, user.data)) {
                return this.setState({ loading: false });
            }
            this.props.onFormSubmit(user.data);

            return this.setState({ loading: false });
        } catch (err) {
            return;
        }
    }

    onRegisterSubmit = async (event) => {
        event.preventDefault();

        let user = null;
        console.log(this.state)
        if (!this.state.email || !this.state.password
            || !this.state.confirmPassword || !this.state.name
            || !this.state.phone) { return toast.error('Preencha todos os campos') }

        if (this.state.password !== this.state.confirmPassword) {return toast.error('Senhas não coincidem')}

        this.setState({ loading: true });
        try {
            user = await Api.register(this.state.email, this.state.password, this.state.name, this.state.phone, this.state.country);
            console.log(user);
            if (Utils.checkForErrors(this, user.data)) {
                return this.setState({ loading: false });
            }
            this.props.onFormSubmit(user.data);

            return this.setState({ loading: false });
        } catch (err) {
            return;
        }
    }

    handleKeyPress = (event) => {

        if (event.key === 'Enter') {
            if (this.state.register) {
                this.onRegisterSubmit(event);
            } else {
                this.onFormSubmit(event);
            }
        }
    }

    render() {
        let { from } = this.props.location.state || { from: { pathname: Routes.main } };
        if (this.props.logged) {
            return <Redirect to={from} />
        }

        return (
            <div className="auth-component">
                <div className="logo-container">
                    <img src={mainLogo} alt="botao do bem" />
                </div>
                {this.props.loading ? (
                    <div className="loading" style={{ height: '176px' }}>
                        <BounceLoader
                            sizeUnit={"px"}
                            size={60}
                            color={'#fff'}
                            loading={this.props.loading}
                        />
                    </div>
                ) : (
                        this.state.register ?
                            this.renderRegister() :
                            this.renderLogin()
                    )}
            </div>
        )
    }

    renderLogin() {
        return (
            <div className='input-container' onKeyPress={this.handleKeyPress}>
                {/* Email */}
                <div className="input-section">
                    <label className='input-label'>Email</label>
                    <input
                        type='text'
                        className='input-field'
                        value={this.state.email}
                        onChange={(event) => this.setState({ email: event.target.value })}
                    />
                </div>
                {/* Password */}
                <div className="input-section">
                    <label className='input-label'>Senha</label>
                    <input
                        type='password'
                        className='input-field'
                        value={this.state.password}
                        onChange={(event) => this.setState({ password: event.target.value })}
                    />
                </div>

                {/* Submit */}
                <div className='buttons-container'>
                    <Button
                        className='button'
                        as="input" type="submit" value="Entrar"
                        disabled={this.props.loading}
                        onClick={this.onFormSubmit}
                    />
                    <Button
                        className='button'
                        as="input" type="submit" value="Registrar"
                        disabled={this.props.loading}
                        onClick={this.handleRegisterOpen}
                    />
                </div>

                <ToastContainer position='bottom-left' />
            </div>
        );
    }

    renderRegister() {
        return (
            <div className='input-container' onKeyPress={this.handleKeyPress}>
                {/* Name */}
                <div className="input-section">
                    <label className='input-label'>Nome</label>
                    <input
                        type='text'
                        className='input-field'
                        value={this.state.name}
                        onChange={(event) => this.setState({ name: event.target.value })}
                    />
                </div>
                {/* Email */}
                <div className="input-section">
                    <label className='input-label'>Email</label>
                    <input
                        type='text'
                        className='input-field'
                        value={this.state.email}
                        onChange={(event) => this.setState({ email: event.target.value })}
                    />
                </div>
                {/* Password */}
                <div className="input-section">
                    <label className='input-label'>Senha</label>
                    <input
                        type='password'
                        className='input-field'
                        value={this.state.password}
                        onChange={(event) => this.setState({ password: event.target.value })}
                    />
                </div>
                {/* Confirm Password */}
                <div className="input-section">
                    <label className='input-label'>Confirmar Senha</label>
                    <input
                        type='password'
                        className='input-field'
                        value={this.state.confirmPassword}
                        onChange={(event) => this.setState({ confirmPassword: event.target.value })}
                    />
                </div>
                {/* Phone */}
                <div className="input-section">
                    <label className='input-label'>Telefone</label>
                    <ReactPhoneInput
                        containerStyle={{ marginTop: '10px', width: '100%' }}
                        inputStyle={{ width: '100%' }}
                        defaultCountry="br"
                        value={this.state.phone}
                        onChange={(value) => this.setState({ phone: value })}
                    />
                </div>

                {/* Submit */}
                <div className='buttons-container'>
                    <Button
                        className='button'
                        as="input" type="submit" value="Voltar"
                        disabled={this.props.loading}
                        onClick={this.handleRegisterClose}
                    />
                    <Button
                        className='button'
                        as="input" type="submit" value="Registrar"
                        disabled={this.props.loading}
                        onClick={this.onRegisterSubmit}
                    />
                </div>

                <ToastContainer position='bottom-left' />
            </div>
        );
    }

    handleRegisterOpen = () => {
        this.setState({ register: true });
    }

    handleRegisterClose = () => {
        this.setState({ register: false });
    }
}

export default ScreenAuth;