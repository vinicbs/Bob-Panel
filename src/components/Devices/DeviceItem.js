import React from 'react';

//import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap'
import { toast } from 'react-toastify';
import Modal from 'react-bootstrap/Modal';
import { Collapse } from 'react-collapse';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ClipLoader } from 'react-spinners'
//import Routes from '../../utils/routes'

import Api from '../../utils/api'
import Utils from '../../utils/utils'
import ContactItem from '../Contacts/ContactItem'

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
            loading: false
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
        const { openDevice, openContacts, nameDisplay, loading } = this.state;
        return (
            <div className="device-item">
                {loading && (
                    <div className="loadingScreen">
                        <ClipLoader
                            size={60}
                            sizeUnit={"px"}
                            color={"#ED3348"}
                            loading={loading}
                        />
                    </div>
                )}
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
                                <div className="device-item-contacts-box-header-icon" onClick={this.fetchContacts}>
                                    {openContacts ? <FontAwesomeIcon icon='caret-up' /> : <FontAwesomeIcon icon='caret-down' />}
                                </div>
                            </div>
                            <Collapse isOpened={openContacts}>
                                <div className="device-item-contacts-box-addNew">
                                    <Button
                                        className='device-item-contacts-box-addNew-button'
                                        as="input" type="submit" value="Adicionar novo contato"
                                        disabled={this.props.loading}
                                        onClick={this.handleNewContact}
                                    />
                                </div>
                                {this.renderContacts()}
                            </Collapse>
                        </div>
                        <div className='device-item-buttons-container'>
                            <Button
                                className='device-item-button'
                                as="input" type="submit" value="Histórico"
                                as="input" type="submit" value="Beep"
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
        this.setState({ openContacts: openContacts });
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

    // ### Contacts ###
    fetchContacts = async () => {
        if (!this.state.openContacts) {
            this.setState({ loading: true });
            try {
                let response = await Api.contactsList(this.state.id)

                //Check for errors
                if (Utils.checkForErrors(this, response.data)) { return; }

                let contactsList = response.data.data;
                this.setState({ contacts: contactsList }, () => {
                    this.setState({ loading: false })
                    this.handleOpenContacts();
                })

            } catch (err) {
                console.log(err);
                toast.error('Aconteceu algo inesperado, recarregue a pagina');
            }
        } else {
            this.handleOpenContacts();
        }
    }

    renderContacts = () => {
        const contacts = this.state.contacts.map((contact) => {
            return (
                <ContactItem
                    onContactDelete={this.handleContactDelete}
                    onContactSave={this.handleContactSave}
                    onCloseEvent={this.fetchContacts}
                    deviceId={this.state.id}
                    key={contact.id}
                    item={contact}
                />
            );
        });
        return contacts
    }

    handleNewContact = () => {
        const newContact = {
            id: 0,
            title: '',
            fullText: '',
            pictureUrl: '',
            createdAt: '',
        }
        let contacts = this.state.contacts;
        this.setState({ contacts: [...contacts, newContact] })
    }

    handleContactSave = () => {
        this.setState({ contacts: [] });
        this.fetchContacts();
    }

    handleContactDelete = async (id) => {
        this.setState({ loading: true });
        try {
            let del = await Api.contactDelete(id);
            if (Utils.checkForErrors(this, del.data)) { return; }

            if (del) {
                this.setState({ contacts: [] });
                this.fetchContacts();
            }
            this.setState({ loading: false });
        } catch (err) {
            console.log(err);
            toast.error('Aconteceu algo inesperado, recarregue a pagina');
        }
    }

}

export default DeviceItem;