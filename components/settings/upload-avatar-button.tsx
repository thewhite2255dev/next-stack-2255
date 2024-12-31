/* eslint-disable @typescript-eslint/no-explicit-any */
"client";

import { CldUploadWidget } from "next-cloudinary";
import { useSession } from "next-auth/react";
import { toast } from "@/hooks/use-toast";
import ToastSuccess from "../toast-success";
import { updateAvatar } from "@/actions/settings/update-avatar";

interface UploadAvatarButtonProps {
  children: React.ReactNode;
}

export default function UploadAvatarButton({
  children,
}: UploadAvatarButtonProps) {
  const { update } = useSession();

  const handleUpload = (result: any) => {
    if (result.event === "success") {
      updateAvatar(result.info.secure_url).then((data) => {
        if (data?.success) {
          update();
          toast({
            description: <ToastSuccess message={data?.success} />,
          });
        }
      });
    }
  };

  return (
    <CldUploadWidget
      onSuccess={(result) => handleUpload(result)}
      signatureEndpoint="/api/sign-cloudinary-image"
    >
      {({ open }) => {
        return (
          <span className="cursor-pointer" onClick={() => open()}>
            {children}
          </span>
        );
      }}
    </CldUploadWidget>
  );
}
