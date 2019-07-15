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
                onHide={this.handleClose}
                dialogClassName="modal-dialog-90w"
                className="modal">
                <Modal.Header closeButton>
                    <Modal.Title className="modal-title">Novo dispositivo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <div className="modal-input-group modal-input-formation">
                            <label>nome</label>
                            <TextareaAutosize
                                style={{ resize: 'none' }}
                                maxRows={1}
                                value={this.state.name}
                                onChange={e => this.setState({ name: e.target.value })}
                                placeholder="digite aqui o nome do dispositivo..."
                                async />
                            <br></br><br></br>
                            <label>imei</label>
                            <TextareaAutosize
                                style={{ resize: 'none' }}
                                maxRows={1}
                                value={this.state.imei}
                                onChange={e => this.setState({ imei: e.target.value })}
                                placeholder="digite aqui o código imei do dispositivo..."
                                async />
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <div className="button-group">
                        <Button onClick={this.handleSaveDevice} className="button save">Salvar</Button>
                    </div>
                </Modal.Footer>

            </Modal>
        )
    }
}

export default NewDeviceModal;