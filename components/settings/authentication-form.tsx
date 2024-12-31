"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

import { useTransition } from "react";
import { toast } from "@/hooks/use-toast";
import { ExtendedUser } from "@/next-auth";
import { updateAuthentication } from "@/actions/settings/update-authentication";
import { AuthenticationFormValues } from "@/types/settings.types";
import { AuthenticationFormSchema } from "@/schemas/settings.schema";
import ToastError from "../toast-error";
import ToastSuccess from "../toast-success";

interface AuthenticationFormProps {
  user?: ExtendedUser;
}

export default function AuthenticationForm({ user }: AuthenticationFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<AuthenticationFormValues>({
    resolver: zodResolver(AuthenticationFormSchema),
    defaultValues: {
      isTwoFactorEnabled: user?.isTwoFactorEnabled || false,
    },
  });

  const handleSubmitTwoFactor = (values: { isTwoFactorEnabled: boolean }) => {
    startTransition(() => {
      updateAuthentication(values).then((data) => {
        if (data?.error) {
          toast({
            description: <ToastError message={data?.error} />,
          });
        }

        if (data?.success) {
          toast({
            description: <ToastSuccess message={data?.success} />,
          });
        }
      });
    });
  };

  return (
    <Form {...form}>
      <div className="space-y-6">
        <div className="space-y-8">
          <FormField
            control={form.control}
            name="isTwoFactorEnabled"
            render={({ field }) => (
              <FormItem>
                <div className="mt-2 flex items-center justify-between rounded-md border border-input px-3 py-2 shadow-sm">
                  <div className="space-y-0">
                    <FormLabel>Two Factor Authentication</FormLabel>
                    <FormDescription>
                      Enable two-factor authentication for your account
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      disabled={isPending}
                      onCheckedChange={field.onChange}
                      checked={field.value}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            disabled={isPending}
            type="button"
            onClick={() => form.handleSubmit(handleSubmitTwoFactor)()}
          >
            Update authentication
          </Button>
        </div>
      </div>
    </Form>
  );
}
