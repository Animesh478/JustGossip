const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { v4: uuidv4 } = require("uuid");

const { Message, ChatParticipants, User } = require("../models/index");

// configure aws s3
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const sendMedia = async function (userId, chatId, file) {
  // check whether a record exists linking this user to this chat
  const isParticipant = await ChatParticipants.findOne({
    where: {
      chatId,
      userId,
    },
  });

  if (!isParticipant) {
    throw new Error("Unauthorized: User is not a part of this chat");
  }

  const fileName = `chat-media/${uuidv4()}-${file.originalname}`;

  // creating a command
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  // sending that command to the s3 client
  await s3Client.send(command);

  // create the media url
  const mediaUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

  // save the message along with the url to the database
  const newMessage = await Message.create({
    message: null,
    mediaUrl: mediaUrl,
    mediaType: file.mimetype,
    senderId: userId,
    chatId,
  });

  const fullMessage = await Message.findByPk(newMessage.id, {
    include: [
      {
        model: User,
        as: "sender",
        attributes: ["id", "username", "profilePictureUrl"],
      },
    ],
  });

  return fullMessage;
};

module.exports = {
  sendMedia,
};
