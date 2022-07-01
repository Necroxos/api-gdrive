import { google } from 'googleapis';
import { loadDriveConfig } from '../../config';

export class GoogleDriveConnection {
    private readonly appConfig = loadDriveConfig();

    createDriveClient() {
        const clientId = this.appConfig.GDRIVE_CLIENT_ID;
        const clientSecret = this.appConfig.GDRIVE_CLIENT_SECRET;
        const redirectUri = this.appConfig.GOOGLE_DRIVE_REDIRECT_URI;
        const refreshToken = this.appConfig.GDRIVE_REFRESH_TOKEN;
        const client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

        client.setCredentials({ refresh_token: refreshToken });

        return google.drive({
            version: 'v3',
            auth: client,
        });
    }
}

const gdriveConnection = new GoogleDriveConnection();
export default gdriveConnection;
