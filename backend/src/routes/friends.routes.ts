import {
   acceptFriendController,
   declineFriendController,
   deleteFriendController,
   inviteFriendController,
   listFriendsController,
   listReceivedFriendRequestsController,
   listSentFriendshipController,
   searchFriendsController
} from '../controllers/friends.controllers';
import verifyAuthTokenMiddeware from '../middlewares/verifyAuthToken.middleware';

import { Router } from 'express';
const friendRoutes = Router();

// find user
friendRoutes.get('/find', verifyAuthTokenMiddeware, searchFriendsController);

// invite friend
friendRoutes.post('/invite/:userId', verifyAuthTokenMiddeware, inviteFriendController);

// accept friend
friendRoutes.post('/accept/:requestId', verifyAuthTokenMiddeware, acceptFriendController);

// decline friend request
friendRoutes.post('/decline/:requestId', verifyAuthTokenMiddeware, declineFriendController);

// list friends
friendRoutes.get('/list', verifyAuthTokenMiddeware, listFriendsController);

// list requests received
friendRoutes.get('/requests/received', verifyAuthTokenMiddeware, listReceivedFriendRequestsController);

//list requests sent
friendRoutes.get('/requests/sent', verifyAuthTokenMiddeware, listSentFriendshipController);

// remove friend
friendRoutes.delete('/delete/:friendId', verifyAuthTokenMiddeware, deleteFriendController);

// block user

// unblock user

export default friendRoutes;
