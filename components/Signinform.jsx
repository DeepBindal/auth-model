"use client";
import React from "react";
import { Input } from "@nextui-org/react";
import { z } from "zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const FormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string({ required_error: "Please enter your password" }),
});

const Signinform = ({ callbackUrl }) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(FormSchema),
  });

  const loginUser = async (data) => {
    const result = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });
    if (!result?.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("Welcome");
    router.push(callbackUrl ? callbackUrl : "/");
  };

  return (
    <>
    <div className="flex flex-col flex-center">
      <div className="p-4 mx-4 md:p-8 flex flex-col items-center my-8 md:h-auto md:w-2/3 lg:w-1/2 xl:w-1/3 rounded-xl shadow-md bg-gray-200 ">
        <div className="w-full my-4 mx-4s px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800">
            Login to your account
          </h1>
          <p className="text-gray-600 text-center">
            to continue to Stock Management
          </p>
        </div>
        <form
          onSubmit={handleSubmit(loginUser)}
          className="flex flex-col mt-4 md:mt-8 w-full space-y-4"
        >

          <Input
            type="email"
            label="Email"
            {...register("email")}
            errorMessage={errors.email?.message}
            isInvalid={!!errors.email}
            id="email"
          />

          <Input
            type="password"
            id="password"
            label="Password"
            color="default"
            {...register("password")}
            errorMessage={errors.password?.message}
            isInvalid={!!errors.password}
          />
          <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-md mt-4 md:mt-8 transition duration-300 ease-in-out">
            Login
          </button>
        </form>
        <button
          onClick={() => signIn("github")}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-md mt-4 md:mt-4 transition duration-300 ease-in-out"
        >
          Sign In with Github
        </button>
        <p className="mt-4 md:mt-8 text-start text-sm text-gray-600">
          <Link
            className="font-semibold text-blue-500 hover:text-blue-600"
            href="/auth/forgotPassword"
          >
            Forgot password ?
          </Link>
        </p>
        <p className="mt-4 md:mt-8 text-center text-sm text-gray-600">
          No Account?&nbsp;
          <Link
            href="/auth/signup"
            className="font-semibold text-blue-500 hover:text-blue-600"
          >
            Sign Up
          </Link>
        </p>
      </div>
      </div>
    </>
  );
};

export default Signinform;
