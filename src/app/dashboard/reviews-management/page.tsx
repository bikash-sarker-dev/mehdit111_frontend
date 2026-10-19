import ReviewsManager from "@/components/dashboardComponents/reviews/ReviewsManager";
import React from "react";

export const metadata = {
  title: "Reviews & AI Replies | GrowMoreReviews",
  description: "Monitor customer reviews, analyze sentiment, and generate AI-powered smart replies.",
};

const page = () => {
  return (
    <div>
      <ReviewsManager />
    </div>
  );
};

export default page;
