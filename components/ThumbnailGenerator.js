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
    const [textPlacement, setTextPlacement] = useState("");
    const [base64Image, setBase64Image] = useState([]); // State to store the base64 image data
    const [isLoading, setIsLoading] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const [selectedFont, setSelectedFont] = useState('Arial'); // Default font
    const [textX, setTextX] = useState(0); // X-coordinate for text placement
    const [textY, setTextY] = useState(0); // Y-coordinate for text placement
    const [isImageClicked, setIsImageClicked] = useState(false); // To check if image was clicked for text placement
    const [fontSize, setFontSize] = useState(16); // Default font size

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
                const dataURL = canvas.toDataURL('image/png');
                const link = document.createElement('a');
                link.download = 'thumbnail.png';
                link.href = dataURL;
                link.click();
            };
        }
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
                tnText,
                textPlacement,
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
                    min="20"
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
                                layout="fill" // This will make the image fill the parent div
                                objectFit="contain" // Adjust this as needed for your image scaling
                            />
                            <Draggable
                                bounds="parent"
                                position={{x: textX, y: textY}}
                                onStop={(e, data) => {
                                    setTextX(data.x);
                                    setTextY(data.y);
                                }}
                            >
                                <div
                                    style={{
                                        position: 'absolute',
                                        color: 'white',
                                        fontFamily: selectedFont,
                                        fontSize: `${fontSize}px`,
                                        cursor: 'move' // Optional, for a better UX
                                    }}
                                >
                                    {tnText}
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
