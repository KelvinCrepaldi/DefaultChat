import jwt from "jsonwebtoken";
import "dotenv/config";

const verifySocketToken = (token?: string): { id: string } | null => {
  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.SECRET_KEY as string
    ) as { id: string };

    return { id: decoded.id };
  } catch {
    return null;
  }
};

export default verifySocketToken;
