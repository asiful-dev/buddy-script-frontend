"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
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
import { setAuthToken } from "@/shared/libs/axios.config";
import { useToast } from "@/shared/components/ToastProvider";
import AuthBackground from "./auth-background";

export default function LoginView() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { success, error } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginSchemaType) => {
    setIsLoading(true);
    try {
      const data = await authApi.login(values);
      setAuthToken(data.accessToken);
      dispatch(setUser(data.user));
      success("Login successful! Redirecting to feed...");
      
      // Redirect after a short delay to show the toast
      setTimeout(() => {
        window.location.href = "/feed";
      }, 1500);
    } catch (err: any) {
      setIsLoading(false);
      const errorMessage = err?.response?.data?.message || err?.message || "Login failed. Please try again.";
      error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 relative">
      {/* Background with decorative shapes */}
      <AuthBackground />

      {/* Left Illustration Panel */}
      <div className="relative hidden lg:flex items-center justify-center overflow-hidden z-10">
        <Image
          src="/assests/login.png"
          alt="Illustration"
          width={600}
          height={600}
          className="object-contain relative z-10"
        />
      </div>

      {/* Right Form Panel */}
      <div className="flex items-center justify-center relative z-10">
        <Card className="w-full max-w-md shadow-none  px-6 py-12">
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

            <p className="text-sm text-gray-500 mb-1">Welcome back</p>

            <CardTitle className="text-2xl font-semibold text-gray-900">
              Login to your account
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
              <span>Or sign-in with google</span>
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
                      <FormLabel className="text-gray-700">Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your email"
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
                        <div className="relative">
                          <Input
                            placeholder="Enter your password"
                            type={showPassword ? "text" : "password"}
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 pr-10"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="remember"
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      defaultChecked
                    />
                    <label
                      htmlFor="remember"
                      className="text-sm text-gray-600 cursor-pointer"
                    >
                      Remember me
                    </label>
                  </div>

                  <Link href="#" className="text-sm text-blue-600 hover:text-blue-700">
                    Forgot password?
                  </Link>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Login now"}
                </Button>
              </form>
            </Form>

            <p className="text-center text-sm text-gray-600">
              Dont have an account?{" "}
              <Link href="/auth/register" className="text-blue-600 font-medium hover:text-blue-700 underline">
                Create New Account
              </Link>
            </p>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
