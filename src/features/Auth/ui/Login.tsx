"use client";
import React from "react";
import styles from "./style.module.css";
import { AuthProps, useLogin } from "@/shared/api/auth/auth";
import { Controller, useForm } from "react-hook-form";
import { Grid, GridItem } from "@consta/uikit/Grid";
import { FORM_SIZE } from "@/shared/lib/const";
import { TextField } from "@consta/uikit/TextField";
import { Button } from "@consta/uikit/Button";
import { showToast } from "@/shared/ui/Toast/Toast";
import { toast, ToastContainer } from "react-toastify";

export interface LoginProps {
  children?: React.ReactNode;
  className?: string;
}

export const Login = ({ className }: LoginProps) => {
  const { mutateAsync } = useLogin();

  const {
    control,
    watch,
    formState: { errors },
  } = useForm<AuthProps>();

  const formData = watch();

  return (
    <div>
      <Grid cols={6} gap={FORM_SIZE}>
        <GridItem col={6}>
          <Controller
            name="email"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                {...field}
                placeholder={"Введите почту"}
                label={"Почта"}
                required
                size={FORM_SIZE}
                className={styles.fields}
              />
            )}
          />
        </GridItem>
        <GridItem col={6}>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                placeholder="Введите пароль"
                label="Пароль"
                type="password"
                required
                min={1}
                max={5}
                size={FORM_SIZE}
                className={styles.fields}
              />
            )}
          />
        </GridItem>
        <GridItem col={2}>
          <Button
            label={"Войти"}
            onClick={async () => {
              const error = await mutateAsync({
                email: formData.email,
                password: formData.password,
              });

              // const notify = () => toast.error("asdasd");
              //
              // notify();
            }}
          />
        </GridItem>
      </Grid>
    </div>
  );
};
