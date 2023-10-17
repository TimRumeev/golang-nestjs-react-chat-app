export const ErrorBox = ({
  context = "Error",
  error,
}: {
  error: string;
  context?: string;
}) => {
  return (
    error && (
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center">
        <div
          className="bg-red-50 border border-red-300 text-red-500 px-6 py-4 rounded-xl relative"
          role="alert"
        >
          <strong className="font-medium">{context}: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    )
  );
};
