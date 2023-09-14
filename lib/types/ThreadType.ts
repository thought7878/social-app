import { CommunityType } from "./CommunityType";
import { Types } from "mongoose";
import { UserType } from "./UserType";

export interface ThreadType {
	_id?: Types.ObjectId;
	author?: UserType;
	community?: CommunityType;
	createdAt?: Date;
	parentId?: ThreadType;
	children?: ThreadType[];
}
