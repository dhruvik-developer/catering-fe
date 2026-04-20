const Loader = ({ message, fullScreen = true }) => {
  return (
    <div
      className={`flex flex-col ${fullScreen ? "h-full min-h-[50vh]" : "h-full py-8"} items-center justify-center bg-transparent`}
    >
      <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-[#845cbd] border-t-transparent"></div>
      {message && (
        <p className="mt-4 text-lg font-medium text-[#845cbd]">{message}</p>
      )}
    </div>
  );
};
export default Loader;
