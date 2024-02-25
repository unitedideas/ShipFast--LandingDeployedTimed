"use client";

import {useEffect, useState} from "react";
import apiClient from "@/libs/api";

const ImageGallery = () => {
    const [images, setImages] = useState([]);

    console.log('ImageGallery', images);
    console.log('ImageGallery', images.length);
    console.log('ImageGallery Image[0]', images[0]);

    useEffect(() => {
        // Define the async function inside the effect
        const fetchImages = async () => {
            try {
                const response = await apiClient.get("supabaseStorage/fetchUserImages");
                if (Array.isArray(response.data)) {
                    setImages(response.data); // Assuming the response has a .data property with the images
                } else {
                    console.error('Expected an array but received', response);
                }
            } catch (error) {
                console.error('An error occurred while fetching user images:', error);
            }
        };
        // Call the async function
        fetchImages().then(() => console.log('ImageGallery fetchImages done'));
    }, [])

    const deleteImageByName = (imageName) => {
        // Filter out the image with the matching 'name'
        const updatedImages = images.filter(image => image.name !== imageName);

        // Update the state to the new array of images
        setImages(updatedImages);
    };


    const deleteImage = async (imageName) => {
        console.log('deleteImage', imageName);
        try {
            const config = {
                data: { imageName } // Data included here
            };
            const response          = await apiClient.delete(`supabaseStorage/deleteImage`, config);

            // Log the response to understand its structure
            console.log(response);

            // Use response.ok to check for a successful response
            if (Array.isArray(response.data)) {
                const updatedImages = images.filter(image => image.name !== imageName);

                // Update the state with the new array of images
                setImages(updatedImages);
            } else {
                console.error('Expected a successful response but received', response.status);
            }
        } catch (error) {
            console.error('An error occurred while deleting user image:', error);
        }
    };

    return (
        <div className="flex flex-wrap p-4">
            {images.map((image, index) => (
                <div key={index} className="p-2 w-full sm:w-1/2 md:w-1/3">
                    <div className="relative hover:scale-105 transition-transform duration-200">
                        <img
                            src={`https://aenehhumfeuxwlvpybvc.supabase.co/storage/v1/object/public/onlineyoutubethumbnailmaker/369abdd5-e4a9-4de9-8b5d-7e008aeaaab6/${image.name}`}
                            alt={image.alt}
                            loading="lazy"
                            className="w-full h-auto rounded"/>
                        <div
                            className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                            <button className="btn-gradient btn p-2 rounded text-white">Edit</button>
                            <button
                                onClick={() => deleteImage(image.name)}
                                className="btn-gradient btn p-2 rounded text-white ml-2">Delete
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ImageGallery;