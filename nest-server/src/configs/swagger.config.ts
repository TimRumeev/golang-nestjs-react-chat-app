import { DocumentBuilder } from "@nestjs/swagger";

const swaggerConfig = new DocumentBuilder()
	.setTitle("Chat App Backend")
	.setDescription("Node.js (Nest.js) with TypeScript, MongoDB (Mongoose), Websocket (Socket.io)")
	.setVersion("1.0")
	.build();

export default swaggerConfig;
