export interface PartialDriveFile {
    id: string;
    name: string;
}

export interface PartialDriveLink {
    webViewLink: string;
    webContentLink: string;
}

export interface PartialDriveUpload {
    message: string;
    data: {
        id: string;
        name: string;
        urls: PartialDriveLink
    }
}