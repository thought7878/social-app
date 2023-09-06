"use client";

import React, { ChangeEvent } from "react";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";
// import {  } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserValidation } from "../../lib/validations/user";
import { Button } from "../ui/button";
import Image from "next/image";
import { Textarea } from "../ui/textarea";

interface IAccountProfile {
	user: {
		id?: string;
		objectId?: string;
		username?: string;
		name?: string;
		bio?: string;
		image?: string;
	};
	btnTitle?: string;
}

const AccountProfile = ({ user, btnTitle }: IAccountProfile) => {
	const form = useForm({
		resolver: zodResolver(UserValidation),
		defaultValues: {
			profile_photo: "",
			name: "",
			username: "",
			bio: "",
		},
	});

	const handleImage = (
		e: ChangeEvent,
		fieldChange: (value: string) => void
	) => {
		e.preventDefault();
	};

	function onSubmit(values: z.infer<typeof UserValidation>) {
		console.log(values);
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex flex-col gap-10"
			>
				<FormField
					control={form.control}
					name="profile_photo"
					render={({ field }) => (
						<FormItem className="flex items-center gap-4">
							<FormLabel className="account-form_image-label">
								{field.value ? (
									<Image
										src={field.value}
										alt="profile photo"
										width={96}
										height={96}
										priority
										className="rounded-full object-contain"
									/>
								) : (
									<Image
										src="/assets/profile.svg"
										alt="profile photo"
										width={96}
										height={96}
										className="object-contain"
									/>
								)}
							</FormLabel>
							<FormControl className="flex-1 text-base-semibold text-gray-200">
								<Input
									type="file"
									accept="image/*"
									placeholder="Upload a photo"
									className="account-form_image-input"
									onChange={(e) => handleImage(e, field.onChange)}
								/>
							</FormControl>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem className="flex flex-col gap-3 w-full">
							<FormLabel className="text-base-semibold text-light-2">
								Name
							</FormLabel>
							<FormControl>
								<Input
									type="text"
									className="account-form_input no-focus"
									{...field}
								/>
							</FormControl>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="username"
					render={({ field }) => (
						<FormItem className="flex flex-col gap-3 w-full">
							<FormLabel className="text-base-semibold text-light-2">
								Username
							</FormLabel>
							<FormControl>
								<Input
									type="text"
									className="account-form_input no-focus"
									{...field}
								/>
							</FormControl>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="bio"
					render={({ field }) => (
						<FormItem className="flex flex-col gap-3 w-full">
							<FormLabel className="text-base-semibold text-light-2">
								Bio
							</FormLabel>
							<FormControl>
								<Textarea
									rows={10}
									className="account-form_input no-focus"
									{...field}
								/>
							</FormControl>
						</FormItem>
					)}
				/>
				<Button type="submit" className="bg-primary-500">
					Submit
				</Button>
			</form>
		</Form>
	);
};

export default AccountProfile;
