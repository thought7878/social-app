"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { ThreadValidation } from "../../lib/validations/thread";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { createThread } from "../../lib/actions/thread";
import { z } from "zod";
import { useOrganization } from "@clerk/nextjs";

function PostThread({ userId }: { userId: string }) {
	const router = useRouter();
	const pathname = usePathname();
	const { organization } = useOrganization();

	const form = useForm({
		resolver: zodResolver(ThreadValidation),
		defaultValues: {
			thread: "",
			accountId: userId,
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
