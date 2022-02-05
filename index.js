const express = require("express");
const { RtcTokenBuilder, RtcRole } = require("agora-access-token");
const PORT = 8080;
const APP_ID = "3fcc1d5039f345e0897fdee4f28406c0";
const APP_CERTIFICATE = "0493ce420d8a4cf4ae1140996297c19b";
const app = express();
const nocache = (req, resp, next) => {
  resp.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  resp.header("Expires", "-1");
  resp.header("Pragma", "no-cache");
  next();
};

const generateAccessToken = (req, resp) => {
  resp.header("Access-Control-Allow-Origin", "*");

  const channelName = req.query.channelName;
  if (!channelName) {
    return resp.status(500).json({ error: "channel is required" });
  }
  let uid = req.query.uid;
  if (!uid || uid == "") {
    uid = 0;
  }
  // get role
  let role = RtcRole.PUBLISHER;
  if (req.query.role == "publisher") {
    role = RtcRole.PUBLISHER;
  }
  // get the expire time
  let expireTime = req.query.expireTime;
  if (!expireTime || expireTime == "") {
    const currentTime = Math.floor(Date.now() / 1000);
    const privilegeExpireTime = currentTime + expireTime;
    expireTime = privilegeExpireTime;
  } else {
    expireTime = parseInt(expireTime, 10);
  }
  // calculate privilege expire time
  const currentTime = Math.floor(Date.now() / 1000);
  const privilegeExpireTime = currentTime + expireTime;

  const token = RtcTokenBuilder.buildTokenWithUid(
    APP_ID,
    APP_CERTIFICATE,
    channelName,
    uid,
    role,
    privilegeExpireTime
  );
  return resp.json({ token: token });
};
app.get("/access_token", nocache, generateAccessToken);

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
