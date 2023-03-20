# Test Suite for the communicator library
This is a small playground I made a long time ago for testing the communicator.js library. I'm attaching it as a way for people to test it out in their computers without the need to set up a web server with working HTTPS. 

To use this test suite, you must open index.html in a Google Chrome (or Chromium) web browser. After that the buttons do the following:
-Attach serial: Will bring the "file:// wants to connect to a serial port". After that the communicator.js will open the port for reading and writing. If it fails there is the Open port button.

-Open port: in the case of the Attach serial failing to open the port (which should not fail), pressing this will open the serial port for read and write access. If you are not sure if the library failed to connect to the serial port, open the console and it should say why it failed to connect.

-Send data: Sends the DigiROM inserted in the text box. Before seding data you must press the "Get digirom data" button. This will get the packet number of the digirom and pass it on to the library to listen for an equal amount of data packets. After

-Get digirom data: All it does is get the amount of data packets in a DigiROM and pass them to the read data function to keep in mind how many packets are needed to read.