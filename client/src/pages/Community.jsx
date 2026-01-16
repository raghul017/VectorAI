import { useState, useEffect } from "react";
import { Heart, Users, Image as ImageIcon } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth, useUser } from "@clerk/clerk-react";

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

const Community = () => {
  const [creations, setCreations] = useState([]);
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const { getToken } = useAuth();

  const fetchCreations = async () => {
    try {
      const { data } = await axios.get("/api/user/get-published-creations", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (data.success) {
        setCreations(data.creations);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
    setLoading(false);
  };

  const imageLikeToggle = async (id) => {
    try {
      const { data } = await axios.post(
        "/api/user/toggle-like-creation",
        { id },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );

      if (data.success) {
        toast.success(data.message);
        await fetchCreations();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCreations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Lightbox
  const openLightbox = (creation) => setSelectedImage(creation);
  const closeLightbox = () => setSelectedImage(null);

  return !loading ? (
    <div className="h-full overflow-y-scroll bg-[#050505]">
      <div className="max-w-6xl mx-auto p-6 lg:p-8 pt-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-neutral-500 mb-6">
          <span>Dashboard</span>
          <span>/</span>
          <span className="text-white">Community</span>
        </div>

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Users className="w-6 h-6 text-neutral-400" />
              <h1 className="text-2xl font-semibold text-white tracking-tight">
                Community Gallery
              </h1>
            </div>
            <p className="text-neutral-500 text-sm">
              Explore AI-generated images from our community
            </p>
          </div>
          {creations.length > 0 && (
            <span className="text-xs text-neutral-500">
              {creations.length} creation{creations.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {creations.length === 0 ? (
          <div className="rounded-xl border border-neutral-800 p-12 text-center">
            <div className="w-14 h-14 mx-auto border border-neutral-800 rounded-full flex items-center justify-center mb-4">
              <Heart className="w-6 h-6 text-neutral-600" />
            </div>
            <h3 className="text-base font-medium text-white mb-2">
              No creations yet
            </h3>
            <p className="text-neutral-500 text-sm max-w-sm mx-auto">
              Be the first to share your AI-generated images with the community!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {creations.map((creation, index) => (
              <div
                key={index}
                className="group relative rounded-lg border border-neutral-800 overflow-hidden hover:border-neutral-700 transition-all cursor-pointer"
                onClick={() => openLightbox(creation)}
              >
                <img
                  src={creation.content}
                  alt={creation.prompt}
                  className="w-full aspect-square object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all flex flex-col justify-end p-3">
                  <p className="text-white text-xs font-medium mb-1 line-clamp-2">
                    {creation.prompt}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-neutral-400 text-[10px]">
                      {creation.user_name || user.fullName}
                    </p>
                    <div
                      className="flex items-center gap-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        imageLikeToggle(creation.id);
                      }}
                    >
                      <span className="text-white text-xs font-medium">
                        {creation.likes.length}
                      </span>
                      <Heart
                        className={`w-3.5 h-3.5 cursor-pointer transition-colors ${
                          creation.likes.includes(user.id)
                            ? "fill-red-500 text-red-500"
                            : "text-white hover:text-red-400"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-6"
          onClick={closeLightbox}
        >
          <div className="max-w-3xl max-h-[90vh] relative" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedImage.content}
              alt={selectedImage.prompt}
              className="max-w-full max-h-[80vh] rounded-lg"
            />
            <div className="mt-4 flex items-center justify-between">
              <div className="flex-1">
                <p className="text-white text-sm">{selectedImage.prompt}</p>
                <p className="text-neutral-500 text-xs mt-1">
                  by {selectedImage.user_name || user.fullName}
                </p>
              </div>
              <button
                onClick={() => imageLikeToggle(selectedImage.id)}
                className="flex items-center gap-2 px-3 py-1.5 border border-neutral-700 rounded-lg"
              >
                <Heart
                  className={`w-4 h-4 ${
                    selectedImage.likes.includes(user.id)
                      ? "fill-red-500 text-red-500"
                      : "text-white"
                  }`}
                />
                <span className="text-white text-sm">{selectedImage.likes.length}</span>
              </button>
            </div>
            <button
              onClick={closeLightbox}
              className="absolute -top-2 -right-2 w-8 h-8 bg-neutral-800 rounded-full flex items-center justify-center text-white hover:bg-neutral-700"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  ) : (
    <div className="h-full flex items-center justify-center bg-[#050505]">
      {/* Skeleton Grid */}
      <div className="max-w-6xl mx-auto p-6 w-full">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-square bg-neutral-800 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Community;
