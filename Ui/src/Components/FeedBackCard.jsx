const FeedBackCard = ({ name, message, image }) => {
  return (
    <div className="bg-white hover:bg-gray-50 transition-colors duration-200 p-6 border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md my-4 mx-2 rounded-xl flex gap-4 items-start group">
      <div className="flex-shrink-0">
        <img
          src={image}
          alt={`${name}'s avatar`}
          className="w-14 h-14 rounded-full object-cover border-2 border-gray-100 group-hover:border-blue-200 transition-colors duration-200"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 text-lg mb-2 leading-tight">
          {name}
        </h3>
        <blockquote className="text-gray-600 leading-relaxed italic relative">
          <span className="text-blue-400 text-xl absolute -left-1 -top-1">"</span>
          <span className="pl-3">{message}</span>
          <span className="text-blue-400 text-xl">"</span>
        </blockquote>
      </div>
    </div>
  );
};

export default FeedBackCard;
