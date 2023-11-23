let appUUID = "You app uuid goes here";
let comment = "NacaBattle";
let wifiComInteval;


class WiFiCom {
    constructor(device, user_api_key) {
        this.__device = device
        this.__user_api_key = user_api_key
    }

    writeData(rom) {
        const url = new URL(
            "https://wificom.dev/api/v2/application/send_digirom"
        );

        const headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
        };
        
        let body = {
            "api_key": this.__user_api_key,
            "device_name": this.__device,
            "application_uuid": appUUID,
            "comment": comment,
            "digirom": rom
        };
        
        return new Promise((resolve) => {
            fetch(url, {
                method: "POST",
                headers,
                body: JSON.stringify(body),
            }).then(response => response.json().then(data => {
                console.log(data)
                resolve();
            }));
        })
    }

    readData(processing = true) {
        return new Promise(resolve => {
            wifiComInteval = setInterval(() => {
                readWifiComData(this.__user_api_key, this.__device).then(data => {
                    if (data["last_output"] !== null) {
                        clearInterval(wifiComInteval);
                        if (processing) {
                            let rom = processSerialLine(data["last_output"]);
                            let parsedRom = rom.join("-")
                            resolve(parsedRom);
                        } else {
                            resolve(data["last_output"]);
                        }
                    }
                }).catch(error => {
                    clearInterval(wifiComInteval);
                });
            }, "5000")
        })
    }
    
}

function readWifiComData(user_api_key, device_name) {
    const url = new URL(
        "https://wificom.dev/api/v2/application/last_output"
    );

    const headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
    };
    
    let body = {
        "api_key": user_api_key,
        "application_uuid": appUUID,
        "device_name": device_name
    };
    
    return new Promise((resolve, reject) => {
        fetch(url, {
            method: "POST",
            headers,
            body: JSON.stringify(body),
        }).then(response => {
            response.json().then(data => {
                console.log(data);
                if (response.ok) {
                    resolve(data);
                } else {
                    clearInterval(wifiComInteval);
                    displayError(data["error"]);
                    reject(data);
                }
            })
        });
    })
}