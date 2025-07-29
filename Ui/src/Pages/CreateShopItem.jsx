import React, { useState } from "react";
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
  Tag,
} from "lucide-react";
import UserProfile from "../../UserProfile";
import api from "../lib/Url";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FaMoneyBillWave } from "react-icons/fa";

const EventDecorCategories = [
  "Lighting & Effects",
  "Floral Decoration",
  "Table Decoration",
  "Dining Setup",
  "Other",
];

const CreateDecorItem = () => {
  const currentUser = UserProfile.GetUserData();
  const [imageFile, setImageFile] = useState([]);
  const [uploadError, setUploadError] = useState({
    isError: false,
    message: "",
  });
  const [formSubmitLoading, setFormSubmitLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      offer: false,
      discountPrice: "",
      price: "",
      category: "",
      stock: 0,
    },
    mode: "onBlur",
  });

  const watchOffer = watch("offer");

  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (!imageFile.length) {
      setError("images", {
        type: "manual",
        message: "Please select at least one image",
      });
      return;
    }

    setLoading(true);
    const uploadFormData = new FormData();

    for (let i = 0; i < imageFile.length; i++) {
      uploadFormData.append("images", imageFile[i]);
    }

    try {
      const response = await api.post("/storage/upload", uploadFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setUploadedImages((prev) => [...prev, ...response.data.images]);
      setImageFile([]);
      clearErrors("images");
    } catch (error) {
      setError("images", {
        type: "manual",
        message: error.response?.data?.message || "Image upload failed",
      });
      toast.error(
        error.response?.data?.message || error.message || "Image upload failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async (index) => {
    const newImages = [...uploadedImages];
    newImages.splice(index, 1);
    setUploadedImages(newImages);

    if (newImages.length === 0) {
      setError("images", {
        type: "manual",
        message: "At least one image is required",
      });
    } else {
      clearErrors("images");
    }
  };

  const onSubmit = async (data) => {
    if (uploadedImages.length < 1) {
      setError("images", {
        type: "manual",
        message: "Please upload at least one image",
      });
      toast.error("Please upload at least one image", {
        position: "top-right",
      });
      return;
    }

    try {
      setFormSubmitLoading(true);

      const productData = {
        ...data,
        images: uploadedImages.map((img) => ({
          url: img.path,
          alt: data.name || "Event decor item",
        })),
        userId: currentUser._id,
      };

      const res = await api.post(`/product`, productData);
      navigate(`/item/${res.data._id}`);

      toast.success("Shop item created successfully!");
    } catch (error) {
      if (error.response?.data?.errors) {
        error.response.data.errors.forEach((err) => {
          setError(err.path, {
            type: "server",
            message: err.msg,
          });
        });
      } else {
        toast.error(
          error.response?.data?.message || error.message || "An error occurred",
          { position: "top-right" }
        );
      }
    } finally {
      setFormSubmitLoading(false);
    }
  };

  const ErrorMessage = ({ error }) => {
    if (!error) return null;

    return (
      <div className="flex items-center mt-2 text-red-600">
        <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
        <span className="text-sm">{error.message}</span>
      </div>
    );
  };

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
                Add New Event Shop Item
              </h1>
              <p className="text-slate-600 mt-1">
                Fill in the details to add your Shop item to the shop
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
                      {...register("name", {
                        required: "This field is required",
                        minLength: {
                          value: 3,
                          message: "Name must be at least 3 characters",
                        },
                        maxLength: {
                          value: 100,
                          message: "Name must be less than 100 characters",
                        },
                      })}
                      type="text"
                      placeholder="e.g., Crystal Centerpiece, Floral Garland, etc."
                      className={`w-full bg-white px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-900 transition-colors text-slate-900 placeholder-slate-400 ${
                        errors.name ? "border-red-500" : "border-slate-500"
                      }`}
                    />
                    <ErrorMessage error={errors.name} />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      {...register("description", {
                        required: "This field is required",
                        minLength: {
                          value: 10,
                          message: "Description must be at least 10 characters",
                        },
                        maxLength: {
                          value: 1000,
                          message:
                            "Description must be less than 1000 characters",
                        },
                      })}
                      rows="4"
                      placeholder="Describe your shop item in detail (materials, dimensions, colors, etc.)"
                      className={`w-full px-4 py-3 border bg-white rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors text-slate-900 placeholder-slate-400 resize-none ${
                        errors.description
                          ? "border-red-500"
                          : "border-slate-500"
                      }`}
                    />
                    <ErrorMessage error={errors.description} />
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
                      {...register("category", {
                        required: "Please select a category",
                        validate: (value) =>
                          EventDecorCategories.includes(value) ||
                          "Please select a valid category",
                      })}
                      className={`w-full px-4 py-3 border bg-white rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors ${
                        errors.category ? "border-red-500" : "border-slate-500"
                      }`}
                    >
                      <option value="">Select a category</option>
                      {EventDecorCategories.map((category, index) => (
                        <option value={category} key={index}>
                          {category}
                        </option>
                      ))}
                    </select>
                    <ErrorMessage error={errors.category} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Price <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FaMoneyBillWave className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                          {...register("price", {
                            required: "This field is required",
                            pattern: {
                              value: /^\d+(\.\d{1,2})?$/,
                              message:
                                "Price must be a valid number with up to 2 decimal places",
                            },
                            min: {
                              value: 1,
                              message: "Price must be greater than 0",
                            },
                           
                          })}
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          className={`w-full pl-12 pr-4 py-3 border bg-white rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors ${
                            errors.price ? "border-red-500" : "border-slate-500"
                          }`}
                        />
                      </div>
                      <ErrorMessage error={errors.price} />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Stock Quantity
                      </label>
                      <input
                        {...register("stock", {
                          min: {
                            value: 0,
                            message: "Stock cannot be negative",
                          },
                          max: {
                            value: 10000,
                            message: "Stock must be less than 10,000",
                          },
                          pattern: {
                            value: /^[0-9]+$/,
                            message: "Stock must be a whole number",
                          },
                        })}
                        type="number"
                        className={`w-full px-4 py-3 border bg-white rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors ${
                          errors.stock ? "border-red-500" : "border-slate-500"
                        }`}
                      />
                      <ErrorMessage error={errors.stock} />
                    </div>
                  </div>

                  {/* Discount Offer Section */}
                  <div>
                    <label className="flex items-center space-x-3 cursor-pointer p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                      <Controller
                        name="offer"
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
                      <Tag className="text-slate-600 w-5 h-5" />
                      <div>
                        <span className="font-medium text-slate-900">
                          Offer a discount
                        </span>
                        <p className="text-sm text-slate-500">
                          Provide a special price for this item
                        </p>
                      </div>
                    </label>

                    {watchOffer && (
                      <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Discount Price <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <FaMoneyBillWave className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                          <input
                            {...register("discountPrice", {
                              required: "Discount price is required when offer is checked",
                              validate: (value) => {
                                const price = watch("price");
                                if (!price) return "Please enter regular price first";
                                if (parseFloat(value) >= parseFloat(price)) {
                                  return "Discount price must be less than regular price";
                                }
                                if (parseFloat(value) <= 0) {
                                  return "Discount price must be greater than 0";
                                }
                                return true;
                              }
                            })}
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            className={`w-full pl-12 pr-4 py-3 border bg-white rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors ${
                              errors.discountPrice ? "border-red-500" : "border-slate-300"
                            }`}
                          />
                        </div>
                        <ErrorMessage error={errors.discountPrice} />
                      </div>
                    )}
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
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center hover:border-slate-400 transition-colors ${
                      errors.images
                        ? "border-red-500 bg-red-50"
                        : "border-slate-300"
                    }`}
                  >
                    <div className="w-12 h-12 mx-auto bg-slate-100 rounded-lg flex items-center justify-center mb-4">
                      <Plus className="w-6 h-6 text-slate-600" />
                    </div>
                    <p className="text-sm text-slate-600 mb-4">
                      <span className="font-medium">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-slate-500 mb-4">
                      PNG, JPG up to 10MB. First image will be the main display.
                    </p>

                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => {
                        setImageFile(e.target.files);
                        if (e.target.files.length > 0) {
                          clearErrors("images");
                        }
                      }}
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

                  <ErrorMessage error={errors.images} />

                  {/* Uploaded Images */}
                  {uploadedImages.length > 0 && (
                    <div className="mt-6 space-y-3">
                      <h3 className="text-sm font-medium text-slate-900">
                        Uploaded Images
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
                              {index === 0 && (
                                <span className="inline-block w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                              )}
                              {imgSrc.filename}
                            </p>
                            <p className="text-xs text-slate-500">
                              {index === 0
                                ? "Main image"
                                : `Image ${index + 1}`}
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
                </div>
              </div>

              {/* Submit Section */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="p-6">
                  <button
                    type="submit"
                    disabled={
                      uploadedImages.length < 1 || loading || formSubmitLoading
                    }
                    className="w-full flex items-center justify-center px-6 py-4 bg-slate-900 text-white text-lg font-semibold rounded-lg hover:bg-slate-800 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
                  >
                    {formSubmitLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                        Adding Shop Item...
                      </>
                    ) : (
                      "Add Shop Item"
                    )}
                  </button>
                  <p className="text-xs text-slate-500 text-center mt-3">
                    By adding this item, you agree to our terms and conditions.
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

export default CreateDecorItem;