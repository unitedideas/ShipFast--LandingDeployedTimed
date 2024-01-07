"use client";
import {useRef, useState} from "react";
import apiClient from "@/libs/api";
import Image from "next/image";
import Draggable from 'react-draggable';


const ThumbnailGenerator = () => {
    const inputRef = useRef(null);
    const [sceneDescription, setSceneDescription] = useState("");
    const [artStyle, setArtStyle] = useState("");
    const [subject, setSubject] = useState("");
    const [tnText, settnText] = useState("");
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
        // Check if window is defined to avoid issues with server-side rendering
        if (typeof window !== "undefined") {
            // Find the image element
            const imageElement = document.querySelector('.thumbnail-item img');

            // Create a new Image object using the window's Image constructor
            const img = new window.Image();
            img.src = imageElement.src;

            // Ensure the image is loaded before drawing it on the canvas
            img.onload = () => {
                const finalImage = renderTextOnImage(
                    img,
                    tnText,
                    textX,
                    textY,
                    selectedFont,
                    textColor,
                    textRotation,
                    textShadow,
                    textOutline,
                    fontSize
                );

                // Create a canvas with the same dimensions as the image
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;

                // Get the canvas context
                const ctx = canvas.getContext('2d');

                // Draw the image onto the canvas
                ctx.drawImage(img, 0, 0, img.width, img.height);

                // Set the text properties
                ctx.font = `${fontSize}px ${selectedFont}`;
                ctx.fillStyle = 'white'; // Modify as needed
                ctx.textBaseline = 'top'; // Adjusts vertical alignment
                ctx.fillText(tnText, textX, textY);

                // Convert the canvas to a data URL and download
                const link = document.createElement('a');
                link.download = 'thumbnail.png';
                link.href = finalImage;
                link.click();
            };
        }
    }

    // Function to render text on the image
    function renderTextOnImage(image, text, x, y, font, color, rotation, shadow, outline, fontSize) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Set canvas size to image size
        canvas.width = image.width;
        canvas.height = image.height;

        // Draw the image onto the canvas
        ctx.drawImage(image, 0, 0);

        // Set text properties
        ctx.font = `${fontSize}px ${font}`;
        ctx.fillStyle = color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Save context state
        ctx.save();

        // Translate and rotate context for text rotation
        ctx.translate(x, y);
        ctx.rotate(rotation * Math.PI / 180);

        // Optional: Apply drop shadow
        if (shadow) {
            ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
            ctx.shadowOffsetX = 4;
            ctx.shadowOffsetY = 4;
            ctx.shadowBlur = 2;
        }

        // Draw the text with optional outline
        if (outline) {
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 1;
            ctx.strokeText(text, 0, 0); // Draw the outline
        }

        // Draw the text
        ctx.fillText(text, 0, 0);

        // Restore context state to not affect the rest of the canvas
        ctx.restore();

        // Return the canvas as a data URL
        return canvas.toDataURL('image/png');
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

            console.log("response", response);

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


    const handleSliderChange = (e) => {
        const newRotation = e.target.value;
        window.requestAnimationFrame(() => setTextRotation(newRotation));
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
                                        left: `${textX}px`,
                                        top: `${textY}px`,
                                        color: textColor,
                                        fontFamily: selectedFont,
                                        fontSize: `${fontSize}px`,
                                        cursor: 'move',
                                        WebkitTransform:`rotate(${textRotation}deg)`, // Apply rotation
                                        transformOrigin: 'center center', // Ensures rotation around the center
                                        textShadow: textShadow ? '4px 4px 8px rgba(0, 0, 0, 0.5)' : 'none',
                                        WebkitTextStroke: textOutline ? '1px black' : '0px transparent',
                                    }}
                                >
                                    {tnText}
                                </div>
                            </Draggable>                        </div>
                    ))}
                </div>
            )}

            <button onClick={saveFinalImage} className="btn btn-secondary mt-4">Save Thumbnail</button>
        </div>
    );
};

export default ThumbnailGenerator;
