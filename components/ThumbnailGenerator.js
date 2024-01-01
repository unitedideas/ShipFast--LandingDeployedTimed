"use client";
import { useRef, useState } from "react";
import apiClient from "@/libs/api";
import Image from "next/image";

const ThumbnailGenerator = () => {
    const inputRef = useRef(null);
    const [sceneDescription, setSceneDescription] = useState("");
    const [base64Image, setBase64Image] = useState(''); // State to store the base64 image data
    const [isLoading, setIsLoading] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsLoading(true);
        setIsDisabled(true); // Disable the button to prevent multiple submissions

        try {
            // Perform the API call
            const response = await apiClient.post("/thumbNailGenerator", { sceneDescription });

            console.log("response", response);

            // Assuming the server responds with a JSON object containing the thumbnail data
            if (response.thumbnail.data && response.thumbnail.data && response.thumbnail.data.length > 0) {
                console.log("response", response.thumbnail.data[0].b64_json);
                setBase64Image(response.thumbnail.data[0].b64_json); // Set the base64 string in the state
            }

            // Reset the form fields and remove focus
            inputRef.current?.blur();
            setSceneDescription("");
        } catch (error) {
            console.error(error);
            // Handle the error appropriately
        } finally {
            setIsLoading(false);
            setIsDisabled(false); // Re-enable the button after the operation is complete
        }
    };

    console.log("base64Image", base64Image);

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    required
                    type="text"
                    value={sceneDescription}
                    autoComplete="off"
                    placeholder="Enter a description of the scene"
                    className="input input-bordered w-full placeholder:opacity-60"
                    onChange={(e) => setSceneDescription(e.target.value)}
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

            {base64Image && (
                <div className="image-preview">
                    {/* Using the base64 string as the source of the image */}
                    <Image
                        src={`data:image/png;base64,${base64Image}`}
                        alt="Generated Thumbnail"
                        width={1280}
                        height={70}
                    />
                </div>
            )}
        </div>
    );
};

export default ThumbnailGenerator;
