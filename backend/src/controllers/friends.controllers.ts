import { Request, Response } from 'express';
import { AppError, handleError } from '../errors/appErrors';
import listFriendsService from '../services/friends/listFriends.service';
import FindFriendService from '../services/friends/findFriend.service';
import inviteFriendService from '../services/friends/inviteFriend.service';
import acceptFriendService from '../services/friends/acceptFriend.service';
import declineFriendService from '../services/friends/declineFrien.service';
import deleteFriendService from '../services/friends/deleteFriendService';
import listReceivedFriendRequestsService from '../services/friends/listReceivedFriendRequests.service';
import listSentFriendshipRequests from '../services/friends/listSentFriendRequests.service';

const listFriendsController = async (req: Request, res: Response) => {
   try {
      const user = req.user.id;

      const friends = await listFriendsService({ userId: user });
      return res.status(200).send(friends);
   } catch (error) {
      if (error instanceof AppError) {
         handleError(error, res);
      }
   }
};

const searchFriendsController = async (req: Request, res: Response) => {
   try {
      const letters = req.query.letters as string;
      const { id } = req.user;

      const friends = await FindFriendService({ letters, userId: id });
      return res.status(200).send(friends);
   } catch (error) {
      if (error instanceof AppError) {
         handleError(error, res);
      }
   }
};

const inviteFriendController = async (req: Request, res: Response) => {
   try {
      const { userId } = req.params;
      const user = req.user.id;

      const invite = await inviteFriendService({ friendId: userId, userId: user });
      return res.status(200).send(invite);
   } catch (error) {
      if (error instanceof AppError) {
         handleError(error, res);
      }
   }
};

const acceptFriendController = async (req: Request, res: Response) => {
   try {
      const { requestId } = req.params;
      const { id } = req.user;

      const acceptFriend = await acceptFriendService({ requestId, userId: id });
      return res.status(200).send(acceptFriend);
   } catch (error) {
      if (error instanceof AppError) {
         handleError(error, res);
      }
   }
};

const declineFriendController = async (req: Request, res: Response) => {
   try {
      const { requestId } = req.params;
      const { id } = req.user;

      const declineFriend = await declineFriendService({ requestId, userId: id });
      return res.status(200).send(declineFriend);
   } catch (error) {
      if (error instanceof AppError) {
         handleError(error, res);
      }
   }
};

const deleteFriendController = async (req: Request, res: Response) => {
   try {
      const { friendId } = req.params;
      const { id } = req.user;

      const deleteFriend = await deleteFriendService({ userId: id, friendId });
      return res.status(200).send(deleteFriend);
   } catch (error) {
      if (error instanceof AppError) {
         handleError(error, res);
      }
   }
};

deleteFriendService;

const listReceivedFriendRequestsController = async (req: Request, res: Response) => {
   try {
      const { id } = req.user;

      const request = await listReceivedFriendRequestsService({ userId: id });
      return res.status(200).send(request);
   } catch (error) {
      if (error instanceof AppError) {
         handleError(error, res);
      }
   }
};

const listSentFriendshipController = async (req: Request, res: Response) => {
   try {
      const { id } = req.user;

      const request = await listSentFriendshipRequests({ userId: id });
      return res.status(200).send(request);
   } catch (error) {
      if (error instanceof AppError) {
         handleError(error, res);
      }
   }
};

export {
   listFriendsController,
   inviteFriendController,
   acceptFriendController,
   declineFriendController,
   deleteFriendController,
   listReceivedFriendRequestsController,
   listSentFriendshipController,
   searchFriendsController
};
