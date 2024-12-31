"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import FormError from "@/components/form-error";
import FormSuccess from "@/components/form-success";
import useCurrentUser from "@/hooks/use-current-user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "../ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { signOut, useSession } from "next-auth/react";
import { DeleteAccountFormValues } from "@/types/settings.types";
import { DeleteAccountSchema } from "@/schemas/settings.schema";
import { useRouter } from "next/navigation";
import { deleteAccount } from "@/actions/settings/delete-account";

interface DeleteAccountButtonProps {
  children: React.ReactNode;
}

export default function DeleteAccountButton({
  children,
}: DeleteAccountButtonProps) {
  const user = useCurrentUser();
  const { update } = useSession();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const isMobile = useIsMobile();
  const router = useRouter();

  const form = useForm<DeleteAccountFormValues>({
    resolver: zodResolver(DeleteAccountSchema),
    defaultValues: {
      email: "",
      confirmation: "",
      password: "",
    },
  });

  const handleSubmit = (values: DeleteAccountFormValues) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      deleteAccount(values).then((data) => {
        if (data?.error) {
          setError(data?.error);
        }

        if (data?.success) {
          signOut({ redirectTo: "/" });
          update();
          router.refresh();
        }
      });
    });
  };

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger asChild>{children}</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="px-6 text-left">
            <DrawerTitle>Delete Account</DrawerTitle>
            <DrawerDescription>
              We will immediately delete your account.
            </DrawerDescription>
          </DrawerHeader>
          <Separator />
          <div className="space-y-4 p-6">
            <FormError message="This action is not reversible. Please be certain." />
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-6"
                autoComplete="off"
              >
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Enter your email{" "}
                          <span className="font-semibold">{user?.email}</span>{" "}
                          to continue
                        </FormLabel>
                        <FormControl>
                          <Input {...field} type="email" disabled={isPending} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          To confirm, type{" "}
                          <span className="font-bold">delete my account</span>{" "}
                          below
                        </FormLabel>
                        <FormControl>
                          <Input {...field} disabled={isPending} />
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
                        <FormLabel>Confirm password</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={isPending} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormError message={error} />
                <FormSuccess message={success} />
                <div className="flex justify-between">
                  <DrawerClose asChild>
                    <Button
                      type="button"
                      variant="outline"
                      disabled={isPending}
                    >
                      Cancel
                    </Button>
                  </DrawerClose>
                  <Button type="submit" disabled={isPending}>
                    Delete
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="w-[425px] px-0">
        <AlertDialogHeader className="px-6">
          <AlertDialogTitle>Delete Account</AlertDialogTitle>
          <AlertDialogDescription>
            We will immediately delete your account.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Separator />
        <div className="space-y-4 px-6">
          <FormError message="This action is not reversible. Please be certain." />
          <Form {...form}>
            <form
              autoComplete="off"
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Enter your email{" "}
                        <span className="font-semibold">{user?.email}</span> to
                        continue
                      </FormLabel>
                      <FormControl>
                        <Input {...field} type="email" disabled={isPending} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        To confirm, type{" "}
                        <span className="font-bold">delete my account</span>{" "}
                        below
                      </FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isPending} />
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
                      <FormLabel>Confirm password</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isPending} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormError message={error} />
              <FormSuccess message={success} />
              <div className="flex justify-between">
                <AlertDialogCancel asChild>
                  <Button type="button" variant="outline" disabled={isPending}>
                    Cancel
                  </Button>
                </AlertDialogCancel>
                <Button type="submit" disabled={isPending}>
                  Delete
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
