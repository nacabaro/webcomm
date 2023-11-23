# webcomm
This is a set of libraries designed to interact with ACom/WiFiCom devices from within your web browser. These have been extracted from the NacaBattle website. (https://86centservers.h4ck.me).

## Usage
To use these libraries, it's important to keep in mind that these were designed with a factory design pattern in mind. This means both have similar interfaces for reading and writing to the devices, with exception of the methods used to create the connection.

### ACom (acom.js)
This library will only work in devices which support the WebSerial protocol. As of now the compatible web browsers are Google Chrome and Chromium-based browsers in desktop computers. 

It is important the user is displayed a warning that the browser is not compatible.

Here is a snippet that shows how to initiate connection with an ACom using the library:

```javascript
comm = new ACom()
comm.attachPort().then((resolve) => {
    comm.initReaderAndWriter();
    onAcomConnected();
})
```

Let's break this down:

`comm.attachPort()` is a function that will show a promt to the user, asking to select the ACom device. Once the device is selected, the function returns a promise. The promise is resolved if the device that was selected is valid and is ready. 

This promise will be rejected if the user clicks away from the serial port selector, or the serial port chosen is not valid.

`comm.initReaderAndWriter();` is a property that will fetch the reader and writer properties of the serial port. Before making use of the serial port, this property has to be called in order to initialize it.

### WiFiCom (wificom.js)
This library should work in any browser that supports `fetch()`. Let's look at a snippet of the initialization of this library.

```javascript
let api_key = window.localStorage.getItem("user_api_key");
let device_name = window.localStorage.getItem("user_device_name");
comm = new WiFiCom(device_name, api_key)
onWiFiComConnected();
```

Before getting started with this library, it's important you create an application UUID inside the https://wificom.dev website. Once you have that, you can set the `appUUID` variable in the code with your application's UUID. It is not really necessary to keep this as a secret. Also set the comment variable to something that suits your application.

After that, you need to implement a way to collect the user's device name and generated API key for their WiFiCom. In my personal recommendation, you should store these values in the Local Storage of the user's web browser. 

Once done that, just invoking the constructor with the device name and API key of the user's WiFiCom will initialize the class.

## Reading and writing
Once the devices are set up and ready, you can start reading and writing from each device, for that both classes work in the same way. Let's look at a code snippet that shows how to read and write:

```javascript
setCurrentCommInfo("Writing DigiRom to comm.");
comm.writeData(rom);
setCurrentCommInfo("Reading DigiROM from comm.");
comm.readData().then((rom) => {
    setCurrentCommInfo("Read successful, you can now disconnect your device.");
    sendRom(rom);
    setCurrentCommInfo("Waiting now for opponent.");
})
```

Writing to the device can be done without much hassle, just send the DigiROM as a parameter in the `writeData()` function.

Reading, on the other hand works by returning a promise once a DigiROM has been detected in the communication stream. 

**Note**: If you only intend on implementing one of the libraries instead of both, make sure you have the `processSerialLine()` function which is contained inside the `acom.js` file.

If you do not specify any parameters in the read function, you will obtain only the packets that begin with `r:` in the DigiROM delimited by dashes, but, if you set the parameter of the `readData()` function as `false`, you will get the resulting string of communcation with all the packets. 

This is an example of a processed output: `0123-4567-89AB-CDEF-0123`

## Closing the communication
The communication between the web browser and the devices are never closed in the case of ACom devices, as this allows for live battles to keep going without having to choose the device all the time. In the case of WiFiCom devices, the connection is closed once the DigiROM is received, but will be reopened after the `writeData()` and `readData()` functions are called once again.

## Credits
You can find more info about the peope behind the ACom/WiFiCom projects here: https://86centservers.h4ck.me/credits