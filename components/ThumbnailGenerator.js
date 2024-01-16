"use client";
import {useRef, useState} from "react";
import apiClient from "@/libs/api";
import Image from "next/image";
import Draggable from 'react-draggable';
import html2canvas from 'html2canvas';


const ThumbnailGenerator = () => {
    const inputRef = useRef(null);
    const [sceneDescription, setSceneDescription] = useState("Mountains, pines, creek, and a cabin");
    const [artStyle, setArtStyle] = useState("Bob Ross");
    const [subject, setSubject] = useState("Basenji");
    const [tnText, settnText] = useState("Bob Ross");
    const [base64Image, setBase64Image] = useState([]); // State to store the base64 image data
    const [isLoading, setIsLoading] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const [selectedFont, setSelectedFont] = useState('Arial'); // Default font
    const [textX, setTextX] = useState(0); // X-coordinate for text placement
    const [textY, setTextY] = useState(0); // Y-coordinate for text placement
    const [fontSize, setFontSize] = useState(40); // Default font size
    const [textColor, setTextColor] = useState('#FFFFFF'); // Default white color
    const [textRotation, setTextRotation] = useState(0); // Rotation in degrees
    const [textShadow, setTextShadow] = useState(false); // Drop shadow toggle
    const [textOutline, setTextOutline] = useState(false); // Text outline toggle

    // Function to handle font selection
    function handleFontChange(event) {
        setSelectedFont(event.target.value);
    }


// Function to save the final image
    function saveFinalImage() {
        const element = document.querySelector('.image-preview'); // Adjust the selector as needed

        html2canvas(element, {
            scale: 1,
            logging: true, // Enables logging for debugging purposes
            onclone: (document) => {
                const cloneElement = document.querySelector('.image-preview');
                // Set the size explicitly if needed
                cloneElement.style.width = `1280px`;
                cloneElement.style.height = `720px`;
            }
        }).then(canvas => {
            const base64image = canvas.toDataURL("image/png");
            const link = document.createElement('a');
            link.download = 'thumbnail.png';
            link.href = base64image;
            link.click();
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
        <div>
            <form onSubmit={handleSubmit}>
                <h1 className="text-xl font-bold mb-4">Generate YouTube Thumbnail</h1>
                <p className="text-sm text-gray-500 mb-4">
                    This example uses the OpenAI API to generate a YouTube thumbnail based on a description of the scene
                    and the art style.
                </p>

                <input
                    required
                    type="text"
                    value={artStyle}
                    placeholder="Image Type Example: photograph, illustration, drawing, oil painting"
                    className="input input-bordered w-full placeholder:opacity-40"
                    onChange={(e) => setArtStyle(e.target.value)}
                />
                <input
                    required
                    type="text"
                    value={sceneDescription}
                    placeholder="Setting/Scene: Quick description of the environment"
                    className="input input-bordered w-full placeholder:opacity-40"
                    onChange={(e) => setSceneDescription(e.target.value)}
                />
                <input
                    required
                    type="text"
                    value={subject}
                    placeholder="Main Subjects: Describe the main characters or objects in the scene"
                    className="input input-bordered w-full placeholder:opacity-40"
                    onChange={(e) => setSubject(e.target.value)}
                />
                <input
                    type="range"
                    min="40"
                    max="400"
                    value={fontSize}
                    onChange={(e) => setFontSize(e.target.value)}
                    className="slider"
                />
                <h4 className="text-sm text-gray-500 mb-4">Let the image render and then you can place and save the text
                    position.</h4>
                Font Size: {fontSize}
                <input
                    required
                    type="text"
                    value={tnText}
                    placeholder="Title Text"
                    className="input input-bordered w-full placeholder:opacity-40"
                    onChange={(e) => settnText(e.target.value)}
                />
                {/* Text Color Picker */}
                <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="input input-bordered"
                />

                {/* Text Rotation Slider */}
                <input
                    type="range"
                    min="0"
                    max="360"
                    value={textRotation}
                    onChange={(e) => setTextRotation(e.target.value)}
                    className="slider"
                />

                {/* Drop Shadow Toggle */}
                <label className="label cursor-pointer">
                    <span className="label-text">Drop Shadow</span>
                    <input
                        type="checkbox"
                        checked={textShadow}
                        onChange={(e) => setTextShadow(e.target.checked)}
                        className="toggle"
                    />
                </label>

                {/* Text Outline Toggle */}
                <label className="label cursor-pointer">
                    <span className="label-text">Text Outline</span>
                    <input
                        type="checkbox"
                        checked={textOutline}
                        onChange={(e) => setTextOutline(e.target.checked)}
                        className="toggle"
                    />
                </label>
                <select value={selectedFont} onChange={handleFontChange} className="input input-bordered w-full mb-4">
                    <option value="Arial">Arial</option>
                    <option value="Verdana">Verdana</option>
                    {/* Add more font options here */}
                </select>

                <button
                    className="btn btn-primary btn-block"
                    type="submit"
                    disabled={isDisabled}
                >
                    {isLoading ? (
                        <span className="loading loading-spinner loading-xs"></span>
                    ) : (
                        "Generate Thumbnail"
                    )}
                </button>
            </form>

            {/*display the array of images*/}
            {Array.isArray(base64Image) && base64Image.length > 0 && (
                <div className="image-preview">
                    {base64Image.map((imageData, index) => (
                        <div key={index} className="thumbnail-item"
                             style={{position: 'relative', width: 1280, height: 720}}>
                            <Image
                                src={`data:image/png;base64,${imageData}`}
                                alt={`Generated Thumbnail ${index + 1}`}
                                layout="fill"
                                objectFit="contain"
                            />
                            <Draggable
                                bounds="parent"
                                position={{ x: textX, y: textY }}
                                onDrag={(e, data) => {
                                    setTextX(data.x);
                                    setTextY(data.y);
                                }}
                            >
                                <div
                                    style={{
                                        position: 'absolute',
                                        cursor: 'move',
                                        display: 'flex', // Use flex to center the inner div
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        width: '0', // Collapse the parent div to a point
                                        height: '0', // Collapse the parent div to a point
                                    }}
                                >
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

            <button onClick={saveFinalImage} className="btn btn-secondary mt-4">Save Thumbnail</button>
        </div>
    );
};

export default ThumbnailGenerator;
