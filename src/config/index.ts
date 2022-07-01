import dotenv from 'dotenv';
import Joi from 'joi';
import { ConfigInfo, DriveConfigInfo } from '../interfaces/config';


dotenv.config();

function loadConfig(): ConfigInfo {
    const configSchema = Joi.object<ConfigInfo>({
        NODE_ENV: Joi.string().valid('development', 'production').required(),
        PORT: Joi.number().required(),
    });

    const { error, value } = configSchema.validate(process.env, { allowUnknown: true });
    console.log('Variables de entorno cargadas');

    if (error) {
        throw error;
    }
    return { ...value } as ConfigInfo;
}

function loadDriveConfig(): DriveConfigInfo {
    const configSchema = Joi.object<DriveConfigInfo>({
        GDRIVE_CLIENT_ID: Joi.string().required(),
        GDRIVE_CLIENT_SECRET: Joi.string().required(),
        GOOGLE_DRIVE_REDIRECT_URI: Joi.string().required(),
        GDRIVE_REFRESH_TOKEN: Joi.string().required(),
    });

    const { error, value } = configSchema.validate(process.env, { allowUnknown: true });

    if (error) {
        throw error;
    }
    return { ...value } as DriveConfigInfo;
}

export { loadConfig, loadDriveConfig };
