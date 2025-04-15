"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import supabase from "@/shared/config/supabase";

export async function login(email: string, password: string) {
  // type-casting here for convenience
  // in practice, you should validate your inputs

  try {
    await signInWithEmail(email, password);
  } catch (e) {
    console.error(e);
  }
  // if (error) {
  //   redirect("/error");
  // }
  //
  // revalidatePath("/", "layout");
  // redirect("/");
}

export async function signup(formData: FormData) {
  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  try {
    await supabase.auth.signUp(data);
  } catch (e) {
    console.error(e);
  }
}

//   if (error) {
//     redirect("/error");
//   }
//
//   revalidatePath("/", "layout");
//   redirect("/");
// }

async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  console.log({ data, error });
}
