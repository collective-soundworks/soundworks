import coloredLogger from '#logs/colored-logger.js';

export default {
  versionDiscrepancies(clientRole, clientVersion, serverVersion) {
    coloredLogger.warn(`
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

WARNING

Version discrepancies between server and "${clientRole}" client:
+ server: ${serverVersion} | client: ${clientVersion}

This might lead to unexpected behavior, you should consider to re-install your
dependencies on both your server and clients.

!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`);
  },

  deprecated(oldAPI, newAPI, lastSupportedVersion) {
    if (!lastSupportedVersion) {
      throw new Error(`Invalid 'logger.deprecated call: a deprecation version is required`);
    }

    const msg = `DEPRECATION WARNING: \`${oldAPI}\` is deprecated (last supported version: ${lastSupportedVersion}) and will be removed in the next major revision, please use ${newAPI} instead.\n`;
    coloredLogger.warn(msg);
  },

  removed(oldAPI, hint, lastSupportedVersion) {
    if (!lastSupportedVersion) {
      throw new Error(`Invalid 'logger.deprecated call: a deprecation version is required`);
    }

    const msg = `"${oldAPI}" has been removed (last supported version: ${lastSupportedVersion}), please use "${hint}" instead.`;
    throw new Error(msg);
  },
};
