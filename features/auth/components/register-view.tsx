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
import {
  RegisterSchema,
  RegisterSchemaType,
} from "../validations/auth.schema";
import { authApi } from "../services/api";
import { setUser } from "../slices/auth.slice";
import { useAppDispatch } from "@/shared/libs/redux.config";
import AuthBackground from "./auth-background";

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
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 relative">
      {/* Background with decorative shapes */}
      <AuthBackground />

      {/* Left Illustration Panel */}
      <div className="relative hidden lg:flex items-center justify-center overflow-hidden z-10">
        <Image
          src="/assests/registration.png"
          alt="Illustration"
          width={800}
          height={800}
          className="object-contain relative z-10"
        />
      </div>

      {/* Right Form Panel */}
      <div className="flex items-center justify-center relative py-6 z-10">
        <Card className="w-full max-w-md shadow-none px-6 py-12">
          <CardHeader className="space-y-2 text-center pb-6">
            <div className="flex items-center justify-center mb-4">
              <Link href="/">
                <Image
                  src="/assests/logo.svg"
                  alt="BuddyScript Logo"
                  width={170}
                  height={170}
                  className="h-auto"
                />
              </Link>
            </div>

            <p className="text-sm text-gray-500 mb-1">Get Started Now</p>

            <CardTitle className="text-2xl font-semibold text-gray-900">
            Registration
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2 border-gray-300 hover:bg-gray-50"
            >
              <Image
                src="/assests/google.svg"
                alt="Google"
                width={20}
                height={20}
              />
              <span>Register with google</span>
            </Button>

            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-gray-300" />
              <span className="text-sm text-gray-500">Or</span>
              <div className="h-px flex-1 bg-gray-300" />
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    name="firstName"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">First Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="First Name"
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="lastName"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Last Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Last Name"
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  name="email"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your email"
                          type="email"
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          {...field}
                        />
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
                      <FormLabel className="text-gray-700">Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your password"
                          type="password"
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="terms"
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm text-gray-600 cursor-pointer"
                  >
                    I agree to the{" "}
                    <Link href="#" className="text-blue-600 hover:text-blue-700 underline">
                      Terms and Conditions
                    </Link>
                  </label>
                </div>

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Register now
                </Button>
              </form>
            </Form>

            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-blue-600 font-medium hover:text-blue-700 underline">
                Login
              </Link>
            </p>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
