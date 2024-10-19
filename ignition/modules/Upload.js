const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");



module.exports = buildModule("UploadModule", (m) => {

  const upload = m.contract("Upload");

  return { upload };
});
