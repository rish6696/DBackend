export const production: string = "PRODUCTION";
export const development: string = "DEVELOPMENT";
export const createPasswordMailSubject: string = "Welcome to Dash";
export const forgotPasswordMailSubject: string = "Reset Your Password";
export const createPasswordMailHtml = (
  encryptedData: string,
  logoUrl: string,
  _id: string
): string => {
  const url = `?token=${encodeURIComponent(encryptedData)}&_id=${_id}&logo=${encodeURIComponent(logoUrl)}`;
  return `<h1> To create your Password,click here ${url}<h1/>`;
};
