class ACom {
    constructor() {
        this.__port = undefined;
        this.__reader = null;
        this.__writer = null;
    }
    
    async attachPort() {
        this.__port = await navigator.serial.requestPort();
        await this.__port.open({ baudRate: 9600 }); // Ajusta la velocidad de baudios según tu dispositivo
    }
    
    initReaderAndWriter() {
        this.__writer = this.__port.writable.getWriter();
        this.__reader = this.__port.readable.getReader();
    }

    writeData(rom) {
        const encoded_data = new TextEncoder().encode(rom + '\r\n');
        this.__writer.write(encoded_data);
    }

    async readData(processing = true) {
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
            const { value, done } = await this.__reader.read();
            buffer += decoder.decode(value);

            const lines = buffer.split('\n');
            if (lines.length > 1) {
                const line = lines.shift();
                buffer = lines.join('\n');
                let recvData = processSerialLine(line);
                if (recvData.length > 0 && processing) {
                    recvData = recvData.join("-");
                    return recvData;
                } else if (recvData.length > 0 && !processing) {
                    return line;
                }
            }
        }
    }
}

function processSerialLine(line) {
    console.log(line);
    const regex = /r:([A-F0-9]*)/g;
    let matches = [];
    let match;

    while ((match = regex.exec(line)) !== null) {
        matches.push(match[1]);
    }

    if (matches) {
        return matches
    } else {
        return false;
    }
}