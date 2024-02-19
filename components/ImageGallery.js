const ImageGallery = ({ images }) => {
    return (
        <div className="flex flex-wrap p-4">
            {images.map((image, index) => (
                <div key={index} className="p-2 w-full sm:w-1/2 md:w-1/3">
                    <div className="relative hover:scale-105 transition-transform duration-200">
                        <img src={image.src} alt={image.alt} loading="lazy" className="w-full h-auto rounded"/>
                        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                            <button className="btn-gradient btn p-2 rounded text-white">Edit</button>
                            <button className="btn-gradient btn p-2 rounded text-white ml-2">Delete</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ImageGallery;
