"use client";

import { signIn } from "next-auth/react";
import { useActionState } from "react";
import SubmitButton from "../SubmitButton";
import { checkUserExists, registerUser } from "../../../lib/actions";
import RegisterSelectGroup from "./RegisterSelectGroup";



async function loginUser(prevState: any, formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    await signIn("credentials", {
        email,
        password,
        redirect: true,
    });

    return { step: "login", email: email };
}


async function handleFormAction(prevState: any, formData: FormData) {

    const step = prevState.step || "check";

    if (step === "check") {
        return await checkUserExists(prevState, formData);
    }

    if (step === "login") {
        return loginUser(prevState, formData);
    }

    if (step === "register") {

        // console.log("registering user", formData);

        await registerUser(prevState, formData);
        return await loginUser(prevState, formData);
    }
}

function Input({ type, name, label, hidden = false, ...props }: { type: string, name: string, label: string, hidden?: boolean, [key: string]: any }) {
    return (
        <div className="w-full mt-2">
            <label htmlFor={name} className={"block px-2 font-bold text-sm" + (hidden === true ? " hidden" : "")}>{label}</label>
            <input
                type={type}
                name={name}
                id={name}
                className={`w-full px-4 py-1 border rounded-lg text-md`}
                required
                hidden={hidden}
                {...props}
            />
        </div>
    );
}

export default function LoginRegister({ groups }: { groups: { name: string; id: number }[] }) {

    const [state, formAction, pending] = useActionState(handleFormAction, { step: "check", email: "" });

    return (
        <div className="absolute inset-x-0 mx-auto h-[380px] w-[500px] bottom-[12%] text-gray-700" >
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
                <form className="mt-6" action={formAction}>
                    {state?.step === "check" && (
                        <>
                            <Input type="email" name="email" label="Email" />
                        </>
                    )}
                    {state?.step === "login" && (
                        <>
                            <Input type="email" name="email" label="Email" value={state.email} readOnly />
                            <Input type="password" name="password" label="Password" />
                        </>
                    )}
                    {state?.step === "register" && (
                        <>
                            <Input type="text" name="name" label="Name" />
                            {/* <Input type="text" name="group" label="Group" /> */}
                            <div className="flex justify-between mt-2">
                            <RegisterSelectGroup groups={groups} />
                            </div>

                            <Input type="email" name="email" label="Email" value={state.email} readOnly hidden />
                            <Input type="password" name="password" label="Password" />
                        </>
                    )}
                    <SubmitButton pending={pending} />
                </form>
            </div>
        </div>
    );
}
