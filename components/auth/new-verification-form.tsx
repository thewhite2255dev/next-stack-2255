"use client";

import { newVerification } from "@/actions/auth/new-verification";
import CardWrapper from "@/components/auth/card-wrapper";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";

import FormError from "@/components/form-error";
import FormSuccess from "@/components/form-success";

export default function NewVerificationForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const handleSubmit = useCallback(() => {
    if (success || error) return;

    if (!token) {
      setError("Missing token.");
      return;
    }

    newVerification(token).then((data) => {
      if (data?.error) {
        setError(data?.error);
      }

      if (data?.success) {
        setSuccess(data?.success);
      }
    });
  }, [token, success, error]);

  useEffect(() => {
    handleSubmit();
  }, [handleSubmit]);

  return (
    <CardWrapper
      headerTitle="Email verification"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <div className="flex w-full items-center justify-center">
        {!success && !error && <BeatLoader />}
        <FormSuccess message={success} />
        <FormError message={error} />
      </div>
    </CardWrapper>
  );
}
