"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user";
import { connectToDB } from "../mongoose";
import Thread from "../models/thread";
import { FilterQuery } from "mongoose";

interface UserParams {
	userId: string;
	username: string;
	name: string;
	bio: string;
	image: string;
	path: string;
}

export async function updateUser({
	userId,
	username,
	name,
	bio,
	image,
	path,
}: UserParams) {
	connectToDB();
	try {
		await User.findOneAndUpdate(
			{ id: userId },
			{
				username: username.toLowerCase(),
				name,
				bio,
				image,
				path,
				onboarded: true,
			},
			// update an existing row if a specified value already exists in a table,
			// and insert a new row if the specified value doesn't already exist
			{ upsert: true }
		);

		if (path === "/profile/edit") {
			revalidatePath(path);
		}
	} catch (error: any) {
		throw new Error(`Failed to create or update user: ${error.message}`);
	}
}

export async function fetchUser(userId: string) {
	try {
		connectToDB();

		return await User.findOne({ id: userId });
		// .populate({
		// path: "communities",
		// model: Community,
		// });
	} catch (error: any) {
		throw new Error(`Failed to fetch user ${error.message}`);
	}
}

export async function fetchThreadsByUserId(userId: string) {
	try {
		connectToDB();
		const threads = await User.findOne({ id: userId })
			.populate({
				path: "threads",
				model: Thread,
				populate: [
					// {
					// 	path: "community",
					// 	model: Community,
					// 	select: "name id image _id", // Select the "name" and "_id" fields from the "Community" model
					// },
					{
						path: "children",
						model: Thread,
						populate: {
							path: "author",
							model: User,
							select: "name image id", // Select the "name" and "_id" fields from the "User" model
						},
					},
				],
			})
			.exec();
		return threads;
	} catch (error: any) {
		console.log(`Failed to fetch threads by user id:${error.message}`);
	}
}

export async function fetchUsers({
	userId = "",
	searchString = "",
	pageNumber = 1,
	pageSize = 20,
	sort = "desc",
}) {
	try {
		connectToDB();

		const skipAmount = (pageNumber - 1) * pageSize;
		const regExp = new RegExp(searchString, "i");

		const query: FilterQuery<typeof User> = { id: { $ne: userId } };
		if (searchString.trim() !== "") {
			query.$or = [
				{ username: { $regex: regExp } },
				{ name: { $regex: regExp } },
			];
		}

		const sortOptions = { createdAt: sort };

		const usersQuery = User.find(query)
			.sort({
				createdAt: "desc",
			})
			.skip(skipAmount)
			.limit(pageSize);

		const totalUserCount = await User.countDocuments(query);
		const users = await usersQuery.exec();
		const isNext = totalUserCount > skipAmount + users.length;

		return { users, isNext };
	} catch (error: any) {
		console.log(`Failed to fetch users :${error.message}`);
		throw error;
	}
}

export async function fetchActivity(userId: string) {
	try {
		connectToDB();

		const userThreads = await Thread.find({ author: userId });

		const childThreadIds = userThreads.reduce((accumulator, thread) => {
			return accumulator.concat(thread.children);
		}, []);

		const replies = await Thread.find({
			_id: { $in: childThreadIds },
			author: { $ne: userId },
		}).populate({
			path: "author",
			model: User,
			select: "name image _id",
		});

		return replies;
	} catch (error: any) {
		console.log(`Failed to fetch activity :${error.message}`);
		throw error;
	}
}
