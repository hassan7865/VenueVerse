import { useState, useEffect } from "react";
import {
  FiEdit2,
  FiSave,
  FiX,
  FiUser,
  FiMail,
  FiFileText,
  FiCamera,
} from "react-icons/fi";
import { toast } from "react-hot-toast";
import Loading from "../Components/Loading";
import api from "../lib/Url";
import UserProfile from "../../UserProfile";

const ProfilePage = () => {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    bio: "",
  });

  const [editMode, setEditMode] = useState({
    bio: false,
  });

  const [tempData, setTempData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdatingProfilePic, setIsUpdatingProfilePic] = useState(false);
  const currentUser = UserProfile.GetUserData();

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/user/${currentUser._id}`);
      setUserData(response.data);
    } catch (error) {
      toast.error("Failed to fetch profile data");
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchUserData();
  }, []);

  // Handle edit button click
  const handleEdit = (field) => {
    setTempData({ ...tempData, [field]: userData[field] });
    setEditMode({ ...editMode, [field]: true });
  };

  // Handle cancel edit
  const handleCancel = (field) => {
    setEditMode({ ...editMode, [field]: false });
  };

  // Handle save changes
  const handleSave = async (field) => {
    if (!tempData[field] || tempData[field] === userData[field]) {
      setEditMode({ ...editMode, [field]: false });
      return;
    }

    setIsSaving(true);
    try {
      const response = await api.put(`/user/${currentUser._id}`, {
        [field]: tempData[field],
      });

      setUserData((prev) => ({
        ...prev,
        [field]: response.data[field],
      }));
      setEditMode({ ...editMode, [field]: false });
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
      console.error("Error updating profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle profile picture upload
  const handleProfilePicUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match("image.*")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size should be less than 2MB");
      return;
    }

    const uploadFormData = new FormData();
    uploadFormData.append("images", file); // backend expects 'images' key, even for single file

    setIsUpdatingProfilePic(true);

    try {
      // Step 1: Upload to /storage/upload
      const uploadResponse = await api.post("/storage/upload", uploadFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const uploadedImageUrl = uploadResponse.data.images[0]?.path;

      if (!uploadedImageUrl) {
        throw new Error("No image URL returned from upload");
      }

      // Step 2: Update user's avatar with uploaded image URL
      const updateResponse = await api.put(`/user/${currentUser._id}`, {
        avatar: uploadedImageUrl,
      });

      setUserData((prev) => ({
        ...prev,
        avatar: updateResponse.data.avatar,
      }));

      toast.success("Profile picture updated successfully");
      UserProfile.UpdateUserData({avatar:uploadedImageUrl})
    } catch (error) {
      toast.error("Failed to update profile picture");
      console.error("Error updating profile picture:", error);
    } finally {
      setIsUpdatingProfilePic(false);
    }
  };

  // Handle input changes
  const handleChange = (field, value) => {
    setTempData({ ...tempData, [field]: value });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 h-40 relative">
        {/* Profile Picture */}
        <div className="absolute -bottom-12 left-8">
          <div className="relative group">
            <label htmlFor="profile-pic-upload" className="cursor-pointer">
              <div className="w-24 h-24 bg-white rounded-full shadow-lg border-4 border-white">
                {userData.avatar ? (
                  <img
                    src={userData.avatar}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                    <FiUser className="w-10 h-10 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                {isUpdatingProfilePic ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <FiCamera className="w-5 h-5 text-white" />
                )}
              </div>
            </label>
            <input
              id="profile-pic-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleProfilePicUpload}
              disabled={isUpdatingProfilePic}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-16 px-4 sm:px-8 max-w-6xl mx-auto">
        {/* User Info */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">
            {userData.username}
          </h1>
          <p className="text-gray-600">{userData.email}</p>
        </div>

        {/* Profile Details */}
        <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-200">
          {/* Username */}
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FiUser className="w-5 h-5 text-gray-400" />
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Username
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {userData.username}
                  </dd>
                </div>
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FiMail className="w-5 h-5 text-gray-400" />
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Email address
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {userData.email}
                  </dd>
                </div>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="p-4 sm:p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <FiFileText className="w-5 h-5 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <dt className="text-sm font-medium text-gray-500">Bio</dt>
                  {!editMode.bio ? (
                    <div className="mt-1 text-sm text-gray-900 leading-relaxed whitespace-pre-line">
                      {userData.bio || "No bio provided"}
                    </div>
                  ) : (
                    <div className="mt-2">
                      <textarea
                        rows={4}
                         value={tempData.bio !== undefined ? tempData.bio : userData.bio}
                        onChange={(e) => handleChange("bio", e.target.value)}
                        className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none"
                        placeholder="Tell us about yourself..."
                      />
                      <div className="mt-3 flex justify-end space-x-3">
                        <button
                          onClick={() => handleCancel("bio")}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          disabled={isSaving}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSave("bio")}
                          disabled={
                            isSaving ||
                            !tempData.bio ||
                            tempData.bio === userData.bio
                          }
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
                        >
                          {isSaving ? (
                            <>
                              <svg
                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              Saving...
                            </>
                          ) : (
                            "Save"
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {!editMode.bio && (
                <button
                  onClick={() => handleEdit("bio")}
                  className="ml-3 p-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded"
                >
                  <FiEdit2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
