"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginRegister() {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [error, setError] = useState("");
    const [touched, setTouched] = useState({ email: false, name: false, password: false });
    const router = useRouter();

    const checkUserExists = async () => {
        if (!email) {
            setTouched((prev) => ({ ...prev, email: true }));
            return;
        }
        const res = await fetch("/api/user-exists", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });

        if (res.ok) {
            const data = await res.json();
            data.exists ? setShowLogin(true) : setShowRegister(true);
        }
    };

    const registerUser = async () => {
        setTouched({ email: true, name: true, password: true });
        if (!email || !name || !password) return;
        const res = await fetch("/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, name, password }),
        });

        if (res.ok) {
            router.refresh();
        } else if (res.status === 400) {
            const data = await res.json();
            setError(data.error);
        }
    };

    const loginUser = async () => {
        setTouched((prev) => ({ ...prev, email: true, password: true }));
        if (!email || !password) return;
        setError("");

        const result = await signIn("credentials", {
            redirect: false,
            email,
            password,
        });

        if (result?.error) {
            setError(result.error);
        } else if (result?.ok) {
            router.refresh();
            router.push("/");
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-5 border rounded-lg shadow">
            <h1 className="text-xl font-bold">
                {showLogin && "Login"}
                {showRegister && "Register"}
                {!showLogin && !showRegister && "Welcome"}
            </h1>
            <p className="mt-2 text-gray-500">
                {showLogin && "Please enter your credentials"}
                {showRegister && "Please enter your credentials"}
                {!showLogin && !showRegister && "Please sign in using your DLR e-mail address"}
            </p>

            <form className="mt-4">
                <input
                    type="email"
                    placeholder="Email"
                    className={`w-full p-2 border rounded ${touched.email && !email ? "border-red-500" : ""}`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                {!showLogin && !showRegister && (
                    <button
                        type="button"
                        className="w-full mt-2 bg-blue-500 text-white py-2 rounded"
                        onClick={checkUserExists}
                    >
                        Continue
                    </button>
                )}
                {showLogin && (
                    <>
                        <input
                            type="password"
                            placeholder="Passwort"
                            className={`w-full p-2 border rounded mt-2 ${touched.password && !password ? "border-red-500" : ""}`}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={loginUser}
                            className="w-full mt-2 bg-blue-500 text-white py-2 rounded"
                        >
                            Login
                        </button>
                    </>
                )}
                {showRegister && (
                    <>
                        <input
                            type="text"
                            placeholder="Name"
                            className={`w-full p-2 border rounded mt-2 ${touched.name && !name ? "border-red-500" : ""}`}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Passwort"
                            className={`w-full p-2 border rounded mt-2 ${touched.password && !password ? "border-red-500" : ""}`}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={registerUser}
                            className="w-full mt-2 bg-green-500 text-white py-2 rounded"
                        >
                            Register
                        </button>
                    </>
                )}
                {error && <p className="text-red-500 mt-2">{error}</p>}
            </form>
        </div>
    );
}
