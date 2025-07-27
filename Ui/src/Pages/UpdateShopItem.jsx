import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Upload,
  Trash2,
  Image,
  FileText,
  Plus,
  AlertCircle,
  Palette,
  List,
  Star,
} from "lucide-react";
import UserProfile from "../../UserProfile";
import api from "../lib/Url";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../Components/Loading";

const EventDecorCategories = [
  "Lighting & Effects",
  "Floral Decoration",
  "Table Decoration",
  "Dining Setup",
  "Other",
];

const UpdateDecorItem = () => {
  const { id } = useParams();
  const currentUser = UserProfile.GetUserData();
  const [imageFile, setImageFile] = useState([]);
  const [uploadError, setUploadError] = useState({ isError: false, message: "" });
  const [formSubmitLoading, setFormSubmitLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      price: "",
      category: "",
      stock: 0,
      isFeatured: false,
    }
  });

  const watchFeatured = watch("isFeatured");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsFetching(true);
        const response = await api.get(`/product/${id}`);
        
        if (response.data.userId !== currentUser._id) {
          toast.error("You can only edit your own items");
          navigate("/shop");
          return;
        }

        // Set form values
        reset({
          name: response.data.name,
          description: response.data.description,
          price: response.data.price,
          category: response.data.category,
          stock: response.data.stock,
          isFeatured: response.data.isFeatured,
        });

        // Set existing images
        setExistingImages(response.data.images || []);
      } catch (error) {
        toast.error(error.response?.data?.message || error.message || "Failed to fetch product");
        navigate("/shop");
      } finally {
        setIsFetching(false);
      }
    };

    fetchProduct();
  }, [id, currentUser._id, navigate, reset]);

  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (!imageFile.length) return;

    setLoading(true);
    const uploadFormData = new FormData();
    
    for (let i = 0; i < imageFile.length; i++) {
      uploadFormData.append("images", imageFile[i]);
    }

    try {
      const response = await api.post('/storage/upload', uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUploadedImages(prev => [...prev, ...response.data.images]);
      setImageFile([]);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Image upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async (index, isExisting = false) => {
    if (isExisting) {
      // Mark existing image for deletion (you might want to actually delete from server)
      setExistingImages(prev => prev.filter((_, i) => i !== index));
    } else {
      setUploadedImages(prev => prev.filter((_, i) => i !== index));
    }
  };

  const onSubmit = async (data) => {
    if (existingImages.length + uploadedImages.length < 1) {
      toast.error("Please keep at least one image", { position: "top-right" });
      return;
    }

    try {
      setFormSubmitLoading(true);

      const productData = {
        ...data,
        images: [
          ...existingImages,
          ...uploadedImages.map(img => ({
            url: img.path,
            alt: data.name || "Event decor item"
          }))
        ],
        userId: currentUser._id,
      };

      await api.put(`/product/${id}`, productData);
     
      toast.success("Decor item updated successfully!");
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "An error occurred",
        { position: "top-right" }
      );
    } finally {
      setFormSubmitLoading(false);
    }
  };

  if (isFetching) {
    return (
        <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loading />
          <p className="font-heading text-slate-900 text-lg sm:text-2xl mt-4">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center">
              <Palette className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Update Event Decor Item
              </h1>
              <p className="text-slate-600 mt-1">
                Edit the details of your decorative item
              </p>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center space-x-2 text-sm text-slate-500">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-slate-900 rounded-full"></div>
              <span>Basic Info</span>
            </div>
            <div className="w-4 h-px bg-slate-300"></div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
              <span>Details</span>
            </div>
            <div className="w-4 h-px bg-slate-300"></div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
              <span>Media</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Form Fields */}
            <div className="lg:col-span-2 space-y-8">
              {/* Basic Information */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="p-6 border-b border-slate-100">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-slate-600" />
                    <h2 className="text-lg font-semibold text-slate-900">
                      Basic Information
                    </h2>
                  </div>
                </div>
                <div className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Item Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register("name", { required: "This field is required" })}
                      type="text"
                      placeholder="e.g., Crystal Centerpiece, Floral Garland, etc."
                      className="w-full bg-white px-4 py-3 border border-slate-500 rounded-lg focus:ring-2 focus:ring-slate-900 transition-colors text-slate-900 placeholder-slate-400"
                    />
                    {errors.name && (
                      <div className="flex items-center mt-2 text-red-600">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        <span className="text-sm">{errors.name.message}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      {...register("description", { required: "This field is required" })}
                      rows="4"
                      placeholder="Describe your decor item in detail (materials, dimensions, colors, etc.)"
                      className="w-full px-4 py-3 border bg-white border-slate-500 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors text-slate-900 placeholder-slate-400 resize-none"
                    />
                    {errors.description && (
                      <div className="flex items-center mt-2 text-red-600">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        <span className="text-sm">{errors.description.message}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Category & Details */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="p-6 border-b border-slate-100">
                  <div className="flex items-center space-x-3">
                    <List className="w-5 h-5 text-slate-600" />
                    <h2 className="text-lg font-semibold text-slate-900">
                      Category & Details
                    </h2>
                  </div>
                </div>
                <div className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register("category", { required: "Please select a category" })}
                      className="w-full px-4 py-3 border border-slate-500 bg-white rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors"
                    >
                      <option value="">Select a category</option>
                      {EventDecorCategories.map((category, index) => (
                        <option value={category} key={index}>
                          {category}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <div className="flex items-center mt-2 text-red-600">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        <span className="text-sm">{errors.category.message}</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Price ($) <span className="text-red-500">*</span>
                      </label>
                      <input
                        {...register("price", { 
                          required: "This field is required",
                          min: { value: 0.01, message: "Price must be greater than 0" }
                        })}
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className="w-full px-4 py-3 border border-slate-500 bg-white rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors"
                      />
                      {errors.price && (
                        <div className="flex items-center mt-2 text-red-600">
                          <AlertCircle className="w-4 h-4 mr-2" />
                          <span className="text-sm">{errors.price.message}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Stock Quantity
                      </label>
                      <input
                        {...register("stock", { 
                          min: { value: 0, message: "Stock cannot be negative" }
                        })}
                        type="number"
                        className="w-full px-4 py-3 border border-slate-500 bg-white rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors"
                      />
                      {errors.stock && (
                        <div className="flex items-center mt-2 text-red-600">
                          <AlertCircle className="w-4 h-4 mr-2" />
                          <span className="text-sm">{errors.stock.message}</span>
                        </div>
                      )}
                    </div>
                  </div>

                

                  <div>
                    <label className="flex items-center space-x-3 cursor-pointer p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                      <Controller
                        name="isFeatured"
                        control={control}
                        render={({ field }) => (
                          <input
                            type="checkbox"
                            className="w-4 h-4 bg-white border-slate-300 rounded focus:ring-slate-900"
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                          />
                        )}
                      />
                      <Star className="text-slate-600 w-5 h-5" />
                      <div>
                        <span className="font-medium text-slate-900">
                          Feature this item
                        </span>
                        <p className="text-sm text-slate-500">
                          Show this item in featured sections
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Image Upload */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="p-6 border-b border-slate-100">
                  <div className="flex items-center space-x-3">
                    <Image className="w-5 h-5 text-slate-600" />
                    <h2 className="text-lg font-semibold text-slate-900">
                      Product Images
                    </h2>
                  </div>
                </div>
                <div className="p-6">
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-slate-400 transition-colors">
                    <div className="w-12 h-12 mx-auto bg-slate-100 rounded-lg flex items-center justify-center mb-4">
                      <Plus className="w-6 h-6 text-slate-600" />
                    </div>
                    <p className="text-sm text-slate-600 mb-4">
                      <span className="font-medium">Click to upload</span> or drag
                      and drop
                    </p>
                    <p className="text-xs text-slate-500 mb-4">
                      PNG, JPG up to 10MB. First image will be the main display.
                    </p>

                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files)}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <span className="inline-flex items-center px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors">
                        <Upload className="w-4 h-4 mr-2" />
                        Select Files
                      </span>
                    </label>

                    {imageFile.length > 0 && (
                      <button
                        type="button"
                        onClick={handleImageUpload}
                        disabled={loading}
                        className="ml-3 inline-flex items-center px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 disabled:bg-slate-400 transition-colors"
                      >
                        {loading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 mr-2" />
                            Upload ({imageFile.length})
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {/* Existing Images */}
                  {existingImages.length > 0 && (
                    <div className="mt-6 space-y-3">
                      <h3 className="text-sm font-medium text-slate-900">
                        Current Images
                      </h3>
                      {existingImages.map((img, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-3 p-3 border border-slate-200 rounded-lg"
                        >
                          <img
                            src={img.url}
                            alt={img.alt || "Existing decor item"}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 truncate">
                              {index === 0 && (
                                <span className="inline-block w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                              )}
                              {img.alt || `Image ${index + 1}`}
                            </p>
                            <p className="text-xs text-slate-500">
                              {index === 0 ? "Main image" : `Image ${index + 1}`}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteImage(index, true)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Newly Uploaded Images */}
                  {uploadedImages.length > 0 && (
                    <div className="mt-6 space-y-3">
                      <h3 className="text-sm font-medium text-slate-900">
                        New Images
                      </h3>
                      {uploadedImages.map((imgSrc, index) => (
                        <div
                          key={imgSrc.filename}
                          className="flex items-center space-x-3 p-3 border border-slate-200 rounded-lg"
                        >
                          <img
                            src={imgSrc.path}
                            alt="Uploaded decor item"
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 truncate">
                              {existingImages.length === 0 && index === 0 && (
                                <span className="inline-block w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                              )}
                              {imgSrc.filename}
                            </p>
                            <p className="text-xs text-slate-500">
                              Image {existingImages.length + index + 1}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteImage(index)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {uploadError.isError && (
                    <div className="mt-4 text-red-600 text-sm">
                      <AlertCircle className="inline w-4 h-4 mr-1" />
                      {uploadError.message}
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Section */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="p-6">
                  <button
                    type="submit"
                    disabled={loading || formSubmitLoading || (existingImages.length + uploadedImages.length < 1)}
                    className="w-full flex items-center justify-center px-6 py-4 bg-slate-900 text-white text-lg font-semibold rounded-lg hover:bg-slate-800 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
                  >
                    {formSubmitLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                        Updating Decor Item...
                      </>
                    ) : (
                      "Update Decor Item"
                    )}
                  </button>
                  <p className="text-xs text-slate-500 text-center mt-3">
                    By updating this item, you agree to our terms and conditions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateDecorItem;