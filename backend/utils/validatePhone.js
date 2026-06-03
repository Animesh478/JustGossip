const { parsePhoneNumberFromString } = require("libphonenumber-js");

const validatePhoneNumber = function (phone, country = "IN") {
  const phoneNumber = parsePhoneNumberFromString(phone, country);

  if (!phoneNumber || !phoneNumber.isValid()) {
    throw new Error("Invalid phone number");
  }

  return phoneNumber.number;
};

module.exports = { validatePhoneNumber };
