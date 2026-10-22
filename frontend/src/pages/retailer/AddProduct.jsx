import { useState, useRef } from "react";
import api from "../../utils/api";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Save, X, ImagePlus, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AddProduct = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
  });

  // Uploaded image URLs (from Cloudinary)
  const [images, setImages] = useState([]);

  // For URL fallback mode
  const [imageInput, setImageInput] = useState("");
  const [uploadMode, setUploadMode] = useState("file"); // "file" or "url"

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Upload files to Cloudinary via backend
  const uploadFiles = async (files) => {
    if (files.length === 0) return;
    if (images.length + files.length > 5) {
      toast.error("Maximum 5 images allowed per product");
      return;
    }

    const formPayload = new FormData();
    Array.from(files).forEach((file) => {
      formPayload.append("images", file);
    });

    try {
      setUploading(true);
      const res = await api.post("/products/upload-images", formPayload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        setImages((prev) => [...prev, ...res.data.data]);
        toast.success(res.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  // File input change handler
  const handleFileSelect = (e) => {
    if (e.target.files) {
      uploadFiles(e.target.files);
    }
    // Reset input to allow re-uploading same file
    e.target.value = "";
  };

  // Drag & Drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      uploadFiles(e.dataTransfer.files);
    }
  };

  // URL fallback add
  const handleAddImageUrl = (e) => {
    e.preventDefault();
    if (!imageInput) return;
    if (!imageInput.startsWith("http://") && !imageInput.startsWith("https://")) {
      toast.error("Please enter a valid image URL");
      return;
    }
    if (images.length >= 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }
    setImages((prev) => [...prev, imageInput]);
    setImageInput("");
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (images.length === 0) {
      toast.error("Please upload at least one product image");
      return;
    }

    try {
      setLoading(true);
      const dataToSubmit = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        images,
      };

      const res = await api.post("/products", dataToSubmit);
      if (res.data.success) {
        toast.success(res.data.message || "Product added! Awaiting admin approval.");
        navigate("/retailer/products");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8 pb-12 text-white max-w-4xl"
    >
      {/* Title */}
      <div className="flex items-center gap-4">
        <Link
          to="/retailer/products"
          className="h-10 w-10 bg-[#111111] border border-white/10 rounded-full flex items-center justify-center text-neutral-400 hover:text-white transition duration-200"
        >
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight gradient-text">Add New Product</h1>
          <p className="text-sm text-neutral-400 mt-2">Submit a product to request catalog addition.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core details card */}
        <div className="bg-[#111111] border border-white/5 p-6 rounded-2xl space-y-6 shadow-xl">
          <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 border-b border-white/5 pb-3">Product Specifications</h3>

          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs text-neutral-400 font-semibold uppercase tracking-wider">Product Title</label>
              <input
                required
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Leather Minimalist Watch"
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500/50 transition duration-200 text-white placeholder-neutral-600"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs text-neutral-400 font-semibold uppercase tracking-wider">Description (Min 10 chars)</label>
              <textarea
                required
                rows="4"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Write description about core specifications, build quality, fabric types, etc..."
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500/50 transition duration-200 text-white resize-none placeholder-neutral-600"
              />
            </div>
          </div>
        </div>

        {/* Pricing and Stock Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#111111] border border-white/5 p-6 rounded-2xl flex flex-col gap-2 shadow-xl">
            <label className="text-xs text-neutral-400 font-semibold uppercase tracking-wider">Price (INR)</label>
            <input
              required
              type="number"
              min="1"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="1499"
              className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500/50 transition duration-200 text-white placeholder-neutral-600"
            />
          </div>

          <div className="bg-[#111111] border border-white/5 p-6 rounded-2xl flex flex-col gap-2 shadow-xl">
            <label className="text-xs text-neutral-400 font-semibold uppercase tracking-wider">Initial Stock (Units)</label>
            <input
              required
              type="number"
              min="0"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              placeholder="50"
              className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500/50 transition duration-200 text-white placeholder-neutral-600"
            />
          </div>

          <div className="bg-[#111111] border border-white/5 p-6 rounded-2xl flex flex-col gap-2 shadow-xl">
            <label className="text-xs text-neutral-400 font-semibold uppercase tracking-wider">Category</label>
            <input
              required
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="e.g. Watches"
              className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500/50 transition duration-200 text-white placeholder-neutral-600"
            />
          </div>
        </div>

        {/* Image Upload Card */}
        <div className="bg-[#111111] border border-white/5 p-6 rounded-2xl space-y-5 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Product Images ({images.length}/5)
            </h3>
            <div className="flex bg-black rounded-xl border border-white/10 overflow-hidden">
              <button
                type="button"
                onClick={() => setUploadMode("file")}
                className={`px-4 py-1.5 text-xs font-semibold transition ${
                  uploadMode === "file"
                    ? "bg-white text-black"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                Upload File
              </button>
              <button
                type="button"
                onClick={() => setUploadMode("url")}
                className={`px-4 py-1.5 text-xs font-semibold transition ${
                  uploadMode === "url"
                    ? "bg-white text-black"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                Paste URL
              </button>
            </div>
          </div>

          {uploadMode === "file" ? (
            /* Drag & Drop Zone */
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300 ${
                dragActive
                  ? "border-indigo-500 bg-indigo-500/5 scale-[1.01]"
                  : "border-white/10 hover:border-white/20 hover:bg-white/[0.02]"
              }`}
            >
              {uploading ? (
                <>
                  <Loader2 size={32} className="text-indigo-400 animate-spin" />
                  <p className="text-sm text-neutral-400 animate-pulse">Uploading to cloud...</p>
                </>
              ) : (
                <>
                  <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <ImagePlus size={20} className="text-neutral-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-white">
                      Drag & drop images here, or <span className="text-indigo-400 underline hover:text-indigo-300">browse files</span>
                    </p>
                    <p className="text-[10px] text-neutral-500 mt-1.5">
                      JPG, PNG, WebP, AVIF — Max 5MB per file — Up to 5 images
                    </p>
                  </div>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          ) : (
            /* URL Paste Mode */
            <div className="flex gap-3">
              <input
                type="text"
                value={imageInput}
                onChange={(e) => setImageInput(e.target.value)}
                placeholder="Paste image URL (https://...)"
                className="flex-1 bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500/50 transition duration-200 text-white placeholder-neutral-600"
              />
              <button
                type="button"
                onClick={handleAddImageUrl}
                className="px-5 py-3 bg-white text-black font-bold rounded-xl flex items-center justify-center hover:bg-neutral-200 transition duration-200 cursor-pointer text-sm"
              >
                Add
              </button>
            </div>
          )}

          {/* Preview of uploaded images */}
          <AnimatePresence>
            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 pt-3">
                {images.map((img, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="relative group aspect-square rounded-2xl overflow-hidden border border-white/10 bg-black"
                  >
                    <img src={img} alt={`Product ${index + 1}`} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="h-8 w-8 bg-rose-500 rounded-full flex items-center justify-center text-white hover:bg-rose-600 transition"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    {index === 0 && (
                      <span className="absolute top-2 left-2 bg-indigo-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                        Cover
                      </span>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 justify-end">
          <Link
            to="/retailer/products"
            className="px-6 py-3 border border-white/10 rounded-xl text-sm font-medium hover:bg-white/5 transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading || uploading}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-black font-semibold text-sm rounded-xl hover:bg-neutral-200 transition-all duration-300 disabled:opacity-50 hover:shadow-lg hover:shadow-white/5 hover:-translate-y-0.5 cursor-pointer"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            <span>{loading ? "Saving..." : "Submit Product"}</span>
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default AddProduct;
