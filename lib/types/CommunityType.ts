import { ThreadType } from "./ThreadType";
import { Types } from "mongoose";
import { UserType } from "./UserType";

export interface CommunityType {
	_id?: Types.ObjectId;
	username?: string;
	name?: string;
	image?: string;
	bio?: string;
	createdBy?: UserType;
	threads?: ThreadType[];
	members?: UserType[];
}
