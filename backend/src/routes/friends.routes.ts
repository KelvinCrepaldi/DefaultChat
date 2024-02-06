import {
   acceptFriendController,
   declineFriendController,
   deleteFriendController,
   inviteFriendController,
   listFriendsController,
   listReceivedFriendRequestsController,
   listSentFriendshipController,
} from '../controllers/friends.controllers';
import verifyAuthTokenMiddeware from '../middlewares/verifyAuthToken.middleware';

import { Router } from 'express';
const friendRoutes = Router();


// list requests received
friendRoutes.get('/requests/received', verifyAuthTokenMiddeware, listReceivedFriendRequestsController);

//list requests sent
friendRoutes.get('/requests/sent', verifyAuthTokenMiddeware, listSentFriendshipController);

// list friends
friendRoutes.get('/', verifyAuthTokenMiddeware, listFriendsController);

// invite friend
friendRoutes.post('/:userId', verifyAuthTokenMiddeware, inviteFriendController);

// accept friend
friendRoutes.post('/:requestId/accept', verifyAuthTokenMiddeware, acceptFriendController);

// decline friend request
friendRoutes.post('/:requestId/decline', verifyAuthTokenMiddeware, declineFriendController);

// remove friend
friendRoutes.delete('/:friendId', verifyAuthTokenMiddeware, deleteFriendController);

// block user

// unblock user

export default friendRoutes;
