function createHexArray(binaryArray) {
    let packetsHex = new Array();
    for (let i = 0; i < binaryArray.length; i++) {
        packetsHex.push(parseInt(binaryArray[i], 2).toString(16).toUpperCase().padStart(4, '0'));
    }

    return packetsHex;
}

class DMX {
    constructor() {
        this.dummy = "V2-007E-007E-041E-141E-004E";
        this.eol = "1110";
        this.head = "V2-";
    }

    genRandomCode() {
        let level = Math.floor(Math.random() * 10).toString(2).padStart(4, '0');
        let order = "0";
        let sick = "0";
        let attack = Math.floor(Math.random() * 4).toString(2).padStart(2, '0');;
        let version = "0000";
        let stage = "101";
        let index = "0".padStart(7, "0");;
        let attribute = Math.floor(Math.random() * 4).toString(2).padStart(2, '0');
        let shot_s = "0".padStart(6, '0'); 
        let shot_w = "0".padStart(6, '0');
        let shot_m = "0".padStart(5, '0');
        let hp = Math.floor(22 + Math.random() * 10).toString(2).padStart(5, '0');
        let buff = "10";
        let power = Math.floor(150 + Math.random() * 70).toString(2).padStart(8, '0');
        let hits = "11111";

        let packets = new Array(6);
        packets[0] = order + level + sick + attack + version + this.eol;
        packets[1] = stage + index + attribute + this.eol;
        packets[2] = shot_s + shot_w + this.eol;
        packets[3] = "00" + hp + shot_m + this.eol;
        packets[4] = "00" + buff + power + this.eol;
        packets[5] = "0000" + "000" + hits + this.eol;

        let packetsHex = createHexArray(packets);
        packetsHex[5] = '@8^1^FE';

        return this.head + packetsHex.join('-');
    }
}

class DM20 {
    constructor() {
        this.dummyS = "V2-0101-0101-000E-008E-05AE-01EE-000E-000E-000E";
        this.dummyT = "V2-0101-0101-020E-008E-05AE-01EE-008E-05AE-01EE";
        this.eol = "1110";
        this.head = "V2-";
    }

    genRandomCodeSingle() {
        // I want the tamer name to always be NACA as an honor to myself
        let name1 = "0000000100001110";
        let name2 = "0000000100000011";

        let order = "0";
        let attack = (10 + Math.floor(Math.random() * 6)).toString(2).padStart(5, "0");
        let operation = "0".padStart(2, "0");
        let version = "0".padStart(4, "0");  // This is equivalent to Taichi's Agumon
        let indexL = "1111".padStart(8, "0");
        let attributeL = Math.floor(Math.random() * 4).toString(2).padStart(2, "0");
        let shot_sL = "0".padStart(6, "0");
        let shot_wL = "0".padStart(6, "0");
        let powerL = (20 + Math.floor(Math.random() * 210)).toString(2).padStart(8, "0");
        let indexR = "0".padStart(8, "0");
        let attributeR = "0".padStart(2, "0");
        let shot_sR = "0".padStart(6, "0");
        let shot_wR = "0".padStart(6, "0");
        let powerR = "0".padStart(8, "0");
        let tagMeter = "0".padStart(4, "0");
        let hits = Math.floor(Math.random() * 16).toString(2).padStart(4, "0");
        let dodges = Math.floor(Math.random() * 16).toString(2).padStart(4, "0");

        let packets = new Array();
        packets[0] = name1;
        packets[1] = name2;
        packets[2] = order + attack + operation + version + this.eol;
        packets[3] = "00" + indexL + attributeL + this.eol;
        packets[4] = shot_sL + shot_wL + this.eol;
        packets[5] = "0000" + powerL + this.eol;
        packets[6] = "00" + indexR + attributeR + this.eol;
        packets[7] = shot_sR + shot_wR + this.eol;
        packets[8] = tagMeter + powerR + this.eol;
        packets[9] = "0000" + dodges + hits + this.eol;

        let packetsHex = createHexArray(packets);
        packetsHex[9] = "@0^F^FE";

        console.log(this.head + packetsHex.join("-"))

        return this.head + packetsHex.join("-");
    }

    genRandomCodeTag() {
        // Try to guess the name of the tamer :P
        let name1 = "0000000100001110";
        let name2 = "0000000100000011";

        let order = "0";
        let attack = Math.floor(10 + Math.random() * 6).toString(2).padStart(5, "0");
        let operation = "10".padStart(2, "0");
        let version = "0".padStart(4, "0");  // This is equivalent to Taichi's Agumon
        let indexL = "0".padStart(8, "0");
        let attributeL = Math.floor(Math.random() * 4).toString(2).padStart(2, "0");
        let shot_sL = "0".padStart(6, "0");
        let shot_wL = "0".padStart(6, "0");
        let powerL = Math.floor(20 + Math.random() * 210).toString(2).padStart(8, "0");
        let indexR = "0".padStart(8, "0");
        let attributeR = Math.floor(Math.random() * 4).toString(2).padStart(2, "0");
        let shot_sR = "0".padStart(6, "0");
        let shot_wR = "0".padStart(6, "0");
        let powerR = Math.floor(20 + Math.random() * 210).toString(2).padStart(8, "0");
        let tagMeter = Math.floor(Math.random() * 4).toString(2).padStart(4, "0");
        let hits = Math.floor(Math.random() * 16).toString(2).padStart(4, "0");
        let dodges = Math.floor(Math.random() * 16).toString(2).padStart(4, "0");

        let packets = new Array();
        packets[0] = name1;
        packets[1] = name2;
        packets[2] = order + attack + operation + version + this.eol;
        packets[3] = "00" + indexL + attributeL + this.eol;
        packets[4] = shot_sL + shot_wL + this.eol;
        packets[5] = "0000" + powerL + this.eol;
        packets[6] = "00" + indexR + attributeR + this.eol;
        packets[7] = shot_sR + shot_wR + this.eol;
        packets[8] = tagMeter + powerR + this.eol;
        packets[9] = "0000" + dodges + hits + this.eol;

        let packetsHex = createHexArray(packets);
        packetsHex[9] = "@0^F^FE";

        return this.head + packetsHex.join("-");
    }
}

