// pages/index.tsx or any other page/component

import Loading from '../../app/components/Loading'; // Adjust the path as needed

export default function HomePage() {
  // State or logic to determine loading state
  const isLoading = true; // Example state

  return (
    <div>
      {isLoading ? (
        <Loading />
      ) : (
        <div>
          {/* Your actual content goes here */}
          <h1>Welcome to the Home Page!</h1>
        </div>
      )}
    </div>
  );
}
