"use client";
import React from "react";
import { Button, Checkbox, Input, Link } from "@nextui-org/react";
import { z } from "zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerUser } from "@/lib/actions/user.actions";
import toast from "react-hot-toast";

const FormSchema = z.object({
  username: z
    .string()
    .min(2, "username must be atleast 2 characters")
    .max(45, "username must be less than 45 characters")
    .regex(new RegExp("^[a-zA-Z]+$"), "No special character allowed!"),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters ")
    .max(50, "Password must be less than 50 characters"),
});

const Signup = () => {
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

  const saveUser = async (data) => {
    const { ...user } = data;
    console.log(user);
    try {
      const result = await registerUser(user);
      toast.success("User registered successfully");
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    }
  };

  return (
    <>
    <div className="flex flex-col flex-center">
      <div className="p-4 mx-4 md:p-8 flex flex-col items-center my-8 md:h-auto md:w-2/3 lg:w-1/2 xl:w-1/3 rounded-xl shadow-md bg-gray-200 ">
        <div className="w-full my-4 mx-4s px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800">
            Create your account
          </h1>
          <p className="text-gray-600 text-center">
            to continue to Stock Management
          </p>
        </div>
        <form
          onSubmit={handleSubmit(saveUser)}
          className="flex flex-col mt-4 md:mt-8 w-full space-y-4"
        >
          <Input
            type="text"
            {...register("username")}
            label="Username"
            errorMessage={errors.username?.message}
            isInvalid={!!errors.username}
            id="username"
          />

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
            Sign Up
          </button>
        </form>
      </div>
      </div>
    </>
  );
};

export default Signup;
