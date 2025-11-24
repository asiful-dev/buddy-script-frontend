"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, LoginSchemaType } from "../validations/auth.schema";
import { authApi } from "../services/api";
import { setUser } from "../slices/auth.slice";
import { useAppDispatch } from "@/shared/libs/redux.config";

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
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 bg-white">

      {/* Left Illustration Panel */}
      <div className="relative hidden lg:flex items-center justify-center overflow-hidden bg-[#F0F2F5]">
        <Image
          src="/assests/registration.png"
          alt="Illustration"
          width={600}
          height={600}
          className="object-contain"
        />

        {/* OPTIONAL: If you want shapes like the template */}
        <Image
          src="/assests/shape1.svg"
          alt="shape"
          width={200}
          height={200}
          className="absolute top-0 left-0 opacity-30"
        />
        <Image
          src="/assests/shape2.svg"
          alt="shape"
          width={300}
          height={300}
          className="absolute bottom-0 right-0 opacity-40"
        />
      </div>

      {/* Right Form Panel */}
      <div className="flex items-center justify-center px-6 py-12">
        <Card className="w-full max-w-md shadow-none border-none">
          <CardHeader className="space-y-2 text-center">
            <Image
              src="/assests/logo.svg"
              alt="Logo"
              width={120}
              height={120}
              className="mx-auto mb-2"
            />

            <p className="text-sm text-gray-500">Welcome Back</p>

            <CardTitle className="text-2xl font-semibold">
              Login
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
            >
              <Image
                src="/assests/google.svg"
                alt="Google"
                width={20}
                height={20}
              />
              Login with Google
            </Button>

            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-gray-300" />
              <span className="text-sm text-gray-500">Or</span>
              <div className="h-px flex-1 bg-gray-300" />
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                <FormField
                  name="email"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="password"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your password"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-600">Remember me</span>
                  </div>

                  <Link href="#" className="text-sm text-blue-600">
                    Forgot password?
                  </Link>
                </div>

                <Button type="submit" className="w-full">
                  Login
                </Button>
              </form>
            </Form>

            <p className="text-center text-sm text-gray-600">
              Don’t have an account?{" "}
              <Link href="/auth/register" className="text-blue-600 font-medium">
                Create New Account
              </Link>
            </p>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
