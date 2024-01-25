"use client";
import {useRef, useState} from "react";
import apiClient from "@/libs/api";
import Image from "next/image";
import Draggable from 'react-draggable';
import domtoimage from 'dom-to-image';

const ThumbnailGenerator = () => {
    const inputRef = useRef(null);
    const [artStyle, setArtStyle] = useState("");
    const [sceneDescription, setSceneDescription] = useState("");
    const [subject, setSubject] = useState("");
    const [tnText, settnText] = useState("");
    const [base64Image, setBase64Image] = useState([]); // State to store the base64 image data
    const [isLoading, setIsLoading] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const [selectedFont, setSelectedFont] = useState('Arial'); // Default font
    const [textX, setTextX] = useState(335); // X-coordinate for text placement
    const [textY, setTextY] = useState(-400); // Y-coordinate for text placement

    // todo: use setTextX(element.offsetWidth / 2) and setTextY(element.offsetHeight * 0.1 * -1) to set the text correctly on different size canvases
    // const [textX, setTextX] = useState(0); // X-coordinate for text placement
    // const [textY, setTextY] = useState(0); // Y-coordinate for text placement
    const [fontSize, setFontSize] = useState(40); // Default font size
    const [textColor, setTextColor] = useState('#FFFFFF'); // Default white color
    const [textRotation, setTextRotation] = useState(0); // Rotation in degrees
    const [textShadow, setTextShadow] = useState(false); // Drop shadow toggle
    const [textOutline, setTextOutline] = useState(false); // Text outline toggle
    const [showTextSection, setShowTextSection] = useState(false);

    const width = 1920;
    const height = 1080;

    // Function to handle font selection
    function handleFontChange(event) {
        setSelectedFont(event.target.value);
    }

// Function to save the final image
    function saveFinalImage() {
        const element = document.getElementById('the-whole-thing');

        domtoimage.toBlob(element, {
            width: width,
            height: height,
            style: {
                'transform': 'scale(' + (width / element.offsetWidth) + ')',
                'transform-origin': 'top left',
                'width': element.offsetWidth + 'px',
                'height': element.offsetHeight + 'px'
            }
        })
            .then(function (blob) {
                // Create a Blob link to download
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.download = 'thumbnail.png';
                link.href = url;
                link.click();
                // Clean up the URL object
                URL.revokeObjectURL(url);
            })
            .catch(function (error) {
                console.error('oops, something went wrong!', error);
            });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsLoading(true);
        setIsDisabled(true); // Disable the button to prevent multiple submissions

        try {
            // Perform the API call
            const response = await apiClient.post("/thumbNailGenerator", {
                sceneDescription,
                artStyle,
                subject,
            });

            if (response.thumbnail.data && response.thumbnail.data.length > 0) {
                // Map through the data array and set images in the state
                const imageList = response.thumbnail.data.map((item) => item.b64_json);
                setBase64Image(imageList);
                setShowTextSection(true); // Show text section if images are present
            } else {
                setShowTextSection(false); // Hide text section if no images
            }

            // Reset the form fields and remove focus
            inputRef.current?.blur();
        } catch (error) {
            console.error(error);
            // Handle the error appropriately
        } finally {
            setIsLoading(false);
            setIsDisabled(false); // Re-enable the button after the operation is complete
        }
    };

    return (
        <div className={"bg-gray-900 text-white min-h-screen p-8"}>
            <div className={"max-w-2xl mx-auto"}>

                <h1 className={"text-4xl font-bold mb-4 text-center"}>YouTube Thumbnail Generator (change to
                    header)</h1>

                <form onSubmit={handleSubmit}>
                    <div className={"bg-gray-800 p-6 rounded-lg shadow-lg"}>
                        {!showTextSection ? (
                            <div>
                                <div className={"flex items-center mb-4"}>
                                    <label
                                        htmlFor={"imageStyle"}
                                        className={"block text-md font-medium mr-2"}>
                                        Image Style:
                                    </label>
                                    <input
                                        required
                                        id={"imageStyle"}
                                        type={"text"}
                                        placeholder={"Sescribe the art style: watercolor, oil painting, photorealistic"}
                                        value={artStyle}
                                        className={"flex-1 text-md font-medium p-2 rounded bg-gray-700 border border-gray-600 focus:ring focus:ring-amber-600"}
                                        onChange={(e) => setArtStyle(e.target.value)}
                                    />
                                </div>

                                <div className={"flex items-center mb-4"}>
                                    <label
                                        htmlFor={"sceneDescription"}
                                        className={"block text-md font-medium mr-2"}>
                                        Scene Description:
                                    </label>
                                    <input
                                        required
                                        id={"sceneDescription"}
                                        type={"text"}
                                        value={sceneDescription}
                                        placeholder={"Describe the scene: Sunny beach with puppies for clouds"}
                                        className={"flex-1 text-md font-medium p-2 rounded bg-gray-700 border border-gray-600 focus:ring focus:ring-amber-600"}
                                        onChange={(e) => setSceneDescription(e.target.value)}
                                    />
                                </div>

                                <div className="flex items-center mb-4">
                                    <label
                                        htmlFor="mainSubject"
                                        className="block text-md font-medium mr-2">
                                        Title Text:
                                    </label>
                                    <input
                                        required
                                        id="MainSubject"
                                        type="text"
                                        value={subject}
                                        placeholder="Describe the main characters or objects: Happy Puppies"
                                        className="flex-1 text-md font-medium p-2 rounded bg-gray-700 border border-gray-600 focus:ring focus:ring-amber-600"
                                        onChange={(e) => setSubject(e.target.value)}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div>
                                <p className={"text-lg opacity-80 mb-6 text-center"}>
                                    Style:{artStyle},
                                    Description:{sceneDescription},
                                    Subject:{subject}
                                </p>
                            </div>
                        )}

                        <h4 className="text-sm text-gray-500 mb-4">
                            *Note: You will be able to add text and a title after the image is created.
                        </h4>

                        {!showTextSection && (
                            <button
                                className="btn-gradient btn w-full p-3 rounded text-white hover:bg-purple-600"
                                disabled={showTextSection}>
                                {isLoading ? (
                                    <span className="loading loading-spinner loading-xs"></span>
                                ) : (
                                    "Generate Thumbnail"
                                )}
                            </button>
                        )}

                        {/*This section is for text creation*/}
                        {showTextSection && (
                            <div>
                                <div className="flex items-center mb-4">
                                    <label
                                        htmlFor="tnText"
                                        className="block text-md font-medium mr-2">
                                        Title Text:
                                    </label>
                                    <input
                                        id="tnText"
                                        type="text"
                                        value={tnText}
                                        placeholder="Title Text"
                                        className="flex-1 text-md font-medium p-2 rounded bg-gray-700 border border-gray-600 focus:ring focus:ring-amber-600"
                                        onChange={(e) => settnText(e.target.value)}
                                    />
                                </div>

                                <div className="flex items-center mb-4">
                                    <label
                                        htmlFor="fontSize"
                                        className="block text-md font-medium mr-2">
                                        Font Size:
                                    </label>
                                    <input id="fontSize" type="range"
                                           min="20"
                                           max="200"
                                           value={fontSize}
                                           onChange={(e) => setFontSize(e.target.value)}
                                           className="flex-1"
                                    />
                                </div>

                                <div className="flex items-center mb-4 rounded">
                                    <label
                                        htmlFor="textColor"
                                        className="block text-md font-medium mr-2">
                                        Text Color: {textColor}
                                    </label>
                                    <input id="textColor"
                                           type="color"
                                           value={textColor}
                                           onChange={(e) => setTextColor(e.target.value)}
                                           className="flex-1"
                                    />
                                </div>


                                <div className="flex items-center mb-4">
                                    <label
                                        htmlFor="textRotation"
                                        className="block text-md font-medium mr-2">
                                        Text Rotation: {textRotation}
                                    </label>
                                    <input
                                        id="textRotation"
                                        type="range"
                                        min="0"
                                        max="360"
                                        value={textRotation}
                                        onChange={(e) => setTextRotation(e.target.value)}
                                        className="flex-1"
                                    />
                                </div>


                                {/* Drop Shadow Toggle */}
                                <div className="flex items-center mb-4">
                                    <label
                                        htmlFor="textOutline"
                                        className="block text-md font-medium mr-2">
                                        Text Outline:
                                    </label>
                                    <input id="textOutline"
                                           type={"checkbox"}
                                           value={textOutline}
                                           onChange={(e) => setTextOutline(e.target.value)}
                                           className="toggle"
                                    />
                                </div>

                                {/* Text Outline Toggle */}
                                <div className="flex items-center mb-4">
                                    <label
                                        htmlFor="textShadow"
                                        className="block text-md font-medium mr-2">
                                        Text Drop Shadow:
                                    </label>
                                    <input id="textShadow"
                                           type={"checkbox"}
                                           value={textShadow}
                                           onChange={(e) => setTextShadow(e.target.value)}
                                           className="toggle"
                                    />
                                </div>

                                <select
                                    value={selectedFont}
                                    onChange={handleFontChange}
                                    className="input input-bordered w-full mb-4">
                                    <option value="Impact">Impact</option>
                                    <option value="Helvetica">Helvetica Bold</option>
                                    <option value="Bebas Neue">Bebas Neue</option>
                                    <option value="Roboto">Roboto Bold</option>
                                    <option value="Anton">Anton</option>
                                    <option value="Montserrat">Montserrat</option>
                                    <option value="Playfair Display">Playfair Display</option>
                                    <option value="Futura">Futura Bold</option>
                                    <option value="Arial">Arial</option>
                                    <option value="Verdana">Verdana</option>
                                </select>
                            </div>
                        )}
                    </div>
                </form>

                {/*display the array of images*/}
                <div
                    className="w-full relative"
                    style={showTextSection ? {paddingTop: '56.25%'} : {}}
                    id={'the-whole-thing'}>
                    {Array.isArray(base64Image) && base64Image.length > 0 && (
                        <div className="image-preview absolute top-0 left-0 right-0 bottom-0">
                            {base64Image.map((imageData, index) => (
                                <div
                                    key={index}
                                    className="thumbnail-item absolute inset-0">
                                    <Image
                                        src={`data:image/png;base64,${imageData}`}
                                        alt={`Generated Thumbnail ${index + 1}`}
                                        width={width}
                                        height={height}
                                        layout="responsive"
                                        objectFit="contain"
                                    />
                                    <button
                                        onClick={saveFinalImage}
                                        className="btn-gradient btn w-full p-3 rounded text-white hover:bg-purple-600">
                                        Save Your Awesome New Thumbnail!
                                    </button>
                                    <Draggable
                                        bounds="parent"
                                        position={{x: textX, y: textY}}
                                        onDrag={(e, data) => {
                                            setTextX(data.x);
                                            setTextY(data.y);
                                        }}>
                                        <div
                                            style={{
                                                position: 'absolute',
                                                cursor: 'move',
                                                display: 'flex', // Use flex to center the inner div
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                width: '0', // Collapse the parent div to a point
                                                height: '0', // Collapse the parent div to a point
                                            }}>
                                            <div
                                                style={{
                                                    color: textColor,
                                                    fontFamily: selectedFont,
                                                    fontSize: `${fontSize}px`,
                                                    transform: `rotate(${textRotation}deg)`,
                                                    transformOrigin: 'center center',
                                                    textShadow: textShadow ? '4px 4px 8px rgba(0, 0, 0, 0.5)' : 'none',
                                                    WebkitTextStroke: textOutline ? '1px black' : '0px transparent',
                                                }}
                                            >
                                                {tnText}
                                            </div>
                                        </div>
                                    </Draggable>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ThumbnailGenerator;
