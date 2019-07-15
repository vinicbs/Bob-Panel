import React from 'react';
import Api from '../../utils/api'
import { ToastContainer, toast } from 'react-toastify';
import BottomScrollListener from 'react-bottom-scroll-listener'
import { ClipLoader } from 'react-spinners'
import { Button } from 'react-bootstrap'

import DeviceItem from '../../components/Devices/DeviceItem'
import './ScreenMain.scss'
import Utils from '../../utils/utils';


//Constants
const devicesPageSize = 50;

class ScreenMain extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            devices: [],

            page: 1,
            loading: false,
            reachedEnd: false,
            error: 0,

            showNewDevice: false
        };
    }

    componentDidMount() {
        this.fetchData(this.state.page, devicesPageSize);
    }

    async fetchData(page, pageSize) {
        this.setState({ loading: true });
        try {
            let response = await Api.devicesList(page, pageSize)

            //Check for errors
            if (Utils.checkForErrors(this, response.data)) { return; }

            let devicesList = response.data.data;
            let lastDevicesList = this.state.devices;

            if (devicesList.length > 0) {
                for (let i = 0; i < devicesList.length; i++) {
                    lastDevicesList.push(devicesList[i])
                    this.setState({ devices: lastDevicesList }, () => this.setState({ loading: false }))
                }
            } else {
                this.setState({ reachedEnd: true }, () => this.setState({ loading: false }))
            }
        } catch (err) {
            console.log(err);
            toast.error('Aconteceu algo inesperado, recarregue a pagina');
        }
    }

    renderDevices = () => {
        const devices = this.state.devices.map((device) => {
            return (
                <DeviceItem
                    onDeviceDelete={this.handleDeviceDelete}
                    onDeviceSave={this.handleDeviceSave}
                    onCloseEvent={this.handleRefreshDevice}
                    key={device.id}
                    item={device}
                />
            );
        });
        return devices
    }

    reachedBottomScroll = () => {
        if (!this.state.reachedEnd) {
            const page = this.state.page
            this.setState({ page: page + 1 })
            this.fetchData(this.state.page, devicesPageSize)
        }
    }

    render() {
        const { loading } = this.state
        return (
            <BottomScrollListener onBottom={this.reachedBottomScroll} >
                {scrollRef => (
                    <div ref={scrollRef} className="main-component">
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
                        <div className="devices-list">
                            <Button
                                className='device-list-button save'
                                as="input" type="submit" value="Adicionar Dispositivo"
                                disabled={loading}
                                onClick={this.handleShowNewDeviceModal}
                            />
                            {this.renderDevices()}
                        </div>
                        <ToastContainer position='bottom-left' />
                    </div>
                )}
            </BottomScrollListener>
        )
    }

    handleDeviceSave = async () => {
        this.setState({ devices: [], page: 1 })
        this.fetchData(1, devicesPageSize)
    }

    handleDeviceDelete = async (id) => {
        this.setState({ loading: true });
        let del = await Api.deviceDelete(id);
        if (Utils.checkForErrors(this, del.data)) { return; }

        if (del) {
            this.setState({ devices: [], page: 1 });
            this.fetchData(1, devicesPageSize);
        }
        this.setState({ loading: false });
    }

    handleShowNewDeviceModal = () => {
        this.setState({ showNewDevice: true })
    }
}

export default ScreenMain;