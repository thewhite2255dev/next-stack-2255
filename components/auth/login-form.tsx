"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import CardWrapper from "@/components/auth/card-wrapper";
import { Button } from "@/components/ui/button";
import FormError from "@/components/form-error";
import FormSuccess from "@/components/form-success";
import { login } from "@/actions/auth/login";
import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useSession } from "next-auth/react";
import { resendCode } from "@/actions/auth/resend-code";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "../ui/input-otp";
import { LoginFormValues } from "@/types/auth.types";
import { LoginSchema } from "@/schemas/auth.schema";

export default function LoginForm() {
  const { update } = useSession();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callback_url") || undefined;
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use with different provider."
      : "";

  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
      code: "",
    },
  });

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleResend2FACode = (email: string) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      resendCode(email).then((data) => {
        if (data?.error) {
          setError(data?.error);
        }

        if (data?.success) {
          setSuccess(data?.success);
        }
      });
    });
  };

  const handleSubmit = (values: LoginFormValues) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      login(values, callbackUrl).then((data) => {
        if (data?.error) {
          setError(data?.error);
        }

        if (data?.success) {
          update();
          setSuccess(data?.success);
          router.refresh();
        }

        if (data?.twoFactor) {
          setShowTwoFactor(true);
        }
      });
    });
  };

  return (
    <CardWrapper
      headerTitle={showTwoFactor ? "Code verification" : "Log in"}
      headerLabel={
        showTwoFactor
          ? `If you have an account, we have sent a code to ${form.getValues("email")}. Enter it below`
          : "Welcome back! Log in to your account"
      }
      backButtonLabel="Don't have an account? Sign up"
      backButtonHref="/auth/signup"
      showSocial
    >
      <Form {...form}>
        <form
          autoComplete="off"
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-6"
        >
          <div className="space-y-4">
            {showTwoFactor && (
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-center">
                      <FormControl>
                        <InputOTP {...field} disabled={isPending} maxLength={6}>
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                          </InputOTPGroup>
                          <InputOTPSeparator />
                          <InputOTPGroup>
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                    </div>
                    <div className="flex items-center justify-center">
                      <Button
                        size="sm"
                        variant="link"
                        onClick={() =>
                          handleResend2FACode(form.getValues("email"))
                        }
                        className="px-0 font-normal"
                      >
                        Did not receive the code? Resend
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {!showTwoFactor && (
              <>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" disabled={isPending} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Password</FormLabel>
                        <Button
                          size="sm"
                          variant="link"
                          asChild
                          className="px-0 font-normal"
                        >
                          <Link href="/auth/forgot-password">
                            Forgot password
                          </Link>
                        </Button>
                      </div>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            disabled={isPending}
                            className="pr-10"
                          />
                          {form.getValues().password !== "" && (
                            <div className="absolute inset-y-0 right-0 flex items-center justify-center p-3">
                              <Button
                                variant={null}
                                type="button"
                                onClick={toggleShowPassword}
                                className="cursor-pointer px-0 font-normal"
                              >
                                {showPassword ? (
                                  <EyeOff className="size-4" />
                                ) : (
                                  <Eye className="size-4" />
                                )}
                              </Button>
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>
          <FormError message={error || urlError} />
          <FormSuccess message={success} />
          <div>
            <Button type="submit" disabled={isPending} className="w-full">
              {showTwoFactor ? "Confirm" : "Log in"}
            </Button>
          </div>
        </form>
      </Form>
    </CardWrapper>
  );
}
