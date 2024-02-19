"use client";
import {useRef, useState} from "react";
import apiClient from "@/libs/api";
import Image from "next/image";
import Draggable from 'react-draggable';
import domtoimage from 'dom-to-image';
import imageType from "@/app/util/artTypeSelector";
import artTypeSelector from "@/app/util/artTypeSelector";
import fontSelector from "@/app/util/fontSelector";

const ThumbnailGenerator = () => {
    const inputRef = useRef(null);
    const [sceneDescription, setSceneDescription] = useState("");
    const [mainSubject, setMainSubject] = useState("");
    const [tnText, settnText] = useState("");
    const [base64Image, setBase64Image] = useState([]); // State to store the base64 image data
    const [isLoading, setIsLoading] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const [selectedFont, setSelectedFont] = useState(fontSelector[0].value);
    const [textX, setTextX] = useState(335); // X-coordinate for text placement
    const [textY, setTextY] = useState(-400); // Y-coordinate for text placement
    const [artLabel, setArtLabel] = useState("");
    const [selectedStyleValue, setSelectedStyleValue] = useState(artTypeSelector[0].value); // Default to the first option
    const [fontSize, setFontSize] = useState(40); // Default font size
    const [textColor, setTextColor] = useState('#FFFFFF'); // Default white color
    const [textRotation, setTextRotation] = useState(0); // Rotation in degrees
    const [textShadow, setTextShadow] = useState(false); // Drop shadow toggle
    const [textOutline, setTextOutline] = useState(false); // Text outline toggle
    const [showTextSection, setShowTextSection] = useState(false);

    const resetForm = () => {
        setSceneDescription("");
        setMainSubject("");
        settnText("");
        setBase64Image([]);
        setIsLoading(false);
        setIsDisabled(false);
        setSelectedFont(fontSelector[0].value);
        setTextX(335);
        setTextY(-400);
        setArtLabel("");
        setSelectedStyleValue(artTypeSelector[0].value);
        setFontSize(40);
        setTextColor('#FFFFFF');
        setTextRotation(0);
        setTextShadow(false);
        setTextOutline(false);
        setShowTextSection(false);
    };


    const width = 1920;
    const height = 1080;

    // Function to handle font selection
    function handleFontChange(event) {
        setSelectedFont(event.target.value);
    }
    // Function to handle font selection
    function cancelRequestAndReset() {

    }

    const handleArtStyleChange = async (e) => {
        const value = e.target.value;
        setSelectedStyleValue(value);
        // Update artStyle based on the selection
        const selected = imageType.find(option => option.value === value);
        await setArtLabel(selected.artStyleDescription);
    };

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
            const response = await apiClient.post("/thumbNailGenerator", {
                mainSubject,
                sceneDescription,
                artLabel,
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
        <div className={"bg-gray-900 text-white w-160 md:w-320 p-5"}>
            <div className={"max-w-2xl mx-auto"}>

                <div className={"p-5 rounded"}>
                    <h1 className={"text-4xl font-bold text-center"}>{"Let's Get Creative!"}</h1>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className={"bg-gray-800 p-6 rounded-lg shadow-lg"}>
                        {!showTextSection ? (
                            <div>
                                {/*<h4 className="text-sm text-gray-500 mb-4">*/}
                                {/*    *Note: You will be able to add text and a title after the image is created.*/}
                                {/*</h4>*/}
                                <div className={"flex flex-col md:flex-row items-center mb-4"}>
                                    <label
                                        htmlFor="mainSubject"
                                        className={"block text-md font-medium mr-2 mb-1 md:mb-0"}>
                                        Main Subject:
                                    </label>
                                    <input
                                        required
                                        id="MainSubject"
                                        type="text"
                                        value={mainSubject}
                                        placeholder="Describe the main characters or objects: Happy Puppies"
                                        className={"flex-1 text-md font-medium p-2 rounded bg-gray-700 border border-gray-600 focus:ring focus:ring-amber-600"}
                                        onChange={(e) => setMainSubject(e.target.value)}
                                    />
                                </div>

                                <div className={"flex flex-col md:flex-row items-center mb-4"}>
                                    <label
                                        htmlFor={"sceneDescription"}
                                        className={"block text-md font-medium mr-2 mb-1 md:mb-0"}
                                    >
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

                                <div className={"flex flex-col md:flex-row items-center mb-4"}>
                                    <label
                                        htmlFor={"sceneDescription"}
                                        className={"block text-md font-medium mr-2 mb-1 md:mb-0"}
                                    >
                                        Art Type:
                                    </label>
                                    <select
                                        id={"artStyleSelect"}
                                        value={selectedStyleValue}
                                        onChange={handleArtStyleChange}
                                        className={"flex-1 text-md font-medium p-2 rounded bg-gray-700 border border-gray-600 focus:ring focus:ring-amber-600"}
                                    >
                                        {imageType.map(option => (
                                            <option value={option.value} key={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>


                                {selectedStyleValue === 'userDescription' &&
                                    (<div className={"flex flex-col md:flex-row items-center mb-4"}>
                                            <label
                                                htmlFor={"imageStyle"}
                                                className={"block text-md font-medium mr-2 mb-1 md:mb-0"}
                                            >
                                                Artistic Style:
                                            </label>
                                            <input
                                                required
                                                id={"imageStyle"}
                                                type={"text"}
                                                placeholder={"Describe the art style: watercolor, oil painting, photorealistic"}
                                                value={artLabel}
                                                className={"flex-1 text-md font-medium p-2 rounded bg-gray-700 border border-gray-600 focus:ring focus:ring-amber-600"}
                                                onChange={(e) => setArtLabel(e.target.value)}
                                            />
                                        </div>
                                    )
                                }
                            </div>
                        ) : (
                            <div>
                                <p className={"text-lg opacity-80 mb-6 text-center"}>

                                    Subject: {mainSubject}
                                </p>

                                <p className={"text-lg opacity-80 mb-6 text-center"}>

                                    Description: {sceneDescription}
                                </p>

                                <p className={"text-lg opacity-80 mb-6 text-center"}>
                                    Style: {artLabel}
                                </p>
                            </div>
                        )}

                        {!showTextSection && (
                            <div className="button-container flex">
                                <button
                                    style={{width: '75%', marginRight: '3%'}}
                                    className="btn-primary btn-gradient btn p-3 rounded text-white"
                                    disabled={showTextSection}>
                                    {isLoading ? (
                                        <span className="loading loading-spinner loading-xs"></span>
                                    ) : (
                                        "✨ Generate Thumbnail"
                                    )}
                                </button>
                                <button
                                    style={{width: '22%'}}
                                    className="btn-gradient btn p-3 rounded text-white hover:bg-red-700"
                                    disabled={showTextSection}
                                    onClick={isLoading ? cancelRequestAndReset : resetForm}
                                >
                                    {isLoading ? (
                                        <span className="loading loading-spinner loading-xs"></span>
                                    ) : (
                                        "♻️ Reset"
                                    )}
                                </button>
                            </div>
                        )}
                        {/*This section is for text creation*/}
                        {showTextSection && (
                            <div>

                                <div className={"flex flex-col md:flex-row items-center mb-4"}>
                                    <label
                                        htmlFor="tnText"
                                        className={"block text-md font-medium mr-2 mb-1 md:mb-0"}
                                    >
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

                                <div className={"flex flex-col md:flex-row items-center mb-4"}>
                                    <label
                                        htmlFor="fontSize"
                                        className={"block text-md font-medium mr-2 mb-1 md:mb-0"}
                                    >
                                        Font Size:
                                    </label>
                                    <input id="fontSize"
                                           type="range"
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
                                        className="block text-md font-medium mr-2"
                                    >
                                        Text Color: {textColor}
                                    </label>
                                    <input id="textColor"
                                           type="color"
                                           value={textColor}
                                           onChange={(e) => setTextColor(e.target.value)}
                                           className="flex-1"
                                    />
                                </div>


                                <div className={"flex flex-col md:flex-row items-center mb-4"}>
                                    <label
                                        htmlFor="textRotation"
                                        className={"block text-md font-medium mr-2 mb-1 md:mb-0"}
                                    >
                                        Text Rotation: {textRotation}
                                    </label>
                                    <input
                                        id="textRotation"
                                        type="range"
                                        min="0"
                                        max="360"
                                        value={textRotation}
                                        onChange={(e) => setTextRotation(e.target.value)}
                                        className={"flex-1 text-md font-medium p-2 rounded bg-gray-700 border border-gray-600 focus:ring focus:ring-amber-600"}
                                    />
                                </div>

                                {/* Drop Shadow Toggle */}
                                <div className={"flex flex-col md:flex-row items-center mb-4"}>
                                    <label
                                        htmlFor="textOutline"
                                        className={"block text-md font-medium mr-2 mb-1 md:mb-0"}
                                    >
                                        Text Outline:
                                    </label>
                                    <input
                                        id="textShadow"
                                        type="checkbox"
                                        checked={textOutline}
                                        onChange={(e) => setTextOutline(e.target.checked)}
                                        className="toggle"
                                    />
                                </div>

                                <div className={"flex flex-col md:flex-row items-center mb-4"}>
                                    <label
                                        htmlFor="textShadow"
                                        className={"block text-md font-medium mr-2 mb-1 md:mb-0"}
                                    >
                                        Text Drop Shadow:
                                    </label>
                                    <input
                                        id="textShadow"
                                        type="checkbox"
                                        checked={textShadow}
                                        onChange={(e) => setTextShadow(e.target.checked)}
                                        className="toggle"
                                    />
                                </div>

                                <div className="flex items-center mb-4">
                                    <select
                                        value={selectedFont}
                                        onChange={handleFontChange}
                                        className="flex-1 text-md font-medium p-2 rounded bg-gray-700 border border-gray-600 focus:ring focus:ring-amber-600"
                                    >
                                        {fontSelector.map(option => (
                                            <option value={option.value} key={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>
                </form>

                {/*display the array of images*/}
                <div
                    className="w-full relative"
                    style={showTextSection ? {paddingTop: '65%'} : {}}
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
