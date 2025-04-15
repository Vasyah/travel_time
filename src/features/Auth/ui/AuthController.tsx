"use client";
import React from "react";
import { useUnit } from "effector-react/compat";
import { $user } from "@/shared/models/auth";
import { redirect, usePathname } from "next/navigation";
import { revalidatePath } from "next/cache";
import supabase from "@/shared/config/supabase";

export interface AuthControllerProps {
  children?: React.ReactNode;
  className?: string;
}

export const useAuthSession = async ({
  className,
  children,
}: AuthControllerProps) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) redirect("/login");
};
