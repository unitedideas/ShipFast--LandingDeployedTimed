"use client";
import {useRef, useState} from "react";
import apiClient from "@/libs/api";
import Image from "next/image";

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
                    required
                    type="text"
                    value={tnText}
                    placeholder="Text Placement: Text Location Desired"
                    className="input input-bordered w-full placeholder:opacity-40"
                    onChange={(e) => settnText(e.target.value)}
                />
                <input
                    required
                    type="text"
                    value={textPlacement}
                    placeholder="Title Text"
                    className="input input-bordered w-full placeholder:opacity-40"
                    onChange={(e) => setTextPlacement(e.target.value)}
                />

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

            {Array.isArray(base64Image) && base64Image.length > 0 && (
                <div className="image-preview">
                    {base64Image.map((imageData, index) => (
                        <div key={index} className="thumbnail-item">
                            <Image
                                src={`data:image/png;base64,${imageData}`}
                                alt={`Generated Thumbnail ${index + 1}`}
                                width={1280}
                                height={70}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ThumbnailGenerator;
