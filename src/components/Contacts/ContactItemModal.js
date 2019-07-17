import React from 'react';

//import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap'
import Modal from 'react-bootstrap/Modal';
import { Collapse } from 'react-collapse';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactPhoneInput from 'react-phone-input-2'
//import Routes from '../../utils/routes'

import Api from '../../utils/api'
import Utils from '../../utils/utils'

import '../../styles/modal.scss'

class ContactItemModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            id: '',
            name: '',
            email: '',
            phone: '',
            deviceId: ''
        }
    }

    componentDidMount() {
        const { id, name, email, message, phone, deviceId, createdAt } = this.props.item;
        this.setState({
            id: id,
            name: name,
            email: email,
            message: message,
            phone: phone,
            deviceId: deviceId,
            createdAt: createdAt
        });
    };

    render() {
        return (
            <Modal
                show={this.props.showContactItemModal}
                onHide={this.props.closeContactItemModal}
                dialogClassName="modal-dialog-30w"
                className="modal">
                <Modal.Header closeButton>
                    <Modal.Title className="modal-title">{this.state.id === '' ? 'Novo Contato' : 'Editar Contato'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <div className="modal-input-group">
                            <div className="modal-input-section">
                                <label className='modal-input-label'>Nome: </label>
                                <input
                                    type='text'
                                    className='modal-input-field'
                                    value={this.state.name}
                                    onChange={(event) => this.setState({ name: event.target.value })}
                                />
                            </div>
                            <div className="modal-input-section">
                                <label className='modal-input-label'>Email: </label>
                                <input
                                    type='text'
                                    className='modal-input-field'
                                    value={this.state.email}
                                    onChange={(event) => this.setState({ email: event.target.value })}
                                />
                            </div>
                        </div>
                        <div className="modal-input-group">
                            <div className="modal-input-section">
                                <label className='modal-input-label'>Mensagem: </label>
                                <input
                                    type='text'
                                    className='modal-input-field'
                                    value={this.state.message}
                                    onChange={(event) => this.setState({ message: event.target.value })}
                                />
                            </div>
                        </div>
                        <div className="modal-input-group">
                            <div className="modal-input-section">
                                <label className='modal-input-label'>Telefone:   </label>
                                <div className='modal-input-field phone'>
                                    <ReactPhoneInput
                                        containerStyle={{ marginTop: '10px', width: '100%' }}
                                        inputStyle={{ width: '100%' }}
                                        defaultCountry="br"
                                        value={this.state.phone}
                                        onChange={(value) => this.setState({ phone: value })} />
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <div className="button-group">
                        <Button onClick={this.handleSaveContact} className="button save">Salvar</Button>
                    </div>
                </Modal.Footer>

            </Modal >
        )
    }

    handleSaveContact = async () => {
        const { id, name, email, message, phone, deviceId } = this.state;

        //Inputs validator
        let data = []
        data.push({ name: name ? name : '' });
        data.push({ email: email ? email : '' });
        data.push({ message: message ? message : '' });
        data.push({ phone: phone ? phone : '' });

        if (!Utils.elementsValidator(data)) { return; }

        //API save
        let resp = await Api.contactSave(id, deviceId, name, email, message, phone);
        if (Utils.checkForErrors(this, resp.data)) { return; }

        this.props.closeContactItemModal();
        this.props.saveContactItem();
    }
}

export default ContactItemModal;