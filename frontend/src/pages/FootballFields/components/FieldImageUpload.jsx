mport { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ImagePlus } from "lucide-react";

export default function FieldImageUpload({ images = [], setImages }) {
    const inputRef = useRef(null);
    const [previews, setPreviews] = useState(images.map((f) => (typeof f === "string" ? f : URL.createObjectURL(f))));

    const pickFiles = () => inputRef.current?.click();

    const handleFiles = (filesList) => {
        const files = Array.from(filesList);
        setImages(files);
        setPreviews(files.map((f) => URL.createObjectURL(f)));
    };

    const removeAt = (i) => {
        const newImgs = [...images];
        newImgs.splice(i, 1);
        setImages(newImgs);
        setPreviews(newImgs.map((f) => (typeof f === "string" ? f : URL.createObjectURL(f))));
    };

    return (
        <div className="mb-4">
            <label className="flex itemscenter gap-2 mb-2 font-semibold">Images</label>

            <motion.div
                onClick={pickFiles}
                whileHover={{ scale: 1.02 }}
                className="p-6 rounded-xl border-2 border-dashed border-green-300 text-center cursor-pointer"
            >
                <ImagePlus size={28} className="mx-auto text-green-600" />
                <p className="text-sm mt-2">Click or drag images here (max 6)</p>
            </motion.div>

            <input ref={inputRef} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={(e) => handleFiles(e.target.files)} />

            <div className="flex gap-3 mt-3 flex-wrap">
                {previews.map((src, i) => (
                    <div key={i} className="w-24 h-24 rounded-lg overflow-hidden relative shadow">
                        <img src={src} alt={`preview-${i}`} className="w-full h-full object-cover" />
                        <button onClick={(ev) => { ev.stopPropagation(); removeAt(i); }} className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow text-red-600">✕</button>
                    </div>
                ))}
            </div>
        </div>
    );
}
