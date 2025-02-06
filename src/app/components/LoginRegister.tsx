"use client";

import { signIn } from "next-auth/react";
import { useActionState } from "react";
import SubmitButton from "./SubmitButton";
import { checkUserExists, registerUser } from "../actions";



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

        console.log("registering user", formData);

        await registerUser(prevState, formData);
        return await loginUser(prevState, formData);
    }
}

function Input({ type, name, label, ...props }: { type: string, name: string, label: string, [key: string]: any }) {
    return (
        <div>
            <label htmlFor={name} className="block font-medium text-gray-700">{label}</label>
            <input
                type={type}
                name={name}
                id={name}
                className={`w-full mt-2 p-2 border rounded`}
                required
                {...props}
            />
        </div>
    );
}

export default function LoginRegister() {

    const [state, formAction, pending] = useActionState(handleFormAction, { step: "check", email: "" });

    return (
        <div className="absolute top-50%" >


            <h1 className="text-xl font-bold text-center">
                {state?.step === "check" && "Welcome"}
                {state?.step === "login" && "Sign In"}
                {state?.step === "register" && "Register"}
            </h1>
            <div className="w-md">
                <p className="mt-2 text-gray-500">
                    {state?.step === "check" && "Please sign in using your DLR e-mail address"}
                    {state?.step === "login" && "Please enter your credentials"}
                    {state?.step === "register" && "Please enter your credentials"}
                </p>
            </div>
            <div className="max-w-md mx-auto mt-10 p-5">
                <form className="mt-6 space-y-4" action={formAction}>
                    {state?.step === "check" && (
                        <>
                            {/* <div>
                        <label htmlFor="email" className="block font-medium text-gray-700">Email</label>
                        <input
                            type="email" name="email" id="email" autoComplete="email"
                            className={`w-full mt-2 p-2 border rounded`}
                            required
                        />
                        </div> */}
                            <Input type="email" name="email" label="Email" />
                        </>
                    )}
                    {state?.step === "login" && (
                        <>
                            <div>
                                {/* <label className="block font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            readOnly={true}
                            value={state.email}
                            placeholder="Email"
                            className={`w-full p-2 border rounded`}
                        /> */}
                                <Input type="email" name="email" label="Email" value={state.email} />
                            </div>
                            {/* <div>
                        <label className="block font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Passwort"
                            className={`w-full p-2 border rounded mt-2`}
                        />
                        </div> */}
                            <Input type="password" name="password" label="Password" />
                        </>
                    )}
                    {state?.step === "register" && (
                        <>
                            {/* <label htmlFor="name" className="block font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            name="name"
                            className={`w-full p-2 border rounded mt-2`}
                        />
                         */}
                            <Input type="text" name="name" label="Name" />

                            {/* <label htmlFor="group" className="block font-medium text-gray-700">Group</label>
                        <input
                            type="text"
                            name="group"
                            className={`w-full p-2 border rounded mt-2`}
                        /> */}
                            <Input type="text" name="group" label="Group" />



                            {/* <label htmlFor="email" className="block font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            readOnly={true}
                            value={state.email}
                            className={`w-full p-2 border rounded mt-2`}
                        /> */}
                            <Input type="email" name="email" label="Email" value={state.email} />



                            {/* <label htmlFor="password" className="block font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            name="password"
                            className={`w-full p-2 border rounded mt-2`}
                        /> */}
                            <Input type="password" name="password" label="Password" />
                        </>
                    )}
                    <SubmitButton pending={pending} />
                </form>
            </div>
        </div>
    );
}
