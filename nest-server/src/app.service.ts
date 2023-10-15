import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AppService {
	constructor(private configService: ConfigService) {}

	getHello(): string {
		let response = `
      - rest api docs (swagger) available at <a href="/api">/api</a>
      <br />
      - websocket docs not available yet
    `;

		const frontendUrl = this.configService.get<string>("frontendUrl");

		if (frontendUrl) {
			response += `
        <br />
        - the frontend app that consumes this backend service is available at <a href="${frontendUrl}">${frontendUrl}</a>
      `;
		}

		return response;
	}
}
