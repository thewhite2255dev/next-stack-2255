"use client";

import FormError from "../form-error";
import CardWrapper from "./card-wrapper";

export default function ErrorCard() {
  return (
    <CardWrapper
      headerTitle="Oops"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <div className="flex items-center justify-center">
        <FormError message="Something went wrong. Please try again later." />
      </div>
    </CardWrapper>
  );
}
