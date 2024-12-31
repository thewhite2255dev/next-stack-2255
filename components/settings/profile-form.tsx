"use client";

import Link from "next/link";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { MoreVertical, Trash2, Upload, User2 } from "lucide-react";
import { ExtendedUser } from "@/next-auth";
import { useTransition } from "react";
import { useSession } from "next-auth/react";
import { updateProfile } from "@/actions/settings/update-profile";
import { ProfileFormValues } from "@/types/settings.types";
import { ProfileFormSchema } from "@/schemas/settings.schema";
import ToastError from "../toast-error";
import ToastSuccess from "../toast-success";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import UploadAvatarButton from "./upload-avatar-button";
import DeleteAvatarButton from "./delete-avatar-button";

interface ProfileFormProps {
  user?: ExtendedUser;
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const { update } = useSession();
  const [isPending, startTransition] = useTransition();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(ProfileFormSchema),
    defaultValues: {
      name: user?.name || "",
      bio: user?.bio || "",
      location: user?.location || "",
      email: user?.email || "",
    },
  });

  const handleSubmit = (values: ProfileFormValues) => {
    startTransition(() => {
      updateProfile(values).then((data) => {
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
        <div>
          <FormLabel>Profile picture</FormLabel>
          <div className="mt-2 rounded-md border border-input px-3 py-2 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm">
                <Avatar className="h-12 w-12 rounded-lg">
                  <AvatarImage
                    src={(user?.image as string) || undefined}
                    alt={user?.name}
                  />
                  <AvatarFallback className="rounded-lg bg-info text-primary-foreground">
                    <User2 className="size-8" />
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left leading-tight">
                  <span className="truncate font-semibold">{user?.name}</span>
                  <span className="truncate text-sm text-muted-foreground">
                    {user?.email}
                  </span>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button type="button" variant="ghost" size="icon">
                    <MoreVertical />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuGroup>
                    <UploadAvatarButton>
                      <DropdownMenuItem>
                        <Upload />
                        Upload image
                      </DropdownMenuItem>
                    </UploadAvatarButton>
                    <DeleteAvatarButton>
                      <DropdownMenuItem>
                        <Trash2 />
                        Remove image
                      </DropdownMenuItem>
                    </DeleteAvatarButton>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <FormDescription className="mt-2">
            This is your avatar. You can also use the buttons to change or
            remove your profile picture.
          </FormDescription>
        </div>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  disabled={isPending}
                  placeholder="Your name"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This is your public display name. It can be your real name or a
                pseudonym.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a verified email to display" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={user?.email as string}>
                    {user?.email}
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                You can manage verified email addresses in your{" "}
                <Link href="/examples/forms">email settings</Link>.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  className="resize-none"
                  rows={3}
                  maxLength={160}
                  disabled={isPending}
                  placeholder="Tell us a little bit about yourself"
                  {...field}
                />
              </FormControl>
              <div className="flex items-center justify-between">
                <FormDescription>
                  Write a short bio to introduce yourself.
                </FormDescription>
                <FormDescription>
                  {form.getValues("bio")?.length} / 160
                </FormDescription>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input
                  maxLength={100}
                  disabled={isPending}
                  placeholder="Your location"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Your location helps us connect you with services nearby.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isPending} type="submit">
          Update profile
        </Button>
      </form>
    </Form>
  );
}
