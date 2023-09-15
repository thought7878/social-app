import Image from "next/image";
import Link from "next/link";
import { formatDateString } from "../../lib/utils";
import { Types } from "mongoose";
import { ThreadType } from "../../lib/types/ThreadType";
import { UserType } from "../../lib/types/UserType";
import { CommunityType } from "../../lib/types/CommunityType";

interface IThreadCard {
	id?: Types.ObjectId;
	userId?: string;
	parentId?: Types.ObjectId | ThreadType | null;
	content?: string;
	author?:
		| UserType
		| {
				name: string;
				image: string;
				id: string;
		  };
	community?: CommunityType | null;
	createdAt?: Date | string;
	comments?: ThreadType[] | { author: { image: string } }[];
	isComment?: boolean;
}

export default function ThreadCard({
	id,
	userId,
	parentId,
	content,
	author,
	community,
	createdAt,
	comments,
	isComment,
}: IThreadCard) {
	return (
		<article
			className={`flex flex-col w-full rounded-xl ${
				isComment ? "px-0 xs:px-7" : "bg-dark-2 p-7 mb-5"
			}`}
		>
			<div className="flex items-start justify-between">
				<div className="flex w-full flex-1 flex-row gap-4">
					<div className="flex flex-col items-center">
						<Link
							href={`/profile/${author?.id}`}
							className="relative h-11 w-11"
						>
							<Image
								src={author?.image || ""}
								alt="author"
								fill
								className="rounded-full cursor-pointer"
								// className="rounded-full w-5 h-5"
							/>
						</Link>
						<div className="thread-card_bar" />
					</div>
					<div className="flex w-full flex-col">
						<Link href={`/profile/${author?.id}`} className="w-fit">
							<h4 className="text-base-semibold text-light-1 cursor-pointer">
								{author?.name}
							</h4>
						</Link>
						<p className="mt-2 text-small-regular text-light-2">{content}</p>
						<div className="mt-5 flex flex-col gap-3">
							<div className="flex gap-3.5">
								<Image
									src="/assets/heart-gray.svg"
									alt="like"
									width={24}
									height={24}
									className="cursor-pointer object-contain"
								/>
								<Link href={`/thread/${id}`}>
									<Image
										src="/assets/reply.svg"
										alt="reply"
										width={24}
										height={24}
										className="cursor-pointer object-contain"
									/>
								</Link>
								<Image
									src="/assets/repost.svg"
									alt="repost"
									width={24}
									height={24}
									className="cursor-pointer object-contain"
								/>
								<Image
									src="/assets/share.svg"
									alt="share"
									width={24}
									height={24}
									className="cursor-pointer object-contain"
								/>
							</div>
							{isComment && comments && comments?.length > 0 && (
								<Link href={`/thread/${id}`}>
									<p className="mt-1 text-subtle-medium text-gray-1">
										{comments?.length} replies
									</p>
								</Link>
							)}
						</div>
					</div>
				</div>
			</div>
			{/* community Start */}
			{!isComment && community && (
				<Link
					href={`/communities/${community._id}`}
					className="mt-5 flex items-center"
				>
					<p className="text-subtle-medium text-gray-1">
						{formatDateString(createdAt as string)} - {community.name} Community
					</p>
					<Image
						src={community.image || ""}
						alt={community.name || ""}
						width={14}
						height={14}
						className="ml-1 rounded-full object-cover"
					/>
				</Link>
			)}
			{/* community End */}
		</article>
	);
}
