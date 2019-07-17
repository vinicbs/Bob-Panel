import React from 'react';

//import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap'
import Modal from 'react-bootstrap/Modal';
import { Collapse } from 'react-collapse';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import Routes from '../../utils/routes'

import Api from '../../utils/api'
import Utils from '../../utils/utils'

import './ContactItem.scss'
import '../../styles/modal.scss'
import ContactItemModal from './ContactItemModal';

class ContactItem extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            nameDisplay: '',

            id: '',
            name: '',
            email: '',
            phone: '',
            deviceId: '',

            showEdit: false,
            showDelete: false,
        }
    }

    componentDidMount() {
        const { id, name, email, message, phone, created_at } = this.props.item;
        this.setState({
            id: id,
            name: name,
            email: email,
            message: message,
            phone: phone,
            deviceId: this.props.deviceId,
            createdAt: created_at
        }, () => {
            if (id === 0 || id === null) { this.setState({ showEdit: true }) }
        });
    };

    render() {
        return (
            <div className="contact-item">
                <div className="contact-item-name">
                    {this.state.name}
                </div>
                <div className='contact-item-buttons-container'>
                    <Button
                        className='contact-item-button delete'
                        as="input" type="submit" value="Deletar"
                        disabled={this.props.loading}
                        onClick={this.handleShowDelete}
                    />
                    <Button
                        className='contact-item-button save'
                        as="input" type="submit" value="Editar"
                        disabled={this.props.loading}
                        onClick={this.handleShowEdit}
                    />
                </div>

                <Modal
                    show={this.state.showDelete}
                    onHide={this.handleCloseDelete}
                    className="modal">
                    <Modal.Header closeButton>
                        <Modal.Title className="modal-title">Deletar Contato</Modal.Title>
                    </Modal.Header>

                    <Modal.Body style={{ minHeight: '100px', textAlign: 'center' }}>
                        <h3>O contato deletado não poderá ser recuperado. Você deseja continuar?</h3>
                    </Modal.Body>

                    <Modal.Footer>
                        <div className='button-group'>
                            <Button className='button delete' onClick={this.handleDelete}>Sim</Button>
                            <Button className='button return' onClick={this.handleCloseDelete}>Não</Button>
                        </div>
                    </Modal.Footer>
                </Modal>

                <ContactItemModal
                    showContactItemModal={this.state.showEdit}
                    closeContactItemModal={this.handleCloseEdit}
                    saveContactItem={this.handleSaveContact}
                    key={this.state.id}
                    item={this.state} />
            </div>
        )
    }

    handleSaveContact = () => {
        this.props.onContactSave();
    }

    handleShowDelete = () => {
        this.setState({ showDelete: true })
    }

    handleCloseDelete = () => {
        this.setState({ showDelete: false })
    }

    handleDelete = () => {
        this.props.onContactDelete(this.state.id);
        this.handleCloseDelete();
    }

    handleShowEdit = () => {
        this.setState({ showEdit: true });
    }

    handleCloseEdit = () => {
        this.setState({ showEdit: false });
        this.props.onCloseEvent();
    }
}

export default ContactItem;