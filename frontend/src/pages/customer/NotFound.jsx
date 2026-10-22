import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <section
      className="
        min-h-screen
        flex items-center justify-center
        bg-white text-black
        dark:bg-black dark:text-white
        transition-colors
      "
    >
      <div className="text-center px-6 max-w-lg">

        {/* 404 */}
        <h1
          className="
            text-[6rem] sm:text-[8rem]
            font-extrabold
            leading-none
            tracking-tight
            mb-4
            text-black dark:text-white
          "
        >
          404
        </h1>

        {/* Message */}
        <p className="text-lg sm:text-xl opacity-70 mb-8">
          Oops! The page you’re looking for doesn’t exist.
        </p>

        {/* Actions */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="
              px-6 py-3
              rounded-full
              border border-black/20 dark:border-white/20
              hover:bg-black hover:text-white
              dark:hover:bg-white dark:hover:text-black
              transition-all duration-300
            "
          >
            Go Back
          </button>

          <button
            onClick={() => navigate("/")}
            className="
              px-6 py-3
              rounded-full
              bg-black text-white
              dark:bg-white dark:text-black
              hover:opacity-90
              transition-all duration-300
            "
          >
            Go Home
          </button>
        </div>

      </div>
    </section>
  );
};

export default NotFound;
