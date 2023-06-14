import React, {useEffect, useState} from "react";
import ReactDOM from "react-dom";
import "./ui.scss";
import {convert} from "./convert";

function createObjectURL(contents: Uint8Array): string {
    let blob = new Blob([contents], {type: 'application/octet-stream'});
    return URL.createObjectURL(blob);
}

export const App: React.FC = () => {
    const [icns, setIcns] = useState<string>("");
    const [icnsFilename, setIcnsFilename] = useState<string>("");
    const [ico, setIco] = useState<string>("");
    const [icoFilename, setIcoFilename] = useState<string>("");
    const [imgSource, setImgSource] = useState<string>("");
    const [hidePreview, setHidePreview] = useState<boolean>(false);
    const [showImg, setShowImg] = useState<boolean>(false);
    const [tooSmall, setTooSmall] = useState<boolean>(false);

    useEffect(() => {
        window.onmessage = async (event) => {
            if (event.data.pluginMessage?.type?.toString() == "compile") {
                const name: string = event.data.pluginMessage.name,
                    imgData: Buffer = Buffer.from(event.data.pluginMessage.buffer),
                    converted = convert(imgData);

                setIcns(createObjectURL(converted.icns));
                setIcnsFilename(name + ".icns");
                setIco(createObjectURL(converted.ico));
                setIcoFilename(name + ".ico");
                setImgSource("data:image/png;base64," + imgData.toString('base64'));

                setTimeout(() => {
                    setHidePreview(true);
                    setTimeout(() => {
                        setShowImg(true);
                    }, 100);
                }, 50);
                if (event.data.pluginMessage.size < 512) {
                    setTooSmall(true);
                }
            }
        };
    }, []);

    return (
        <div id="download">
            <div className="preview">
                <img src={imgSource} className={showImg ? "show" : undefined} alt="icon preview"/>
                <span className={hidePreview ? "hide" : undefined}></span>
                <p className={tooSmall ? "show" : undefined}>
                    Frame should be at least 512x512 to cover all use cases
                </p>
            </div>
            <div className="action">
                <a download={icnsFilename} href={icns}>icns</a>
                <a download={icoFilename} href={ico}>ico</a>
            </div>
        </div>
    );
};

ReactDOM.render(<App/>, document.getElementById("react-page"));
