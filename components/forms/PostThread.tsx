"use client";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { ThreadValidation } from "../../lib/validations/thread";
import { Types } from "mongoose";
import { createThread } from "../../lib/actions/thread";
import { useForm } from "react-hook-form";
import { useOrganization } from "@clerk/nextjs";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

function PostThread({ userId }: { userId: Types.ObjectId }) {
	const router = useRouter();
	const pathname = usePathname();
	const { organization } = useOrganization();

	const form = useForm({
		resolver: zodResolver(ThreadValidation),
		defaultValues: {
			thread: "",
			accountId: userId.toString(),
		},
	});

	const onSubmit = async (values: z.infer<typeof ThreadValidation>) => {
		await createThread({
			text: values.thread,
			author: userId,
			communityId: organization ? organization.id : null,
			path: pathname,
		});

		router.push("/");
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex flex-col gap-10 mt-10"
			>
				<FormField
					control={form.control}
					name="thread"
					render={({ field }) => (
						<FormItem className="flex flex-col gap-3 w-full">
							<FormLabel className="text-base-semibold text-light-2">
								Content
							</FormLabel>
							<FormControl>
								<Textarea
									rows={18}
									className="border border-dark-4 bg-dark-3 text-light-1 no-focus"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type="submit" className="bg-primary-500">
					Post
				</Button>
			</form>
		</Form>
	);
}

export default PostThread;
