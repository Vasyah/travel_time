import { createStore } from "effector";
import { createEffect } from "effector/compat";
import { RegisterProps } from "@/shared/api/auth/auth";

export const setUser = createEffect<Omit<RegisterProps, "password">>();

export const $user = createStore<Omit<RegisterProps, "password"> | null>(
  null,
).on(setUser, (old, newUser) => {
  return newUser;
});
