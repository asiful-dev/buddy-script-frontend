"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, LoginSchemaType } from "../validations/auth.schema";
import { authApi } from "../services/api";
import { useAppDispatch } from "@/shared/libs/redux.config";
import { setUser } from "../slices/auth.slice";

export default function LoginView() {
  const dispatch = useAppDispatch();

  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (values: LoginSchemaType) => {
    const data = await authApi.login(values);
    dispatch(setUser(data.user));
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <input
        type="email"
        placeholder="Email"
        {...form.register("email")}
      />
      <input
        type="password"
        placeholder="Password"
        {...form.register("password")}
      />
      <button type="submit">Login</button>
    </form>
  );
}
