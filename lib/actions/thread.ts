"use server";

import Community from "../models/community";
import Thread from "../models/thread";
import { ThreadType } from "../types/ThreadType";
import { Types } from "mongoose";
import User from "../models/user";
import { connectToDB } from "../mongoose";
import { revalidatePath } from "next/cache";

interface Params {
	text: string;
	author: Types.ObjectId;
	communityId: string | null;
	path: string;
}

async function createThread({ text, author, communityId, path }: Params) {
	try {
		connectToDB();

		const communityIdObject = await Community.findOne(
			{ id: communityId },
			{ _id: 1 }
		);

		const createdThread = await Thread.create({
			text,
			author,
			community: communityIdObject,
		});

		// update User
		await User.findByIdAndUpdate(author, {
			$push: { threads: createdThread._id },
		});

		// update Community
		if (communityIdObject) {
			await Community.findByIdAndUpdate(communityIdObject, {
				$push: { threads: createdThread._id },
			});
		}

		revalidatePath(path);
	} catch (error: any) {
		throw new Error(`Failed to create thread: ${error.message}`);
	}
}

async function fetchThreads(pageNumber = 1, pageSize = 20) {
	try {
		connectToDB();

		const skipAmount = (pageNumber - 1) * pageSize;

		// find top level threads that have no parents
		const threadQuery = Thread.find({ parentId: { $in: [null, undefined] } })
			.sort({
				createdAt: "desc",
			})
			.skip(skipAmount)
			.limit(pageSize)
			.populate({ path: "author", model: User })
			.populate({
				path: "community",
				model: Community,
			})
			.populate({
				path: "children",
				populate: {
					path: "author",
					model: User,
					select: "_id name parentId image",
				},
			});

		const totalThreadsCount = await Thread.countDocuments({
			parentId: { $in: [null, undefined] },
		});

		const threads = await threadQuery.exec();
		const hasNext = totalThreadsCount > skipAmount + threads.length;

		return { threads, hasNext };
	} catch (error: any) {
		throw new Error(`Failed to fetch threads: ${error.message}`);
	}
}

async function fetchThreadById(id: string) {
	try {
		connectToDB();
		return await Thread.findById<ThreadType>(id)
			.populate({
				path: "author",
				model: User,
				select: "_id id name image",
			})
			.populate({
				path: "children",
				populate: [
					{ path: "author", model: User, select: "_id id name parentId image" },
					{
						path: "children",
						model: Thread,
						populate: {
							path: "author",
							model: User,
							select: "_id id name parentId image",
						},
					},
				],
			})
			.exec();
	} catch (error: any) {
		throw new Error(`Failed to fetch thread by id: ${error.message}`);
	}
}

async function createComment(
	text: string,
	parentId: string,
	userId: string,
	path: string
) {
	try {
		connectToDB();

		const originalThread = await Thread.findById(parentId);
		if (!originalThread) throw new Error("Thread not found");

		// const newComment = await Thread.create({
		// 	text,
		// 	author: userId,
		// 	parentId,
		// });
		const comment = new Thread({ text, author: userId, parentId });
		const newComment = await comment.save();

		originalThread.children.push(newComment._id);
		await originalThread.save();

		revalidatePath(path);
	} catch (error: any) {
		throw new Error(`Failed to create commnent: ${error.message}`);
	}
}

export { createThread, fetchThreads, fetchThreadById, createComment };
