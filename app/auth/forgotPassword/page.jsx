"use client";
import { forgotPassword } from "@/lib/actions/user.actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@nextui-org/react";
import Image from "next/image";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";

const FormSchema = z.object({
  email: z.string().email("Please enter a valid email!"),
});

const ForgotPasswordPage = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(FormSchema),
  });

  const submitRequest = async (data) => {
    console.log(data)
    try {
      const result = await forgotPassword(data.email);
      if (result) {
        toast.success("Reset password link was sent to your email.");
      }
      reset();
    } catch (e) {
      console.log(e);
      toast.error("Something went wrong!");
    }
  };
  return (
    <div className="flex max-w-full  h-[100vh] justify-center items-center">
      <form
        className="flex flex-col gap-2 p-2 border m-2 w-1/2 rounded-md shadow"
        onSubmit={handleSubmit(submitRequest)}
      >
        <div className="text-center p-2">Enter Your Email</div>
        <Input
          label="Email"
          {...register("email")}
          errorMessage={errors.email?.message}
        />
        <Button
          isLoading={isSubmitting}
          type="submit"
          disabled={isSubmitting}
          color="primary"
        >
          {isSubmitting ? "Please Wait..." : "Submit"}
        </Button>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;
