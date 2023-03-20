class VPet {
    constructor() {
        this.reader = NaN;
        this.writer = NaN;
        this.port = NaN;
        this.baudRate = NaN;
        this.stopReading = false;
        this.packetNumber = 0;
        this.serialAttached = false;
    }

    setBaudRate(baudRate) {
        this.baudRate = baudRate;
    }

    attachSerial() {
        return new Promise((resolve, reject) => {
            navigator.serial.requestPort().then((port) => {
                this.port = port;
                if(this.openPort()) {
                    this.serialAttached = true;
                    resolve(true);
                } else {
                    reject(new Error("Failed to open port."));
                }
            }).catch(error => {reject(error);});
        })
    }

    isSerialAttached() {
        return this.serialAttached;
    }

    openPort() {
        return new Promise((resolve, reject) => {        
            this.port.open({baudRate: this.baudRate}).then(port => {
                try {
                    this.reader = this.port.readable.getReader();
                    this.writer = this.port.writable.getWriter();
                } catch (e) {
                    console.log(e);
                    reject(new Error("communicator.js: Failed to open port for communication"));
                } finally {
                    resolve(true)
                }
            }).catch(err => reject(new Error("communicator.js: Failed to open port for communication")));
        });
    }

    enableReadWrite() {
    }
    
    writeData(data) {
        const encoder = new TextEncoder();
        this.writer.write(encoder.encode(data + "\r\n"));
    }

    async readData() {
        const decoder = new TextDecoder();
        var serialBuffer = "";
        var transmitting = true;
        var i = 0;

        try {
            var data;

            while (transmitting) {
                const { value, done } = await this.reader.read();

                if ((data === this.packetNumber) && (decoder.decode(value).includes("t"))) {
                        transmitting = false;
                }
                
                serialBuffer += decoder.decode(value);
                data = serialBuffer.split("r:").length - 1;
                console.log(decoder.decode(value));
            }
        } catch (error) {
            console.log(error)
        } finally {
            var dataTransmission = serialBuffer.split("\r\n");
            dataTransmission = dataTransmission[dataTransmission.length - 2];

            console.log(dataTransmission);
        }

        return dataTransmission;
}

    setPacketNumber(digirom) {
        digirom = digirom.substring(3).split("-");
        this.packetNumber = digirom.length;

        return this.packetNumber;
    }

    closeConnection() {
        console.log("Disconnecting serial port...")
        this.stopReading = true;
        this.reader.releaseLock();
        this.writer.releaseLock();

        this.port.close();
        this.port.forget();
    }
}
