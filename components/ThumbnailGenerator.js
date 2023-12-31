"use client";

import { useState, useRef } from "react";
import { toast } from "react-hot-toast";
import apiClient from "@/libs/api";

const ThumbnailGenerator = ({ extraStyle }) => {
    const inputRef = useRef(null);
    const [artStyle, setArtStyle] = useState("");
    const [sceneDescription, setSceneDescription] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);

    const handleSubmit = async (e) => {
        e?.preventDefault();

        setIsLoading(true);
        try {
            console.log(`apiClient Post - Art Style: ${artStyle}`);
            console.log(`apiClient Post - Scene Description: ${sceneDescription}`);

            // Make sure the endpoint and payload are correct
            await apiClient.post("/thumbNailGenerator", { artStyle, sceneDescription });

            toast.success("Thanks for joining the waitlist!");

            // Reset the form fields and remove focus
            inputRef.current?.blur();
            setArtStyle("");
            setSceneDescription("");
        } catch (error) {
            console.log(error);
            // Handle error appropriately
            // Check if 'messages' variable is used here incorrectly
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form
            className={`w-full max-w-xs space-y-3 ${extraStyle ? extraStyle : ""}`}
            onSubmit={handleSubmit}
        >
            <input
                required
                type="text"
                value={artStyle}
                ref={inputRef}
                autoComplete=""
                placeholder="photorealistic"
                className="input input-bordered w-full placeholder:opacity-60"
                onChange={(e) => setArtStyle(e.target.value)}
            />

            <input
                required
                type="text"
                value={sceneDescription}
                autoComplete=""
                placeholder="A modern cityscape"
                className="input input-bordered w-full placeholder:opacity-60"
                onChange={(e) => setSceneDescription(e.target.value)}
            />
            <button
                className="btn btn-primary btn-block"
                type="submit"
                disabled={isDisabled}
            >
                Enter your style here
                {isLoading ? (
                    <span className="loading loading-spinner loading-xs"></span>
                ) : (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-5 h-5"
                    >
                        <path
                            fillRule="evenodd"
                            d="M5 10a.75.75 0 01.75-.75h6.638L10.23 7.29a.75.75 0 111.04-1.08l3.5 3.25a.75.75 0 010 1.08l-3.5 3.25a.75.75 0 11-1.04-1.08l2.158-1.96H5.75A.75.75 0 015 10z"
                            clipRule="evenodd"
                        />
                    </svg>
                )}
            </button>
        </form>
    );
};

export default ThumbnailGenerator;
