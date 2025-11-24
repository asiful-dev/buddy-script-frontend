"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  RegisterSchema,
  RegisterSchemaType,
} from "../validations/auth.schema";
import { authApi } from "../services/api";
import { useAppDispatch } from "@/shared/libs/redux.config";
import { setUser } from "../slices/auth.slice";

export default function RegisterView() {
  const dispatch = useAppDispatch();

  const form = useForm<RegisterSchemaType>({
    resolver: zodResolver(RegisterSchema),
  });

  const onSubmit = async (values: RegisterSchemaType) => {
    const data = await authApi.register(values);
    dispatch(setUser(data.user));
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <input {...form.register("firstName")} placeholder="First Name" />
      <input {...form.register("lastName")} placeholder="Last Name" />
      <input {...form.register("email")} placeholder="Email" />
      <input
        {...form.register("password")}
        placeholder="Password"
        type="password"
      />
      <button type="submit">Register</button>
    </form>
  );
}
