import React from 'react';

//import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap'
import Modal from 'react-bootstrap/Modal';
import { Collapse } from 'react-collapse';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import Routes from '../../utils/routes'

import Api from '../../utils/api'
import Utils from '../../utils/utils'

import './DeviceItem.scss'
import '../../styles/modal.scss'

class DeviceItem extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            nameDisplay: '',
            contacts: [],

            id: '',
            name: '',
            imei: '',
            createdAt: '',

            openDevice: false,
            openContacts: false,
            showDelete: false,
        }
    }

    componentDidMount() {
        const { id, name, imei, created_at } = this.props.item;
        this.setState({
            id: id,
            nameDisplay: name,
            name: name,
            imei: imei,
            createdAt: created_at,
        });
    };

    render() {
        const { openDevice, openContacts, nameDisplay } = this.state;
        return (
            <div className="device-item">
                <div className="device-item-header">
                    <div className="device-item-name">
                        {nameDisplay}
                    </div>
                    <div className="device-item-icon" onClick={this.handleOpenDevice}>
                        {openDevice ? <FontAwesomeIcon icon='caret-up' /> : <FontAwesomeIcon icon='caret-down' />}
                    </div>
                </div>
                <Collapse isOpened={openDevice}>
                    <div className="device-item-body">
                        <div className="device-item-input-group">
                            <div className="device-item-input-section">
                                <label className='device-item-input-label'>Nome: </label>
                                <input
                                    type='text'
                                    className='device-item-input-field'
                                    value={this.state.name}
                                    onChange={(event) => this.setState({ name: event.target.value })}
                                />
                            </div>
                            <div className="device-item-input-section">
                                <label className='device-item-input-label'>IMEI: </label>
                                <input
                                    type='text'
                                    className='device-item-input-field'
                                    value={this.state.imei}
                                    onChange={(event) => this.setState({ imei: event.target.value })}
                                />
                            </div>
                        </div>
                        <div className="device-item-contacts-box">
                            <div className="device-item-contacts-box-header">
                                <div className="device-item-contacts-box-header-name">
                                    Contatos
                                </div>
                                <div className="device-item-contacts-box-header-icon" onClick={this.handleOpenContacts}>
                                    {openContacts ? <FontAwesomeIcon icon='caret-up' /> : <FontAwesomeIcon icon='caret-down' />}
                                </div>
                            </div>
                            <Collapse isOpened={openContacts}>
                                Contatos
                            </Collapse>
                        </div>
                        <div className='device-item-buttons-container'>
                            <Button
                                className='device-item-button'
                                as="input" type="submit" value="Histórico"
                                disabled={this.props.loading}
                                onClick={this.handleShowDeviceHistory}
                            />
                            <Button
                                className='device-item-button'
                                as="input" type="submit" value="Pedidos de ajuda"
                                disabled={this.props.loading}
                                onClick={this.handleShowDeviceBeeps}
                            />
                        </div>
                    </div>
                    <div className="device-item-footer">
                        <div className='device-item-buttons-container'>
                            <Button
                                className='device-item-button delete'
                                as="input" type="submit" value="Deletar"
                                disabled={this.props.loading}
                                onClick={this.handleShowDelete}
                            />
                            <Button
                                className='device-item-button save'
                                as="input" type="submit" value="Salvar"
                                disabled={this.props.loading}
                                onClick={this.handleSaveDevice}
                            />
                        </div>
                    </div>
                </Collapse>

                <Modal
                    show={this.state.showDelete}
                    onHide={this.handleCloseDelete}
                    className="modal">
                    <Modal.Header closeButton>
                        <Modal.Title className="modal-title">Deletar Dispositivo</Modal.Title>
                    </Modal.Header>

                    <Modal.Body style={{ minHeight: '100px', textAlign: 'center' }}>
                        <h3>O dispositivo deletado não poderá ser recuperado. Você deseja continuar?</h3>
                    </Modal.Body>

                    <Modal.Footer>
                        <div className='button-group'>
                            <Button className='button delete' onClick={this.handleDelete}>Sim</Button>
                            <Button className='button return' onClick={this.handleCloseDelete}>Não</Button>
                        </div>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }

    handleOpenDevice = () => {
        const openDevice = !this.state.openDevice;
        this.setState({ openDevice: openDevice })
    }

    handleOpenContacts = () => {
        const openContacts = !this.state.openContacts;
        this.setState({ openContacts: openContacts })
    }

    handleSaveDevice = async () => {
        const { id, name, imei } = this.state

        //Inputs validator
        let data = []
        data.push({ name: name ? name : '' })
        data.push({ imei: imei ? imei : '' })

        if (!Utils.elementsValidator(data)) { return; }

        //API save
        let resp = await Api.deviceSave(id, name, imei)
        if (Utils.checkForErrors(this, resp.data)) { return; }

        this.props.onDeviceSave()
    }

    handleShowDelete = () => {
        this.setState({ showDelete: true })
    }

    handleCloseDelete = () => {
        this.setState({ showDelete: false })
    }

    handleDelete = () => {
        this.props.onDeviceDelete(this.state.id);
        this.handleCloseDelete();
    }
}

export default DeviceItem;