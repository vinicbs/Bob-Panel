import React from 'react';

//import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap'
import Modal from 'react-bootstrap/Modal';
import { Collapse } from 'react-collapse';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import Routes from '../../utils/routes'

import Api from '../../utils/api'
import Utils from '../../utils/utils'

import '../../styles/modal.scss'

class NewDeviceModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            imei: ''
        }
    }

    render() {
        return (
            <Modal
                show={this.props.showNewDeviceModal}
                onHide={this.props.closeNewDeviceModal}
                dialogClassName="modal-dialog-30w"
                className="modal">
                <Modal.Header closeButton>
                    <Modal.Title className="modal-title">Novo dispositivo</Modal.Title>
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
                                <label className='modal-input-label'>IMEI: </label>
                                <input
                                    type='text'
                                    className='modal-input-field'
                                    value={this.state.imei}
                                    onChange={(event) => this.setState({ imei: event.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <div className="button-group">
                        <Button onClick={this.handleSaveDevice} className="button save">Salvar</Button>
                    </div>
                </Modal.Footer>

            </Modal >
        )
    }

    handleSaveDevice = async () => {
        const { name, imei } = this.state;

        //Inputs validator
        let data = []
        data.push({ name: name ? name : '' });
        data.push({ imei: imei ? imei : '' });

        if (!Utils.elementsValidator(data)) { return; }

        //API save
        let resp = await Api.deviceSave('', name, imei);
        if (Utils.checkForErrors(this, resp.data)) { return; }

        this.props.closeNewDeviceModal();
        this.props.addNewDevice();
    }
}

export default NewDeviceModal;