const attachSerial = document.getElementById("attach-serial");
attachSerial.addEventListener("click", () => {
    if (! VPetCommunicator.isSerialAttached() ) {
        VPetCommunicator.attachSerial().then((resolution) => {
            console.log(resolution);
        }).catch(error => {
            console.log("error")
        })
    }
})

const openPort = document.getElementById("open-port");
openPort.addEventListener("click", () => {
    VPetCommunicator.openPort();
})

const disconnect = document.getElementById("disconnect");
disconnect.addEventListener("click", () => {
    VPetCommunicator.closeConnection();
})

const readData = document.getElementById("read-data");
readData.addEventListener("click", () => {
    VPetCommunicator.readData();
})

const writeData = document.getElementById("send-data");
writeData.addEventListener("click", async () => {
    const digirom = document.getElementById("digirom").value;
    const firstPacket = digirom.substring(3).split("-")[0];
    VPetCommunicator.writeData(digirom);
    response = await VPetCommunicator.readData();
    document.getElementById("digirom-data").innerHTML += "Data transmission: " + response + "\n";
})

const getDigiromData = document.getElementById("get-digirom-data");
getDigiromData.addEventListener("click", () => {
    const digirom = document.getElementById("digirom").value;
    console.log(digirom);
    packetNumber = VPetCommunicator.setPacketNumber(digirom);

    document.getElementById("digirom-data").innerHTML = "The packet number is: " + packetNumber + "\n"
})

var VPetCommunicator = new VPet();
VPetCommunicator.setBaudRate(9600); // Impportant to set a baud rate right after initializing the library
