import * as png2icons from "png2icons";
import {Buffer} from "buffer";

window.Buffer = window.Buffer || Buffer

export function convertToIco(pngBytes: Uint8Array): Uint8Array {
    return png2icons.createICO(Buffer.from(pngBytes), png2icons.BICUBIC, 0, true, true);
}

export function convertToIcns(pngBytes: Uint8Array): Uint8Array {
    return png2icons.createICNS(Buffer.from(pngBytes), png2icons.BICUBIC, 0)
}

export function convert(pngBytes: Uint8Array): ConversionOutput {
    return {
        icns: convertToIcns(pngBytes),
        ico: convertToIco(pngBytes)
    }
}

export interface ConversionOutput {
    icns: Uint8Array;
    ico: Uint8Array;
}