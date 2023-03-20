class VPet {
    constructor() {
        // Serial protocol stuff
        this.reader = NaN;
        this.writer = NaN;
        this.port = NaN;
        this.baudRate = NaN;

        // DigiROM stuff
        this.nPackets = 0;
        this.head = "V2"

        // Serial sanity stuff
        this.serialAttached = false;
    }

    setBaudRate(baudRate) {
        // Will be 9600 most of the time because that is what the ACom uses, but we are open for variety.
        this.baudRate = baudRate;
    }

    attachSerial() {
        // Attach the serial and get it ready to be opened
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
        // Way to check if we are ready to use the serial stuff
        return this.serialAttached;
    }

    openPort() {
        // Opens the port and makes sure it's able to be read and written
        return new Promise((resolve, reject) => {        
            this.port.open({baudRate: this.baudRate}).then(port => {
                try {
                    this.reader = this.port.readable.getReader();
                    this.writer = this.port.writable.getWriter();
                } catch (e) {
                    reject(new Error("communicator.js: Failed to open port for communication"));
                } finally {
                    resolve(true)
                }
            }).catch(err => reject(new Error("communicator.js: Failed to open port for communication")));
        });
    }
    
    writeData(data) {
        const encoder = new TextEncoder();
        this.writer.write(encoder.encode(data + "\r\n"));
    }

    async readData() {
        const decoder = new TextDecoder(); // Decode the serial buffer into string
        var serialBuffer = "";
        var transmitting = true;
        var finalizeBuffer = false;
        var finalDigirom = "";


        try {
            // Clear the serial buffer so we have an easier time reading the data
            // Tho I don't think it's very necessary to do, but makes it cleaner to diagnose
            await this.reader.read();

            // As long as the n packets received do not exceed the packets we expect to get:
            while (transmitting) {
                const { value, done } = await this.reader.read();

                serialBuffer += decoder.decode(value);
                let packetLen = serialBuffer.split("r:").length - 1;

                if ((packetLen >= this.nPackets) && (finalizeBuffer)) {
                    // This means the communication is done and we have the serial buffer with the data we need
                    console.log("Communication done!");
                    transmitting = false;

                } else if ((packetLen >= this.nPackets) && (! finalizeBuffer)) {
                    // With this we run the buffer once again to make sure we got all the data
                    // NOTE: Without this, usually the last packet would have been cut off half way through the communication
                    finalizeBuffer = true;
                }
            }

        } catch (error) {
            // Cheapskate way of error handling
            console.log(error)

        } finally {
            // Now we find all the packets received by the ACom using RegEx
            finalDigirom += this.head
            let re = new RegExp(/r:/);
            let serialArray = serialBuffer.replace(/(\r\n|\n|\r)/gm, "").split(" ")

            serialArray.forEach(function(packet, index){
                // Compare each packet received against the regex and we keep the ones we are interested in
                let data = re.exec(packet);
                if (data !== null) {
                    packet = packet.replace(/r:/gm, "");
                    finalDigirom += "-" + packet;
                }
            })
        }

        // Et voilá, the whole DigiROM is here
        return finalDigirom;
}

    setPacketNumber(digirom) {
        // Retuns the packet number after being calculated and set in the class
        digirom = digirom.substring(3).split("-");
        this.nPackets = digirom.length;

        return this.nPackets;
    }

    closeConnection() {
        // Gracefully close the serial connection by unlocking the port and then closing it
        console.log("Disconnecting serial port...")
        this.reader.releaseLock();
        this.writer.releaseLock();

        this.port.close();
        this.port.forget();
    }
}
