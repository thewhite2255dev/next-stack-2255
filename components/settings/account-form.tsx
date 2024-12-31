"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { UserRole } from "@prisma/client";
import { useTransition } from "react";
import { useSession } from "next-auth/react";
import { ExtendedUser } from "@/next-auth";
import { updateAccount } from "@/actions/settings/update-account";
import { AccountFormValues } from "@/types/settings.types";
import { AccountFormSchema } from "@/schemas/settings.schema";
import ToastError from "../toast-error";
import ToastSuccess from "../toast-success";

interface AccountFormProps {
  user?: ExtendedUser;
}

export default function AccountForm({ user }: AccountFormProps) {
  const { update } = useSession();
  const [isPending, startTransition] = useTransition();

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(AccountFormSchema),
    defaultValues: {
      role: user?.role || undefined,
      username: user?.username || "",
    },
  });

  const handleSubmit = (values: AccountFormValues) => {
    startTransition(() => {
      updateAccount(values).then((data) => {
        if (data?.error) {
          toast({
            description: <ToastError message={data?.error} />,
          });
        }

        if (data?.success) {
          update();
          toast({
            description: <ToastSuccess message={data?.success} />,
          });
        }
      });
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  disabled={isPending}
                  placeholder="Your username"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This is the name that will be displayed on your profile and in
                emails.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select
                disabled={isPending}
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={UserRole.USER}>User</SelectItem>
                  <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <Button disabled={isPending} type="submit">
          Update account
        </Button>
      </form>
    </Form>
  );
}
