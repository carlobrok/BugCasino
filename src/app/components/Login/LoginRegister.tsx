"use client";

import { signIn } from "next-auth/react";
import { startTransition, useActionState } from "react";
import { useForm } from "react-hook-form";
import SubmitButton from "../SubmitButton";
import { checkUserExists, registerUser } from "../../../lib/actions";
import RegisterSelectGroup from "./RegisterSelectGroup";
import RegisterSelectAvatar from "./RegisterSelectAvatar";

export interface RegisterFormData {
    email: string;
    password?: string;
    name?: string;
    groupId?: number;
    avatar?: string;
}

async function loginUser(email: string, password: string) {
    await signIn("credentials", { email, password, redirect: true });
    return { step: "done", email };
}

async function handleFormAction(prevState: any, formData: RegisterFormData) {
    const step = prevState.step || "check";

    if (step === "check") {
        return await checkUserExists(prevState, formData);
    }

    if (step === "login") {
        return await loginUser(formData.email, formData.password!);
    }

    if (step === "register") {
        await registerUser({
            email: formData.email,
            password: formData.password!,
            name: formData.name!,
            groupId: formData.groupId!,
            avatar: formData.avatar!,
        });

        return await loginUser(formData.email, formData.password!);
    }
}

export default function LoginRegister({ groups }: { groups: { name: string; id: number }[] }) {
    const [state, formAction, pending] = useActionState(handleFormAction, { step: "check", email: "" });

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<RegisterFormData>({
        mode: "onChange",
    });

    const onSubmit = (data: RegisterFormData) => {
        startTransition(() => {
            formAction(data);
        });
    };


    if (state?.step === "done") {
        return <></>;
    }

    return (
        <div className="absolute inset-x-0 mx-auto h-[380px] w-[500px] bottom-[12%] text-gray-700">
            <h1 className="text-2xl font-bold text-center">
                {state?.step === "check" && "Welcome"}
                {state?.step === "login" && "Sign In"}
                {state?.step === "register" && "Register"}
            </h1>
            <p className="mt-1 italic text-sm text-gray-500 text-center">
                {state?.step === "check" && "Enter your email to sign in or register"}
                {state?.step === "login" && "Please enter your credentials"}
                {state?.step === "register" && "Please don't use your DLR credentials"}
            </p>

            <div className="w-80 mx-auto">
                <form className="mt-6" onSubmit={handleSubmit(onSubmit)}>
                    {state?.step === "check" && (
                        <>
                            <label className="block px-2 font-bold text-sm">Email</label>
                            <input
                                type="email"
                                {...register("email", { required: "Email is required" })}
                                className="w-full px-4 py-1 border rounded-lg text-md"
                            />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                        </>
                    )}

                    {state?.step === "login" && (
                        <>
                            <label className="block px-2 font-bold text-sm">Email</label>
                            <input type="email" value={state?.email} readOnly className="w-full px-4 py-1 border rounded-lg text-md" />

                            <label className="block px-2 font-bold text-sm">Password</label>
                            <input
                                type="password"
                                {...register("password", { required: "Password is required" })}
                                className="w-full px-4 py-1 border rounded-lg text-md"
                            />
                            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                        </>
                    )}

                    {state?.step === "register" && (
                        <>
                            <label className="block px-2 font-bold text-sm">Name</label>
                            <input
                                type="text"
                                {...register("name", { required: "Name is required" })}
                                className="w-full px-4 py-1 border rounded-lg text-md"
                            />
                            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

                            <div className="flex justify-between mt-2">
                                <RegisterSelectAvatar
                                    register={register}
                                    setValue={setValue}
                                    errors={errors}
                                />
                                <RegisterSelectGroup
                                    groups={groups}
                                    register={register}
                                    setValue={setValue}
                                    errors={errors}
                                />
                            </div>

                            <input type="hidden" value={state?.email} {...register("email")} />

                            <label className="block px-2 font-bold text-sm">Password</label>
                            <input
                                type="password"
                                {...register("password", { required: "Password is required" })}
                                className="w-full px-4 py-1 border rounded-lg text-md"
                            />
                            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                        </>
                    )}

                    <SubmitButton pending={pending} />
                </form>
            </div>
        </div>
    );
}
