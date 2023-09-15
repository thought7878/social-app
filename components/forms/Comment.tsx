"use client";

import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "../ui/button";
import { CommentValidation } from "../../lib/validations/thread";
import Image from "next/image";
import { Input } from "../ui/input";
import { createComment } from "../../lib/actions/thread";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface IComment {
	threadId?: string;
	userImg?: string;
	userId?: string;
}

const Comment = ({ threadId, userImg, userId }: IComment) => {
	const router = useRouter();
	const pathname = usePathname();

	const form = useForm({
		resolver: zodResolver(CommentValidation),
		defaultValues: {
			thread: "",
		},
	});

	const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
		await createComment(
			values.thread,
			threadId as string,
			userId as string,
			pathname
		);
		form.reset();
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="comment-form">
				<FormField
					control={form.control}
					name="thread"
					render={({ field }) => (
						<FormItem className="flex items-center gap-3 w-full">
							<FormLabel>
								<Image
									src={userImg || ""}
									alt="profile image"
									width={48}
									height={48}
									className="rounded-full object-cover"
								/>
							</FormLabel>
							<FormControl className="border-none bg-transparent">
								<Input
									type="text"
									placeholder="Comment..."
									className="outline-none mt-0 bg-dark-3 text-light-1 no-focus"
									{...field}
								/>
							</FormControl>
						</FormItem>
					)}
				/>

				<Button type="submit" className="comment-form_btn">
					Reply
				</Button>
			</form>
		</Form>
	);
};

export default Comment;
