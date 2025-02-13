import { useState } from "react";
import AvatarPicker from "../AvatarPicker";
import { UseFormRegister, UseFormSetValue } from "react-hook-form";

interface Props {
    register: UseFormRegister<any>;
    setValue: UseFormSetValue<any>;
    errors: any;
}

export default function RegisterSelectAvatar({ register, setValue, errors }: Props) {
    // const [avatar, setAvatar] = useState<string | null>(null);

    const handleAvatarChange = (avatar: string) => {
        setValue("avatar", avatar, { shouldValidate: true });
    };

    return (
        <div className="flex flex-col items-center">
            <label htmlFor="avatar" className="block px-2 font-bold text-sm">
                Avatar
            </label>
            <AvatarPicker setInput={handleAvatarChange} error={errors.avatar} />
            <input type="hidden" {...register("avatar", { required: "Avatar is required" })} />
        </div>
    );
}