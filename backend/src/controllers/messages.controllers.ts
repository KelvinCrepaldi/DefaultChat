import { Request, Response } from "express";
import { AppError, handleError } from "../errors/appErrors"
import createMessageService from "../services/messages/createMessage.service";
import listMessagesService from "../services/messages/listMessages.service";

const createMessageController = async (req: Request, res:Response) =>{

  try {
    const userId = req.user.id;
    const { message } = req.body;
    const { roomId } = req.params;
    
    const response = await createMessageService({ message, roomId, userId });

    return res.status(200).send(response);
  } catch (error) {
    if(error instanceof AppError){
      handleError(error, res)
    }
  }
}

const listMessageController = async (req: Request, res:Response) =>{

  try {
    const { roomId } = req.params;
    
    const messages = await listMessagesService({roomId });
    
    return res.status(200).send(messages);
  } catch (error) {
    if(error instanceof AppError){
      handleError(error, res)
    }
  }
}

export { createMessageController, listMessageController }