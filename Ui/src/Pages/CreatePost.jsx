import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";

import {
  Upload,
  Trash2,
  Image,
  MapPin,
  Users,
  Square,
  Tag,
  FileText,
  Home,
  Settings,
  Plus,
  Check,
  AlertCircle,
  Building,
  Clock,
} from "lucide-react";
import UserProfile from "../../UserProfile";
import api from "../lib/Url";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FaMoneyBillWave } from "react-icons/fa";
import DatePicker from "react-datepicker";

const VenueTypes = [
  "Banquet Halls",
  "Ballrooms",
  "Conference Centers",
  "Hotels",
  "Gardens and Parks",
  "Beaches",
  "Rooftops and Terraces",
  "Restaurants and Cafes",
  "Bars and Lounges",
];



const CreatePost = () => {
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
    setValue,
    reset,
  } = useForm({
    defaultValues: {
      type: "service",
      offer: false,
      price: "",
      discountPrice: "",
      operationDays: [],
      operationHours: {
        open: "",
        close: "",
      },
    },
  });

    const validateTimeRange = (openTime, closeTime) => {
    if (!openTime || !closeTime) return true;

    const openMinutes = timeToMinutes(openTime);
    const closeMinutes = timeToMinutes(closeTime);

    if (closeTime === "00:00") return true;

    if (closeMinutes <= openMinutes) {
      return closeMinutes !== openMinutes;
    }

    return closeMinutes > openMinutes;
  };
  const watchType = watch("type");
  const watchOffer = watch("offer");

    const timeToMinutes = (timeStr) => {
    if (!timeStr) return null;
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (!imageFile.length) return;

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
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Image upload failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async (index) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
    console.log("Image deleted successfully!");
  };

  const onSubmit = async (data) => {
    if (uploadedImages.length < 1) {
      toast.error("Please upload at least one image", {
        position: "top-right",
      });
      return;
    }

    try {
      setFormSubmitLoading(true);

      const postData = {
        ...data,
        imgUrl: uploadedImages,
        userId: currentUser._id,
      };

      if (data.type === "service") {
        delete postData.address;
        delete postData.area;
        delete postData.capacity;
        delete postData.venuetype;
      }

      const res = await api.post(`/post/save`, postData);

      navigate(`/listing/${res.data._id}`);

      toast.success("Listing Created Successfully!");
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "An error occurred",
        { position: "top-right" }
      );
    } finally {
      setFormSubmitLoading(false);
    }
  };

    const timeStringToDate = (timeStr) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center">
              <Building className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Create New Listing
              </h1>
              <p className="text-slate-600 mt-1">
                Fill in the details to create your professional listing
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
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register("title", {
                        required: "Title is required",
                        minLength: {
                          value: 5,
                          message: "Title must be at least 5 characters",
                        },
                        maxLength: {
                          value: 100,
                          message: "Title must not exceed 100 characters",
                        },
                      })}
                      type="text"
                      placeholder="Enter your listing title"
                      className="w-full bg-white px-4 py-3 border border-slate-500 rounded-lg focus:ring-2 focus:ring-slate-900 transition-colors text-slate-900 placeholder-slate-400"
                    />
                    {errors.title && (
                      <div className="flex items-center mt-2 text-red-600">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        <span className="text-sm">{errors.title.message}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      {...register("description", {
                        required: "Description is required",
                        minLength: {
                          value: 20,
                          message: "Description must be at least 20 characters",
                        },
                        maxLength: {
                          value: 1000,
                          message:
                            "Description must not exceed 1000 characters",
                        },
                      })}
                      rows="4"
                      placeholder="Describe your service or venue in detail"
                      className="w-full px-4 py-3 border bg-white border-slate-500 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors text-slate-900 placeholder-slate-400 resize-none"
                    />
                    {errors.description && (
                      <div className="flex items-center mt-2 text-red-600">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        <span className="text-sm">
                          {errors.description.message}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Post Type Selection */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="p-6 border-b border-slate-100">
                  <div className="flex items-center space-x-3">
                    <Settings className="w-5 h-5 text-slate-600" />
                    <h2 className="text-lg font-semibold text-slate-900">
                      Listing Type
                    </h2>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="relative cursor-pointer">
                      <input
                        type="radio"
                        value="service"
                        className="sr-only"
                        checked={watchType === "service"}
                        onChange={() => setValue("type", "service")}
                      />
                      <div
                        className={`p-6 border-2 rounded-lg transition-all ${
                          watchType === "service"
                            ? "border-slate-900 bg-slate-50"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-start space-x-4">
                          <div
                            className={`p-3 rounded-lg ${
                              watchType === "service"
                                ? "bg-slate-900"
                                : "bg-slate-100"
                            }`}
                          >
                            <Settings
                              className={`w-5 h-5 ${
                                watchType === "service"
                                  ? "text-white"
                                  : "text-slate-600"
                              }`}
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-slate-900">
                              Service
                            </h3>
                            <p className="text-sm text-slate-500 mt-1">
                              Professional services, consultations, or expertise
                            </p>
                          </div>
                          {watchType === "service" && (
                            <Check className="w-5 h-5 text-slate-900" />
                          )}
                        </div>
                      </div>
                    </label>

                    <label className="relative cursor-pointer">
                      <input
                        type="radio"
                        value="venue"
                        className="sr-only"
                        checked={watchType === "venue"}
                        onChange={() => setValue("type", "venue")}
                      />
                      <div
                        className={`p-6 border-2 rounded-lg transition-all ${
                          watchType === "venue"
                            ? "border-slate-900 bg-slate-50"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-start space-x-4">
                          <div
                            className={`p-3 rounded-lg ${
                              watchType === "venue"
                                ? "bg-slate-900"
                                : "bg-slate-100"
                            }`}
                          >
                            <Home
                              className={`w-5 h-5 ${
                                watchType === "venue"
                                  ? "text-white"
                                  : "text-slate-600"
                              }`}
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-slate-900">
                              Venue
                            </h3>
                            <p className="text-sm text-slate-500 mt-1">
                              Event spaces, meeting rooms, or rental properties
                            </p>
                          </div>
                          {watchType === "venue" && (
                            <Check className="w-5 h-5 text-slate-900" />
                          )}
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Venue Specific Fields */}
              {watchType === "venue" && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                  <div className="p-6 border-b border-slate-100">
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-slate-600" />
                      <h2 className="text-lg font-semibold text-slate-900">
                        Venue Details
                      </h2>
                    </div>
                  </div>
                  <div className="p-6 space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        {...register("address", {
                          required: "Address is required for venues",
                          minLength: {
                            value: 10,
                            message: "Address must be at least 10 characters",
                          },
                        })}
                        type="text"
                        placeholder="Enter venue address"
                        className="w-full px-4 py-3 border border-slate-500 bg-white rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors"
                      />
                      {errors.address && (
                        <div className="flex items-center mt-2 text-red-600">
                          <AlertCircle className="w-4 h-4 mr-2" />
                          <span className="text-sm">
                            {errors.address.message}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
                          <Square className="w-4 h-4 mr-2" />
                          Area (sqft) <span className="text-red-500">*</span>
                        </label>
                        <input
                          {...register("area", {
                            required: "Area is required",
                            min: {
                              value: 1,
                              message: "Area must be greater than 0",
                            },
                          })}
                          type="number"
                          placeholder="Enter area in sqft"
                          className="w-full px-4 py-3 border border-slate-500 bg-white rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors"
                        />
                        {errors.area && (
                          <div className="flex items-center mt-2 text-red-600">
                            <AlertCircle className="w-4 h-4 mr-2" />
                            <span className="text-sm">
                              {errors.area.message}
                            </span>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
                          <Users className="w-4 h-4 mr-2" />
                          Capacity <span className="text-red-500">*</span>
                        </label>
                        <input
                          {...register("capacity", {
                            required: "Capacity is required",
                            min: {
                              value: 1,
                              message: "Capacity must be at least 1",
                            },
                          })}
                          type="number"
                          placeholder="Enter capacity"
                          className="w-full px-4 py-3 border border-slate-500 bg-white rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors"
                        />
                        {errors.capacity && (
                          <div className="flex items-center mt-2 text-red-600">
                            <AlertCircle className="w-4 h-4 mr-2" />
                            <span className="text-sm">
                              {errors.capacity.message}
                            </span>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Venue Type <span className="text-red-500">*</span>
                        </label>
                        <select
                          {...register("venuetype", {
                            required: "Venue type is required",
                          })}
                          className="w-full px-4 py-3 border border-slate-500 bg-white rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors bg-white"
                        >
                          <option value="">Select type</option>
                          {VenueTypes.map((item, index) => (
                            <option value={item} key={index}>
                              {item}
                            </option>
                          ))}
                        </select>
                        {errors.venuetype && (
                          <div className="flex items-center mt-2 text-red-600">
                            <AlertCircle className="w-4 h-4 mr-2" />
                            <span className="text-sm">
                              {errors.venuetype.message}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Operational Days & Hours */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="p-6 border-b border-slate-100">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-slate-600" />
                    <h2 className="text-lg font-semibold text-slate-900">
                      Operational Days & Hours{" "}
                      <span className="text-red-500">*</span>
                    </h2>
                  </div>
                </div>
                <div className="p-6 space-y-6">
                  {/* Days of Operation */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Select Operational Days{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {[
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday",
                        "Sunday",
                      ].map((day) => (
                        <label
                          key={day}
                          className="flex items-center space-x-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            value={day}
                            checked={watch("operationDays")?.includes(day)}
                            onChange={(e) => {
                              const currentDays = watch("operationDays") || [];
                              const updatedDays = e.target.checked
                                ? [...currentDays, day]
                                : currentDays.filter((d) => d !== day);
                              setValue("operationDays", updatedDays);
                            }}
                            className="form-checkbox h-4 w-4 text-slate-900 border-slate-300"
                          />
                          <span className="text-slate-700 text-sm">{day}</span>
                        </label>
                      ))}
                    </div>
                    {errors.operationDays && (
                      <div className="flex items-center mt-2 text-red-600">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        <span className="text-sm">
                          Please select at least one operational day
                        </span>
                      </div>
                    )}
                  </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Opening Time */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Opening Time <span className="text-red-500">*</span>
                        </label>
                        <Controller
                          name="operationHours.open"
                          control={control}
                          rules={{
                            required: "Opening time is required",
                            validate: (value) => {
                              const closeTime = watch("operationHours.close");
                              if (!validateTimeRange(value, closeTime)) {
                                return "Invalid time range";
                              }
                              return true;
                            },
                          }}
                          render={({ field }) => (
                            <DatePicker
                              selected={
                                field.value
                                  ? timeStringToDate(field.value)
                                  : null
                              }
                              onChange={(date) => {
                                const formatted = date
                                  .toTimeString()
                                  .slice(0, 5); // "HH:mm"
                                field.onChange(formatted);
                              }}
                              showTimeSelect
                              showTimeSelectOnly
                              timeIntervals={30}
                              timeCaption="Time"
                              dateFormat="h:mm aa"
                              className="w-full px-4 py-3 border border-slate-500 bg-white rounded-lg focus:ring-2 focus:ring-slate-900 transition-colors"
                            />
                          )}
                        />
                        {errors.operationHours?.open && (
                          <div className="flex items-center mt-2 text-red-600">
                            <AlertCircle className="w-4 h-4 mr-2" />
                            <span className="text-sm">
                              {errors.operationHours.open.message}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Closing Time */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Closing Time <span className="text-red-500">*</span>
                        </label>
                        <Controller
                          name="operationHours.close"
                          control={control}
                          rules={{
                            required: "Closing time is required",
                            validate: (value) => {
                              const openTime = watch("operationHours.open");
                              if (!validateTimeRange(openTime, value)) {
                                return "Invalid time range";
                              }
                              return true;
                            },
                          }}
                          render={({ field }) => (
                            <DatePicker
                              selected={
                                field.value
                                  ? timeStringToDate(field.value)
                                  : null
                              }
                              onChange={(date) => {
                                const formatted = date
                                  .toTimeString()
                                  .slice(0, 5); // "HH:mm"
                                field.onChange(formatted);
                              }}
                              showTimeSelect
                              showTimeSelectOnly
                              timeIntervals={30}
                              timeCaption="Time"
                              dateFormat="h:mm aa"
                              className="w-full px-4 py-3 border border-slate-500 bg-white rounded-lg focus:ring-2 focus:ring-slate-900 transition-colors"
                            />
                          )}
                        />
                        {errors.operationHours?.close && (
                          <div className="flex items-center mt-2 text-red-600">
                            <AlertCircle className="w-4 h-4 mr-2" />
                            <span className="text-sm">
                              {errors.operationHours.close.message}
                            </span>
                          </div>
                        )}

                        {/* Optional Helper Text */}
                        {(() => {
                          const openTime = watch("operationHours.open");
                          const closeTime = watch("operationHours.close");

                          if (!openTime || !closeTime) return null;

                          if (closeTime === "00:00") {
                            return (
                              <div className="flex items-center mt-2 text-blue-600">
                                <span className="text-sm">
                                  Open until midnight (next day)
                                </span>
                              </div>
                            );
                          }

                          const openMinutes = timeToMinutes(openTime);
                          const closeMinutes = timeToMinutes(closeTime);

                          if (closeMinutes < openMinutes) {
                            return (
                              <div className="flex items-center mt-2 text-blue-600">
                                <span className="text-sm">
                                  Overnight operation (closes next day)
                                </span>
                              </div>
                            );
                          }

                          return null;
                        })()}
                      </div>
                    </div>
                </div>
              </div>

              {/* Pricing Section */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="p-6 border-b border-slate-100">
                  <div className="flex items-center space-x-3">
                    <FaMoneyBillWave className="w-5 h-5 text-slate-600" />
                    <h2 className="text-lg font-semibold text-slate-900">
                      Pricing
                    </h2>
                  </div>
                </div>
                <div className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Regular Price
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <FaMoneyBillWave className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input
                        {...register("price", {
                          required: "Price is required",
                          min: {
                            value: 1,
                            message: "Price must be greater than 0",
                          },
                        })}
                        type="number"
                        placeholder="0.00"
                        className="w-full pl-12 pr-4 py-3 border border-slate-500 bg-white rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors text-lg font-medium"
                      />
                    </div>
                    {errors.price && (
                      <div className="flex items-center mt-2 text-red-600">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        <span className="text-sm">{errors.price.message}</span>
                      </div>
                    )}
                  </div>

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
                          Provide a special price for this listing
                        </p>
                      </div>
                    </label>

                    {watchOffer && (
                      <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Discount Price
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <FaMoneyBillWave className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                          <input
                            {...register("discountPrice", {
                              required:
                                "Discount price is required when offer is checked",
                              validate: (value) => {
                                const price = watch("price");
                                if (!price)
                                  return "Please enter regular price first";
                                if (parseFloat(value) >= parseFloat(price)) {
                                  return "Discount price must be less than regular price";
                                }
                                if (parseFloat(value) <= 0) {
                                  return "Discount price must be greater than 0";
                                }
                                return true;
                              },
                            })}
                            type="number"
                            placeholder="0.00"
                            className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors text-lg font-medium bg-white"
                          />
                        </div>
                        {errors.discountPrice && (
                          <div className="flex items-center mt-2 text-red-600">
                            <AlertCircle className="w-4 h-4 mr-2" />
                            <span className="text-sm">
                              {errors.discountPrice.message}
                            </span>
                          </div>
                        )}
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
                      Media <span className="text-red-500">*</span>
                    </h2>
                  </div>
                </div>
                <div className="p-6">
                  <div
                    className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-slate-400 transition-colors"
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.add(
                        "border-slate-400",
                        "bg-slate-50"
                      );
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.remove(
                        "border-slate-400",
                        "bg-slate-50"
                      );
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.remove(
                        "border-slate-400",
                        "bg-slate-50"
                      );
                      if (e.dataTransfer.files.length > 0) {
                        setImageFile(e.dataTransfer.files);
                      }
                    }}
                  >
                    <div className="w-12 h-12 mx-auto bg-slate-100 rounded-lg flex items-center justify-center mb-4">
                      <Plus className="w-6 h-6 text-slate-600" />
                    </div>
                    <p className="text-sm text-slate-600 mb-4">
                      <span className="font-medium">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-slate-500 mb-4">
                      PNG, JPG, GIF, MP4 up to 10MB. First image will be the
                      cover.
                    </p>

                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*"
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

                  {/* Uploaded Media */}
                  {uploadedImages.length > 0 && (
                    <div className="mt-6 space-y-3">
                      <h3 className="text-sm font-medium text-slate-900">
                        Uploaded Media (Drag to reorder)
                      </h3>
                      <div className="space-y-3">
                        {uploadedImages.map((media, index) => (
                          <div
                            key={media.filename}
                            className={`flex items-center space-x-3 p-3 border border-slate-200 rounded-lg ${
                              index === 0 ? "border-amber-300 bg-amber-50" : ""
                            }`}
                            draggable
                            onDragStart={(e) =>
                              e.dataTransfer.setData("text/plain", index)
                            }
                            onDragOver={(e) => {
                              e.preventDefault();
                              e.currentTarget.classList.add("bg-slate-100");
                            }}
                            onDragLeave={(e) => {
                              e.currentTarget.classList.remove("bg-slate-100");
                            }}
                            onDrop={(e) => {
                              e.preventDefault();
                              e.currentTarget.classList.remove("bg-slate-100");
                              const draggedIndex = parseInt(
                                e.dataTransfer.getData("text/plain")
                              );
                              const newImages = [...uploadedImages];
                              const [removed] = newImages.splice(
                                draggedIndex,
                                1
                              );
                              newImages.splice(index, 0, removed);
                              setUploadedImages(newImages);
                            }}
                          >
                            {media.mimetype.startsWith("image/") ? (
                              <img
                                src={media.path}
                                alt="Uploaded"
                                className="w-12 h-12 object-cover rounded-lg"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-slate-200 rounded-lg flex items-center justify-center">
                                <span className="text-xs text-slate-500">
                                  Video
                                </span>
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-900 truncate">
                                {index === 0 && (
                                  <span className="inline-block w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                                )}
                                {media.filename}
                              </p>
                              <p className="text-xs text-slate-500">
                                {index === 0
                                  ? "Cover media"
                                  : `Media ${index + 1}`}
                                {media.mimetype.startsWith("video/") &&
                                  " (Video)"}
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
                    disabled={
                      uploadedImages.length < 1 || loading || formSubmitLoading
                    }
                    className="w-full flex items-center justify-center px-6 py-4 bg-slate-900 text-white text-lg font-semibold rounded-lg hover:bg-slate-800 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
                  >
                    {formSubmitLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                        Creating Listing...
                      </>
                    ) : (
                      "Create Listing"
                    )}
                  </button>
                  <p className="text-xs text-slate-500 text-center mt-3">
                    By creating this listing, you agree to our terms and
                    conditions.
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

export default CreatePost;
